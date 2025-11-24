    document.addEventListener('DOMContentLoaded', function() {
        const scrollContainer = document.getElementById('review-scroll-container');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        // Amount to scroll on each click.
        // We use the width of one card (approx 18rem = 288px) plus the gap (1rem = 16px).
        // You can adjust this value to scroll more or less.
        const scrollAmount = 300; 

        prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: -scrollAmount, // Negative value to scroll left
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: scrollAmount, // Positive value to scroll right
                behavior: 'smooth'
            });
        });
    });
