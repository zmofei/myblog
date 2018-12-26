npm install
rm -rf ./build/
npm run deploy
FileName=`date +%y_%m_%d_%H_%M_%S`;
tar -cvzf build_$FileName.tar.gz ./build;
scp -r ./build_$FileName.tar.gz root@zhuwenlong.com:/usr/local/zhuwenlong/www/zhuwenlong.com/receive/build_$FileName.tar.gz;
CP="cd /usr/local/zhuwenlong/www/zhuwenlong.com/receive/; rm -rf build; tar -xvzf build_$FileName.tar.gz; cd ..; cp -r receive/build/root/* ./root/; cp -r receive/build/static/* ./static/;"
ssh root@zhuwenlong.com "${CP}";
ssh root@zhuwenlong.com "pm2 restart zhuwenlong_com"