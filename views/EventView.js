// Event View - handles event display and booking form
class EventView {
    constructor() {
        this.eventModal = document.getElementById('eventModal');
        this.eventForm = document.getElementById('eventBookingForm');
    }

    showEventModal(event) {
        document.getElementById('modalEventName').textContent = event.name;
        document.getElementById('modalEventDescription').textContent = event.description;
        document.getElementById('modalEventPrice').textContent = `KSh ${event.price.toLocaleString()}`;
        document.getElementById('modalEventCapacity').textContent = event.capacity;
        document.getElementById('eventIdInput').value = event.id;
        
        this.eventModal.style.display = 'block';
    }

    hideEventModal() {
        this.eventModal.style.display = 'none';
        this.eventForm.reset();
    }

    getFormData() {
        return {
            eventId: parseInt(document.getElementById('eventIdInput').value),
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            mpesaNumber: document.getElementById('mpesaNumber').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            date: document.getElementById('bookingDate').value,
            guests: parseInt(document.getElementById('bookingGuests').value)
        };
    }

    showSuccessMessage(booking, event) {
        const paymentMethodText = {
            'mpesa': 'M-Pesa',
            'card': 'Credit/Debit Card',
            'cash': 'Cash on Arrival'
        };
        
        let paymentInfo = '';
        if (booking.paymentMethod === 'mpesa') {
            paymentInfo = `📱 M-Pesa payment request sent to: ${booking.mpesaNumber}\n\n⏳ Please check your phone and enter your M-Pesa PIN to complete payment.\n\n`;
        } else if (booking.paymentMethod === 'card') {
            paymentInfo = `Card payment link sent to: ${booking.email}\n`;
        } else if (booking.paymentMethod === 'cash') {
            paymentInfo = `Please bring cash payment on arrival\n`;
        }
        
        alert(`Booking Confirmed! 🎉\n\nEvent: ${event.name}\nDate: ${booking.date}\nGuests: ${booking.guests}\nTotal: KSh ${(event.price * booking.guests).toLocaleString()}\nPayment Method: ${paymentMethodText[booking.paymentMethod]}\n\n${paymentInfo}Confirmation email sent to: ${booking.email}\n\nBooking ID: #${booking.id}`);
    }

    showPaymentPrompt() {
        return confirm('📱 M-Pesa Payment\n\nA payment request will be sent to your phone.\nPlease have your phone ready to enter your M-Pesa PIN.\n\nClick OK to proceed with payment.');
    }

    showPaymentProcessing() {
        const modal = document.createElement('div');
        modal.id = 'paymentProcessingModal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;';
        modal.innerHTML = `
            <div style="background:#2a1515; padding:40px; border-radius:10px; text-align:center; max-width:400px; border:2px solid #c90000;">
                <h2 style="color:#c90000; margin-bottom:20px;">📱 Processing Payment</h2>
                <p style="color:#f0f0f0; font-size:18px; margin-bottom:20px;">Please check your phone</p>
                <p style="color:#c0c0c0; margin-bottom:30px;">Enter your M-Pesa PIN to complete the payment</p>
                <div style="border:3px solid #c90000; border-radius:50%; width:60px; height:60px; margin:0 auto; border-top-color:transparent; animation:spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    hidePaymentProcessing(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    showPaymentSuccess(receiptNumber) {
        alert(`✅ Payment Successful!\n\nM-Pesa Receipt: ${receiptNumber}\n\nYour booking is confirmed. You will receive a confirmation email shortly.`);
    }

    showPaymentError(message) {
        alert(`❌ Payment Failed\n\n${message}\n\nPlease try again or contact support.`);
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    bindBookingSubmit(handler) {
        this.eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            handler(formData);
        });
    }

    bindCloseModal(handler) {
        const closeBtn = document.querySelector('#eventModal .close');
        closeBtn?.addEventListener('click', handler);
        
        this.eventModal?.addEventListener('click', (e) => {
            if (e.target === this.eventModal) {
                handler();
            }
        });
    }
}
