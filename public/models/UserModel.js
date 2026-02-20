// User Model - manages user authentication and data
class UserModel {
    constructor() {
        this.currentUser = this.loadUser();
    }

    loadUser() {
        const saved = localStorage.getItem('wineUser');
        return saved ? JSON.parse(saved) : null;
    }

    saveUser(user) {
        localStorage.setItem('wineUser', JSON.stringify(user));
        this.currentUser = user;
    }

    clearUser() {
        localStorage.removeItem('wineUser');
        this.currentUser = null;
    }

    async register(userData) {
        // Validate password
        if (userData.password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        if (userData.password !== userData.confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        // Check if user already exists
        const users = this.getAllUsers();
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage (in production, this would be an API call)
        users.push({ ...newUser, password: userData.password });
        localStorage.setItem('wineUsers', JSON.stringify(users));

        // Save current user (without password)
        this.saveUser(newUser);

        // Also send to backend
        try {
            await API.post(API_CONFIG.ENDPOINTS.USERS_REGISTER, {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password
            });
        } catch (error) {
            console.error('Backend registration error:', error);
        }

        return { success: true, user: newUser };
    }

    async login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Save current user (without password)
        const { password: _, ...userWithoutPassword } = user;
        this.saveUser(userWithoutPassword);

        // Also send to backend
        try {
            await API.post(API_CONFIG.ENDPOINTS.USERS_LOGIN, { email, password });
        } catch (error) {
            console.error('Backend login error:', error);
        }

        return { success: true, user: userWithoutPassword };
    }

    logout() {
        this.clearUser();
        return { success: true };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getAllUsers() {
        const saved = localStorage.getItem('wineUsers');
        return saved ? JSON.parse(saved) : [];
    }
}
