const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI ;
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Models
const EventBooking = require('./models/EventBooking');
const Order = require('./models/Order');
const GiftCard = require('./models/GiftCard');
const WineClubMember = require('./models/WineClubMember');
const User = require('./models/User');
const Payment = require('./models/Payment');

// Services
const mpesaService = require('./services/mpesa');

// Routes

// M-Pesa Payment Initiation
app.post('/api/mpesa/initiate', async (req, res) => {
    try {
        const { phoneNumber, amount, accountReference, transactionDesc, relatedId, relatedType } = req.body;
        
        // Initiate STK Push
        const result = await mpesaService.initiateSTKPush(
            phoneNumber,
            amount,
            accountReference,
            transactionDesc
        );

        if (result.success) {
            // Save payment record
            const payment = new Payment({
                merchantRequestId: result.data.MerchantRequestID,
                checkoutRequestId: result.data.CheckoutRequestID,
                phoneNumber: mpesaService.formatPhoneNumber(phoneNumber),
                amount,
                accountReference,
                transactionDesc,
                relatedId,
                relatedType,
                status: 'pending'
            });
            await payment.save();

            res.json({
                success: true,
                message: 'Please check your phone and enter M-Pesa PIN to complete payment',
                checkoutRequestId: result.data.CheckoutRequestID,
                paymentId: payment._id
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// M-Pesa Callback
app.post('/api/mpesa/callback', async (req, res) => {
    try {
        console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
        
        const { Body } = req.body;
        const { stkCallback } = Body;
        
        const payment = await Payment.findOne({ 
            checkoutRequestId: stkCallback.CheckoutRequestID 
        });

        if (payment) {
            payment.resultCode = stkCallback.ResultCode;
            payment.resultDesc = stkCallback.ResultDesc;

            if (stkCallback.ResultCode === 0) {
                // Payment successful
                payment.status = 'success';
                
                const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
                const receiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
                const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
                
                payment.mpesaReceiptNumber = receiptNumber;
                payment.transactionDate = transactionDate;

                // Update related booking/order status
                if (payment.relatedType === 'booking') {
                    await EventBooking.findByIdAndUpdate(payment.relatedId, { status: 'confirmed' });
                } else if (payment.relatedType === 'order') {
                    await Order.findByIdAndUpdate(payment.relatedId, { status: 'processing' });
                } else if (payment.relatedType === 'giftcard') {
                    await GiftCard.findByIdAndUpdate(payment.relatedId, { status: 'sent' });
                }
            } else {
                // Payment failed
                payment.status = 'failed';
            }

            await payment.save();
        }

        res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
        console.error('Callback Error:', error);
        res.json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
});

// Check Payment Status
app.get('/api/mpesa/status/:checkoutRequestId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ 
            checkoutRequestId: req.params.checkoutRequestId 
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // If still pending, query M-Pesa
        if (payment.status === 'pending') {
            const result = await mpesaService.querySTKPushStatus(req.params.checkoutRequestId);
            if (result.success && result.data.ResultCode) {
                payment.resultCode = result.data.ResultCode;
                payment.resultDesc = result.data.ResultDesc;
                payment.status = result.data.ResultCode === '0' ? 'success' : 'failed';
                await payment.save();
            }
        }

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Event Bookings
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = new EventBooking(req.body);
        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await EventBooking.find().sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Orders
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Gift Cards
app.post('/api/gift-cards', async (req, res) => {
    try {
        const giftCard = new GiftCard({
            ...req.body,
            code: 'WW' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
        await giftCard.save();
        res.status(201).json({ success: true, giftCard });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/gift-cards', async (req, res) => {
    try {
        const giftCards = await GiftCard.find().sort({ createdAt: -1 });
        res.json({ success: true, giftCards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Wine Club Members
app.post('/api/wine-club', async (req, res) => {
    try {
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        
        const member = new WineClubMember({
            ...req.body,
            nextBillingDate
        });
        await member.save();
        res.status(201).json({ success: true, member });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/wine-club', async (req, res) => {
    try {
        const members = await WineClubMember.find().sort({ joinedAt: -1 });
        res.json({ success: true, members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Users
app.post('/api/users/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Dashboard Stats for Owner
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const totalBookings = await EventBooking.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalGiftCards = await GiftCard.countDocuments();
        const totalMembers = await WineClubMember.countDocuments();
        const totalUsers = await User.countDocuments();
        
        const recentBookings = await EventBooking.find().sort({ createdAt: -1 }).limit(10);
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
        
        res.json({
            success: true,
            stats: {
                totalBookings,
                totalOrders,
                totalGiftCards,
                totalMembers,
                totalUsers
            },
            recent: {
                bookings: recentBookings,
                orders: recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
