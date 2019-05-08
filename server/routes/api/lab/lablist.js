// const nodemailer = require('nodemailer');
// const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');
// const makred = require('marked');

module.exports = async function(req, res, next) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;

  const DB = await mongoConnect();
  const blogCommentC = DB.collection('lab');

  const list = await blogCommentC.find({}, { sort: { visited: -1 } }).toArray();

  res.json({
    state: 'ok',
    list
  });
}