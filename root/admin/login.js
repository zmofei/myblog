var querystring = require('querystring');
var Mongo = require('../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;

const crypto = require('crypto');


var render = function() {
    var data = '';
    var self = this;
    this.req.on('data', function(_data) {
        data += _data;
    })
    this.req.on('end', function() {
        var info = querystring.parse(data);

        if (info.username && info.password) {
            const secret = 'mofei';
            const password = crypto.createHmac('sha256', secret)
                .update(info.password)
                .digest('hex');
            Mongo.open(function(db) {
                db.collection('blog_user').find({
                    'username': info.username,
                    'password': password
                }).toArray(function(err, data) {
                    if (err) {
                        self.response.http(302, {
                            'Location': '/admin?err=' + err
                        })
                    } else if (data.length < 1) {
                        self.response.http(302, {
                            'Location': '/admin?err=username'
                        })
                    } else {
                        self.response.http(302, {
                            'Location': '/admin/list'
                        })
                    }
                })
            })
        } else {
            self.response.http(302, {
                'Location': '/admin?err=noinput'
            })
        }
    })
}

exports.post = render;
