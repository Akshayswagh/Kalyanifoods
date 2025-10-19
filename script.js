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


    
   


    // ==================== Search Bar (Placeholder for functionality) ====================
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            alert('Search functionality coming soon!'); // Or toggle a search input field
        });
    }



// ==================== Cart Functionality with Local Storage (Common) ====================
    const cartCountSpan = document.querySelector('.cart-count');
    let cart = []; // Array to hold cart items

    const saveCart = () => {
        localStorage.setItem('kalyaniFoodsCart', JSON.stringify(cart));
        updateCartDisplay(); // Ensure header cart count is always updated
    };

    const loadCart = () => {
        const storedCart = localStorage.getItem('kalyaniFoodsCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        updateCartDisplay();
    };

   const updateCartDisplay = () => {
    if (cartCountSpan) {
        // Change: Use cart.length to count unique items, not sum quantities
        cartCountSpan.textContent = cart.length;
    }
};
    

    const addItemToCart = (product) => {
        const existingItemIndex = cart.findIndex(item => item.name === product.name);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} added to cart!`);
    };

    // Event listeners for "Add to Cart" buttons on index.html
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('h3').textContent.trim();
                    const productDescription = productCard.querySelector('.product-description') ? productCard.querySelector('.product-description').textContent.trim() : 'No description';
                    const productPriceText = productCard.querySelector('.price').textContent.trim();
                    const productPrice = parseFloat(productPriceText.replace('₹', '').replace('/ piece', '').trim());
                    const productImage = productCard.querySelector('img').src;

                    const product = {
                        name: productName,
                        description: productDescription,
                        price: productPrice,
                        image: productImage
                    };
                    addItemToCart(product);
                }
            });
        });
    }

    // ==================== Cart Page Specific Functionality ====================
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPriceSpan = document.getElementById('cartTotalPrice');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const customerDetailsModal = document.getElementById('customerDetailsModal');
    const closeModalBtn = document.querySelector('.close-button');
    const customerDetailsForm = document.getElementById('customerDetailsForm');
    const orderMessageDiv = document.getElementById('orderMessage');
    const orderPhoneNumber = "+919423460955"; // Number for call now button

    const renderCartItems = () => {
        if (!cartItemsContainer) return; // Only run if on cart.html

        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Go add some delicious treats!</p>';
            cartTotalPriceSpan.textContent = '₹ 0';
            return;
        }

        let overallTotalPrice = 0;

        cart.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
            overallTotalPrice += itemTotalPrice;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.index = index; // Use data-index for easy reference

            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                </div>
                <div class="cart-item-quantity-controls">
                    <button class="quantity-minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-plus" data-index="${index}">+</button>
                </div>
                <div class="cart-item-price">₹ ${(item.price * item.quantity).toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        cartTotalPriceSpan.textContent = `₹ ${overallTotalPrice.toFixed(2)}`;

        // Attach event listeners for quantity buttons
        cartItemsContainer.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });
        cartItemsContainer.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });
    };

    const updateQuantity = (event) => {
        const index = parseInt(event.target.dataset.index);
        const action = event.target.classList.contains('quantity-plus') ? 'plus' : 'minus';

        if (action === 'plus') {
            cart[index].quantity++;
        } else if (action === 'minus') {
            cart[index].quantity--;
            if (cart[index].quantity < 1) {
                // Remove item if quantity drops to 0
                cart.splice(index, 1);
            }
        }
        saveCart();
        renderCartItems(); // Re-render the cart to reflect changes
    };

    // Modal logic
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty. Please add items before placing an order.");
                return;
            }
            customerDetailsModal.style.display = 'flex'; // Show modal
            orderMessageDiv.style.display = 'none'; // Hide previous messages
            customerDetailsForm.reset(); // Clear form fields
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            customerDetailsModal.style.display = 'none'; // Hide modal
        });
    }

    // Close modal if clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target == customerDetailsModal) {
            customerDetailsModal.style.display = 'none';
        }
    });

   // Form submission for placing order
if (customerDetailsForm) {
    customerDetailsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Prepare order data (customer details are gathered from form inputs)
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerContact = document.getElementById('customerContact').value;
        const customerAltContact = document.getElementById('customerAltContact').value;
        const orderDate = new Date().toLocaleString();
        const orderItems = cart.map(item => `${item.name} (Qty: ${item.quantity}, Price: ₹${item.price.toFixed(2)} each)`).join('; ');
        const totalOrderAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

        // This is the correct FormData object to use
        const formDataToSend = new FormData();
        formDataToSend.append('Name', customerName);
        formDataToSend.append('Address', customerAddress);
        formDataToSend.append('Contact Number', customerContact);
        formDataToSend.append('Alternate Contact', customerAltContact || 'N/A');
        formDataToSend.append('Order Date', orderDate); // Ensure order date is appended
        formDataToSend.append('Order Items', orderItems);
        formDataToSend.append('Total Amount', `₹${totalOrderAmount}`); // Ensure '₹' prefix is there

        // Replace with YOUR DEPLOYED Google Apps Script Web App URL
        // Make sure this URL is correct and points to your /exec endpoint
        const googleSheetWebAppURL = 'https://script.google.com/macros/s/AKfycbyd3ex8QH8xvDWblzuqfNoOkyo4tqVQgIJ2lUUoD64AT1-bc6RX1GnO-RdGM_ReuhaL/exec'; // Your URL, from the initial deployment
        // (You used AKfycbz_RIhaz_T_53ywQOz02duJ9qLpMlxucMAwAQzZkqGk4TDekqChusk68IDFPZieeTiW/exec in your last paste, confirm which is the latest deployed one)


        orderMessageDiv.style.display = 'block';
        orderMessageDiv.className = 'order-message'; // Reset class
        orderMessageDiv.innerHTML = 'Placing your order...';

        try {
            // *** CRITICAL CHANGE: Use mode: 'no-cors' ***
            // This tells the browser *not* to enforce CORS policy.
            // The downside is that response.ok will always be true,
            // and you can't read the actual response body from Apps Script (it becomes "opaque").
            // However, the request *will* go through, and the data *will* hit your sheet.
            // We'll then assume success if the fetch doesn't throw a network error.
            const response = await fetch(googleSheetWebAppURL, {
                method: 'POST',
                body: formDataToSend, // Use the correctly prepared FormData object
                mode: 'no-cors' // <<< Added mode: 'no-cors'
            });

            // With mode: 'no-cors', response.ok will always be true and response.status will be 0.
            // So we can't check `response.ok`. We assume success if there's no network error.
            // This means the Apps Script's success/error message won't be readable by the client-side.
            // But the data will be sent.

            // Since we can't read the response in no-cors mode, we have to assume it worked
            // if the fetch operation itself didn't throw a network error.
            // This is a trade-off for getting around stubborn CORS issues with Apps Script.
            orderMessageDiv.classList.add('success');
            orderMessageDiv.innerHTML = 'Order placed successfully! Thank you for your purchase.';
            cart = []; // Clear cart after assumed successful order
            saveCart();
            renderCartItems(); // Update cart display on cart page
            setTimeout(() => {
                customerDetailsModal.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('Error during fetch:', error);
            orderMessageDiv.classList.add('error');
            orderMessageDiv.innerHTML = `
                Technical issue. Please call us to place your order.
                <a href="tel:${orderPhoneNumber}" class="call-now-btn">Call Now</a>
            `;
        }
    });
}
    // Initialize cart on page load for both index.html and cart.html
    loadCart();

    // If on the cart page, render the items
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
});