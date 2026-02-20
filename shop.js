// Wine products database
const products = [
    { id: 1, name: "Château Margaux 2015", category: "red", price: 299.99, description: "Full-bodied Bordeaux with notes of blackcurrant and oak", image: "jacob-le-1BuJoMJ6ZBk-unsplash.jpg" },
    { id: 2, name: "Domaine de la Romanée-Conti", category: "red", price: 450.00, description: "Legendary Burgundy Pinot Noir, elegant and complex", image: "ankita-gupta-vk-KlS1wYMY-unsplash.jpg" },
    { id: 3, name: "Cloudy Bay Sauvignon Blanc", category: "white", price: 45.99, description: "Crisp New Zealand white with tropical fruit flavors", image: "melanie-lim-0oPK0sG3CQU-unsplash.jpg" },
    { id: 4, name: "Chablis Grand Cru", category: "white", price: 89.99, description: "Mineral-driven Chardonnay from France's finest terroir", image: "nathan-andress-XCdC4ph1P9g-unsplash.jpg" },
    { id: 5, name: "Whispering Angel Rosé", category: "rose", price: 32.99, description: "Provence rosé with delicate strawberry and citrus notes", image: "stefan-johnson-xIFbDeGcy44-unsplash.jpg" },
    { id: 6, name: "Miraval Rosé", category: "rose", price: 28.99, description: "Elegant rosé from the heart of Provence", image: "t-ed-hOgog7l-iuY-unsplash.jpg" },
    { id: 7, name: "Dom Pérignon Vintage", category: "sparkling", price: 199.99, description: "Iconic champagne with refined bubbles and complexity", image: "valentin-lacoste-4eyAy57ObtQ-unsplash.jpg" },
    { id: 8, name: "Veuve Clicquot Brut", category: "sparkling", price: 65.99, description: "Classic champagne perfect for celebrations", image: "vlad-zaytsev-sO26ESssFdE-unsplash.jpg" },
    { id: 9, name: "Barolo Riserva DOCG", category: "red", price: 125.00, description: "Powerful Italian red with truffle and rose petal aromas", image: "jacob-le-1BuJoMJ6ZBk-unsplash.jpg" },
    { id: 10, name: "Riesling Spätlese", category: "white", price: 38.99, description: "German sweet wine with perfect acidity balance", image: "melanie-lim-0oPK0sG3CQU-unsplash.jpg" },
    { id: 11, name: "Prosecco Superiore", category: "sparkling", price: 24.99, description: "Italian sparkling wine, light and refreshing", image: "valentin-lacoste-4eyAy57ObtQ-unsplash.jpg" },
    { id: 12, name: "Côtes de Provence Rosé", category: "rose", price: 22.99, description: "Fresh and fruity rosé perfect for summer", image: "stefan-johnson-xIFbDeGcy44-unsplash.jpg" }
];

let cart = JSON.parse(localStorage.getItem('wineCart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartCount();
});

function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getCategoryName(category) {
    const names = { 'red': '🍷 Red Wine', 'white': '🥂 White Wine', 'rose': '🌸 Rosé Wine', 'sparkling': '🍾 Sparkling Wine' };
    return names[category] || category;
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    let filtered = products;
    
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (priceFilter !== 'all') {
        if (priceFilter === '0-50') {
            filtered = filtered.filter(p => p.price <= 50);
        } else if (priceFilter === '50-100') {
            filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
        } else if (priceFilter === '100+') {
            filtered = filtered.filter(p => p.price > 100);
        }
    }
    
    displayProducts(filtered);
}

function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    filterProducts();
    document.getElementById('SHOP').scrollIntoView({ behavior: 'smooth' });
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
    document.getElementById('SHOP').scrollIntoView({ behavior: 'smooth' });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('wineCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        displayCart();
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; padding:40px; color:#c0c0c0;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = $${itemTotal.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\n\nTotal: $${total.toFixed(2)}\n\nYou will be redirected to payment processing.\n\n(This is a demo - no actual payment will be processed)`);
    
    cart = [];
    saveCart();
    updateCartCount();
    toggleCart();
}

function showAccount() {
    alert('Account features:\n\n• Sign In / Register\n• Order History\n• Saved Addresses\n• Payment Methods\n• Wine Club Membership\n\n(Demo mode - feature not fully implemented)');
}

function navigateToEvent() {
    const select = document.getElementById('eventSelect');
    const value = select.value;
    if (value) {
        alert(`Event Booking: ${select.options[select.selectedIndex].text}\n\nBook your exclusive wine experience!\n\n(Demo mode - booking system not fully implemented)`);
        select.value = '';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed; top:80px; right:20px; background:#c90000; color:white; padding:15px 25px; border-radius:8px; z-index:3000; animation:slideIn 0.3s;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
