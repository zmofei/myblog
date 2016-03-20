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
        // filter xss
        var message = post.content;
        // for <script>
        message = message.replace(/(<[\s\/]*?script.*?>)/g, '');
        // for attribuits <img on='' error=""> => <img>
        message = message.replace(/(<\s*?\w+)\s+.*?(>)/g, function(match, $1, $2) {
            return $1 + $2;
        });
        //
        Mongo.open(function(db) {
            db.collection('blog_message').insertOne({
                "name": post.name,
                "email": post.email || null,
                "blog": post.blog || null,
                "content": message,
                "blogid": ObjectID(post.blogid),
                "replayid": post.replayid ? ObjectID(post.replayid) : null,
                "avatar": post.avatar,
                "time": new Date(),
            }, function(err, res) {
                if (err) {
                    self.response.json({ code: 400, text: err });
                } else {
                    self.response.json({ code: 200, t: 1, text: res });
                }
            })
        })
    });

}

exports.post = post;