var render = function () {
    const isEnglish = /himofei\.com/.test(this.req.headers.host);
    var path;
    if (isEnglish) {
        path = this.jade.proto.router.path.replace(/\.\w+$/, '.en.jade');
    }

    this.jade.render({
        path: path
    });
}

exports.get = render;