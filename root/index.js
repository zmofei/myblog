var render = function() {
    this.jade({
        data: {
            title: 'abc'
        }
    })
}

exports.get = render;
