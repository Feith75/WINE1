const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    merchantRequestId: String,
    checkoutRequestId: String,
    phoneNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    accountReference: String,
    transactionDesc: String,
    mpesaReceiptNumber: String,
    transactionDate: Date,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'success', 'failed', 'cancelled']
    },
    resultCode: String,
    resultDesc: String,
    relatedId: String, // ID of booking/order/gift card
    relatedType: String, // 'booking', 'order', 'giftcard', 'wineclub'
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
