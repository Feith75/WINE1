// Router - handles navigation
class Router {
    constructor(productController) {
        this.productController = productController;
        this.init();
    }

    init() {
        this.bindNavigation();
        this.handleInitialRoute();
    }

    bindNavigation() {
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigate(href.substring(1).toLowerCase());
                }
            });
        });
    }

    navigate(route) {
        const section = document.getElementById(route.toUpperCase());
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleInitialRoute() {
        const hash = window.location.hash;
        if (hash) {
            this.navigate(hash.substring(1));
        }
    }
}
