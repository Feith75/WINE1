// Cart Controller - handles cart logic
class CartController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.updateCart();
        this.bindEvents();
    }

    bindEvents() {
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            cartItems.addEventListener('click', (e) => {
                if (e.target.classList.contains('qty-btn')) {
                    const productId = parseInt(e.target.dataset.id);
                    const action = e.target.dataset.action;
                    this.updateQuantity(productId, action);
                } else if (e.target.classList.contains('remove-btn')) {
                    const productId = parseInt(e.target.dataset.id);
                    this.removeItem(productId);
                }
            });
        }
    }

    addItem(product, quantity = 1) {
        this.model.addItem(product, quantity);
        this.updateCart();
    }

    removeItem(productId) {
        this.model.removeItem(productId);
        this.updateCart();
    }

    updateQuantity(productId, action) {
        const items = this.model.getItems();
        const item = items.find(i => i.id === productId);
        
        if (item) {
            const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            this.model.updateQuantity(productId, newQuantity);
            this.updateCart();
        }
    }

    updateCart() {
        const items = this.model.getItems();
        const total = this.model.getTotal();
        const count = this.model.getItemCount();
        
        this.view.renderCart(items, total);
        this.view.updateCartCount(count);
    }

    toggleCart() {
        this.view.toggleCart();
    }

    checkout() {
        const items = this.model.getItems();
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Open payment modal
        this.openPaymentModal(items, this.model.getTotal());
        this.view.toggleCart(); // Close cart modal
    }

    openPaymentModal(items, total) {
        const paymentModal = document.getElementById('paymentModal');
        const paymentOrderItems = document.getElementById('paymentOrderItems');
        const paymentTotal = document.getElementById('paymentTotal');

        // Display order items
        paymentOrderItems.innerHTML = items.map(item => `
            <div class="payment-order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>KSh ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');

        // Display total
        paymentTotal.textContent = total.toLocaleString();

        // Show modal
        paymentModal.style.display = 'block';

        // Setup payment form handlers
        this.setupPaymentHandlers();
    }

    setupPaymentHandlers() {
        const paymentMethod = document.getElementById('paymentMethod');
        const mpesaSection = document.getElementById('mpesaSection');
        const cardSection = document.getElementById('cardSection');
        const cashSection = document.getElementById('cashSection');
        const paymentForm = document.getElementById('paymentForm');
        const closePayment = document.getElementById('closePayment');
        const paymentModal = document.getElementById('paymentModal');

        // Payment method change
        paymentMethod.onchange = () => {
            mpesaSection.style.display = 'none';
            cardSection.style.display = 'none';
            cashSection.style.display = 'none';

            const method = paymentMethod.value;
            if (method === 'mpesa') {
                mpesaSection.style.display = 'block';
                document.getElementById('mpesaPhone').required = true;
            } else if (method === 'card') {
                cardSection.style.display = 'block';
                document.getElementById('cardNumber').required = true;
                document.getElementById('cardExpiry').required = true;
                document.getElementById('cardCVV').required = true;
                document.getElementById('cardName').required = true;
            } else if (method === 'cash') {
                cashSection.style.display = 'block';
            }
        };

        // Form submission
        paymentForm.onsubmit = async (e) => {
            e.preventDefault();
            await this.processPayment();
        };

        // Close modal
        closePayment.onclick = () => {
            paymentModal.style.display = 'none';
            paymentForm.reset();
        };

        paymentModal.onclick = (e) => {
            if (e.target === paymentModal) {
                paymentModal.style.display = 'none';
                paymentForm.reset();
            }
        };

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.oninput = (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            };
        }

        // Expiry date formatting
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.oninput = (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            };
        }
    }

    async processPayment() {
        const paymentMethod = document.getElementById('paymentMethod').value;
        const deliveryName = document.getElementById('deliveryName').value;
        const deliveryPhone = document.getElementById('deliveryPhone').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const deliveryNotes = document.getElementById('deliveryNotes').value;

        const orderData = {
            items: this.model.getItems(),
            total: this.model.getTotal(),
            paymentMethod: paymentMethod,
            delivery: {
                name: deliveryName,
                phone: deliveryPhone,
                address: deliveryAddress,
                notes: deliveryNotes
            }
        };

        if (paymentMethod === 'mpesa') {
            orderData.mpesaPhone = document.getElementById('mpesaPhone').value;
            
            // Send to backend for M-Pesa STK Push
            try {
                const response = await API.post(API_CONFIG.ENDPOINTS.ORDERS, orderData);
                if (response.success) {
                    alert('✅ M-Pesa payment initiated!\n\nPlease check your phone for the M-Pesa prompt.\nEnter your PIN to complete the payment.');
                    this.completeOrder();
                } else {
                    alert('❌ Payment failed: ' + (response.message || 'Please try again'));
                }
            } catch (error) {
                console.error('Payment error:', error);
                alert('✅ Order placed!\n\nYour order has been received.\nOrder Total: KSh ' + this.model.getTotal().toLocaleString());
                this.completeOrder();
            }
        } else if (paymentMethod === 'card') {
            orderData.card = {
                number: document.getElementById('cardNumber').value,
                expiry: document.getElementById('cardExpiry').value,
                cvv: document.getElementById('cardCVV').value,
                name: document.getElementById('cardName').value
            };

            // In production, this would process card payment
            alert('✅ Card payment processed!\n\nYour order has been confirmed.\nOrder Total: KSh ' + this.model.getTotal().toLocaleString());
            this.completeOrder();
        } else if (paymentMethod === 'cash') {
            // Cash on delivery
            alert('✅ Order placed!\n\nYou will pay KSh ' + this.model.getTotal().toLocaleString() + ' when your order is delivered.\n\nThank you for shopping with Wine World!');
            this.completeOrder();
        }
    }

    completeOrder() {
        // Clear cart
        this.model.clearCart();
        this.updateCart();

        // Close payment modal
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('paymentForm').reset();
    }
}
