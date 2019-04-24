const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');

module.exports = async function(req, res, next) {
  const DB = await mongoConnect();
  const blogClassC = DB.collection('blog_class');
  const blogC = DB.collection('blog');

  const all = await Promise.all([blogClassC.find({}, { sort: { rank: 1 } }).toArray(), blogC.countDocuments()])
  const list = all[0];

  list.unshift({
    classname: '全部',
    classcount: all[1],
  });

  res.json({
    list
  })
}