const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');

module.exports = async function(req, res, next) {
  const DB = await mongoConnect();
  const blogC = DB.collection('blog');
  const list = await blogC.aggregate([
    { $sort: { pubtime: -1 } },
    { $limit: 20 },
    {
      $project: {
        _id: 1,
        content: { $substrCP: ["$content", 0, 200] },
        contentEn: { $substrCP: ["$content-en", 0, 200] },
        classid: 1,
        comment: 1,
        pubtime: 1,
        title: 1,
        'title-en': 1,
        cover: 1,
        visitedL: 1,
        links: 1,
        like: 1,
      }
    }
  ]).toArray();

  // 

  list.forEach(l => {
    l.content = l.content.replace(/[\s|\`|//]/g, '').replace(/\s+/g, ' ')
    l.contentEn = l.contentEn.replace(/[\s|\`|//]/g, '')
  });

  res.json({
    list
  })
}