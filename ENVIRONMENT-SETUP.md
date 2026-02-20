# Environment Configuration

## Files Created

### 1. `.env` (backend/.env)
Contains all sensitive configuration and URLs:
- MongoDB connection string
- M-Pesa API credentials
- Server port
- API URLs
- Email configuration

### 2. `.gitignore`
Prevents sensitive files from being committed to Git:
- .env files
- node_modules
- logs
- temporary files

## Configuration Structure

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wine-shop
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/mpesa/callback
API_BASE_URL=http://localhost:5000/api
```

### Frontend (config.js)
All API URLs are centralized in `config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: { ... }
};
```

## How It Works

### Backend
1. `server.js` loads environment variables using `require('dotenv').config()`
2. All sensitive data is accessed via `process.env.VARIABLE_NAME`
3. M-Pesa service (`services/mpesa.js`) uses environment variables

### Frontend
1. `config.js` centralizes all API URLs
2. All pages use `API_CONFIG.BASE_URL` for API calls
3. Easy to change URLs in one place

## Setup Instructions

### 1. Configure Backend
Edit `backend/.env` and add your actual credentials:
```bash
cd backend
# Edit .env file with your MongoDB URI and M-Pesa credentials
```

### 2. Start Backend
```bash
cd backend
npm install
npm start
```

### 3. Configure Frontend (if needed)
Edit `config.js` to change API URLs:
```javascript
const API_CONFIG = {
    BASE_URL: 'https://your-production-domain.com/api'
};
```

## Security Notes

✅ **Good Practices:**
- `.env` file is in `.gitignore` - won't be committed
- Sensitive credentials are not in code
- Easy to change for different environments (dev/production)

❌ **Never Do:**
- Commit `.env` file to Git
- Share `.env` file publicly
- Hardcode credentials in code

## Environment Variables Used

### Server
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Database
- `MONGODB_URI` - MongoDB connection string

### M-Pesa
- `MPESA_CONSUMER_KEY` - Daraja API consumer key
- `MPESA_CONSUMER_SECRET` - Daraja API consumer secret
- `MPESA_SHORTCODE` - Business shortcode
- `MPESA_PASSKEY` - Lipa Na M-Pesa passkey
- `MPESA_CALLBACK_URL` - Payment callback URL

### Security
- `JWT_SECRET` - JWT token secret
- `SESSION_SECRET` - Session secret

## Changing URLs

### For Development
Keep `backend/.env` as is with `localhost:5000`

### For Production
Update `backend/.env`:
```
API_BASE_URL=https://api.yoursite.com
MPESA_CALLBACK_URL=https://api.yoursite.com/api/mpesa/callback
FRONTEND_URL=https://yoursite.com
```

Update `config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'https://api.yoursite.com/api'
};
```

## Files That Use Environment Variables

### Backend
- `backend/server.js` - Main server
- `backend/services/mpesa.js` - M-Pesa integration

### Frontend
- `config.js` - API configuration
- `admin-dashboard.html` - Uses API_CONFIG
- `gift-cards.js` - Uses API_CONFIG for gift orders

All URLs are now centralized and easy to manage!
