const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    code: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'sent', 'redeemed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GiftCard', giftCardSchema);
