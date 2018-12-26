var Mongo = require('../../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;

Mongo.open(function(db) {
  // update blog's classid
  let blog = db.collection('blog');
  blog.find({}, { classid: 1 }).toArray((err, d) => {
    d.forEach(data => {
      if (data.classid && typeof data.classid !== "object") {
        blog.updateOne({ _id: ObjectID(data._id) }, { $set: { classid: data.classid.split(',').map(id => Number(id)) } },
          (err, d) => {
            console.log(err);
          })
      }
    })
  })

  // update blog_class's classid
  let blogClass = db.collection('blog_class');
  blogClass.find({}, { classid: 1 }).toArray((err, d) => {
    d.forEach(data => {
      if (data.classid && typeof data !== "number") {
        let classid = Number(data.classid)
        blogClass.updateOne({ _id: ObjectID(data._id) }, { $set: { classid: classid } },
          (err, d) => {
            console.log(err);
          })

        // fix count 
        db.collection('blog').countDocuments({
          state: {
            $in: ["0", 0, null]
          },
          classid: { $in: [data.classid] }
        }, function(err, count) {
          var classCollection = db.collection('blog_class');
          classCollection.updateOne({ classid: classid }, {
            $set: { classcount: count }
          }, function(err, doc) {
            console.log(err)
          });
        });
      }
    })
  })

});