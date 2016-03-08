var Mongo = require('../../system/mongo/init.js');

var url = require('url');


var render = function() {
    var self = this;
    var page = 0;
    var perPage = 10;
    var skip = 0;

    if (self.reqParam && self.reqParam[1]) {
        page = Math.max(self.reqParam[1] - 1, 0);
        skip = perPage * page;
    }

    Mongo.open(function(db) {
        var collection = db.collection('blog');
        var classCollection = db.collection('blog_class');

        var url_parts = url.parse(self.req.url, true);
        var search = url_parts.search;

        var data = {
            currentPage: page + 1,
            search: search,
        };

        var getBlogClass = new Promise(function(resolve, reject) {
            classCollection.find({}).toArray(function(err, docs) {
                var blogClass = {};
                for (var i in docs) {
                    blogClass[docs[i].classid] = docs[i];
                }
                data.blogClass = blogClass;
                resolve();
            });
        });

        var getCount = new Promise(function(resolve, reject) {
            collection.count(function(err, count) {
                data.totalPage = Math.ceil(count / perPage);
                resolve();
            });
        });

        var getBlog = new Promise(function(resolve, reject) {
            collection.find({}, { limit: perPage, skip: skip, sort: { _id: -1 } }).toArray(function(err, docs) {
                data.blogs = docs;
                resolve();
            });
        });

        Promise.all([getBlogClass, getCount, getBlog]).then(function(val) {
            for (var i in data.blogs) {
                data.blogs[i].tags = [];
                var tagIds = data.blogs[i].classid.split(',');
                for (var j in tagIds) {
                    data.blogs[i].tags.push({
                        id: tagIds[j],
                        name: data.blogClass[tagIds[j]].classname
                    });
                }
            }
            self.jade({
                data: data
            })
        });
    });
}

exports.get = render;
