const axios = require('axios');

class MpesaService {
    constructor() {
        // M-Pesa Daraja API Credentials
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.shortCode = process.env.MPESA_SHORTCODE;
        this.passkey = process.env.MPESA_PASSKEY;
        this.callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback';
        
        // Use sandbox or production
        this.baseUrl = process.env.MPESA_ENV === 'production' 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';
    }

    // Get OAuth token
    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting M-Pesa token:', error.message);
            throw error;
        }
    }

    // Generate password for STK Push
    generatePassword() {
        const timestamp = this.getTimestamp();
        const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');
        return { password, timestamp };
    }

    // Get timestamp in format YYYYMMDDHHmmss
    getTimestamp() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hour}${minute}${second}`;
    }

    // Format phone number to 254XXXXXXXXX
    formatPhoneNumber(phone) {
        // Remove spaces, dashes, and plus signs
        phone = phone.replace(/[\s\-\+]/g, '');
        
        // If starts with 0, replace with 254
        if (phone.startsWith('0')) {
            phone = '254' + phone.substring(1);
        }
        
        // If doesn't start with 254, add it
        if (!phone.startsWith('254')) {
            phone = '254' + phone;
        }
        
        return phone;
    }

    // Initiate STK Push (Lipa Na M-Pesa)
    async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            const accessToken = await this.getAccessToken();
            const { password, timestamp } = this.generatePassword();
            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            const requestData = {
                BusinessShortCode: this.shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount), // Must be integer
                PartyA: formattedPhone,
                PartyB: this.shortCode,
                PhoneNumber: formattedPhone,
                CallBackURL: this.callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc
            };

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                data: response.data,
                message: 'STK Push sent successfully. Please check your phone.'
            };
        } catch (error) {
            console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.errorMessage || 'Payment initiation failed',
                error: error.response?.data
            };
        }
    }

    // Query STK Push status
    async querySTKPushStatus(checkoutRequestId) {
        try {
            const accessToken = await this.getAccessToken();
            const { password, timestamp } = this.generatePassword();

            const requestData = {
                BusinessShortCode: this.shortCode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestId
            };

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('M-Pesa Query Error:', error.response?.data || error.message);
            return {
                success: false,
                message: 'Query failed',
                error: error.response?.data
            };
        }
    }
}

module.exports = new MpesaService();
