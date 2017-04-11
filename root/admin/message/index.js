var Mongo = require('../../../system/mongo/init.js');

var get = function () {
    var self = this;

    if (this.session.get('pow') !== 'admin') {
        this.res.writeHead(302, {
            Location: '/admin/'
        });
        this.res.end();
        return false;
    }


    Mongo.open(function (db) {
        var classCollection = db.collection('blog_message');
        var data = {};
        var getBlogClass = new Promise(function (resolve, reject) {
            classCollection.find({}).limit(10).sort({
                _id: -1
            }).toArray(function (err, docs) {
                data.data = docs;
                resolve();
            });
        });

        Promise.all([getBlogClass]).then(function () {
            console.log(data)
            self.jade.render({
                data: data
            });
        });
    });
}

exports.get = get;