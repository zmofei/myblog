var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/emailmessage', require('./api/emailmessage'));

module.exports = router;