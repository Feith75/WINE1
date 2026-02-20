# M-Pesa Integration Setup Guide

## Overview
This integration uses Safaricom's Daraja API to process M-Pesa payments via STK Push (Lipa Na M-Pesa Online).

## Step 1: Create Daraja Account

1. Go to https://developer.safaricom.co.ke
2. Click "Sign Up" and create an account
3. Verify your email address
4. Log in to your account

## Step 2: Create an App

1. Click "My Apps" in the dashboard
2. Click "Add a New App"
3. Fill in the details:
   - App Name: Wine Shop
   - Description: Wine e-commerce platform
4. Select "Lipa Na M-Pesa Online" API
5. Click "Create App"

## Step 3: Get API Credentials

After creating the app, you'll get:
- **Consumer Key**
- **Consumer Secret**

### For Sandbox Testing:
- **Shortcode**: 174379 (Test shortcode)
- **Passkey**: Get from the test credentials page

### For Production:
- Apply for Go-Live approval
- Get your business shortcode
- Get your production passkey

## Step 4: Configure Environment Variables

Create a `.env` file in the backend folder:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/wine-shop
PORT=5000

# M-Pesa Credentials (Sandbox)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
MPESA_ENV=sandbox

# For Production, change to:
# MPESA_ENV=production
# MPESA_SHORTCODE=your_business_shortcode
# MPESA_PASSKEY=your_production_passkey
```

## Step 5: Setup Callback URL

### For Local Development:
Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend server
npm start

# In another terminal, expose port 5000
ngrok http 5000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update:
```env
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
```

### For Production:
Use your actual domain:
```env
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

## Step 6: Test the Integration

### Sandbox Test Numbers:
- **Phone**: 254708374149 (or any 254 number)
- **PIN**: Any 4 digits (e.g., 1234)

### Testing Flow:
1. Start the backend server: `npm start`
2. Open wine.html in browser
3. Book an event and select M-Pesa payment
4. Enter test phone number: 254708374149
5. You'll see a prompt on your phone (in sandbox, it's simulated)
6. Enter PIN to complete payment

## Step 7: Go Live (Production)

1. Test thoroughly in sandbox
2. Apply for Go-Live on Daraja portal
3. Submit required documents:
   - Business registration
   - KRA PIN
   - ID/Passport
4. Wait for approval (usually 2-5 business days)
5. Get production credentials
6. Update .env with production values
7. Change MPESA_ENV to 'production'

## API Endpoints

### Initiate Payment
```
POST /api/mpesa/initiate
Body: {
  "phoneNumber": "254712345678",
  "amount": 3500,
  "accountReference": "BOOKING-123",
  "transactionDesc": "Wine Tasting Booking"
}
```

### Check Payment Status
```
GET /api/mpesa/status/:checkoutRequestId
```

### Callback (Automatic)
```
POST /api/mpesa/callback
```

## How It Works

1. **Customer initiates payment** → Frontend calls `/api/mpesa/initiate`
2. **Backend sends STK Push** → M-Pesa sends prompt to customer's phone
3. **Customer enters PIN** → M-Pesa processes payment
4. **M-Pesa sends callback** → Backend receives payment confirmation
5. **Status updated** → Booking/Order status changed to confirmed

## Troubleshooting

### Error: "Invalid Access Token"
- Check your Consumer Key and Secret
- Ensure they're correctly set in .env

### Error: "Bad Request - Invalid PhoneNumber"
- Phone must be in format 254XXXXXXXXX
- Remove spaces, dashes, or plus signs

### Callback not received
- Check your callback URL is accessible
- Use ngrok for local testing
- Check server logs for errors

### Payment stuck on "pending"
- Check M-Pesa callback logs
- Query payment status manually
- Customer may have cancelled

## Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Use HTTPS in production** - Required for callbacks
3. **Validate all inputs** - Phone numbers, amounts
4. **Store credentials securely** - Use environment variables
5. **Monitor transactions** - Check for suspicious activity

## Support

- Daraja Support: apisupport@safaricom.co.ke
- Documentation: https://developer.safaricom.co.ke/docs
- Community: https://developer.safaricom.co.ke/community
