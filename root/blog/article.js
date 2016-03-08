var Mongo = require('../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;
var marked = require('marked');

var render = function() {
    var self = this;
    var id = this.reqParam[1];

    var data = {}


    Mongo.open(function(db) {
        var getBlog = new Promise(function(reslove, reject) {
            db.collection('blog').find({ _id: ObjectID(id) }).toArray(function(err, docs) {
                data.blog = docs[0];
                reslove();
            });
        });

        var getBlogClass = new Promise(function(resolve, reject) {
            db.collection('blog_class').find({}).toArray(function(err, docs) {
                var blogClass = {};
                for (var i in docs) {
                    blogClass[docs[i].classid] = docs[i];
                }
                data.blogClass = blogClass;
                resolve();
            });
        });

        function getComment() {
            return new Promise(function(reslove, reject) {
                db.collection('blog_comment').find({ blogid: ObjectID(data.blog._id) }).toArray(function(err, docs) {
                    data.comments = docs;
                    console.log(docs)
                    reslove();
                });
            });
        }

        Promise.all([getBlog, getBlogClass]).then(getComment).then(function() {
            data.blog.html = marked(data.blog.content);
            var classId = data.blog.classid.split(',');
            var tags = []
            for (var i in classId) {
                tags.push(data.blogClass[classId[i]]);
            }
            data.tags = tags;
            self.jade({
                data: data
            });
        });

    })
}

exports.get = render;
