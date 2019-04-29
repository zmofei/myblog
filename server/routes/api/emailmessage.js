const sendEmail = require('../common/sendEmail.js');

module.exports = async function(req, res, next) {

  let html = '<p>来至' + req.body.username + (req.body.email ? '(' + req.body.email + ')' : '') + '的留言：</p>'
  html += '<p>' + req.body.message + '</p>';
  const msg = await sendEmail('13761509829@163.com', '新留言@zhuwenlong.com', html)

  res.json({
    code: 200,
    text: msg
  });
}