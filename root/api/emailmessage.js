var account = require('../../system/config/account.js');
var qs = require('querystring');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'QQex', // no need to set host or port etc.
    auth: {
        user: account.email.user,
        pass: account.email.pass,
    }
});

var mailOptions = {
    from: '"Mofei Zhu"<hello@zhuwenlong.com>',
    to: '13761509829@163.com',
    subject: '新留言@zhuwenlong.com',
    html: ''
}

var post = function() {
    var self = this;
    var body = '';
    this.req.on('data', function(data) {
        body += data;
        if (body.length > 1e6) {
            this.req.connection.destroy();
        }
    });

    this.req.on('end', function() {
        var post = qs.parse(body);
        mailOptions.html = '<p>来至' + post.username + (post.email ? '(' + post.email + ')' : '') + '的留言：</p>'
        mailOptions.html += '<p>' + post.message + '</p>';

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                self.response.json({ code: 500, text: err })
            } else {
                self.response.json({ code: 200, text: info })
            }
        })

    });

}

exports.post = post;
