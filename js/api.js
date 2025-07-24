// API configuration and utilities
class API {
    constructor() {
        // For static frontend, we'll use mock data directly
        this.baseURL = '';
        this.useStaticData = true;
    }

    async request(endpoint, options = {}) {
        // For static frontend, always use mock data
        if (this.useStaticData && window.mockData) {
            return this.getMockDataForEndpoint(endpoint);
        }

        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed, falling back to mock data:', error);
            // Fallback to mock data if API fails
            if (window.mockData) {
                return this.getMockDataForEndpoint(endpoint);
            }
            throw error;
        }
    }

    getMockDataForEndpoint(endpoint) {
        // Return mock data based on endpoint
        const endpointMap = {
            '/impact-metrics': window.mockData.impactMetrics,
            '/products': window.mockData.products,
            '/products/featured': window.mockData.products.slice(0, 6),
            '/artisans': window.mockData.artisans,
            '/blog-posts': window.mockData.blogPosts,
            '/collection-points': window.mockData.collectionPoints
        };

        return Promise.resolve(endpointMap[endpoint] || []);
    }

    // GET requests
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST requests
    async post(endpoint, data) {
        // For static frontend, simulate successful form submissions
        if (this.useStaticData) {
            console.log('Form submitted (static mode):', endpoint, data);
            
            // Simulate different responses based on endpoint
            if (endpoint.includes('/contact')) {
                return Promise.resolve({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
            } else if (endpoint.includes('/donate')) {
                return Promise.resolve({ success: true, message: 'Thank you for your generous donation!' });
            } else if (endpoint.includes('/volunteer')) {
                return Promise.resolve({ success: true, message: 'Thank you for volunteering! We will contact you soon.' });
            } else if (endpoint.includes('/join-artisan')) {
                return Promise.resolve({ success: true, message: 'شكرًا لك! تم استلام طلبك وسنتواصل معك قريباً لبدء رحلتك معنا.' });
            } else if (endpoint.includes('/newsletter')) {
                return Promise.resolve({ success: true, message: 'Successfully subscribed to our newsletter!' });
            }
            
            return Promise.resolve({ success: true, message: 'Form submitted successfully!' });
        }

        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT requests
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE requests
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Create global API instance
const api = new API();

// API endpoint functions
const apiEndpoints = {
    // Products
    getProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`),
    getFeaturedProducts: () => api.get('/products/featured'),

    // Artisans
    getArtisans: () => api.get('/artisans'),
    getArtisan: (id) => api.get(`/artisans/${id}`),

    // Impact metrics
    getImpactMetrics: () => api.get('/impact-metrics'),

    // Blog posts
    getBlogPosts: () => api.get('/blog-posts'),
    getBlogPost: (id) => api.get(`/blog-posts/${id}`),

    // Collection points
    getCollectionPoints: () => api.get('/collection-points'),

    // Form submissions
    submitContact: (data) => api.post('/contact', data),
    submitTextileDonation: (data) => api.post('/textile-donation', data),
    submitVolunteer: (data) => api.post('/volunteer', data),
    submitJoinArtisan: (data) => api.post('/join-artisan', data),
    submitDonation: (data) => api.post('/donate', data),
    submitOrder: (data) => api.post('/checkout', data),
    subscribeNewsletter: (email) => api.post('/newsletter', { email })
};

// Data loading utilities
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
    }

    async loadWithCache(key, loader, ttl = 300000) { // 5 minutes default TTL
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && (now - cached.timestamp) < ttl) {
            return cached.data;
        }

        if (this.loadingStates.get(key)) {
            return this.loadingStates.get(key);
        }

        const promise = loader();
        this.loadingStates.set(key, promise);

        try {
            const data = await promise;
            this.cache.set(key, { data, timestamp: now });
            this.loadingStates.delete(key);
            return data;
        } catch (error) {
            this.loadingStates.delete(key);
            throw error;
        }
    }

    clearCache(key) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

const dataLoader = new DataLoader();

// Loading state management
function showLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Error handling
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    showMessage(
        getCurrentLanguage() === 'ar' 
            ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' 
            : 'An error occurred. Please try again.',
        'error'
    );
}

// Success message helper
function showSuccessMessage(messageEn, messageAr) {
    const message = getCurrentLanguage() === 'ar' ? messageAr : messageEn;
    showMessage(message, 'success');
}

// Generic message display
function showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;

    container.appendChild(messageEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 5000);

    // Manual close on click
    messageEl.addEventListener('click', () => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    });
}

// Utility functions for data formatting
function formatCurrency(amount, currency = 'EGP') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const isArabic = getCurrentLanguage() === 'ar';
    
    return date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Image loading with fallback
function loadImageWithFallback(img, src, fallback = 'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop') {
    img.onerror = () => {
        img.src = fallback;
        img.onerror = null; // Prevent infinite loop
    };
    img.src = src;
}

// Debounce utility for search/filter functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Network status detection
function isOnline() {
    return navigator.onLine;
}

window.addEventListener('online', () => {
    showMessage(
        getCurrentLanguage() === 'ar' 
            ? 'تم استعادة الاتصال بالإنترنت'
            : 'Internet connection restored',
        'success'
    );
});

window.addEventListener('offline', () => {
    showMessage(
        getCurrentLanguage() === 'ar' 
            ? 'لا يوجد اتصال بالإنترنت'
            : 'No internet connection',
        'warning'
    );
});

// Export for use in other modules
window.api = api;
window.apiEndpoints = apiEndpoints;
window.dataLoader = dataLoader;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.handleError = handleError;
window.showSuccessMessage = showSuccessMessage;
window.showMessage = showMessage;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.loadImageWithFallback = loadImageWithFallback;
window.debounce = debounce;
window.throttle = throttle;