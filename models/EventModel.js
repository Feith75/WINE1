// Event Model - handles event data and bookings
class EventModel {
    constructor() {
        this.events = [
            {
                id: 1,
                name: "Wine Tasting",
                description: "Experience a curated selection of premium wines with expert guidance",
                duration: "2 hours",
                price: 3500,
                capacity: 2,
                image: "jacob-le-1BuJoMJ6ZBk-unsplash.jpg"
            },
            {
                id: 2,
                name: "Parties",
                description: "Host your private celebration with exclusive wine service",
                duration: "4 hours",
                price: 3500,
                capacity: 2,
                image: "stefan-johnson-xIFbDeGcy44-unsplash.jpg"
            },
            {
                id: 3,
                name: "Festivals",
                description: "Join our seasonal wine festival with live music and food pairings",
                duration: "Full day",
                price: 3500,
                capacity: 2,
                image: "valentin-lacoste-4eyAy57ObtQ-unsplash.jpg"
            }
        ];
        
        this.bookings = this.loadBookings();
    }

    loadBookings() {
        const saved = localStorage.getItem('wineEventBookings');
        return saved ? JSON.parse(saved) : [];
    }

    saveBookings() {
        localStorage.setItem('wineEventBookings', JSON.stringify(this.bookings));
    }

    getAllEvents() {
        return this.events;
    }

    getEventById(id) {
        return this.events.find(e => e.id === id);
    }

    getEventByName(name) {
        return this.events.find(e => e.name.toLowerCase() === name.toLowerCase());
    }

    createBooking(bookingData) {
        const booking = {
            id: Date.now(),
            ...bookingData,
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        this.bookings.push(booking);
        this.saveBookings();
        return booking;
    }

    getBookings() {
        return this.bookings;
    }
}
