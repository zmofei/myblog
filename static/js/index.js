// nav
var body = document.body;
var nav = document.getElementById('nav');
var navTar = document.getElementById('navTar');
var navLink = document.querySelector('.global-nav-text-link');

navTar.addEventListener('click', function(e) {
    if (navLink.style.display == 'block') {
        navLink.style.display = 'none';
    } else {
        navLink.style.display = 'block';
    }
});


on('#More', 'click', function(e, dom) {
    var toTop = document.body.clientHeight || document.documentElement.clientHeight;
    var fromTop = window.scrollY;
    var loop = setInterval(function() {
        if ((fromTop += 40) >= toTop) {
            clearInterval(loop)
        }
        window.scrollTo(0, fromTop);
    }, 16);
});
// more
// var more = document.getElementById('More');
// more.addEventListener('click', function() {
//     var toTop = document.body.clientHeight || document.documentElement.clientHeight;
//     var fromTop = window.scrollY;
//     var loop = setInterval(function() {
//         if ((fromTop += 40) >= toTop) {
//             clearInterval(loop)
//         }
//         window.scrollTo(0, fromTop);
//     }, 16);
//
// })

// message
var username = document.getElementById('username');
var email = document.getElementById('email');
var messgae = document.getElementById('message');
var sendBtn = document.getElementById('send');
var tips = document.getElementById('tips');
var inputs = [username, email, messgae];

// send message
var isSend = false;
sendBtn.addEventListener('click', function() {
    if (isSend) return;
    for (var i in inputs) {
        var val = inputs[i].value;
        if (!val) {
            inputs[i].focus();
            return false;
        }
        inputs[i].setAttribute('disabled', 'disabled');
    }

    isSend = true;
    sendBtn.innerText = "Sending ...";

    http({
        url: '/api/emailmessage',
        method: 'post',
        data: {
            username: username.value,
            email: email.value,
            message: messgae.value
        },
        success: function(data) {
            for (var i in inputs) {
                inputs[i].value = '';
                inputs[i].removeAttribute('disabled');
            }
            sendBtn.innerText = "Send";
            tips.innerText = 'Message sended';
            tips.style.color = '#A5A5A5';
            tips.style.opacity = 1;
            setTimeout(function() {
                tips.style.opacity = 0;
            }, 2000);
            isSend = false;
        },
        error: function(data) {
            for (var i in inputs) {
                inputs[i].removeAttribute('disabled');
            }
            sendBtn.innerText = "Try Again";
            tips.innerText = 'Message send failed, Please try again';
            tips.style.color = '#FF5F5F';
            tips.style.opacity = 1;
            setTimeout(function() {
                tips.style.opacity = 0;
            }, 4000);
            isSend = false;
        }
    })
});


// div.popbox
//         div.popbox-in
//             div.popbox-close

var qq = document.getElementById('qq');
var wechat = document.getElementById('wechat');

qq.addEventListener('click', function(e) {
    popup({
        img: '/image/index/qq.jpg',
        scale: 1 / 2
    })
    e.preventDefault()
    ''
});

wechat.addEventListener('click', function(e) {
    popup({
        img: '/image/index/wechat.jpg',
        scale: 1 / 2
    })
    e.preventDefault()
    ''
});


function popup(obj) {
    var box = document.createElement('div');
    box.className = 'popbox';
    box.style.background = 'rgba(0, 0, 0, 0)';

    var boxIn = document.createElement('div');
    boxIn.className = 'popbox-in';
    var boxHTML = document.createElement('div');
    var boxClose = document.createElement('div');
    boxClose.className = 'popbox-close';
    box.appendChild(boxIn);
    boxIn.appendChild(boxClose);
    boxIn.appendChild(boxHTML);

    if (obj.img) {
        var img = new Image();
        img.src = obj.img;
        img.addEventListener('load', function() {
            var width = this.width;
            var height = this.height;
            if (obj.scale) {
                width = width * obj.scale;
                height = height * obj.scale;
                img.width = width;
                img.height = height;
            }
            boxIn.style.height = height + 'px';
            boxIn.style.width = width + 'px';
            boxIn.style.margin = '-' + height / 2 + 'px 0 0 -' + width / 2 + 'px';
            boxHTML.appendChild(img);
        });
    }

    boxClose.addEventListener('click', function() {
        box.style.background = 'rgba(0, 0, 0, 0)';
        box.remove();
    });
    document.body.appendChild(box);
    window.getComputedStyle(box).opacity;
    box.style.background = 'rgba(0, 0, 0, 0.8)';
}

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


// just for fun
console.log(" _____ _             __  __        __     _ \n|_   _( )           |  \\/  |      / _|   (_)\n  | | |/ _ __ ___   | \\  / | ___ | |_ ___ _ \n  | |   | '_ ` _ \\  | |\\/| |/ _ \\|  _/ _ \\ |\n _| |_  | | | | | | | |  | | (_) | ||  __/ |\n|_____| |_| |_| |_| |_|  |_|\\___/|_| \\___|_|\n\n v-20161008")
