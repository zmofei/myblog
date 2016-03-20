var Mongo = require('../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;

var render = function() {
    var self = this;

    var page = 0;
    var perPage = 10;
    var skip = 0;

    if (self.reqParam && self.reqParam[1]) {
        page = Math.max(self.reqParam[1] - 1, 0);
        skip = perPage * page;
    }

    var data = {
        currentPage: page + 1,
    };

    Mongo.open(function(db) {
        var getComment = new Promise(function(reslove, reject) {
            db.collection('blog_message').find({}, { limit: perPage, skip: skip, sort: { _id: -1 } }).toArray(function(err, docs) {
                data.comments = docs;
                reslove();
            });
        });

        var getCount = new Promise(function(resolve, reject) {
            db.collection('blog_message').count(function(err, count) {
                data.totalPage = Math.ceil(count / perPage);
                resolve();
            });
        });

        Promise.all([getComment, getCount]).then(function() {
            self.jade.render({
                data: data
            });
        });

    })
}

exports.get = render;