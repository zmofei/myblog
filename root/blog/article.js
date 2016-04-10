var Mongo = require('../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;
var marked = require('marked');

var render = function() {
    var self = this;
    var id = this.reqParam && this.reqParam[1];
    if (!id) {
        self.response.http(404);
    }


    var data = {}

    Mongo.open(function(db) {
        var getBlog = new Promise(function(reslove, reject) {
            var findQuery = {
                _id: ObjectID(id)
            };
            db.collection('blog').findAndModify(findQuery, [
                    ['_id', 'asc']
                ], {
                    $inc: {
                        visited: 1
                    }
                }, {
                    new: true
                },
                function(err, docs) {
                    data.blog = docs.value;
                    if (!docs.value) {
                        reslove();
                    } else {
                        if (docs.value.html) {
                            reslove();
                        } else {
                            docs.value.html = marked(docs.value.content);
                            db.collection('blog').updateOne(findQuery, {
                                $set: {
                                    html: docs.value.html
                                }
                            }, function(err, results) {
                                reslove();
                            })
                        }
                    }
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
                if (data.blog) {
                    db.collection('blog_comment').find({
                        blogid: ObjectID(data.blog._id)
                    }, {
                        sort: {
                            _id: -1
                        }
                    }).toArray(function(err, docs) {
                        data.comments = docs;
                        reslove();
                    });
                } else {
                    reslove();
                }
            });
        }

        Promise.all([getBlog, getBlogClass]).then(getComment).then(function() {
            if (data.blog) {
                var classid = data.blog.classid;
                var tags = []
                if (typeof(classid) == 'string') {
                    var classId = data.blog.classid.split(',');
                } else {
                    classId = classid;
                }

                for (var i in classId) {
                    tags.push(data.blogClass[classId[i]]);
                }

                data.tags = tags;

                self.jade.render({
                    data: data
                });
            } else {
                self.response.http(404);
            }
        });

    })
}

exports.get = render;
