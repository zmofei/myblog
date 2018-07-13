fetch('/api/weixin/access_token').then(data => data.json()).then(data => {
    if (data && data.code == 200) {
        regWX(data.msg)
    }
});

function regWX(data) {
    wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxe9b3f8c2e2592748', // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [] // 必填，需要使用的JS接口列表
    });

    wx.ready(function() {
        //朋友圈
        wx.onMenuShareTimeline({
            title: document.title, // 分享标题
            link: location.href, // 分享链接
            imgUrl: '//static.zhuwenlong.com/image/logo.png',
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
        //朋友
        wx.onMenuShareAppMessage({
            title: document.title, // 分享标题
            // desc: '宝宝的睡眠很重要，你的睡眠也很重要', // 分享描述
            link: location.href, // 分享链接
            imgUrl: '//static.zhuwenlong.com/image/logo.png',
            // type: '', // 分享类型,music、video或link，不填默认为link
            // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            // success: function() {
            //     // 用户确认分享后执行的回调函数
            //     alert("分享");
            // },
            // cancel: function() {
            //     // 用户取消分享后执行的回调函数
            //     alert("取消分享");
            // }
        });
    })
}