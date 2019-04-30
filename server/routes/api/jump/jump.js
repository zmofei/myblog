const mongodb = require('mongodb');
const mongoConnect = require('../../../server/mongo');
const url = require('url');

const allowModules = { 'lab': { type: 'visited' } };

async function jump(req, res) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const isSameHost = req.header('Referer') && req.header('Referer').indexOf(req.host) !== -1;
  if (query.url) {
    if (query.module && query.id && query.type && allowModules[uery.module] && allowModules[uery.module][query.type] && isSameHost) {
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