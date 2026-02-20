// User View - handles account UI
class UserView {
    constructor() {
        this.accountModal = document.getElementById('accountModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.accountDashboard = document.getElementById('accountDashboard');
        this.accountBtn = document.querySelector('.header-actions button:first-child');
    }

    showAccountModal() {
        this.accountModal.style.display = 'block';
    }

    hideAccountModal() {
        this.accountModal.style.display = 'none';
        this.loginForm?.reset();
        this.registerForm?.reset();
    }

    showLoginForm() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    showRegisterForm() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    showDashboard(user) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        
        document.getElementById('dashboardUserName').textContent = user.name;
        document.getElementById('dashboardUserEmail').textContent = user.email;
        document.getElementById('dashboardUserPhone').textContent = user.phone || 'Not provided';
    }

    updateAccountButton(isLoggedIn, userName) {
        if (isLoggedIn) {
            this.accountBtn.innerHTML = `👤 ${userName}`;
        } else {
            this.accountBtn.innerHTML = '👤 Account';
        }
    }

    getLoginData() {
        return {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };
    }

    getRegisterData() {
        return {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('registerConfirmPassword').value
        };
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        alert(message);
    }

    bindLoginSubmit(handler) {
        this.loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            handler(this.getLoginData());
        });
    }

    bindRegisterSubmit(handler) {
        this.registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            handler(this.getRegisterData());
        });
    }

    bindShowRegister(handler) {
        document.getElementById('showRegisterLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    }

    bindShowLogin(handler) {
        document.getElementById('showLoginLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    }

    bindLogout(handler) {
        document.getElementById('logoutBtn')?.addEventListener('click', handler);
    }

    bindCloseModal(handler) {
        const closeBtn = document.querySelector('#accountModal .close');
        closeBtn?.addEventListener('click', handler);
        
        this.accountModal?.addEventListener('click', (e) => {
            if (e.target === this.accountModal) {
                handler();
            }
        });
    }
}
