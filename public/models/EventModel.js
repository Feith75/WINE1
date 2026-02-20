// Event Model - manages event booking data
class EventModel {
    constructor() {
        this.events = {
            'Wine Tasting': {
                id: 'wine-tasting',
                name: 'Wine Tasting',
                description: 'Experience our curated selection of premium wines with expert guidance',
                pricePerPerson: 3500,
                maxCapacity: 2
            },
            'Parties': {
                id: 'parties',
                name: 'Parties',
                description: 'Host your special celebration in our elegant wine venue',
                pricePerPerson: 3500,
                maxCapacity: 2
            },
            'Festivals': {
                id: 'festivals',
                name: 'Festivals',
                description: 'Join our seasonal wine festivals featuring local and international wines',
                pricePerPerson: 3500,
                maxCapacity: 2
            }
        };
    }

    getEvent(eventName) {
        return this.events[eventName];
    }

    async createBooking(bookingData) {
        try {
            const response = await API.post(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
            return response;
        } catch (error) {
            console.error('Booking error:', error);
            return { success: false, message: 'Failed to create booking' };
        }
    }

    calculateTotal(pricePerPerson, guests) {
        return pricePerPerson * guests;
    }
}
