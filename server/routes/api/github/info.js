const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

// const URL = require('URL');

module.exports = async function(req, res, next) {

  const DB = await mongoConnect();
  const blogC = DB.collection('system');


  const info = await blogC.findOne({
    key: 'github'
  }, {
    projection: {
      followers: true,
      following: true,
      public_repos: true,
      _id: false
    }
  })


  res.json({
    info
  })
}