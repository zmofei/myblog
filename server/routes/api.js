var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/emailmessage', require('./api/emailmessage'));
router.get('/blog/tags', require('./api/blog/tags'));
router.get('/blog/lists', require('./api/blog/list'));



module.exports = router;