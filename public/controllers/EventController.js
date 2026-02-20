// Event Controller - handles event booking logic
class EventController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const eventForm = document.getElementById('eventBookingForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBooking();
            });
        }

        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            const closeBtn = eventModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.view.closeEventModal();
                });
            }

            eventModal.addEventListener('click', (e) => {
                if (e.target === eventModal) {
                    this.view.closeEventModal();
                }
            });
        }
    }

    openEventBooking(eventName) {
        const event = this.model.getEvent(eventName);
        if (event) {
            this.view.openEventModal(event);
        }
    }

    async handleBooking() {
        const formData = {
            eventId: document.getElementById('eventIdInput').value,
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            mpesaNumber: document.getElementById('mpesaNumber').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            date: document.getElementById('bookingDate').value,
            guests: parseInt(document.getElementById('bookingGuests').value)
        };

        // Validate
        if (formData.guests > 2) {
            this.view.showBookingError('Maximum 2 guests allowed');
            return;
        }

        // Calculate total
        const event = this.model.getEvent(document.getElementById('modalEventName').textContent);
        const total = this.model.calculateTotal(event.pricePerPerson, formData.guests);

        // Create booking
        const bookingData = {
            ...formData,
            eventName: event.name,
            pricePerPerson: event.pricePerPerson,
            totalAmount: total
        };

        const result = await this.model.createBooking(bookingData);

        if (result.success) {
            this.view.showBookingSuccess(`Booking confirmed! Total: KSh ${total.toLocaleString()}`);
        } else {
            this.view.showBookingError(result.message);
        }
    }
}
