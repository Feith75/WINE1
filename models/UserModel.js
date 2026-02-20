// User Model - handles user authentication and data
class UserModel {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.users = this.loadUsers();
    }

    loadCurrentUser() {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    }

    loadUsers() {
        const saved = localStorage.getItem('wineUsers');
        return saved ? JSON.parse(saved) : [];
    }

    saveUsers() {
        localStorage.setItem('wineUsers', JSON.stringify(this.users));
    }

    saveCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    register(userData) {
        // Check if email already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login after registration
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        this.saveCurrentUser(userWithoutPassword);

        return { success: true, user: userWithoutPassword };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        this.saveCurrentUser(userWithoutPassword);

        return { success: true, user: userWithoutPassword };
    }

    logout() {
        this.saveCurrentUser(null);
        return { success: true };
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateProfile(userData) {
        if (!this.currentUser) {
            return { success: false, message: 'Not logged in' };
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            name: userData.name,
            phone: userData.phone
        };

        this.saveUsers();
        
        const updatedUser = { ...this.users[userIndex] };
        delete updatedUser.password;
        this.saveCurrentUser(updatedUser);

        return { success: true, user: updatedUser };
    }
}
