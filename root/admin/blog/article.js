var Mongo = require('../../../system/mongo/init.js');

var get = function () {
    var self = this;

    Mongo.open(function (db) {
        var classCollection = db.collection('blog_class');
        var data = {};
        var getBlogClass = new Promise(function (resolve, reject) {
            classCollection.find({}).toArray(function (err, docs) {
                var blogClass = {};
                for (var i in docs) {
                    blogClass[docs[i].classid] = docs[i];
                }
                data.blogClass = blogClass;
                resolve();
            });
        });

        Promise.all([getBlogClass]).then(function (val) {
            self.jade.render({
                data: data
            });
        });
    });
}

exports.get = get;