var fs = require('fs');
var path = require('path');
var formidable = require("formidable");

var post = function () {
    let req = this.req;
    let res = this.res;

    var form = new formidable.IncomingForm();
    var files = [];
    var fields = [];
    form
        .on('field', function (field, value) {
            console.log('field')
            fields.push([field, value]);
        })
        .on('file', function (field, file) {
            console.log('file')
            files.push([field, file]);
        })
        .on('end', function () {});
    form.parse(req, function (err, fields, files) {
        var newPath = path.join(__dirname, '../../../static/upload/image');
        var newFilePath = path.join(newPath, (+new Date()).toString() + '-' + files.img.name);
        fs.stat(newPath, (err, stat) => {
            if (err) {
                try {
                    fs.mkdirSync(path.join(__dirname, '../../../static/upload'));
                } catch (e) {

                }
                try {
                    fs.mkdirSync(path.join(__dirname, '../../../static/upload/image'));
                } catch (e) {

                }
                fs.rename(files.img.path, newFilePath, (err) => {
                    uploadSuccess(res, newFilePath)
                })
            } else {
                fs.rename(files.img.path, newFilePath, (err) => {
                    uploadSuccess(res, newFilePath)
                })
            };
        });
    });

}

function uploadSuccess(res, newFilePath) {
    res.writeHead(200, {
        'content-type': 'text/plain'
    });
    res.end('received files:\n\n ' + JSON.stringify(newFilePath));
}


exports.post = post;

exports.get = function () {
    if (this.session.get('pow') !== 'admin') {
        this.res.writeHead(302, {
            Location: '/admin/'
        });
        this.res.end();
        return false;
    }

    this.jade.render({});
}