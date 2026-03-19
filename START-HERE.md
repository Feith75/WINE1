# 🍷 Wine World E-Commerce Platform

## Quick Start Guide

### 1. Open the Website
Simply open `index.html` in your browser to get started!

**Direct Links:**
- Main Shop: `wine.html`
- Gift Packages: `gift-cards.html`
- Admin Dashboard: `admin-dashboard.html`

### 2. Start the Backend (Optional)
The backend is only needed for:
- Saving data to MongoDB
- M-Pesa payments
- Admin dashboard data

**To start backend:**
```cmd
cd backend
npm start
```

Backend will run on: `http://localhost:5000`

### 3. Features Overview

#### 🛍️ Main Shop (wine.html)
- Browse 12 premium wines
- Filter by category (Red, White, Rosé, Sparkling)
- Filter by price range
- Search functionality
- Shopping cart with localStorage
- User authentication (Login/Register)
- Event booking system
- Wine Club membership

#### 🎁 Gift Packages (gift-cards.html)
- Starter Package (KSh 3,500): Wine + Flowers + Card
- Classic Package (KSh 4,500): Wine + Deluxe Flowers + Premium Card + Box
- Premium Package (KSh 8,000): 2 Wines + Luxury Flowers + Premium Card + Box + Free Delivery
- Custom message on greeting card
- M-Pesa or Card payment

#### 📊 Admin Dashboard (admin-dashboard.html)
- View all event bookings
- View all orders
- View gift card purchases
- View wine club members
- Requires backend to be running

### 4. File Structure

```
public/
├── index.html              # Welcome page
├── wine.html               # Main shop
├── gift-cards.html         # Gift packages
├── admin-dashboard.html    # Admin panel
├── styles.css              # Main styles
├── gift-cards.css          # Gift page styles
├── config.js               # API configuration
├── app.js                  # Main application
├── gift-cards.js           # Gift page logic
├── models/                 # Data models
│   ├── ProductModel.js
│   ├── CartModel.js
│   ├── EventModel.js
│   └── UserModel.js
├── views/                  # UI views
│   ├── ProductView.js
│   ├── CartView.js
│   ├── EventView.js
│   └── UserView.js
├── controllers/            # Business logic
│   ├── ProductController.js
│   ├── CartController.js
│   ├── EventController.js
│   └── UserController.js
└── router/                 # Navigation
    └── Router.js

backend/
├── server.js               # Express server
├── .env                    # Environment variables
├── models/                 # MongoDB models
└── services/               # M-Pesa integration
```

### 5. How to Use

#### Browse and Shop
1. Open `wine.html` in browser
2. Browse wines by category or search
3. Click "Add to Cart" on any wine
4. Click cart icon to view cart
5. Adjust quantities or remove items
6. Click "Proceed to Checkout"

#### Create Account
1. Click "Account" button in header
2. Click "Register here"
3. Fill in your details
4. Password must be at least 6 characters
5. Click "Create Account"

#### Book an Event
1. Click "BOOK EVENT" dropdown in navbar
2. Select event type (Wine Tasting, Parties, or Festivals)
3. Fill in booking details
4. Max 2 guests, KSh 3,500 per person
5. Choose payment method (M-Pesa, Card, or Cash)
6. Submit booking

#### Join Wine Club
1. Scroll to footer
2. Click "Wine Club"
3. Choose membership tier:
   - Silver: KSh 5,000/month
   - Gold: KSh 10,000/month
   - Platinum: KSh 20,000/month
4. Click "Join" button

#### Buy Gift Package
1. Click "GIFT" in navbar or open `gift-cards.html`
2. Choose package (Starter, Classic, or Premium)
3. Click "Buy Now"
4. Fill in recipient and sender details
5. Write personal message for greeting card
6. Choose payment method
7. Complete purchase

### 6. Browser Cache Issue

If you see old content or "Chinese characters" instead of emojis:

**Solution 1: Hard Refresh**
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Solution 2: Clear Browser Cache**
- Chrome: Settings → Privacy → Clear browsing data
- Firefox: Settings → Privacy → Clear Data
- Edge: Settings → Privacy → Clear browsing data

**Solution 3: Use Different Browser**
- Try opening in Chrome, Firefox, or Edge

### 7. Backend Configuration

The backend uses environment variables in `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
```

Update these values with your actual credentials.

### 8. Troubleshooting

**Problem: Site not loading properly**
- Solution: Clear browser cache and hard refresh

**Problem: Backend not starting**
- Solution: Make sure you're in the `backend` folder: `cd backend`
- Check if MongoDB URI is correct in `.env`
- Run: `npm install` first

**Problem: M-Pesa not working**
- Solution: Update M-Pesa credentials in `backend/.env`
- Check M-Pesa setup guide: `backend/MPESA_SETUP.md`

**Problem: Cart not saving**
- Solution: Check browser localStorage is enabled
- Try different browser

### 9. All Prices in KSh (Kenya Shillings)

- Wines: KSh 4,500 - KSh 12,000
- Event booking: KSh 3,500 per person
- Gift packages: KSh 3,500 - KSh 8,000
- Wine Club: KSh 5,000 - KSh 20,000/month

### 10. Support

For issues or questions, check:
- `ENVIRONMENT-SETUP.md` - Environment configuration
- `backend/README.md` - Backend documentation
- `backend/MPESA_SETUP.md` - M-Pesa integration guide

---

**Enjoy your Wine World e-commerce platform! 🍷**
