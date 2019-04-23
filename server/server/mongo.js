const MongoClient = require('mongodb').MongoClient;
const config = process.env

const dbName = config.DBName;
const user = config.DBUser;
const password = config.DBPwd;
const url = `mongodb://${config.DBURL || 'localhost'}/${dbName}`;

let dbConnection = null;

let cacheCallback = [];

function getDB(cb) {
  return new Promise(resolve => {
    if (dbConnection) {
      resolve(dbConnection);
    } else {
      console.log(`connecting to db ${url} ...`);
      MongoClient.connect(url, {
        useNewUrlParser: true,
        auth: {
          user,
          password
        }
      }, (err, client) => {
        if (err) {
          console.log('connect to servier faild', err);
        } else {
          console.log(`connect to db ${url} success`);

          while (cacheCallback.length > 0) {
            cacheCallback.shift(client);
          }
          dbConnection = client.db(dbName);
          resolve(dbConnection);
        }
      });
    }
  });
}


module.exports = getDB;