// Cart Controller - manages cart operations
class CartController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.bindCartActions(
            this.updateQuantity.bind(this),
            this.removeFromCart.bind(this)
        );
        
        this.updateCartDisplay();
    }

    addToCart(product) {
        this.model.addItem(product);
        this.updateCartDisplay();
        this.view.showNotification('Added to cart!');
    }

    removeFromCart(productId) {
        this.model.removeItem(productId);
        this.updateCartDisplay();
        this.refreshCartView();
    }

    updateQuantity(productId, change) {
        this.model.updateQuantity(productId, change);
        this.updateCartDisplay();
        this.refreshCartView();
    }

    updateCartDisplay() {
        const count = this.model.getItemCount();
        this.view.updateCartCount(count);
    }

    refreshCartView() {
        const cart = this.model.getCart();
        const total = this.model.getTotal();
        this.view.renderCart(cart, total);
    }

    toggleCart() {
        this.view.toggleCart();
        this.refreshCartView();
    }

    checkout() {
        const cart = this.model.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const total = this.model.getTotal();
        alert(`Thank you for your order!\n\nTotal: KSh ${total.toFixed(2)}\n\nYou will be redirected to payment processing.\n\n(This is a demo - no actual payment will be processed)`);
        
        this.model.clearCart();
        this.updateCartDisplay();
        this.view.hideCart();
    }
}
