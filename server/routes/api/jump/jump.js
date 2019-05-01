const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

const allowModules = { 'lab': { visited: true }, 'links': { visited: true } };


async function jump(req, res) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const isSameHost = req.header('Referer') && req.header('Referer').indexOf(req.hostname) !== -1;
  const cookie_id = `link_${query.url}`;


  let timePass = true;
  if (req.cookies[cookie_id]) {
    const passedTime = new Date() - new Date(req.cookies[cookie_id]);
    if (passedTime < 1000 * 60) {
      timePass = false;
    } else {
      timePass = true;
      res.cookie(cookie_id, new Date());
    }
  } else {
    res.cookie(cookie_id, new Date());
  }


  if (query.url) {
    if (query.module && query.id && query.type && allowModules[query.module] && allowModules[query.module][query.type] && isSameHost && timePass) {
      const DB = await mongoConnect();
      const collection = DB.collection(query.module);
      const inc = { $inc: {} };
      inc['$inc'][query.type] = 1;
      collection.updateOne({
        _id: mongodb.ObjectID(query.id)
      }, inc)
    }
    res.redirect(query.url);
  } else {
    res.status(403).end()
  }
}

module.exports = jump;