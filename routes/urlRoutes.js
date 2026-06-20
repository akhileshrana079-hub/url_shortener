const express = require('express');
const router = express.Router();

const {shortenUrl} = require('../controller/urlContoller');

router.post('/shorten',shortenUrl);

module.exports= router;