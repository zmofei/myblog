const https = require('https');
const Mongo = require('../../system/mongo/init.js');


const options = {
    hostname: 'api.github.com',
    path: '/users/zmofei',
    headers: { 'User-Agent': 'zmofei' }
};

https.get(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', (d) => {
        const info = JSON.parse(data)
        if (info) {
            Mongo.open(function (db) {
                db.collection('system').updateOne({
                    key: 'github',
                }, {
                    $set: {
                        followers: info.followers,
                        following: info.following,
                        public_repos: info.public_repos,
                        uptime: new Date()
                    }
                }, { upsert: true }, function (err) {
                    console.log('**************** update github at ', new Date());
                    err && console.log(err);
                    db.close();
                })
            })
        }
    });
});