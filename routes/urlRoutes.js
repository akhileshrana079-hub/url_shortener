const express = require('express');
const router = express.Router();

const {shortenUrl,redirectUrl,getUrlAnalytics,getAllUrls} = require('../controller/urlContoller');
const { createUrlLimiter } = require("../middleware/rateLimiter");

router.post('/shorten',createUrlLimiter,shortenUrl);
router.get('/', getAllUrls);
router.get("/analytics/:shortCode", getUrlAnalytics);
router.get('/:shortCode',redirectUrl);


module.exports= router;