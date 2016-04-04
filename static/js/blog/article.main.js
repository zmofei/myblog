class Nav {
    constructor() {
        var navTar = document.getElementById('navTar');
        var navLink = document.querySelector('.global-nav-text-link');
        console.log('??223?');
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