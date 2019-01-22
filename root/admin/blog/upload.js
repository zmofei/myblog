'use strict';

var fs = require('fs');
var path = require('path');
var formidable = require("formidable");

var post = function() {
  var req = this.req;
  var res = this.res;

  var form = new formidable.IncomingForm();
  var files = [];
  var fields = [];
  form
    .on('field', function(field, value) {
      // console.log('field')
      fields.push([field, value]);
    })
    .on('file', function(field, file) {
      // console.log('file')
      files.push([field, file]);
    })
    .on('end', function() {});
  form.parse(req, function(err, fields, files) {
    var newPath = path.join(__dirname, '../../../static/upload/image');
    var basefileName = (+new Date()).toString() + '-' + files.img.name;
    var newFilePath = path.join(newPath, basefileName);
    var cdnPath = path.join('https://static.zhuwenlong.com/upload/image', basefileName);
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
          uploadSuccess(res, newFilePath, cdnPath)
        })
      };
    });
  });

}

function uploadSuccess(res, newFilePath, cdnPath) {
  res.writeHead(200, {
    'content-type': 'text/plain'
  });
  res.end('received files: <p>' + '\n\n' + newFilePath + '</p><p>' + cdnPath + '</p>');
}


exports.post = post;

exports.get = function() {
  if (this.session.get('pow') !== 'admin') {
    this.res.writeHead(302, {
      Location: '/admin/'
    });
    this.res.end();
    return false;
  }

  this.jade.render({});
}