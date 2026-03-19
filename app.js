// Main Application - initializes MVC architecture
class App {
    constructor() {
        this.init();
    }

    init() {
        // Initialize Models
        const productModel = new ProductModel();
        const cartModel = new CartModel();
        const eventModel = new EventModel();
        const userModel = new UserModel();

        // Initialize Views
        const productView = new ProductView();
        const cartView = new CartView();
        const eventView = new EventView();
        const userView = new UserView();

        // Initialize Controllers
        const cartController = new CartController(cartModel, cartView);
        const productController = new ProductController(productModel, productView, cartController);
        const eventController = new EventController(eventModel, eventView);
        const userController = new UserController(userModel, userView);

        // Initialize Router
        const router = new Router(productController);

        // Initialize products display
        productController.init();

        // Bind global event handlers
        this.bindGlobalEvents(productController, cartController, eventController, userController, router);
    }

    bindGlobalEvents(productController, cartController, eventController, userController, router) {
        // Search functionality - hero section
        const heroSearchBtn = document.getElementById('heroSearchBtn');
        const heroSearchInput = document.getElementById('heroSearchInput');
        
        heroSearchBtn?.addEventListener('click', () => {
            const searchTerm = heroSearchInput.value;
            productController.searchProducts(searchTerm);
            router.navigate('shop');
        });

        heroSearchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = heroSearchInput.value;
                productController.searchProducts(searchTerm);
                router.navigate('shop');
            }
        });

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');

        categoryFilter?.addEventListener('change', () => {
            const category = categoryFilter.value;
            const price = priceFilter.value;
            productController.applyFilters(category, price);
        });

        priceFilter?.addEventListener('change', () => {
            const category = categoryFilter.value;
            const price = priceFilter.value;
            productController.applyFilters(category, price);
        });

        // Cart toggle
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn?.addEventListener('click', () => {
            cartController.toggleCart();
        });

        // Close cart modal on outside click
        const cartModal = document.getElementById('cartModal');
        cartModal?.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartController.toggleCart();
            }
        });

        // Close button for cart
        const cartCloseBtn = document.getElementById('closeCart');
        cartCloseBtn?.addEventListener('click', () => {
            cartController.toggleCart();
        });

        // About modal
        const aboutLink = document.querySelector('a[href="#ABOUT"]');
        const aboutModal = document.getElementById('aboutModal');
        const closeAbout = document.getElementById('closeAbout');
        
        aboutLink?.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.style.display = 'block';
        });
        
        closeAbout?.addEventListener('click', () => {
            aboutModal.style.display = 'none';
        });
        
        aboutModal?.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.style.display = 'none';
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn?.addEventListener('click', () => {
            cartController.checkout();
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (category) {
                    categoryFilter.value = category;
                    productController.filterByCategory(category);
                    router.navigate('shop');
                }
            });
        });

        // Account button
        const accountBtn = document.querySelector('.header-actions button:first-child');
        accountBtn?.addEventListener('click', () => {
            userController.openAccountModal();
        });

        // Event booking
        const eventSelect = document.getElementById('eventSelect');
        eventSelect?.addEventListener('change', () => {
            const value = eventSelect.value;
            if (value) {
                const eventName = eventSelect.options[eventSelect.selectedIndex].text;
                eventController.openEventBooking(eventName);
                eventSelect.value = '';
            }
        });

        // Wine Club
        const wineClubLink = document.getElementById('wineClubLink');
        const wineClubModal = document.getElementById('wineClubModal');
        const closeWineClub = document.getElementById('closeWineClub');
        
        wineClubLink?.addEventListener('click', () => {
            wineClubModal.style.display = 'block';
        });
        
        closeWineClub?.addEventListener('click', () => {
            wineClubModal.style.display = 'none';
        });
        
        wineClubModal?.addEventListener('click', (e) => {
            if (e.target === wineClubModal) {
                wineClubModal.style.display = 'none';
            }
        });

        // Gift - redirect to gift page
        const giftCardsLink = document.getElementById('giftCardsLink');
        giftCardsLink?.addEventListener('click', () => {
            window.location.href = 'gift-cards.html';
        });
        
        // Gift navbar link
        const giftNavLink = document.querySelector('a[href="gift-cards.html"]');
        giftNavLink?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'gift-cards.html';
        });
    }
}

// Global function for Wine Club
function joinWineClub(plan) {
    const plans = {
        'silver': { name: 'Silver', price: 5000 },
        'gold': { name: 'Gold', price: 10000 },
        'platinum': { name: 'Platinum', price: 20000 }
    };
    
    const selectedPlan = plans[plan];
    alert(`Welcome to Wine Club! 🍷\n\nYou've selected: ${selectedPlan.name} Membership\nMonthly Fee: KSh ${selectedPlan.price.toLocaleString()}\n\nYour membership will be activated upon payment confirmation.\n\nThank you for joining Wine World Club!`);
    
    document.getElementById('wineClubModal').style.display = 'none';
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
