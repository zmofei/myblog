const nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

module.exports = async function (req, res, next) {
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

    const inserObj = {};
    const { name, email, blog } = { ...userinfo };
    name && (inserObj.name = name);
    email && (inserObj.email = email);
    blog && (inserObj.blog = blog);
    req.body.message && (inserObj.content = req.body.message);
    inserObj.time = new Date();
    req.body.replayid && (inserObj.replayid = req.body.replayid);
    req.body.avatar && (inserObj.avatar = req.body.avatar);
    inserObj.blogid = req.body.id;


    const DB = await mongoConnect();
    const blogMessageC = DB.collection('blog_message');
    await blogMessageC.insertOne(inserObj);

    res.json({
        state: 'ok'
    });
}