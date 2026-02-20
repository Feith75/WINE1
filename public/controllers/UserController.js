// User Controller - handles user authentication logic
class UserController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Switch between login and register
        const showRegisterLink = document.getElementById('showRegisterLink');
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.view.showRegisterSection();
            });
        }

        const showLoginLink = document.getElementById('showLoginLink');
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.view.showLoginSection();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Close modal
        const accountModal = document.getElementById('accountModal');
        if (accountModal) {
            const closeBtn = accountModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.view.closeAccountModal();
                });
            }

            accountModal.addEventListener('click', (e) => {
                if (e.target === accountModal) {
                    this.view.closeAccountModal();
                }
            });
        }
    }

    checkLoginStatus() {
        const user = this.model.getCurrentUser();
        if (user) {
            this.view.showDashboard(user);
        } else {
            this.view.showLoginSection();
        }
    }

    openAccountModal() {
        this.checkLoginStatus();
        this.view.openAccountModal();
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = await this.model.login(email, password);

        if (result.success) {
            this.view.showDashboard(result.user);
            this.view.showMessage('Login successful!');
        } else {
            this.view.showMessage(result.message, true);
        }
    }

    async handleRegister() {
        const userData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('registerConfirmPassword').value
        };

        const result = await this.model.register(userData);

        if (result.success) {
            this.view.showDashboard(result.user);
            this.view.showMessage('Registration successful!');
        } else {
            this.view.showMessage(result.message, true);
        }
    }

    handleLogout() {
        this.model.logout();
        this.view.showLoginSection();
        this.view.showMessage('Logged out successfully');
    }
}
