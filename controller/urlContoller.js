const validator = require("validator");
const Url = require("../models/url");
const { nanoid } = require('nanoid');

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode,expiresAt } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({
        message: "Please provide a valid URL starting with http:// or https://",
      });
    }

    let shortCode;

    if (customCode) {
      const existingUrl = await Url.findOne({ shortCode: customCode });

      if (existingUrl) {
        return res.status(409).json({
          message: "This custom code is already taken",
        });
      }

      shortCode = customCode;
    } else {
      shortCode = nanoid(6);
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      expiresAt:expiresAt||null
    });

    return res.status(201).json({
      message: "Short URL created successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }
    if(url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({
      message: "This short URL has expired",
    });
}
    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUrlAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    return res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      expiresAt: url.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalUrls = await Url.countDocuments();

    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      page,
      limit,
      totalUrls,
      totalPages: Math.ceil(totalUrls / limit),
      count: urls.length,
      urls,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlAnalytics,
  getAllUrls
};