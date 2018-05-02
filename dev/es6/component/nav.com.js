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

export default Nav;
