var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/emailmessage', require('./api/emailmessage'));
router.get('/blog/tags', require('./api/blog/tags'));
router.get('/blog/lists', require('./api/blog/list'));
router.get('/blog/article/:id', require('./api/blog/article'));
router.post('/blog/like/:id', require('./api/blog/like'));
router.post('/blog/message', require('./api/blog/message'));
router.get('/blog/messagelist', require('./api/blog/messagelist'));

router.get('/lib/getlist', require('./api/lab/lablist'));
router.get('/links/getlist', require('./api/links/links'));
router.get('/github/getinfo', require('./api/github/info'));



router.get('/jump', require('./api/jump/jump'));

router.get('/rss', require('./rss/rss'));




module.exports = router;