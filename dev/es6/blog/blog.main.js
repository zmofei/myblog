import Nav from '../component/nav.com.js';

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