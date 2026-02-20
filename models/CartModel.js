// Cart Model - handles shopping cart data
class CartModel {
    constructor() {
        this.cart = this.loadCart();
    }

    loadCart() {
        const saved = localStorage.getItem('wineCart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('wineCart', JSON.stringify(this.cart));
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        return this.cart;
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        return this.cart;
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                return this.removeItem(productId);
            }
            this.saveCart();
        }
        return this.cart;
    }

    getCart() {
        return this.cart;
    }

    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        return this.cart;
    }
}
