var Mongo = require('../../../system/mongo/init.js');

var qs = require('querystring');

var post = function () {

    var self = this;

    var body = '';
    this.req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
            this.req.connection.destroy();
        }
    });

    this.req.on('end', function () {
        var post = qs.parse(body);

        Mongo.open(function (db) {
            db.collection('blog').insertOne({
                "classid": post.class ? (typeof (post.class) == 'string' ? post.class : post.class.join(',')) : null,
                "state": post.state,
                "content": post.content,
                "title": post.title,
                "pubtime": new Date(),
            }, function (err, res) {
                if (err) {
                    self.response.json({
                        code: 400,
                        data: post
                    });
                } else {
                    self.response.json({
                        code: 200,
                        data: post
                    });
                }
            })
        })
    })

    // Mongo.open(function (db) {
    //     // var classCollection = db.collection('blog_class');
    //     // var data = {};
    //     // var getBlogClass = new Promise(function (resolve, reject) {
    //     //     classCollection.find({}).toArray(function (err, docs) {
    //     //         var blogClass = {};
    //     //         for (var i in docs) {
    //     //             blogClass[docs[i].classid] = docs[i];
    //     //         }
    //     //         data.blogClass = blogClass;
    //     //         resolve();
    //     //     });
    //     // });
    //     // this.res.writeHead(200, {
    //     //     'Content-Type': 'text/plain'
    //     // });
    //     self.response.json({
    //         msg: 'got it'
    //     });
    //     // Promise.all([getBlogClass]).then(function (val) {
    //     // self.jade.render({
    //     // data: data
    //     // });
    //     // });
    // });
}

exports.post = post;