const nodemailer = require('nodemailer');

function sendEmail(to, subject, html) {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'QQex', // no need to set host or port etc.
      auth: {
        user: process.env.EmailUser,
        pass: process.env.EmailPwd,
      }
    });

    const mailOptions = {
      from: '"Mofei Zhu"<hello@zhuwenlong.com>',
      to,
      subject,
      html
    }

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    })
  })

}

module.exports = sendEmail;