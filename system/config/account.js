exports.email = {
  user: process.env.EMAIL || '',
  pass: process.env.EMAILPWD || ''
};

exports.db = {
  user: process.env.DB || '',
  pwd: process.env.DBPWD || '',
  dbName: process.env.DBNAME || ''
}

exports.weixin = {
  appid: process.env.WXID || '',
  appsecret: process.env.WXSECRET || ''
}