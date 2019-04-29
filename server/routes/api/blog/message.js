const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');
const makred = require('marked');


const sendEmail = require('../../common/sendEmail.js');

module.exports = async function(req, res, next) {
  let userinfo;
  try {
    userinfo = JSON.parse(req.cookies.userinfo);
  } catch (e) {
    console.log(e)
  };

  if (!req.body.id) {
    res.status(403).json({
      err: '哎呀呀，你走错道儿了！'
    });
    return false;
  }

  if (!req.body.message) {
    res.status(403).json({
      err: '哎呀呀，你没写内容呐！'
    });
    return false;
  }

  if (!userinfo || !userinfo.name) {
    res.status(403).json({
      err: '陌生人，请问你叫什么？'
    });
    return false;
  }

  const DB = await mongoConnect();
  const blogCommentC = DB.collection('blog_comment');
  const inserObj = {};
  makred.setOptions({ sanitize: true })

  let toEmail = '13761509829@163.com';
  let repCtx = '';

  if (req.body.replyID) {
    const oldMSG = await blogCommentC.findOne({
      _id: mongodb.ObjectID(req.body.replyID)
    });
    repCtx = oldMSG.content.replace(/\<.+?\>/g, '').replace(/[\n|\r]/g, '').substr(0, 200);
    inserObj.replyTxt = makred(`> @${oldMSG.name} ${repCtx}`);
    if (inserObj.email) {
      toEmail = inserObj.email;
    }
  }

  const { name, email, blog } = {...userinfo };
  name && (inserObj.name = name);
  email && (inserObj.email = email);
  blog && (inserObj.blog = blog);
  req.body.message && (inserObj.content = makred(req.body.message));
  inserObj.time = new Date();
  req.body.replayid && (inserObj.replayid = req.body.replayid);
  req.body.avatar && (inserObj.avatar = req.body.avatar);
  inserObj.blogid = mongodb.ObjectID(req.body.id);

  await blogCommentC.insertOne(inserObj);

  sendEmail(
    toEmail,
    req.body.replayid ? '您在 [朱文龙的自留地] 的留言有了新回复' : '新留言',
    `<div style="BORDER: #666666 1px solid; MARGIN: 10px auto 0px; WIDTH: 702px; FONT-FAMILY: 微软雅黑, Arial; COLOR: #111; FONT-SIZE: 12px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; border-radius: 8px"> <div style="WIDTH: 100%; BACKGROUND: #666666; HEIGHT: 60px; COLOR: white; -moz-border-radius: 6px 6px 0 0; -webkit-border-radius: 6px 6px 0 0; -khtml-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0"> <span style="LINE-HEIGHT: 60px; HEIGHT: 60px; MARGIN-LEFT: 30px; FONT-SIZE: 12px">您在 <a style="COLOR: #00bbff; FONT-WEIGHT: 600; TEXT-DECORATION: none" href="https://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> 上的留言有新回复啦！</span> </div> <div style="MARGIN: 0px auto; WIDTH: 90%"> <p>Mofei, 您好!</p> <p>您曾在 <a href="${req.header('Referer')}" target="_blank">朱文龙的自留地</a> 的留言</p><p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #f4f4f4; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">${repCtx}</p><p>${name} 给您的回复如下: </p> <p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #f4f4f4; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">${inserObj.content.replace(/\<.+?\>/g, '').replace(/[\n|\r]/g, '').substr(0, 200)}...</p> <p>您可以点击 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="${req.header('Referer')}" target="_blank">查看回复的完整內容</a> </p> <p>欢迎再次光临 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="https://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> </p> <p>(此邮件由系统自动发出, 请勿回复.)</p> </div></div>`
  );


  res.json({
    state: 'ok',
    data: inserObj
  });
}