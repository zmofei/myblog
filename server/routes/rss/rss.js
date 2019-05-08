const convert = require('xml-js');
// const mongodb = require('mongodb');
const mongoConnect = require('../../server/mongo');
const url = require('url');

function lanSwitch(obj, lang) {
  return obj[lang];
}

async function rss(req, res) {
  const urlObj = url.parse(req.url);
  const lan = urlObj.query && urlObj.query.indexOf('lan=en') !== -1 ? 'en' : 'zh';
  const host = req.hostname;
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
        title: lanSwitch({ zh: "Hi! I'm Mofei - 朱文龙的自留地", en: "Hi! I'm Mofei" }, lan),
        link: `https://${host}`,
        description: {
          _cdata: lanSwitch({
            zh: "朱文龙,Mofei Zhu,易班网端工程师、ADOBE中国认证网络设计师，2010年接触前端，10-14年在上海易班刷了4年副本，14-18年坐标北京百度，目前带着走向世界的梦想在Mapbox打拼。",
            en: "Mofei Zhu, Start Front-End in 2010, move to Chinese biggest IT company Baidu in 2014 to be an excellent Full Stack engineer. Start a new career at Mapbox in 2018."
          }, lan)
        },
        language: lanSwitch({
          zh: 'zh-CN',
          en: 'en'
        }, lan),
        managingEditor: 'hello@zhuwenlong.com',
        webMaster: 'hello@zhuwenlong.com',
        ttl: 60 * 24
      },
      item: list.map(l => {
        return {
          title: lanSwitch({
            zh: l.title,
            en: (l['title-en'] || l.title).replace(/\n/g, ''),
          }, lan),
          link: `https://${host}/blog/article/${l._id}`,
          description: lanSwitch({
            zh: l.html.replace(/\n/g, ''),
            en: (l['html-en'] || l.html).replace(/\n/g, ''),
          }, lan).replace(/./g, function(c) {
            var cc = c.charCodeAt(0);
            if (cc < 32) {
              return '';
            } else {
              return c;
            }
          }),
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