const rateLimit = require("express-rate-limit");

const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: {
    message: "Too many URL creation requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createUrlLimiter,
};