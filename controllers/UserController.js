// User Controller - manages user authentication
class UserController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.bindLoginSubmit(this.handleLogin.bind(this));
        this.view.bindRegisterSubmit(this.handleRegister.bind(this));
        this.view.bindShowRegister(this.showRegister.bind(this));
        this.view.bindShowLogin(this.showLogin.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));
        this.view.bindCloseModal(this.closeModal.bind(this));
        
        this.updateUI();
    }

    openAccountModal() {
        if (this.model.isLoggedIn()) {
            this.view.showDashboard(this.model.getCurrentUser());
        } else {
            this.view.showLoginForm();
        }
        this.view.showAccountModal();
    }

    closeModal() {
        this.view.hideAccountModal();
    }

    showLogin() {
        this.view.showLoginForm();
    }

    showRegister() {
        this.view.showRegisterForm();
    }

    handleLogin(credentials) {
        if (!credentials.email || !credentials.password) {
            this.view.showError('Please fill in all fields');
            return;
        }

        const result = this.model.login(credentials.email, credentials.password);
        
        if (result.success) {
            this.view.showSuccess('Login successful!');
            this.updateUI();
            this.view.hideAccountModal();
        } else {
            this.view.showError(result.message);
        }
    }

    handleRegister(userData) {
        // Validation
        if (!userData.name || !userData.email || !userData.phone || !userData.password || !userData.confirmPassword) {
            this.view.showError('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            this.view.showError('Please enter a valid email address');
            return;
        }

        if (userData.password.length < 6) {
            this.view.showError('Password must be at least 6 characters');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            this.view.showError('Passwords do not match');
            return;
        }

        const result = this.model.register(userData);
        
        if (result.success) {
            this.view.showSuccess('Registration successful! Welcome to Wine World!');
            this.updateUI();
            this.view.hideAccountModal();
        } else {
            this.view.showError(result.message);
        }
    }

    handleLogout() {
        this.model.logout();
        this.view.showSuccess('Logged out successfully');
        this.updateUI();
        this.view.hideAccountModal();
    }

    updateUI() {
        const isLoggedIn = this.model.isLoggedIn();
        const user = this.model.getCurrentUser();
        
        if (isLoggedIn && user) {
            this.view.updateAccountButton(true, user.name);
        } else {
            this.view.updateAccountButton(false, '');
        }
    }

    isLoggedIn() {
        return this.model.isLoggedIn();
    }

    getCurrentUser() {
        return this.model.getCurrentUser();
    }
}
