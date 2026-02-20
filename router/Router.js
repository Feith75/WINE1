// Router - handles navigation and URL routing
class Router {
    constructor(productController) {
        this.productController = productController;
        this.routes = {
            '/': () => this.handleHome(),
            '/shop': () => this.handleShop(),
            '/category/:category': (category) => this.handleCategory(category),
            '/about': () => this.handleAbout()
        };
        
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        
        // Handle smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = e.target.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.parseRoute(hash);
        
        if (route.handler) {
            route.handler(route.params);
        }
    }

    parseRoute(path) {
        // Simple route matching
        if (path === '/' || path === '' || path === 'HOME') {
            return { handler: this.routes['/'] };
        }
        
        if (path === 'SHOP' || path === 'shop') {
            return { handler: this.routes['/shop'] };
        }
        
        if (path === 'ABOUT' || path === 'about') {
            return { handler: this.routes['/about'] };
        }
        
        // Category routes
        if (path.startsWith('category/')) {
            const category = path.split('/')[1];
            return { 
                handler: this.routes['/category/:category'],
                params: category
            };
        }
        
        return { handler: this.routes['/'] };
    }

    handleHome() {
        document.getElementById('HOME')?.scrollIntoView({ behavior: 'smooth' });
    }

    handleShop() {
        this.productController.showAllProducts();
        document.getElementById('SHOP')?.scrollIntoView({ behavior: 'smooth' });
    }

    handleCategory(category) {
        this.productController.filterByCategory(category);
        document.getElementById('SHOP')?.scrollIntoView({ behavior: 'smooth' });
    }

    handleAbout() {
        document.getElementById('ABOUT')?.scrollIntoView({ behavior: 'smooth' });
    }

    navigate(path) {
        window.location.hash = path;
    }
}
