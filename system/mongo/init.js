var MongoClient = require('mongodb').MongoClient;
var config = require('../config/account.js');

var open = (function() {
  var db = null;
  var connectionStatus = 0;
  var callbacks = [];
  return function(cb) {
    if (db) {
      if (typeof(cb) == 'function') {
        cb(db);
      } else {
        console.log(cb + ' not a function pass [system/mongo/init.js]');
      }
    } else {
      cb && callbacks.push(cb);
      if (!connectionStatus) {
        // connect to the db
        const dbName = config.db.dbName || 'zhuwenlong_com';
        const url = `mongodb://${process.env.DBADDRESS || '127.0.0.1'}:27017/${dbName}`;
        console.log('connect to ', url);
        console.log('user ', config.db.user);
        console.log('password ', config.db.pwd);
        const connectInfo = { useNewUrlParser: true };
        if (config.db.user && config.db.pwd) {
          connectInfo.auth = {
            user: config.db.user,
            password: config.db.pwd
          }
        }
        MongoClient.connect(url, connectInfo, function(err, _db) {
          //   console.log(_db);
          if (err) {
            console.log('mongodb authenticate error ', err);
          } else {
            console.log('mongodb authenticate sueess ');
            db = _db.db(dbName);
            var _cb = callbacks.shift();
            while (_cb) {
              if (typeof(_cb) == 'function') {
                _cb(db);
              } else {
                console.log(_cb + ' not a function pass [system/mongo/init.js]');
              }
              _cb = callbacks.shift();
            }


            connectionStatus = 2;
          }
        });
        connectionStatus = 1;
      }
    }
  }
})();

exports.open = open;