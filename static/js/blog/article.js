var commend = document.getElementById('commend');
var commendBox = document.getElementById('commendBox');
var commendTips = document.getElementById('commendTips');
var commendUsername = document.getElementById('commendUsername');
var publish = document.getElementById('publish');
var makegood = document.getElementById('makegood');
var goodCount = document.getElementById('goodCount');

var useravatar = document.getElementById('useravatar');

// comment
publish.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    sendComment({
        message: commendBox.innerHTML,
        success: insertMsg
    });
});

commend.addEventListener('click', function() {
    if (localStorage.getItem('username')) {
        commendBox.focus();
    } else {
        login();
    }
});

commendBox.addEventListener('focus', function() {
    var newClass = commend.getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
    commend.setAttribute('class', newClass);
});

commendUsername.addEventListener('click', function() {
    login();
});

// replay
on('.commend-replay-btn', 'click', function(e) {
    if (!localStorage.getItem('username')) {
        login(true);
        return false
    }
    var replay = e.target.parentElement.nextSibling;
    var allBox = document.querySelectorAll('.commend-replay-box');
    for (var i = 0, len = allBox.length; i < len; i++) {
        allBox[i].style.display = 'none';
    };
    replay.style.display = 'block';
    placeCursorAtEnd(replay.children[0]);
});

// replay submit
on('.commend-replay-box-btn', 'click', function(e) {
    var message = e.target.previousSibling.innerHTML;
    var id = e.target.getAttribute('id')
    sendComment({
        message: message,
        replayid: id,
        success: function(data) {
            e.target.parentElement.style.display = 'none'
            insertMsg(data)
        }
    });
});

// init userinfo
initUserinfo();

// high light
var co = document.querySelectorAll('pre code');
for (var i = 0; i < co.length; i++) {
    hljs.highlightBlock(co[i]);
}

// like blog
makegood.addEventListener('click', function() {
    var classes = makegood.getAttribute('class');
    if (classes.indexOf('active') != -1) {
        return false;
    }

    var blogid = location.href.match(/article\/(.{24})/)[1];

    var oldLike = localStorage.getItem('likeblog')
    if (oldLike) {
        oldLike = oldLike.split(',');
    } else {
        oldLike = [];
    }

    http({
        url: '/api/blog/like',
        method: 'post',
        data: {
            blogid: blogid
        },
        success: function(_data) {
            var count = goodCount.innerHTML;
            count = parseInt(count) + 1;
            goodCount.innerHTML = count;

            if (oldLike.indexOf(blogid) == -1) {
                oldLike.push(blogid);
            }

            localStorage.setItem('likeblog', oldLike.join(','));

            var newClass = classes.replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
            makegood.setAttribute('class', newClass);
        }
    });
});

//init likeblog
var blogid = location.href.match(/article\/(.{24})/)[1];
var likeblog = localStorage.getItem('likeblog') || '';
likeblog = likeblog.split(',');
if (likeblog.indexOf(blogid) != -1) {
    var newClass = makegood.getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
    makegood.setAttribute('class', newClass);
}



// like blog
on('.commend-like', 'click', function(e, dom) {
    var classes = dom.getAttribute('class');
    var id = dom.getAttribute('id');
    if (classes.indexOf('active') != -1) {
        return false;
    }

    var oldLike = localStorage.getItem('likecomment')
    if (oldLike) {
        oldLike = oldLike.split(',');
    } else {
        oldLike = [];
    }

    http({
        url: '/api/blog/like',
        method: 'post',
        data: {
            commentid: id
        },
        success: function(_data) {
            var countDom = dom.children[2];
            var count = countDom.innerHTML;
            count = parseInt(count) + 1;
            countDom.innerHTML = count;

            if (oldLike.indexOf(id) == -1) {
                oldLike.push(id);
            }

            localStorage.setItem('likecomment', oldLike.join(','));

            var newClass = classes.replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
            dom.setAttribute('class', newClass);
        }
    });
});

//init likeblog
var likecomment = localStorage.getItem('likecomment') || '';
likecomment = likecomment.split(',');
var commendLike = document.querySelectorAll('.commend-like');
for (var i in commendLike) {
    if (likecomment.indexOf(commendLike[i].id) != -1) {
        var newClass = commendLike[i].getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
        commendLike[i].setAttribute('class', newClass);
    }
}

function insertMsg(data) {
    var blockTemp = '<div class="commend-user"><div class="commend-avatar"> <img src="{{avatar}}" onerror="avatarError(this)"></div><div class="commend-info"><div class="commend-name">{{name}}<div class="commend-time">刚刚</div></div></div></div><div class="commend-text">{{content}}</div>';
    var blockHTML = blockTemp.replace(/{{(.+?)}}/g, function(match, $1) {
        return data[$1];
    });
    var block = document.createElement('div');
    block.style.background = "#F4F4F4";
    block.className = 'commend-block';
    block.innerHTML = blockHTML;
    insertAfter(block, commend);
    commend.scrollIntoView();
}

function sendComment(obj) {
    var message = obj.message;
    var replayid = obj.replayid || null;

    var blog = localStorage.getItem('website') || null;
    var email = localStorage.getItem('email') || null;
    var name = localStorage.getItem('username');
    var blogid = location.href.match(/article\/(.{24})/)[1];
    var avatar = getAvatar(localStorage.getItem('email'));

    var data = {
        "name": name,
        "content": message,
        "blogid": blogid,
        "avatar": avatar
    };

    if (replayid) {
        data.replayid = replayid
    }
    if (email) {
        data.email = email
    }
    if (blog) {
        data.blog = blog
    }

    http({
        url: '/api/blog/comment',
        method: 'post',
        data: data,
        success: function(_data) {
            obj.success && obj.success(data);
        }
    });
}

function placeCursorAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function initUserinfo() {
    if (localStorage.getItem('username')) {
        document.getElementById('commendUsername').innerHTML = localStorage.getItem('username');
        var avatar = '/image/nobody.jpg';
        if (localStorage.getItem('email')) {
            avatar = getAvatar(localStorage.getItem('email'))
        }
        useravatar.src = avatar;
    }
}

function getAvatar(email) {
    var avatarHash = md5(email);
    return 'http://www.gravatar.com/avatar/' + avatarHash;

}


function login(slient) {
    var loginTemplete = [
        '<div class="message-login">',
        '<div class="message-login-title">Hi，很高兴见到你：</div>',
        '<div>请问我该如何称呼您呢？</div>',
        '<div><input id="username" placeholder="name" ></div>',
        '<div>您的Email？（选填，用于展示头像，回复通知）</div>',
        '<div><input id="email"  placeholder="email"  ></div>',
        '<div>您的个人网站？（选填）</div>',
        '<div><input id="website"  placeholder="website" ></div>',
        '<div><button class="message-login-btn" id="login">很高兴见到你</button></div>',
        '</div>'
    ];

    var box = popup({
        html: loginTemplete.join(''),
        onopen: function() {
            var username = document.getElementById('username');
            var email = document.getElementById('email');
            var website = document.getElementById('website');
            username.value = localStorage.getItem('username');
            email.value = localStorage.getItem('email');
            website.value = localStorage.getItem('website');
        }
    });

    on('#login', 'click', function(e) {
        e.preventDefault();
        var username = document.getElementById('username');
        var email = document.getElementById('email');
        var website = document.getElementById('website');
        if (!username.value) {
            username.focus();
        } else {
            localStorage.setItem('username', username.value);
            localStorage.setItem('email', email.value);
            localStorage.setItem('website', website.value);
            box.remove();
            initUserinfo();
            if (!slient) {
                commendBox.focus();
            }
        }

    });
}
