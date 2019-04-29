const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');
const makred = require('marked');

module.exports = async function(req, res, next) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;

  if (!query.id) {
    res.status(403).json({
      err: '哎呀呀，你走错道儿了！'
    });
    return false;
  }

  const DB = await mongoConnect();
  const blogCommentC = DB.collection('blog_comment');

  const list = await blogCommentC.find({
    blogid: mongodb.ObjectID(query.id)
  }, { sort: { _id: -1 } }).toArray();

  res.json({
    state: 'ok',
    list
  });
}