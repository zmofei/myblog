var Mongo = require('../../../system/mongo/init.js');

var qs = require('querystring');

function getDB() {
  return new Promise(resolve => {
    Mongo.open(function(db) {
      resolve(db);
    });
  })
}

function insertBlog(db, data) {
  return new Promise(resolve => {
    db.collection('blog')
      .insertOne(data, (err, res) => {
        resolve(res);
      })
  })
}

function updateClassCount(db, classid) {
  return new Promise(resolve => {
    db.collection('blog')
      .countDocuments({
        state: {
          $in: ["0", 0, null]
        },
        classid: { $in: [classid] }
      }, (err, count) => {
        db.collection('blog_class')
          .updateOne({ classid }, {
            $set: { classcount: count }
          }, function(err, doc) {
            console.log(err)
            console.log(`update ${classid} with ${count}`)
            resolve();
          });
      })
  })
}

var post = function() {
  var self = this;

  var body = '';
  this.req.on('data', function(data) {
    body += data;
    if (body.length > 1e6) {
      this.req.connection.destroy();
    }
  });

  this.req.on('end', async function() {
    var post = qs.parse(body);

    // get post class
    let postClass = [];
    if (post.class) {
      classIds = typeof post.class === 'string' ? [post.class] : post.class;
      postClass = classIds.map(classid => Number(classid))
    }

    const db = await getDB();

    // insert blog
    await insertBlog(db, {
      "classid": postClass,
      "state": post.state,
      "content": post.content,
      "title": post.title,
      "pubtime": new Date(),
    });

    // update class count
    postClass.forEach(async classId => {
      await updateClassCount(db, classId);
    });

    self.response.json({
      code: 200,
      data: post
    });
  });
}

exports.post = post;