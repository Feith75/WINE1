// Event View - handles event booking display
class EventView {
    constructor() {
        this.eventModal = document.getElementById('eventModal');
        this.eventForm = document.getElementById('eventBookingForm');
    }

    openEventModal(event) {
        if (!this.eventModal) return;

        document.getElementById('modalEventName').textContent = event.name;
        document.getElementById('modalEventDescription').textContent = event.description;
        document.getElementById('modalEventPrice').textContent = `KSh ${event.pricePerPerson.toLocaleString()}`;
        document.getElementById('modalEventCapacity').textContent = `${event.maxCapacity} guests`;
        document.getElementById('eventIdInput').value = event.id;

        this.eventModal.style.display = 'block';
    }

    closeEventModal() {
        if (this.eventModal) {
            this.eventModal.style.display = 'none';
            if (this.eventForm) {
                this.eventForm.reset();
            }
        }
    }

    showBookingSuccess(message) {
        alert(message || 'Booking confirmed! We will contact you shortly.');
        this.closeEventModal();
    }

    showBookingError(message) {
        alert(message || 'Booking failed. Please try again.');
    }
}
