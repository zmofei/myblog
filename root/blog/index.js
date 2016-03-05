var Mongo = require('../../system/mongo/init.js');

var render = function() {
    var self = this;
    Mongo.open(function(db) {
        var collection = db.collection('blog');
        collection.find({}).sort({ _id: -1 }).toArray(function(err, docs) {
            // console.log(docs)
            self.jade({
                data: {
                    blogs: docs
                }
            })
        });
    });
}

module.exports = render;
