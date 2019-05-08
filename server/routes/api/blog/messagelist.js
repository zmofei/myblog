const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');
const makred = require('marked');

module.exports = async function(req, res, next) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query || {};

  const page = Number(query.page || 1);
  const pageNumber = Number(query.pageNumber || 20);

  if (!query.id) {
    res.status(403).json({
      err: '哎呀呀，你走错道儿了！'
    });
    return false;
  }

  const DB = await mongoConnect();
  const blogCommentC = DB.collection('blog_comment');

  const list = await blogCommentC
    .find({
      blogid: mongodb.ObjectID(query.id)
    }, {
      skip: (page - 1) * pageNumber,
      limit: pageNumber,
      sort: { _id: -1 }
    })
    .toArray();

  const total = await blogCommentC
    .countDocuments({
      blogid: mongodb.ObjectID(query.id)
    })

  res.json({
    state: 'ok',
    list,
    page: {
      page,
      total
    }
  });
}