// Product Controller - handles product logic
class ProductController {
    constructor(model, view, cartController) {
        this.model = model;
        this.view = view;
        this.cartController = cartController;
        this.currentProducts = [];
    }

    init() {
        this.currentProducts = this.model.getAllProducts();
        this.view.renderProducts(this.currentProducts);
        this.bindEvents();
    }

    bindEvents() {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    const productId = parseInt(e.target.dataset.id);
                    this.addToCart(productId, e.target);
                } else if (e.target.classList.contains('buy-now-btn')) {
                    const productId = parseInt(e.target.dataset.id);
                    this.buyNow(productId);
                }
            });
        }
    }

    addToCart(productId, button) {
        const product = this.model.getProductById(productId);
        if (product) {
            this.cartController.addItem(product);
            
            // Visual feedback - change button color
            const originalText = button.textContent;
            button.textContent = '✓ Added!';
            button.classList.add('added');
            
            // Reset after 1.5 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('added');
            }, 1500);
        }
    }

    buyNow(productId) {
        const product = this.model.getProductById(productId);
        if (product) {
            // Add to cart
            this.cartController.addItem(product);
            
            // Get cart items and total
            const items = this.cartController.model.getItems();
            const total = this.cartController.model.getTotal();
            
            // Open payment modal directly
            this.cartController.openPaymentModal(items, total);
        }
    }

    filterByCategory(category) {
        this.currentProducts = this.model.filterByCategory(category);
        this.view.renderProducts(this.currentProducts);
    }

    filterByPrice(priceRange) {
        this.currentProducts = this.model.filterByPrice(priceRange);
        this.view.renderProducts(this.currentProducts);
    }

    applyFilters(category, priceRange) {
        let products = this.model.getAllProducts();

        if (category !== 'all') {
            products = products.filter(p => p.category === category);
        }

        if (priceRange !== 'all') {
            const ranges = {
                '0-50': [0, 5000],
                '50-100': [5000, 10000],
                '100+': [10000, Infinity]
            };
            const [min, max] = ranges[priceRange] || [0, Infinity];
            products = products.filter(p => p.price >= min && p.price < max);
        }

        this.currentProducts = products;
        this.view.renderProducts(this.currentProducts);
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.currentProducts = this.model.getAllProducts();
        } else {
            this.currentProducts = this.model.searchProducts(query);
        }
        
        if (this.currentProducts.length === 0) {
            this.view.showNoResults();
        } else {
            this.view.renderProducts(this.currentProducts);
        }
    }
}
