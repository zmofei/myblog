var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/emailmessage', require('./api/emailmessage'));
router.get('/blog/tags', require('./api/blog/tags'));
router.get('/blog/lists', require('./api/blog/list'));
router.get('/blog/article/:id', require('./api/blog/article'));
router.post('/blog/like/:id', require('./api/blog/like'));
router.post('/blog/message', require('./api/blog/message'));



module.exports = router;