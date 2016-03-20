var path = require('path');


var render = function() {
    var self = this;

    var _path = path.parse(self.req.url, true);
    console.log('@@@')

    var newUrl = '/blog/article/' + _path.base;

    self.res.writeHead(301, { 'Location': newUrl });
    self.res.end();
}

exports.get = render;