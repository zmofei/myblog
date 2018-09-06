var render = function() {
    this.res.writeHead(302, { "Location": "https://zhuwenlong.com" });
    this.res.end();
}

exports.get = render;