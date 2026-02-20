// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        BOOKINGS: '/bookings',
        ORDERS: '/orders',
        GIFT_CARDS: '/gift-cards',
        WINE_CLUB: '/wine-club',
        USERS_REGISTER: '/users/register',
        USERS_LOGIN: '/users/login'
    }
};

// API Helper Functions
const API = {
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    async get(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error' };
        }
    }
};
