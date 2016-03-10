var commend = document.getElementById('commend');
var commendBox = document.getElementById('commendBox');
var commendTips = document.getElementById('commendTips');
var publish = document.getElementById('publish');


publish.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    http({
        url: '/api/blog/comment',
        method: 'post',
        data: {
            "name": "Mofei",
            "email": "13761509829@163.com",
            "blog": "http://www.zhuwenlong.com",
            "content": "@剧中人 晚些时候，我会发一篇文章说一下我是如何在实际项目中使用ES6的，以及ES6能否大规模应用于常规项目。答案是肯定的，晚点揭晓。",
            "blogid": "51d3de628ece70c43800000c",
            "replayid": "55d6af0f8cf91c7157121a0e",
            "time": new Date(),
        },
        success: function(data) {
            console.log(data)
        }
    });

    return false;


    var blog = 'http://www.zhuwenlong.com';
    var name = 'Mofei';
    var blockTemp = '<div class="commend-user"><div class="commend-avatar"> <img src="{{avatar}}"></div><div class="commend-info"><div class="commend-name">{{name}}<div class="commend-time">刚刚</div></div></div></div><div class="commend-text">{{message}}</div>';
    var data = {
        'avatar': 'http://www.gravatar.com/avatar/7cb29be8a5c16b6fbce6159bc94687a1',
        'message': commendBox.innerHTML,
        'name': blog ? '<a href="" target="_blank">' + name + '</a>' : '<span>' + name + '</span>'
    }
    var blockHTML = blockTemp.replace(/{{(.+?)}}/g, function(match, $1) {
        return data[$1];
    });
    var block = document.createElement('div');
    block.style.background = "#F4F4F4";
    block.className = 'commend-block';
    block.innerHTML = blockHTML;
    commend.nextSibling.parentElement.insertBefore(block, commend.nextSibling);
});

commend.addEventListener('click', function() {
    commendBox.focus();
});

commendBox.addEventListener('focus', function() {
    var newClass = commend.getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
    commend.setAttribute('class', newClass);
});



function http(obj) {
    var url = obj.url;
    var method = obj.method || 'get';
    var data = obj.data || {};
    var dataStr = '';
    var argcount = 0;
    var timeout = 5000;

    for (var key in data) {
        if (argcount++) {
            dataStr += '&';
        }
        dataStr += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }

    var client = new XMLHttpRequest();
    client.responseType = 'json';
    client.open(method, url);
    client.send(dataStr);
    client.onload = function() {
        clearTimeout(timeoutTest);
        if (this.status >= 200 && this.status < 300) {
            obj.success && obj.success(this.response);
        }
    }
    client.onerror = function() {
        clearTimeout(timeoutTest);
        obj.error && obj.error(this.statusText);
    }

    var timeoutTest = setTimeout(function() {
        obj.error && obj.error('timeout abort');
        client.abort();
    }, timeout)

}
