// Cart View - handles cart display
class CartView {
    constructor() {
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.getElementById('cartCount');
    }

    updateCartCount(count) {
        this.cartCount.textContent = count;
    }

    showCart() {
        this.cartModal.style.display = 'block';
    }

    hideCart() {
        this.cartModal.style.display = 'none';
    }

    toggleCart() {
        if (this.cartModal.style.display === 'block') {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    renderCart(cart, total) {
        if (cart.length === 0) {
            this.cartItems.innerHTML = '<p style="text-align:center; padding:40px; color:#c0c0c0;">Your cart is empty</p>';
            this.cartTotal.textContent = 'KSh 0.00';
            return;
        }

        this.cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">KSh ${item.price.toFixed(2)} × ${item.quantity} = KSh ${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                    <button class="remove-btn" data-product-id="${item.id}">Remove</button>
                </div>
            `;
            this.cartItems.appendChild(cartItem);
        });
        
        this.cartTotal.textContent = 'KSh ' + total.toFixed(2);
    }

    bindCartActions(updateHandler, removeHandler) {
        this.cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;
                const change = action === 'increase' ? 1 : -1;
                updateHandler(productId, change);
            }
            
            if (e.target.classList.contains('remove-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                removeHandler(productId);
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed; top:80px; right:20px; background:#c90000; color:white; padding:15px 25px; border-radius:8px; z-index:3000; animation:slideIn 0.3s;';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
}
