const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

module.exports = async function(req, res, next) {
  const DB = await mongoConnect();
  const blogC = DB.collection('blog');
  let data = await blogC.updateOne({
    _id: mongodb.ObjectID(req.params.id)
  }, {
    $inc: {
      like: 1
    }
  });

  res.json({
    code: 200
  })
}