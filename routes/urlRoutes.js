const express = require('express');
const router = express.Router();

const {shortenUrl,redirectUrl} = require('../controller/urlContoller');

router.post('/shorten',shortenUrl);
router.get('/:shortCode',redirectUrl);
module.exports= router;