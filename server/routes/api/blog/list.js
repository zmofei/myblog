const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');

module.exports = async function(req, res, next) {
  const DB = await mongoConnect();
  const blogC = DB.collection('blog');
  const blogSearch = {};
  const page = 1;
  const limit = 10;
  const list = await blogC.aggregate([
    { $sort: { pubtime: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        content: { $substrCP: ["$content", 0, 400] },
        contentEn: { $substrCP: ["$content-en", 0, 400] },
        classid: 1,
        comment: 1,
        pubtime: 1,
        title: 1,
        'title-en': 1,
        cover: 1,
        visited: 1,
        links: 1,
        like: 1,
      }
    }
  ]).toArray();

  const blogClass = {};
  const klass = await DB.collection('blog_class').find({}).toArray();
  klass.forEach(klass => {
    blogClass[klass.classid] = klass;
  });

  // 

  list.forEach(l => {
    l.content = l.content
      .replace(/\!\[.*?\]\(.*?\)/g, ' ')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[\`|//|\#+]/g, '')
      .replace(/\s+/g, ' ')
      .substr(0, 200)
    l.contentEn = l.contentEn
      .replace(/\!\[.*?\]\(.*?\)/g, ' ')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[\`|//|\#+]/g, '')
      .replace(/\s+/g, ' ')
      .substr(0, 200)
  });

  list.forEach(l => {
    l.classid = l.classid.map(classid => blogClass[classid]);
  })

  const count = await blogC.countDocuments(blogSearch);

  res.json({
    list,
    page: {
      page,
      limit,
      count
    }
  })
}