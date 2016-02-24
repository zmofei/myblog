// nav
var body = document.body;
var nav = document.getElementById('nav');
var navTar = document.getElementById('navTar');
var navBg = document.getElementById('navBg');
var navClose = document.getElementById('navClose');

navTar.addEventListener('click', function(e) {
    navBg.style.display = 'block';
    setTimeout(function() {
        var newClass = nav.getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)|$/, ' active ')
        nav.setAttribute('class', newClass);
    });
    e.preventDefault();
    return false;
})

navClose.addEventListener('click', function(e) {
    var newClass = nav.getAttribute('class').replace(/(^active\s)|(\sactive\s)|(\sactive$)/, ' ')
    nav.setAttribute('class', newClass);
    setTimeout(function() {
        navBg.style.display = 'none';
    }, 300);
    e.preventDefault();
    return false;
});

// more 
var more = document.getElementById('More');
more.addEventListener('click', function() {
    var toTop = document.body.clientHeight || document.documentElement.clientHeight;
    var fromTop = window.scrollY;
    var loop = setInterval(function() {
        if ((fromTop += 40) >= toTop) {
            clearInterval(loop)
        }
        window.scrollTo(0, fromTop);
    }, 16);

})
