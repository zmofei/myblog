var get = function() {
    this.res.end('you use get method');
}

var post = function() {
    this.res.end('you use post method');
}

var put = function() {
    this.res.end('you use put method');
}

var patch = function() {
    this.res.end('you use patch method');
}

var _delete = function() {
    this.res.end('you use delete method');
}

exports.get = get;
exports.post = post;
exports.put = put;
exports.patch = patch;
exports.delete = _delete;
