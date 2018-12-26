type=$1;
if [[ $type == 'online' ]]
then
    echo '**** online';
	echo '$host: "//static.zhuwenlong.com";' > system/config/config.scss;
    echo '**** clean';
    rm -rf ./build/
    echo '**** run config';
	./node_modules/.bin/gulp online;
    echo '**** pack';
    FileName=`date +%y_%m_%d_%H_%M_%S`;
    tar -cvzf build_$FileName.tar.gz ./build;
    scp -r ./build_$FileName.tar.gz root@zhuwenlong.com:/usr/local/zhuwenlong/www/myblog/receive/build_$FileName.tar.gz;
    CP="cd /usr/local/zhuwenlong/www/myblog/receive/; rm -rf build; tar -xvzf build_$FileName.tar.gz; cd ..; cp -r receive/build/root/* ./root/; cp -r receive/build/static/* ./static/;"
    ssh root@zhuwenlong.com "${CP}";
    rm ./build_$FileName.tar.gz;
else
    echo '**** dev';
    echo '**** setting config';
    echo '$host: "";' > ./system/config/config.scss;
    echo '**** run gulp';
    ./node_modules/.bin/gulp;
fi
