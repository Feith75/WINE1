const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
    eventId: {
        type: Number,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    mpesaNumber: {
        type: String
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['mpesa', 'card', 'cash']
    },
    date: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'cancelled', 'completed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EventBooking', eventBookingSchema);
