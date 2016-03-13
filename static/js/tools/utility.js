var on = (function() {
    var eventStack = {};

    document.body.addEventListener('click', function(e) {
        eventStack.click = eventStack.click || {}
        var target = e.target;
        while (target) {

            var id = target.id;
            var _class = target.className;
            _class = _class ? _class.split(' ') : '';

            // do event
            var idEvent = eventStack.click['#' + id];
            if (idEvent) {
                for (var i in idEvent) {
                    idEvent[i](e, target);
                }
            }

            for (var i in _class) {
                var theClass = '.' + _class[i];
                var classEvent = eventStack.click[theClass];
                if (classEvent) {
                    for (var i in classEvent) {
                        classEvent[i](e, target);
                    }
                }
            }

            target = target.parentNode;
        }
    });

    return function(dom, event, callback) {
        eventStack[event] = eventStack[event] || {};
        eventStack[event][dom] = eventStack[event][dom] || [];
        eventStack[event][dom].push(callback);
    };

})();


// local storage
if (!window.localStorage) {
    window.localStorage = {
        getItem: function(sKey) {
            if (!sKey || !this.hasOwnProperty(sKey)) {
                return null;
            }
            return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        key: function(nKeyId) {
            return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },
        setItem: function(sKey, sValue) {
            if (!sKey) {
                return;
            }
            document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
            this.length = document.cookie.match(/\=/g).length;
        },
        length: 0,
        removeItem: function(sKey) {
            if (!sKey || !this.hasOwnProperty(sKey)) {
                return;
            }
            var sExpDate = new Date();
            sExpDate.setDate(sExpDate.getDate() - 1);
            document.cookie = escape(sKey) + "=; expires=" + sExpDate.toGMTString() + "; path=/";
            this.length--;
        },
        hasOwnProperty: function(sKey) {
            return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
    };
    window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}
//

function insertAfter(newEl, targetEl) {
    var parentEl = targetEl.parentNode;

    if (parentEl.lastChild == targetEl) {
        parentEl.appendChild(newEl);
    } else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
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
    } else if (obj.html) {
        var html = document.createElement('div');
        html.innerHTML = obj.html;
        boxHTML.appendChild(html);
    }

    boxClose.addEventListener('click', function() {
        box.style.background = 'rgba(0, 0, 0, 0)';
        box.remove();
    });
    document.body.appendChild(box);
    window.getComputedStyle(box).opacity;
    box.style.background = 'rgba(0, 0, 0, 0.8)';

    obj.onopen && obj.onopen();

    return box;
}
