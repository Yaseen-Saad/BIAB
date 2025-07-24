// Language switching functionality
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = new Map();
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLanguage);
        this.setupLanguageToggle();
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('handmade_language');
        } catch (error) {
            console.error('Error getting stored language:', error);
            return null;
        }
    }

    setStoredLanguage(lang) {
        try {
            localStorage.setItem('handmade_language', lang);
        } catch (error) {
            console.error('Error storing language:', error);
        }
    }

    setupLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        const langText = document.getElementById('lang-text');
        
        if (langToggle && langText) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
            
            // Update button text
            langText.textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
        }
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.switchLanguage(newLanguage);
    }

    switchLanguage(language) {
        if (language !== 'en' && language !== 'ar') {
            console.error('Unsupported language:', language);
            return;
        }

        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.applyLanguage(language);
        
        // Refresh dynamic content
        this.refreshDynamicContent();
    }

    applyLanguage(language) {
        const html = document.documentElement;
        const langText = document.getElementById('lang-text');
        
        // Set HTML attributes
        html.setAttribute('lang', language);
        html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        
        // Update language toggle button
        if (langText) {
            langText.textContent = language === 'en' ? 'العربية' : 'English';
        }
        
        // Update font family based on language
        this.updateFontFamily(language);
        
        // Update all text elements
        this.updateTextElements(language);
        
        // Update form placeholders
        this.updatePlaceholders(language);
    }

    updateFontFamily(language) {
        const elements = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea');
        
        elements.forEach(element => {
            if (language === 'ar') {
                if (element.matches('h1, h2, h3, h4, h5, h6')) {
                    element.style.fontFamily = 'var(--font-heading-ar)';
                } else {
                    element.style.fontFamily = 'var(--font-body-ar)';
                }
            } else {
                if (element.matches('h1, h2, h3, h4, h5, h6')) {
                    element.style.fontFamily = 'var(--font-heading-en)';
                } else {
                    element.style.fontFamily = 'var(--font-body-en)';
                }
            }
        });
    }

    updateTextElements(language) {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                element.textContent = text;
            }
        });
    }

    updatePlaceholders(language) {
        const inputs = document.querySelectorAll('input[data-en-placeholder][data-ar-placeholder], textarea[data-en-placeholder][data-ar-placeholder]');
        
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-${language}-placeholder`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    }

    async refreshDynamicContent() {
        try {
            // Refresh products if they're loaded
            const productsGrid = document.getElementById('featured-products');
            if (productsGrid && productsGrid.children.length > 0) {
                await loadFeaturedProducts();
            }

            // Refresh artisans if they're loaded
            const artisansGrid = document.getElementById('artisans-grid');
            if (artisansGrid && artisansGrid.children.length > 0) {
                await loadArtisans();
            }

            // Refresh blog if loaded
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid && blogGrid.children.length > 0) {
                await loadBlogPosts();
            }

            // Refresh collection points if loaded
            const collectionPoints = document.getElementById('collection-points');
            if (collectionPoints && collectionPoints.children.length > 0) {
                await loadCollectionPoints();
            }

            // Update cart if open
            const cartModal = document.getElementById('cart-modal');
            if (cartModal && cartModal.classList.contains('show')) {
                cart.renderCartItems();
            }

        } catch (error) {
            console.error('Error refreshing dynamic content:', error);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Helper method to get localized text from data
    getLocalizedText(data, field) {
        const lang = this.currentLanguage;
        return data[`${field}_${lang}`] || data[`${field}_en`] || data[field] || '';
    }

    // Helper method to format numbers based on language
    formatNumber(number) {
        const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
        return new Intl.NumberFormat(locale).format(number);
    }

    // Helper method to format currency based on language
    formatCurrency(amount, currency = 'EGP') {
        const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Helper method to format dates based on language
    formatDate(dateString) {
        const date = new Date(dateString);
        const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
        
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export functions for global use
function getCurrentLanguage() {
    return languageManager.getCurrentLanguage();
}

function getLocalizedText(data, field) {
    return languageManager.getLocalizedText(data, field);
}

function switchLanguage(language) {
    languageManager.switchLanguage(language);
}

// Update existing formatting functions to use language manager
window.formatNumber = (number) => languageManager.formatNumber(number);
window.formatCurrency = (amount, currency = 'EGP') => languageManager.formatCurrency(amount, currency);
window.formatDate = (dateString) => languageManager.formatDate(dateString);

// Export for global use
window.languageManager = languageManager;
window.getCurrentLanguage = getCurrentLanguage;
window.getLocalizedText = getLocalizedText;
window.switchLanguage = switchLanguage;

// Handle page load language setup
document.addEventListener('DOMContentLoaded', () => {
    // Apply initial language state
    languageManager.applyLanguage(languageManager.getCurrentLanguage());
});

// Handle dynamic content updates when language changes
document.addEventListener('languageChange', (event) => {
    const { language } = event.detail;
    languageManager.refreshDynamicContent();
});

// Custom event for language changes
function dispatchLanguageChange(language) {
    const event = new CustomEvent('languageChange', {
        detail: { language }
    });
    document.dispatchEvent(event);
}

// Override language manager's switchLanguage to dispatch event
const originalSwitchLanguage = languageManager.switchLanguage;
languageManager.switchLanguage = function(language) {
    originalSwitchLanguage.call(this, language);
    dispatchLanguageChange(language);
};