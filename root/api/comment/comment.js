var Mongo = require('../../../system/mongo/init.js');
var ObjectID = require('mongodb').ObjectID;
var qs = require('querystring');

var sendMsg = require('../../../lib/email/mail.js').send;

var post = function () {
    var self = this;
    var body = '';
    this.req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
            this.req.connection.destroy();
        }
    });

    this.req.on('end', function () {
        var post = qs.parse(body);
        // filter xss
        var message = post.content;
        console.log(message);
        // for <script>
        message = message.replace(/(<[\s\/]*?script.*?>)/g, '');
        // for attribuits <img on='' error=""> => <img>
        message = message.replace(/(<\s*?\w+)\s+.*?(>)/g, function (match, $1, $2) {
            return $1 + $2;
        });
        //
        Mongo.open(function (db) {
            db.collection('blog_message').insertOne({
                "name": post.name,
                "email": post.email || null,
                "blog": post.blog || null,
                "content": message,
                "blogid": ObjectID(post.blogid),
                "replayid": post.replayid ? ObjectID(post.replayid) : null,
                "avatar": post.avatar,
                "time": new Date(),
            }, function (err, res) {
                if (err) {
                    self.response.json({
                        code: 400,
                        text: err
                    });
                } else {
                    self.response.json({
                        code: 200,
                        t: 1,
                        text: res
                    });
                }
            });
            if (post.replayid) {
                db.collection('blog_message').find({
                    '_id': ObjectID(post.replayid)
                }).toArray(function (err, data) {
                    sendMsg({
                        to: data[0].email,
                        subject: '你在 [朱文龙的自留地] 的留言有了新回复',
                        html: `<div style="BORDER: #666666 1px solid; MARGIN: 10px auto 0px; WIDTH: 702px; FONT-FAMILY: 微软雅黑, Arial; COLOR: #111; FONT-SIZE: 12px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; border-radius: 8px"> <div style="WIDTH: 100%; BACKGROUND: #666666; HEIGHT: 60px; COLOR: white; -moz-border-radius: 6px 6px 0 0; -webkit-border-radius: 6px 6px 0 0; -khtml-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0"> <span style="LINE-HEIGHT: 60px; HEIGHT: 60px; MARGIN-LEFT: 30px; FONT-SIZE: 12px">您在 <a style="COLOR: #00bbff; FONT-WEIGHT: 600; TEXT-DECORATION: none" href="http://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> 上的留言有新回复啦！</span> </div> <div style="MARGIN: 0px auto; WIDTH: 90%"> <p>Mofei, 您好!</p> <p>您曾在 <a href="http://www.zhuwenlong.com/message/" target="_blank">朱文龙的自留地</a> 的留言，${post.name} 给您的回复如下: </p> <p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #eee; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">${post.content}</p> <p>您可以点击 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="http://www.zhuwenlong.com/message/" target="_blank">查看回复的完整內容</a> </p> <p>欢迎再次光临 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="http://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> </p> <p>(此邮件由系统自动发出, 请勿回复.)</p> </div></div>`
                    });
                })
            } else {
                sendMsg({
                    to: '13761509829@163.com',
                    subject: '新留言',
                    html: `<div style="BORDER: #666666 1px solid; MARGIN: 10px auto 0px; WIDTH: 702px; FONT-FAMILY: 微软雅黑, Arial; COLOR: #111; FONT-SIZE: 12px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; border-radius: 8px"> <div style="WIDTH: 100%; BACKGROUND: #666666; HEIGHT: 60px; COLOR: white; -moz-border-radius: 6px 6px 0 0; -webkit-border-radius: 6px 6px 0 0; -khtml-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0"> <span style="LINE-HEIGHT: 60px; HEIGHT: 60px; MARGIN-LEFT: 30px; FONT-SIZE: 12px">您在 <a style="COLOR: #00bbff; FONT-WEIGHT: 600; TEXT-DECORATION: none" href="http://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> 上的留言有新回复啦！</span> </div> <div style="MARGIN: 0px auto; WIDTH: 90%"> <p>Mofei, 您好!</p> <p>您曾在 <a href="http://www.zhuwenlong.com/message/" target="_blank">朱文龙的自留地</a> 的留言，${post.name} 给您的回复如下: </p> <p style="BORDER-BOTTOM: #ddd 1px solid; BORDER-LEFT: #ddd 1px solid; PADDING-BOTTOM: 20px; BACKGROUND-COLOR: #eee; MARGIN: 15px 0px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; BORDER-TOP: #ddd 1px solid; BORDER-RIGHT: #ddd 1px solid; PADDING-TOP: 20px">${post.content}</p> <p>您可以点击 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="http://www.zhuwenlong.com/message/" target="_blank">查看回复的完整內容</a> </p> <p>欢迎再次光临 <a style="COLOR: #00bbff; TEXT-DECORATION: none" href="http://www.zhuwenlong.com" target="_blank">朱文龙的自留地</a> </p> <p>(此邮件由系统自动发出, 请勿回复.)</p> </div></div>`
                });
            }
        })
    });

}

exports.post = post;