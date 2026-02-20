// Event Controller - manages event booking operations
class EventController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.bindBookingSubmit(this.handleBookingSubmit.bind(this));
        this.view.bindCloseModal(this.closeModal.bind(this));
    }

    openEventBooking(eventName) {
        const event = this.model.getEventByName(eventName);
        if (event) {
            this.view.showEventModal(event);
        } else {
            this.view.showError('Event not found');
        }
    }

    openEventById(eventId) {
        const event = this.model.getEventById(eventId);
        if (event) {
            this.view.showEventModal(event);
        } else {
            this.view.showError('Event not found');
        }
    }

    closeModal() {
        this.view.hideEventModal();
    }

    async handleBookingSubmit(formData) {
        // Validate form data
        if (!formData.name || !formData.email || !formData.phone || !formData.paymentMethod || !formData.date || !formData.guests) {
            this.view.showError('Please fill in all required fields');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.view.showError('Please enter a valid email address');
            return;
        }

        // Validate M-Pesa number only if M-Pesa is selected
        if (formData.paymentMethod === 'mpesa') {
            if (!formData.mpesaNumber) {
                this.view.showError('Please enter your M-Pesa number');
                return;
            }
            const mpesaRegex = /^(254|0)[17]\d{8}$/;
            if (!mpesaRegex.test(formData.mpesaNumber.replace(/\s/g, ''))) {
                this.view.showError('Please enter a valid M-Pesa number (e.g., 0712345678 or 254712345678)');
                return;
            }
        }

        // Validate date (must be in the future)
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            this.view.showError('Please select a future date');
            return;
        }

        // Validate guests
        if (formData.guests < 1) {
            this.view.showError('Number of guests must be at least 1');
            return;
        }

        const event = this.model.getEventById(formData.eventId);
        if (!event) {
            this.view.showError('Event not found');
            return;
        }

        if (formData.guests > event.capacity) {
            this.view.showError(`Maximum capacity is ${event.capacity} guests`);
            return;
        }

        // Create booking
        const booking = this.model.createBooking(formData);
        
        // If M-Pesa payment, initiate payment
        if (formData.paymentMethod === 'mpesa') {
            const proceed = this.view.showPaymentPrompt();
            if (!proceed) {
                return;
            }

            const processingModal = this.view.showPaymentProcessing();
            
            try {
                const totalAmount = event.price * formData.guests;
                const response = await fetch('http://localhost:5000/api/mpesa/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber: formData.mpesaNumber,
                        amount: totalAmount,
                        accountReference: `BOOKING-${booking.id}`,
                        transactionDesc: `${event.name} Booking`,
                        relatedId: booking.id,
                        relatedType: 'booking'
                    })
                });

                const result = await response.json();
                
                this.view.hidePaymentProcessing(processingModal);

                if (result.success) {
                    this.view.showSuccessMessage(booking, event);
                    this.view.hideEventModal();
                    
                    // Poll for payment status
                    this.checkPaymentStatus(result.checkoutRequestId, 30000); // Check for 30 seconds
                } else {
                    this.view.showPaymentError(result.message || 'Payment initiation failed');
                }
            } catch (error) {
                this.view.hidePaymentProcessing(processingModal);
                this.view.showPaymentError('Network error. Please check your connection.');
            }
        } else {
            // Non-M-Pesa payment
            this.view.showSuccessMessage(booking, event);
            this.view.hideEventModal();
        }
    }

    async checkPaymentStatus(checkoutRequestId, duration) {
        const startTime = Date.now();
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/mpesa/status/${checkoutRequestId}`);
                const result = await response.json();

                if (result.success && result.payment.status !== 'pending') {
                    clearInterval(interval);
                    
                    if (result.payment.status === 'success') {
                        this.view.showPaymentSuccess(result.payment.mpesaReceiptNumber);
                    } else {
                        this.view.showPaymentError(result.payment.resultDesc || 'Payment was not completed');
                    }
                }

                // Stop checking after duration
                if (Date.now() - startTime > duration) {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 3000); // Check every 3 seconds
    }

    getBookings() {
        return this.model.getBookings();
    }
}
