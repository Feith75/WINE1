# Wine Shop Backend with MongoDB

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Setup Instructions

### 1. Install MongoDB
**Option A: Local MongoDB**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Create a `.env` file in the backend folder:
```
MONGODB_URI=mongodb://localhost:27017/wine-shop
PORT=5000
```

For MongoDB Atlas, use your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wine-shop
PORT=5000
```

### 4. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Event Bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings` - Get all bookings

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get all orders

### Gift Cards
- POST `/api/gift-cards` - Create gift card
- GET `/api/gift-cards` - Get all gift cards

### Wine Club
- POST `/api/wine-club` - Add new member
- GET `/api/wine-club` - Get all members

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login

### Dashboard
- GET `/api/dashboard/stats` - Get all statistics

## Admin Dashboard

Open `admin-dashboard.html` in your browser to view:
- Total bookings, orders, gift cards, members
- Recent event bookings
- Recent orders
- All gift cards
- Wine club members

## Testing

1. Start the backend server
2. Open `wine.html` in your browser
3. Make bookings, orders, etc.
4. Open `admin-dashboard.html` to see all data

## Database Collections

- `eventbookings` - Event bookings
- `orders` - Wine orders
- `giftcards` - Gift card purchases
- `wineclubmembers` - Wine club memberships
- `users` - Registered users
