const validator = require("validator");
const Url = require("../models/url");
const { nanoid } = require('nanoid');

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

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

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl
};