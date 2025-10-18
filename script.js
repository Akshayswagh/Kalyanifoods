// ==================== Navbar Responsiveness ====================
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');
    let mainNavOverlay = document.querySelector('.main-nav-overlay'); // Try to find existing overlay

    // Create overlay if it doesn't exist
    if (!mainNavOverlay) {
        mainNavOverlay = document.createElement('div');
        mainNavOverlay.classList.add('main-nav-overlay');
        document.body.appendChild(mainNavOverlay);
    }

    if (hamburgerMenu && mainNav && mainNavOverlay) {
        // Function to open the mobile navigation
        const openNav = () => {
            mainNav.classList.add('active');
            mainNavOverlay.classList.add('active');
            document.body.classList.add('no-scroll'); // Prevent body scroll
        };

        // Function to close the mobile navigation
        const closeNav = () => {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Re-enable body scroll
        };

        hamburgerMenu.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                closeNav(); // Close if already open
            } else {
                openNav(); // Open if closed
            }
        });

        // Close nav when overlay is clicked
        mainNavOverlay.addEventListener('click', closeNav);

        // Close nav when a link inside it is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Optional: Close nav if window is resized past mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // ==================== Hero Carousel Functionality ====================
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateCarousel() {
        // Calculate the translation needed to show the current item
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active class for accessibility or future indicators
        carouselItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    if (prevBtn && nextBtn && carouselInner && carouselItems.length > 0) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalItems - 1 : currentIndex - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        // Auto-advance carousel
        let autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000); // Change slide every 5 seconds

        // Optional: Pause auto-slide on hover
        carouselInner.parentNode.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        carouselInner.parentNode.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            }, 5000);
        });

        updateCarousel(); // Initialize carousel position
    }

    // ==================== Cart Functionality (Basic Example) ====================
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartCountSpan = document.querySelector('.cart-count');
    let cartItemCount = 0;

    if (addToCartButtons.length > 0 && cartCountSpan) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                cartItemCount++;
                cartCountSpan.textContent = cartItemCount;
                alert('Item added to cart!'); // Simple feedback
                // In a real app, you'd add the item data to a cart array/object
            });
        });
    }

    // ==================== Search Bar (Placeholder for functionality) ====================
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            alert('Search functionality coming soon!'); // Or toggle a search input field
        });
    }
});