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

var send = function (obj) {
    mailOptions.to = obj.to || mailOptions.to;
    mailOptions.html = obj.html || mailOptions.html;
    mailOptions.subject = obj.subject || mailOptions.subject;

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log('send error', err);
        } else {
            // console.log('send success', info);
        }
    });

}

exports.send = send;