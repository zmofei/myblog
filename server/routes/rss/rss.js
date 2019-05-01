const convert = require('xml-js');
// const mongodb = require('mongodb');
const mongoConnect = require('../../server/mongo');




async function rss(req, res) {
    const host = req.host;
    const DB = await mongoConnect();
    const blogC = DB.collection('blog');
    const list = await blogC.find({
        "state": {
            $in: ["0", 0, null]
        }
    }, {
            limit: 10,
            skip: 0,
            sort: {
                _id: -1
            },
            projection: {
                content: false
            }
        }).toArray();
    const option = {
        compact: true,
        ignoreComment: true,
        spaces: 4,
        indentCdata: true
    };
    result = convert.json2xml({
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        rss: {
            _attributes: {
                version: '2.0'
            },
            channel: {
                title: "I'm Mofei - 朱文龙的自留地",
                link: `https://${host}`,
                description: "朱文龙,Mofei Zhu,易班网端工程师、ADOBE中国认证网络设计师，2010年接触前端，10-14年在上海易班刷了4年副本，14-18年坐标北京百度，目前带着走向世界的梦想在Mapbox打拼。",
                language: 'zh-CN',
                managingEditor: 'hello@zhuwenlong.com',
                webMaster: 'hello@zhuwenlong.com',
                ttl: 60 * 24
            },
            item: list.map(l => {
                return {
                    title: l.title,
                    link: `https://${host}/blog/article/${l._id}`,
                    description: l.html.replace(/\n/g, ''),
                    author: 'hello@zhuwenlong.com (Mofei Zhu)',
                    pubDate: l.pubtime.toString(),
                    guid: `https://${host}/blog/article/${l._id}`,
                }
            })
        }
    }, option);
    res.set('Content-Type', 'text/xml');
    res.send(result);
}

module.exports = rss;