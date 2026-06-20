const Url = require("../models/url");
const { nanoid } = require('nanoid');

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    const shortCode = nanoid(6);

    const url = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  shortenUrl,
};