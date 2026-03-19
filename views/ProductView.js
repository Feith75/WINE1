// Product View - handles product display
class ProductView {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
    }

    renderProducts(products) {
        if (!this.productsGrid) return;

        this.productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${this.formatCategory(product.category)}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">KSh ${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    <button class="buy-now-btn" data-id="${product.id}">Buy Now</button>
                </div>
            </div>
        `).join('');
    }

    formatCategory(category) {
        const categories = {
            'red': 'Red Wine',
            'white': 'White Wine',
            'rose': 'Rosé Wine',
            'sparkling': 'Sparkling Wine'
        };
        return categories[category] || category;
    }

    showNoResults() {
        if (!this.productsGrid) return;
        this.productsGrid.innerHTML = '<p class="no-results">No products found</p>';
    }
}
