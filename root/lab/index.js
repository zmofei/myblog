var Mongo = require('../../system/mongo/init.js');

var url = require('url');


var render = function() {
    var self = this;
    self.jade.render({
    })
}

exports.get = render;
