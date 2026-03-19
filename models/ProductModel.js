// Product Model - manages product data
class ProductModel {
    constructor() {
        this.products = [
            // Red Wines
            {
                id: 1,
                name: 'Cabernet Sauvignon Reserve',
                category: 'red',
                price: 8500,
                image: 'assets/vlad-zaytsev-sO26ESssFdE-unsplash.jpg',
                description: 'Full-bodied with rich dark fruit flavors'
            },
            {
                id: 2,
                name: 'Merlot Classic',
                category: 'red',
                price: 6500,
                image: 'assets/stefan-johnson-xIFbDeGcy44-unsplash.jpg',
                description: 'Smooth and velvety with plum notes'
            },
            {
                id: 3,
                name: 'Pinot Noir Estate',
                category: 'red',
                price: 9500,
                image: 'assets/t-ed-hOgog7l-iuY-unsplash.jpg',
                description: 'Elegant with cherry and earthy undertones'
            },
            // White Wines
            {
                id: 4,
                name: 'Chardonnay Reserve',
                category: 'white',
                price: 7500,
                image: 'assets/valentin-lacoste-4eyAy57ObtQ-unsplash.jpg',
                description: 'Buttery with hints of vanilla and oak'
            },
            {
                id: 5,
                name: 'Sauvignon Blanc',
                category: 'white',
                price: 5500,
                image: 'assets/nathan-andress-XCdC4ph1P9g-unsplash.jpg',
                description: 'Crisp and refreshing with citrus notes'
            },
            {
                id: 6,
                name: 'Riesling',
                category: 'white',
                price: 6000,
                image: 'assets/melanie-lim-0oPK0sG3CQU-unsplash.jpg',
                description: 'Sweet and aromatic with floral hints'
            },
            // Rosé Wines
            {
                id: 7,
                name: 'Provence Rosé',
                category: 'rose',
                price: 7000,
                image: 'assets/jacob-le-1BuJoMJ6ZBk-unsplash.jpg',
                description: 'Light and fruity with strawberry notes'
            },
            {
                id: 8,
                name: 'Rosé d\'Anjou',
                category: 'rose',
                price: 5800,
                image: 'assets/ankita-gupta-vk-KlS1wYMY-unsplash.jpg',
                description: 'Delicate and refreshing summer wine'
            },
            // Sparkling Wines
            {
                id: 9,
                name: 'Champagne Brut',
                category: 'sparkling',
                price: 12000,
                image: 'assets/vlad-zaytsev-sO26ESssFdE-unsplash.jpg',
                description: 'Elegant bubbles with toasted brioche'
            },
            {
                id: 10,
                name: 'Prosecco',
                category: 'sparkling',
                price: 4500,
                image: 'assets/stefan-johnson-xIFbDeGcy44-unsplash.jpg',
                description: 'Light and fruity Italian sparkler'
            },
            {
                id: 11,
                name: 'Cava Reserva',
                category: 'sparkling',
                price: 6800,
                image: 'assets/t-ed-hOgog7l-iuY-unsplash.jpg',
                description: 'Spanish sparkler with fine bubbles'
            },
            {
                id: 12,
                name: 'Moscato d\'Asti',
                category: 'sparkling',
                price: 5200,
                image: 'assets/valentin-lacoste-4eyAy57ObtQ-unsplash.jpg',
                description: 'Sweet and lightly sparkling dessert wine'
            }
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
        
        const ranges = {
            '0-50': [0, 5000],
            '50-100': [5000, 10000],
            '100+': [10000, Infinity]
        };
        
        const [min, max] = ranges[priceRange] || [0, Infinity];
        return this.products.filter(p => p.price >= min && p.price < max);
    }

    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }
}
