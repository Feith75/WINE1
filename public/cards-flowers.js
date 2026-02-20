// Load selected package
const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));

if (!selectedPackage) {
    alert('Please select a package first');
    window.location.href = 'gift-cards.html';
} else {
    // Display package info
    document.getElementById('packageTitle').textContent = `🎁 ${selectedPackage.name}`;
    document.getElementById('starterTitle').textContent = `🌟 ${selectedPackage.name}`;
    document.getElementById('giftCardValue').textContent = `KSh ${selectedPackage.giftCardAmount.toLocaleString()}`;
    document.getElementById('cartPackageName').textContent = selectedPackage.name;
    document.getElementById('cartPackagePrice').textContent = `KSh ${selectedPackage.giftCardAmount.toLocaleString()}`;
}

// Gift cart storage
let giftCart = [];

function showItems() {
    document.getElementById('starterDisplay').style.display = 'none';
    document.getElementById('itemsSection').classList.add('show');
    
    // Scroll to items
    document.getElementById('itemsSection').scrollIntoView({ behavior: 'smooth' });
}

function addToCart(type, id, name, price) {
    const uniqueId = `${type}-${id}`;
    
    // Check if item already exists
    const existingItem = giftCart.find(item => item.id === uniqueId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        giftCart.push({
            id: uniqueId,
            type: type,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`✓ ${name} added to cart!`);
}

function removeFromCart(itemId) {
    giftCart = giftCart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function updateQuantity(itemId, change) {
    const item = giftCart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = giftCart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('giftCartCount').textContent = totalItems;
    
    // Update cart items display
    const cartItemsDiv = document.getElementById('giftCartItems');
    
    if (giftCart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; padding:20px; color:#c0c0c0;">No items added yet</p>';
    } else {
        let html = '';
        giftCart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">KSh ${item.price.toLocaleString()} × ${item.quantity} = KSh ${itemTotal.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
        });
        cartItemsDiv.innerHTML = html;
    }
    
    // Update total
    const itemsTotal = giftCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = selectedPackage.giftCardAmount + itemsTotal;
    document.getElementById('giftCartTotal').textContent = `KSh ${grandTotal.toLocaleString()}`;
}

function toggleGiftCart() {
    const modal = document.getElementById('giftCartModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        updateCartDisplay();
    }
}

function buyNow(type, id, name, price) {
    // Create order with package and single item
    const order = {
        package: selectedPackage,
        items: [{
            id: `${type}-${id}`,
            type: type,
            name: name,
            price: price,
            quantity: 1
        }],
        total: selectedPackage.giftCardAmount + price
    };
    
    localStorage.setItem('giftOrder', JSON.stringify(order));
    window.location.href = 'gift-checkout.html';
}

function proceedToCheckout() {
    if (giftCart.length === 0) {
        alert('Please add some items to your cart first!');
        return;
    }
    
    const itemsTotal = giftCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        package: selectedPackage,
        items: giftCart,
        total: selectedPackage.giftCardAmount + itemsTotal
    };
    
    localStorage.setItem('giftOrder', JSON.stringify(order));
    window.location.href = 'gift-checkout.html';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed; top:80px; right:20px; background:#4caf50; color:white; padding:15px 25px; border-radius:8px; z-index:3000; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-weight: bold;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Close modal when clicking outside
document.getElementById('giftCartModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'giftCartModal') {
        toggleGiftCart();
    }
});

// Initialize cart display
updateCartDisplay();
