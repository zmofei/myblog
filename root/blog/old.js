function render() {
    var params = this.req.url.split('/');
    var blogid = params[params.length - 1];
    if (blogid.length == 24) {
        this.res.writeHead(301, {
            'location': '/blog/article/' + blogid
        });
        this.res.end('404 Not Found!');
    } else {
        this.res.writeHead(404, {
            'Content-Type': 'text/html; charset=UTF-8'
        });
        this.res.end('404 Not Found!');
    }
}
exports.get = render;
