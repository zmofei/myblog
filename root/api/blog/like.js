var Mongo = require('../../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;
var qs = require('querystring');

var post = function() {
    var self = this;
    var body = '';
    this.req.on('data', function(data) {
        body += data;
        if (body.length > 1e6) {
            this.req.connection.destroy();
        }
    });

    this.req.on('end', function() {
        var post = qs.parse(body);

        var isBlog = post.blogid && post.blogid.length == 24;
        var isComment = post.commentid && post.commentid.length == 24;
        if (isBlog || isComment) {
            Mongo.open(function(db) {
                var collection = 'blog';
                var id = post.blogid;
                if (post.commentid) {
                    collection = 'blog_comment';
                    id = post.commentid;
                }
                db.collection(collection).update({ _id: ObjectID(id) }, {
                    $inc: { like: 1 }
                }, function(err, doc) {
                    if (err) {
                        self.response.json({ code: 403, text: err })
                    } else {
                        self.response.json({ code: 200, text: doc })
                    }
                });
            })
        } else {
            self.response.json({ code: 403, text: 'illegal request' })
        }
    });

}

exports.post = post;
