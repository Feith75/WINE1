require('dotenv').config(); // Load .env variables
const axios = require('axios');

class MpesaService {
    constructor() {
        // Load from environment variables
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.shortCode = process.env.MPESA_SHORTCODE;
        this.passkey = process.env.MPESA_PASSKEY;
        this.callbackUrl = process.env.MPESA_CALLBACK_URL;

        // Environment switch
        this.baseUrl = process.env.MPESA_ENV === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }

    async getAccessToken() {
        const auth = Buffer.from(
            `${this.consumerKey}:${this.consumerSecret}`
        ).toString('base64');

        const response = await axios.get(
            `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );

        return response.data.access_token;
    }

    generatePassword() {
        const timestamp = this.getTimestamp();
        const password = Buffer.from(
            `${this.shortCode}${this.passkey}${timestamp}`
        ).toString('base64');

        return { password, timestamp };
    }

    getTimestamp() {
        const date = new Date();

        return date.getFullYear().toString() +
            String(date.getMonth() + 1).padStart(2, '0') +
            String(date.getDate()).padStart(2, '0') +
            String(date.getHours()).padStart(2, '0') +
            String(date.getMinutes()).padStart(2, '0') +
            String(date.getSeconds()).padStart(2, '0');
    }

    formatPhoneNumber(phone) {
        phone = phone.replace(/[\s\-\+]/g, '');

        if (phone.startsWith('0')) {
            phone = '254' + phone.substring(1);
        }

        if (!phone.startsWith('254')) {
            phone = '254' + phone;
        }

        return phone;
    }

    async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            const accessToken = await this.getAccessToken();
            const { password, timestamp } = this.generatePassword();
            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                {
                    BusinessShortCode: this.shortCode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: Math.round(amount),
                    PartyA: formattedPhone,
                    PartyB: this.shortCode,
                    PhoneNumber: formattedPhone,
                    CallBackURL: this.callbackUrl,
                    AccountReference: accountReference,
                    TransactionDesc: transactionDesc
                },
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
            return {
                success: false,
                message: error.response?.data?.errorMessage || 'Payment failed'
            };
        }
    }
}

module.exports = new MpesaService();