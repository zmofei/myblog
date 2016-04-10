http({
    url: '/api/weixin/access_token',
    success: function(data) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx65d07a7fbed35d0d', // 必填，公众号的唯一标识
            timestamp: data.msg.timestamp, // 必填，生成签名的时间戳
            nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
            signature: data.msg.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function() {
            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo'
                ],
                success: function(res) {
                    // alert(JSON.stringify(res));
                }
            });

            var shareObj = {
                title: '百度慧眼', // 分享标题
                desc: '位置智能，海量室内外位置数据，网民行为数据，洞悉真实世界', // 分享描述
                link: 'http://huiyan.baidu.com', // 分享链接
                imgUrl: 'http://huiyan.baidu.com/static/huiyan/newindex/img/shareicon.jpg', // 分享图标
                success: function() {
                    alert('感谢分享');
                },
                cancel: function() {
                    alert('感谢分享x');
                }
            };

            wx.onMenuShareTimeline(shareObj);
            wx.onMenuShareAppMessage(shareObj);
            wx.onMenuShareQQ(shareObj);
            wx.onMenuShareWeibo(shareObj);

        });
    }
});
