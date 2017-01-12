type=$1;
if [[ $type == 'online' ]]
then
    echo '**** online';
    echo "- var host = '//static.zhuwenlong.com';" > system/config/config.jade;
	echo '$host: "//static.zhuwenlong.com";' > system/config/config.scss;
    echo '**** clean';
    rm -rf ./build/
    echo '**** run config';
	gulp online;
    echo '**** pack';
    FileName=`date +%y_%m_%d_%H_%M_%S`;
    tar -cvzf build_$FileName.tar.gz ./build;
    scp -r ./build_$FileName.tar.gz root@zhuwenlong.com:/usr/local/zhuwenlong/www/zhuwenlong.com/receive/build_$FileName.tar.gz;
    CP="cd /usr/local/zhuwenlong/www/zhuwenlong.com/receive/; rm -rf build; tar -xvzf build_$FileName.tar.gz; cd ..; cp -r receive/build/root/* ./root/; cp -r receive/build/static/* ./static/;"
    ssh root@zhuwenlong.com "${CP}";
else
    echo '**** dev';
    echo '**** setting config';
    echo "- var host = '';" > ./system/config/config.jade;
    echo '$host: "";' > ./system/config/config.scss;
    echo '**** run gulp';
    gulp;
fi
