const mongoose = require('mongoose');

const wineClubMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    plan: {
        type: String,
        required: true,
        enum: ['silver', 'gold', 'platinum']
    },
    monthlyFee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'paused', 'cancelled']
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    nextBillingDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('WineClubMember', wineClubMemberSchema);
