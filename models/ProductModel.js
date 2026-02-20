// Product Model - handles data and business logic
class ProductModel {
    constructor() {
        this.products = [
            { id: 1, name: "Château Margaux 2015", category: "red", price: 299.99, description: "Full-bodied Bordeaux with notes of blackcurrant and oak", image: "jacob-le-1BuJoMJ6ZBk-unsplash.jpg" },
            { id: 2, name: "Domaine de la Romanée-Conti", category: "red", price: 450.00, description: "Legendary Burgundy Pinot Noir, elegant and complex", image: "ankita-gupta-vk-KlS1wYMY-unsplash.jpg" },
            { id: 3, name: "Cloudy Bay Sauvignon Blanc", category: "white", price: 45.99, description: "Crisp New Zealand white with tropical fruit flavors", image: "melanie-lim-0oPK0sG3CQU-unsplash.jpg" },
            { id: 4, name: "Chablis Grand Cru", category: "white", price: 89.99, description: "Mineral-driven Chardonnay from France's finest terroir", image: "nathan-andress-XCdC4ph1P9g-unsplash.jpg" },
            { id: 5, name: "Whispering Angel Rosé", category: "rose", price: 32.99, description: "Provence rosé with delicate strawberry and citrus notes", image: "stefan-johnson-xIFbDeGcy44-unsplash.jpg" },
            { id: 6, name: "Miraval Rosé", category: "rose", price: 28.99, description: "Elegant rosé from the heart of Provence", image: "t-ed-hOgog7l-iuY-unsplash.jpg" },
            { id: 7, name: "Dom Pérignon Vintage", category: "sparkling", price: 199.99, description: "Iconic champagne with refined bubbles and complexity", image: "valentin-lacoste-4eyAy57ObtQ-unsplash.jpg" },
            { id: 8, name: "Veuve Clicquot Brut", category: "sparkling", price: 65.99, description: "Classic champagne perfect for celebrations", image: "vlad-zaytsev-sO26ESssFdE-unsplash.jpg" },
            { id: 9, name: "Barolo Riserva DOCG", category: "red", price: 125.00, description: "Powerful Italian red with truffle and rose petal aromas", image: "jacob-le-1BuJoMJ6ZBk-unsplash.jpg" },
            { id: 10, name: "Riesling Spätlese", category: "white", price: 38.99, description: "German sweet wine with perfect acidity balance", image: "melanie-lim-0oPK0sG3CQU-unsplash.jpg" },
            { id: 11, name: "Prosecco Superiore", category: "sparkling", price: 24.99, description: "Italian sparkling wine, light and refreshing", image: "valentin-lacoste-4eyAy57ObtQ-unsplash.jpg" },
            { id: 12, name: "Côtes de Provence Rosé", category: "rose", price: 22.99, description: "Fresh and fruity rosé perfect for summer", image: "stefan-johnson-xIFbDeGcy44-unsplash.jpg" }
        ];
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    filterByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    }

    filterByPrice(priceRange) {
        if (priceRange === 'all') return this.products;
        
        if (priceRange === '0-50') {
            return this.products.filter(p => p.price <= 50);
        } else if (priceRange === '50-100') {
            return this.products.filter(p => p.price > 50 && p.price <= 100);
        } else if (priceRange === '100+') {
            return this.products.filter(p => p.price > 100);
        }
        return this.products;
    }

    searchProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
    }

    getCategoryName(category) {
        const names = {
            'red': '🍷 Red Wine',
            'white': '🥂 White Wine',
            'rose': '🌸 Rosé Wine',
            'sparkling': '🍾 Sparkling Wine'
        };
        return names[category] || category;
    }
}
