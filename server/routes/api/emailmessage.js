const nodemailer = require('nodemailer');

module.exports = function (req, res, next) {
  console.log({
    user: process.env.EmailUser,
    pass: process.env.EmailPwd,
  })
  const transporter = nodemailer.createTransport({
    service: 'QQex', // no need to set host or port etc.
    auth: {
      user: process.env.EmailUser,
      pass: process.env.EmailPwd,
    }
  });

  const mailOptions = {
    from: '"Mofei Zhu"<hello@zhuwenlong.com>',
    to: '13761509829@163.com',
    subject: '新留言@zhuwenlong.com',
    html: ''
  }

  mailOptions.html = '<p>来至' + req.body.username + (req.body.email ? '(' + req.body.email + ')' : '') + '的留言：</p>'
  mailOptions.html += '<p>' + req.body.message + '</p>';

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json({
        code: 500,
        text: err
      })
    } else {
      res.json({
        code: 200, text: info
      })
    }
  })



  // console.log(req.body)
  // res.render('index', { title: 'Express' });
}