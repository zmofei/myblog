!! This repo archive is move to https://github.com/zmofei/zhuwenlong.com-frontend and https://github.com/zmofei/zhuwenlong.com-server !!

# myblog

This is the source code of my blog https://zhuwenlong.com aka https://himofei.com

After 5 years I moved from `Dufing` https://github.com/zmofei/dufing into Express for quick develope.

# Develop

This repo is divide into 2 parts, static and server.

The static is using React + React router + Webpack + Sass + etc. and located in the `/client` folder.

To start dev of the static, you need to `cd client` and run `npm start`

The server is using Express located in the `/server` folder.

To start server, you need to `cd server` and run `npm start`, before you run the sever you may need to set the ENV for the server, here is a example:

```
DBURL='***' DBUser='***' DBPwd='***' DBUser='***' DBName='***' EmailUser='***' EmailPwd='***' npm start
```
