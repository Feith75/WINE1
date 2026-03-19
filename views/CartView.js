// Cart View - handles cart display
class CartView {
    constructor() {
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.getElementById('cartCount');
    }

    renderCart(items, total) {
        if (!this.cartItems) return;

        if (items.length === 0) {
            this.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            this.cartItems.innerHTML = items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>KSh ${item.price.toLocaleString()}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            `).join('');
        }

        if (this.cartTotal) {
            this.cartTotal.textContent = total.toLocaleString();
        }
    }

    updateCartCount(count) {
        if (this.cartCount) {
            this.cartCount.textContent = count;
        }
    }

    toggleCart() {
        if (this.cartModal) {
            const isVisible = this.cartModal.style.display === 'block';
            this.cartModal.style.display = isVisible ? 'none' : 'block';
        }
    }

    showCheckoutMessage() {
        alert('Thank you for your order! We will process it shortly.');
    }
}
