http({
    url: '/api/weixin/access_token',
    success: function(data) {

        wx.config({
            debug: false,
            appId: 'wx65d07a7fbed35d0d',
            timestamp: data.msg.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.msg.noncestr, // 必填，生成签名的随机串
            signature: data.msg.signature, // 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline'
            ]
        });

        wx.ready(function() {
            console.log('ready');
            //
            wx.onMenuShareTimeline({
                title: '互联网之子',
                link: 'http://movie.douban.com/subject/25785114/',
                imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                trigger: function(res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    alert('用户点击分享到朋友圈');
                },
                success: function(res) {
                    alert('已分享');
                },
                cancel: function(res) {
                    alert('已取消');
                },
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            });
        })

    }
});
