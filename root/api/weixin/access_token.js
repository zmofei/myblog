const Mongo = require('../../../system/mongo/init.js');
const https = require('https');
const appid = 'wx65d07a7fbed35d0d';
const appsecret = '*****';
const crypto = require('crypto');
const hash = crypto.createHash('sha1');

const get = function() {
    var self = this;
    Mongo.open(function(db) {
        db.collection('system').find({
            'name': 'weixin'
        }).toArray(function(err, data) {
            var getToken = true;
            var now = new Date();
            var timestamp = parseInt(now / 1000);
            var noncestr = Math.random().toString(36);
            var referer = self.req.headers.referer;
            if (data.length > 0 && data[0].expire > now && data[0].jsapiTicket) {
                self.response.json({
                    code: 200,
                    msg: {
                        'jsapiTicket': data[0].jsapiTicket,
                        'noncestr': noncestr,
                        'signature': getSignature(data[0].jsapiTicket, timestamp, noncestr, referer),
                        'url': referer,
                        'timestamp': timestamp,
                        'expire': data[0].expire,
                        'type': 'old'
                    }
                });
            } else {
                getAccessToken(db, function(token) {
                    if (token) {
                        getJsapiTicket(db, token.token, token.expire, function(jsapi_ticket) {
                            if (jsapi_ticket) {
                                self.response.json({
                                    code: 200,
                                    msg: {
                                        'noncestr': noncestr,
                                        'jsapiTicket': jsapi_ticket.jsapiTicket,
                                        'signature': getSignature(jsapi_ticket.jsapiTicket, timestamp, noncestr, referer),
                                        'url': referer,
                                        'timestamp': timestamp,
                                        'expire': token.expire,
                                        'type': 'new'
                                    }
                                });
                            } else {
                                self.response.json({
                                    code: 500,
                                    msg: 'jsapi_ticket error:' + jsapi_ticket
                                });
                            }
                        });
                    } else {
                        self.response.json({
                            code: 500,
                            msg: 'token error:' + token
                        });
                    }
                });
            }
        })
    });
}

function getSignature(jsapiTicket, timestamp, noncestr, url) {
    var str = 'jsapi_ticket=' + jsapiTicket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
    str = crypto.createHash('sha1').update(str).digest('hex');
    return str;
}

function getAccessToken(db, callback) {
    https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret, (res) => {
        res.on('data', (d) => {
            var token = JSON.parse(d.toString());
            if (token) {
                var date = new Date();
                var expire = (+date) + (token.expires_in - 600) * 1000;
                db.collection('system').update({
                    'name': 'weixin',
                }, {
                    $set: {
                        'access_token': token.access_token,
                        'expire': expire
                    }
                }, {
                    upsert: true
                }, function(err, r) {
                    var _data = false;
                    if (!err) {
                        _data = {
                            token: token.access_token,
                            expire: expire
                        }
                    }
                    callback && callback(_data);
                });
            }
        });
    }).on('error', (e) => {
        callback && callback(false);
    });
}

function getJsapiTicket(db, access_token, expire, callback) {
    https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (res) => {
        res.on('data', (d) => {
            var jsapiTicket = JSON.parse(d.toString());
            if (jsapiTicket.errcode == 0 && jsapiTicket.ticket) {
                db.collection('system').update({
                    'name': 'weixin',
                }, {
                    $set: {
                        'jsapiTicket': jsapiTicket.ticket
                    }
                }, function(err, r) {
                    var _data = false;
                    if (!err) {
                        _data = {
                            'jsapiTicket': jsapiTicket.ticket
                        }
                    }
                    callback && callback(_data);
                });
            }
        });
    }).on('error', (e) => {
        callback && callback(false);
    });
}

exports.get = get;
