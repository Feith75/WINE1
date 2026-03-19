const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection (reuse across warm invocations)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
}

// Models
const EventBooking = require('../backend/models/EventBooking');
const Order        = require('../backend/models/Order');
const GiftCard     = require('../backend/models/GiftCard');
const WineClubMember = require('../backend/models/WineClubMember');
const User         = require('../backend/models/User');
const Payment      = require('../backend/models/Payment');
const mpesaService = require('../backend/services/mpesa');

// Connect before every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// M-Pesa
app.post('/api/mpesa/initiate', async (req, res) => {
    try {
        const { phoneNumber, amount, accountReference, transactionDesc, relatedId, relatedType } = req.body;
        const result = await mpesaService.initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc);
        if (result.success) {
            const payment = new Payment({
                merchantRequestId: result.data.MerchantRequestID,
                checkoutRequestId: result.data.CheckoutRequestID,
                phoneNumber: mpesaService.formatPhoneNumber(phoneNumber),
                amount, accountReference, transactionDesc, relatedId, relatedType,
                status: 'pending'
            });
            await payment.save();
            res.json({ success: true, message: 'Check your phone for M-Pesa PIN prompt', checkoutRequestId: result.data.CheckoutRequestID, paymentId: payment._id });
        } else {
            res.status(400).json(result);
        }
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/mpesa/callback', async (req, res) => {
    try {
        const { stkCallback } = req.body.Body;
        const payment = await Payment.findOne({ checkoutRequestId: stkCallback.CheckoutRequestID });
        if (payment) {
            payment.resultCode = stkCallback.ResultCode;
            payment.resultDesc = stkCallback.ResultDesc;
            if (stkCallback.ResultCode === 0) {
                payment.status = 'success';
                const items = stkCallback.CallbackMetadata?.Item || [];
                payment.mpesaReceiptNumber = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
                payment.transactionDate    = items.find(i => i.Name === 'TransactionDate')?.Value;
                if (payment.relatedType === 'booking')  await EventBooking.findByIdAndUpdate(payment.relatedId, { status: 'confirmed' });
                if (payment.relatedType === 'order')    await Order.findByIdAndUpdate(payment.relatedId, { status: 'processing' });
                if (payment.relatedType === 'giftcard') await GiftCard.findByIdAndUpdate(payment.relatedId, { status: 'sent' });
            } else {
                payment.status = 'failed';
            }
            await payment.save();
        }
        res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (e) { res.json({ ResultCode: 1, ResultDesc: 'Failed' }); }
});

app.get('/api/mpesa/status/:checkoutRequestId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ checkoutRequestId: req.params.checkoutRequestId });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        if (payment.status === 'pending') {
            const result = await mpesaService.querySTKPushStatus(req.params.checkoutRequestId);
            if (result.success && result.data.ResultCode) {
                payment.status = result.data.ResultCode === '0' ? 'success' : 'failed';
                await payment.save();
            }
        }
        res.json({ success: true, payment });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Bookings
app.post('/api/bookings', async (req, res) => {
    try { const b = await new EventBooking(req.body).save(); res.status(201).json({ success: true, booking: b }); }
    catch (e) { res.status(400).json({ success: false, message: e.message }); }
});
app.get('/api/bookings', async (req, res) => {
    try { res.json({ success: true, bookings: await EventBooking.find().sort({ createdAt: -1 }) }); }
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Orders
app.post('/api/orders', async (req, res) => {
    try { const o = await new Order(req.body).save(); res.status(201).json({ success: true, order: o }); }
    catch (e) { res.status(400).json({ success: false, message: e.message }); }
});
app.get('/api/orders', async (req, res) => {
    try { res.json({ success: true, orders: await Order.find().sort({ createdAt: -1 }) }); }
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Gift Cards
app.post('/api/gift-cards', async (req, res) => {
    try {
        const gc = await new GiftCard({ ...req.body, code: 'WW' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase() }).save();
        res.status(201).json({ success: true, giftCard: gc });
    } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});
app.get('/api/gift-cards', async (req, res) => {
    try { res.json({ success: true, giftCards: await GiftCard.find().sort({ createdAt: -1 }) }); }
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Wine Club
app.post('/api/wine-club', async (req, res) => {
    try {
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        const m = await new WineClubMember({ ...req.body, nextBillingDate }).save();
        res.status(201).json({ success: true, member: m });
    } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});
app.get('/api/wine-club', async (req, res) => {
    try { res.json({ success: true, members: await WineClubMember.find().sort({ joinedAt: -1 }) }); }
    catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Users
app.post('/api/users/register', async (req, res) => {
    try {
        if (await User.findOne({ email: req.body.email })) return res.status(400).json({ success: false, message: 'Email already registered' });
        const u = await new User(req.body).save();
        res.status(201).json({ success: true, user: { id: u._id, name: u.name, email: u.email, phone: u.phone } });
    } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});
app.post('/api/users/login', async (req, res) => {
    try {
        const u = await User.findOne({ email: req.body.email, password: req.body.password });
        if (!u) return res.status(401).json({ success: false, message: 'Invalid email or password' });
        res.json({ success: true, user: { id: u._id, name: u.name, email: u.email, phone: u.phone } });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Dashboard
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        res.json({
            success: true,
            stats: {
                totalBookings: await EventBooking.countDocuments(),
                totalOrders:   await Order.countDocuments(),
                totalGiftCards: await GiftCard.countDocuments(),
                totalMembers:  await WineClubMember.countDocuments(),
                totalUsers:    await User.countDocuments()
            },
            recent: {
                bookings: await EventBooking.find().sort({ createdAt: -1 }).limit(10),
                orders:   await Order.find().sort({ createdAt: -1 }).limit(10)
            }
        });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = app;
