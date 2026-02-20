// Product View - handles product display
class ProductView {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
    }

    renderProducts(products, categoryNameFn) {
        this.productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${categoryNameFn(product.category)}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">KSh ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            this.productsGrid.appendChild(card);
        });
    }

    bindAddToCart(handler) {
        this.productsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                handler(productId);
            }
        });
    }
}
