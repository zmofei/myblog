develop:
	echo "- var host = '';" > system/config/config.jade;
	echo '$$host: "";' > system/config/config.scss;
	gulp;
online:
	echo "- var host = '//o4qdeqynn.qnssl.com';" > system/config/config.jade;
	echo '$$host: "//o4qdeqynn.qnssl.com";' > system/config/config.scss;
	gulp online;
	cp -r build/root/ root/
	cp -r build/static/ static/
