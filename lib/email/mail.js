var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
         service: 'QQex', // no need to set host or port etc.
         auth: {
             user:'hello@zhuwenlong.com',
            pass:'******'
         }
});

var mailOptions = {
    from: '"Mofei"<hello@zhuwenlong.com>',
    to:'13761509829@163.com',
    subject: 'Hello',
    text:'tttt',
    html:'dfafdasfsaf'
}

transporter.sendMail(mailOptions, function(err,info){
    console.log(err);
    console.log(info)
})
