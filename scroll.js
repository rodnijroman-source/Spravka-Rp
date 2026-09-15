const smoothElements = document.querySelectorAll('.smooth');
const hotBar = document.querySelector('.hot-bar-container');

let lastScrollY = window.scrollY;
let lastDirectionY = window.scrollY;

window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    smoothElements.forEach(element => {
        if (currentScrollY + window.innerHeight > element.offsetTop) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    if (currentScrollY > lastScrollY) {
        lastDirectionY = currentScrollY; 
        
        if (currentScrollY > 100) {
            hotBar.classList.add('hidden');
        }
    } else if (currentScrollY < lastScrollY) {
        if (lastDirectionY - currentScrollY > 100) {
            hotBar.classList.remove('hidden');
        }
    }

    // return if scroll on the top
    if (currentScrollY < 100) {
        hotBar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
});
