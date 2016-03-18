var Mongo = require('../../system/mongo/init.js');

var render = function() {
    var self = this;

    Mongo.open(function(db) {
        var collection = db.collection('blog');
        collection.find({}, { limit: 10, skip: 0, sort: { _id: -1 } }).toArray(function(err, docs) {
            self.jade.render({
                header: {
                    'Content-Type': 'application/xml'
                },
                data: {
                    blogs: docs
                }
            })
        });

    });
}

exports.get = render;
