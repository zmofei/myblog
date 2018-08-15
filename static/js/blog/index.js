var search = location.search.substr(1);

if (search) {
    search = search.split('&');
} else {
    search = [];
}

var query = {};
for (var i in search) {
    var _query = search[i].split('=');
    if (_query.length = 2) {
        var id = _query[0];
        var value = _query[1];
        query[id] = value;
    }
}
// console.log(query)
//
var tags = query.tags;
if (tags) {
    tags = tags.split(',');
} else {
    tags = [];
}

var searchDom = document.querySelector('.blog-search');
var toggle = document.querySelector('.blog-search-toggle');
var searchBtn = document.querySelector('.blog-search-btn');
var tagDoms = document.querySelectorAll('.blog-search-tag');
var openText = '&#xe5c5;';
var closeText = '&#xe5c7;';

// show the tags
if (tags.length >= 1) {
    searchDom.style.display = 'block';
    // toggle.innerHTML = closeText;
    for (var i = 0, len = tagDoms.length; i < len; i++) {
        var _tag = tagDoms[i].id.replace('tag_', '');
        if (tags.indexOf(_tag) != -1) {
            var newClass = tagDoms[i].getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ');
            tagDoms[i].setAttribute('class', newClass);
        }
    }
}