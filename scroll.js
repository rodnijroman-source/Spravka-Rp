const smoothElements = document.querySelectorAll('.smooth');

let scrollingY = window.scrollY;

const hotBar = document.querySelector('.hot-bar-container');

window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    smoothElements.forEach(element => {
        if (currentScrollY + window.innerHeight > element.offsetTop) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    if (currentScrollY > scrollingY) {
        hotBar.classList.add('hidden');
    }
    else if (currentScrollY < scrollingY) {
        hotBar.classList.remove('hidden');
    }

    scrollingY = currentScrollY;
});