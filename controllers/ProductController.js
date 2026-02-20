// Product Controller - coordinates between model and view
class ProductController {
    constructor(model, view, cartController) {
        this.model = model;
        this.view = view;
        this.cartController = cartController;
        
        this.view.bindAddToCart(this.handleAddToCart.bind(this));
    }

    init() {
        this.showAllProducts();
    }

    showAllProducts() {
        const products = this.model.getAllProducts();
        this.view.renderProducts(products, this.model.getCategoryName.bind(this.model));
    }

    filterByCategory(category) {
        const products = this.model.filterByCategory(category);
        this.view.renderProducts(products, this.model.getCategoryName.bind(this.model));
    }

    filterByPrice(priceRange) {
        const products = this.model.filterByPrice(priceRange);
        this.view.renderProducts(products, this.model.getCategoryName.bind(this.model));
    }

    applyFilters(category, priceRange) {
        let products = this.model.getAllProducts();
        
        if (category !== 'all') {
            products = products.filter(p => p.category === category);
        }
        
        if (priceRange !== 'all') {
            if (priceRange === '0-50') {
                products = products.filter(p => p.price <= 50);
            } else if (priceRange === '50-100') {
                products = products.filter(p => p.price > 50 && p.price <= 100);
            } else if (priceRange === '100+') {
                products = products.filter(p => p.price > 100);
            }
        }
        
        this.view.renderProducts(products, this.model.getCategoryName.bind(this.model));
    }

    searchProducts(searchTerm) {
        const products = this.model.searchProducts(searchTerm);
        this.view.renderProducts(products, this.model.getCategoryName.bind(this.model));
    }

    handleAddToCart(productId) {
        const product = this.model.getProductById(productId);
        if (product) {
            this.cartController.addToCart(product);
        }
    }
}
