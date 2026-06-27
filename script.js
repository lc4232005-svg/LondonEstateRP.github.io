// Falling Stars Animation
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 100;

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random animation duration
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = duration + 's';
        
        // Random animation delay
        const delay = Math.random() * 5;
        star.style.animationDelay = delay + 's';
        
        // Random opacity
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        starsContainer.appendChild(star);
    }

    // Create initial stars
    for (let i = 0; i < numberOfStars; i++) {
        createStar();
    }

    // Continuously add new stars
    setInterval(() => {
        if (starsContainer.children.length < numberOfStars) {
            createStar();
        }
    }, 200);

    // Remove stars that have finished animation
    setInterval(() => {
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                star.remove();
            }
        });
    }, 100);
});
