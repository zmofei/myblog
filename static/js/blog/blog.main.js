class Nav {
    constructor() {
        var navTar = document.getElementById('navTar');
        var navLink = document.querySelector('.global-nav-text-link');
        navTar.addEventListener('click', function(e) {
            if (navLink.style.display == 'block') {
                navLink.style.display = 'none';
            } else {
                navLink.style.display = 'block';
            }
        });

    }
}

new Nav();

window.onload = function() {
    var searchBtn = document.getElementById('blog-search-tar');
    var searchBox = document.getElementById('blog-search-box');
    var searchCls = document.getElementById('blog-search-cls');
    searchBtn.addEventListener('click', function() {
        searchBox.className = 'blog-search blog-search-active';
    });
    searchCls.addEventListener('click', function() {
        searchBox.className = 'blog-search';
    });
}