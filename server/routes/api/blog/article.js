const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

module.exports = async function(req, res, next) {
  const DB = await mongoConnect();
  const blogC = DB.collection('blog');
  let data = await blogC.findOneAndUpdate({
    _id: mongodb.ObjectID(req.params.id)
  }, {
    $inc: {
      visited: 1
    }
  }, {
    projection: {
      content: false
    }
  });
  data = data.value;


  const blogClass = {};
  const klass = await DB.collection('blog_class').find({}).toArray();
  klass.forEach(klass => {
    blogClass[klass.classid] = klass;
  });
  data.classid = data.classid.map(classid => blogClass[classid]);

  res.json({
    data
  })
}