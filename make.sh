type=$1;
if [[ $type == 'online' ]]
then
    echo '**** online';
    echo "- var host = '//dn-mofei.qbox.me';" > system/config/config.jade;
	echo '$host: "//dn-mofei.qbox.me";' > system/config/config.scss;
    echo '**** clean';
    rm -rf ./build/
    echo '**** run config';
	gulp online;
    echo '**** pack';
    FileName=`date +%y_%m_%d_%H_%M_%S`;
    tar -cvzf build_$FileName.tar.gz ./build;
    scp -r ./build_$FileName.tar.gz root@zhuwenlong.com:/usr/local/www/zhuwenlong.com/myblog/receive/build_$FileName.tar.gz;
else
    echo '**** dev';
    echo '**** setting config';
    echo "- var host = '';" > ./system/config/config.jade;
    echo '$host: "";' > ./system/config/config.scss;
    echo '**** run gulp';
    gulp;
fi
