var Mongo = require('../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;
var marked = require('marked');

var render = function () {
    const isEnglish = /himofei\.com/.test(this.req.headers.host);
    var path;
    if (isEnglish) {
        path = this.jade.proto.router.path.replace(/\.\w+$/, '.en.jade');
    }

    var self = this;
    var id = this.reqParam && this.reqParam[1];
    if (!id || id.length != 24) {
        self.response.http(404);
    }


    var data = {}

    Mongo.open(function (db) {
        var getBlog = new Promise(function (reslove, reject) {
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
                function (err, docs) {
                    data.blog = docs.value || {};
                    if (!docs.value) {
                        reslove();
                    } else {
                        let extendKey = '';
                        if (isEnglish && docs.value['content-en']) {
                            docs.value.title = docs.value['title-en'] || docs.value.title;
                            extendKey = '-en';
                        }
                        if (docs.value['html' + extendKey]) {
                            docs.value.html = docs.value['html' + extendKey] || docs.value.html;
                            reslove();
                        } else {
                            docs.value['html' + extendKey] = marked(docs.value['content' + extendKey]);
                            docs.value.html = docs.value['html' + extendKey] || docs.value.html;
                            const updateObj = {};
                            updateObj['html' + extendKey] = docs.value['html' + extendKey];
                            db.collection('blog').updateOne(findQuery, {
                                $set: updateObj
                            }, function (err, results) {
                                reslove();
                            })
                        }
                    }
                });
        });

        var getBlogClass = new Promise(function (resolve, reject) {
            db.collection('blog_class').find({}).toArray(function (err, docs) {
                var blogClass = {};
                for (var i in docs) {
                    blogClass[docs[i].classid] = docs[i];
                }
                data.blogClass = blogClass;
                resolve();
            });
        });

        function getComment() {
            return new Promise(function (reslove, reject) {
                if (data.blog) {
                    db.collection('blog_comment').find({
                        blogid: ObjectID(data.blog._id)
                    }, {
                        sort: {
                            _id: -1
                        }
                    }).toArray(function (err, docs) {
                        data.comments = docs || [];
                        reslove();
                    });
                } else {
                    reslove();
                }
            });
        }

        Promise.all([getBlog, getBlogClass]).then(getComment).then(function () {
            if (data.blog && data.blog.content && data.blog.title) {
                var classid = data.blog.classid;
                var tags = []
                if (typeof (classid) == 'string') {
                    var classId = data.blog.classid.split(',');
                } else {
                    classId = classid;
                }

                for (var i in classId) {
                    tags.push(data.blogClass[classId[i]]);
                }

                data.tags = tags;
                let content
                if (isEnglish) {
                    content = (data.blog['content-en'] || data.blog.content);
                    content = content.replace(/(\!{0,1}\[.+?\]\(.+?\))|#|(`+?)|\*|=|\n/g, ' ').split(' ');
                    content.length = 180;
                    content = content.join(' ');
                } else {
                    content = data.blog.content;
                    content = content.replace(/(\!{0,1}\[.+?\]\(.+?\))|#|(`+?)|\*|=|-/g, ' ').slice(0, 180) + ' ...'
                }

                data.meta = {
                    title: content
                }

                self.jade.render({
                    data: data,
                    path: path
                });
            } else {
                self.response.http(404);
            }
        });

    })
}

exports.get = render;