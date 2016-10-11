var Mongo = require('../../system/mongo/init.js');

var encode = function (strUni) {
    var strUtf = strUni.replace(/./g, function (c) {
        var cc = c.charCodeAt(0);
        if(cc<32){
            return '';
        }else{
            return c;
        }
        // return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
    });
    // var strUtf = strUni.replace(/[\u0080-\u07ff]/g, function (c) {
    //     var cc = c.charCodeAt(0);
    //     return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
    // });

    // strUtf = strUtf.replace(/[\u0800-\uffff]/g, function (c) {
    //     var cc = c.charCodeAt(0);
    //     return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
    // });

    return strUtf;
};

var render = function () {
    var self = this;

    Mongo.open(function (db) {
        var collection = db.collection('blog');
        collection.find({}, {
            limit: 10,
            skip: 0,
            sort: {
                _id: -1
            }
        }).toArray(function (err, docs) {
            for (var i in docs) {
                var item = docs[i];
                item.html = encode(item.html);
                // console.log()
            };

            // console.log('@@@',docs);
            self.jade.render({
                header: {
                    'Content-Type': 'application/xml; charset=utf-8'
                },
                data: {
                    blogs: docs
                }
            })
        });

    });
}

exports.get = render;