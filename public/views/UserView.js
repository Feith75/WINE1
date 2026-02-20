// User View - handles user authentication display
class UserView {
    constructor() {
        this.accountModal = document.getElementById('accountModal');
        this.loginSection = document.getElementById('loginSection');
        this.registerSection = document.getElementById('registerSection');
        this.dashboardSection = document.getElementById('dashboardSection');
    }

    openAccountModal() {
        if (this.accountModal) {
            this.accountModal.style.display = 'block';
        }
    }

    closeAccountModal() {
        if (this.accountModal) {
            this.accountModal.style.display = 'none';
        }
    }

    showLoginSection() {
        if (this.loginSection) this.loginSection.style.display = 'block';
        if (this.registerSection) this.registerSection.style.display = 'none';
        if (this.dashboardSection) this.dashboardSection.style.display = 'none';
    }

    showRegisterSection() {
        if (this.loginSection) this.loginSection.style.display = 'none';
        if (this.registerSection) this.registerSection.style.display = 'block';
        if (this.dashboardSection) this.dashboardSection.style.display = 'none';
    }

    showDashboard(user) {
        if (this.loginSection) this.loginSection.style.display = 'none';
        if (this.registerSection) this.registerSection.style.display = 'none';
        if (this.dashboardSection) this.dashboardSection.style.display = 'block';

        document.getElementById('dashboardUserName').textContent = user.name;
        document.getElementById('dashboardUserEmail').textContent = user.email;
        document.getElementById('dashboardUserPhone').textContent = user.phone;
    }

    showMessage(message, isError = false) {
        alert(message);
    }
}
