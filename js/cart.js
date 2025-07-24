// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        try {
            const cart = localStorage.getItem('handmade_cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('handmade_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        
        const isArabic = getCurrentLanguage() === 'ar';
        showMessage(
            isArabic ? 'تم إضافة المنتج إلى السلة' : 'Product added to cart',
            'success'
        );
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
            this.renderCartItems();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItemsContainer || !cartTotal) return;

        if (this.items.length === 0) {
            const isArabic = getCurrentLanguage() === 'ar';
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>${isArabic ? 'سلة التسوق فارغة' : 'Your cart is empty'}</p>
                </div>
            `;
            cartTotal.textContent = formatCurrency(0, 'EGP');
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price, 'EGP')}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="cart.removeItem('${item.id}')" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0,0 1,-2,2H7a2,2 0,0 1,-2,-2V6m3,0V4a2,2 0,0 1,2,-2h4a2,2 0,0 1,2,2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = formatCurrency(this.getTotal(), 'EGP');
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartItems();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart modal functions
function openCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        cart.renderCartItems();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Checkout functionality
async function proceedToCheckout() {
    if (cart.items.length === 0) {
        const isArabic = getCurrentLanguage() === 'ar';
        showMessage(
            isArabic ? 'سلة التسوق فارغة' : 'Your cart is empty',
            'error'
        );
        return;
    }

    closeCart();
    showCheckoutForm();
}

function showCheckoutForm() {
    const isArabic = getCurrentLanguage() === 'ar';
    const modal = document.getElementById('product-modal');
    
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-en="Checkout" data-ar="إتمام الطلب">${isArabic ? 'إتمام الطلب' : 'Checkout'}</h3>
                <button class="close-modal" onclick="closeProductModal()">&times;</button>
            </div>
            <div class="checkout-form">
                <div class="checkout-steps">
                    <div class="step active">
                        <span data-en="1. Shipping" data-ar="1. الشحن">${isArabic ? '1. الشحن' : '1. Shipping'}</span>
                    </div>
                    <div class="step">
                        <span data-en="2. Payment" data-ar="2. الدفع">${isArabic ? '2. الدفع' : '2. Payment'}</span>
                    </div>
                    <div class="step">
                        <span data-en="3. Review" data-ar="3. المراجعة">${isArabic ? '3. المراجعة' : '3. Review'}</span>
                    </div>
                </div>

                <form id="checkout-form-step1" class="checkout-section">
                    <h3 data-en="Shipping Information" data-ar="معلومات الشحن">${isArabic ? 'معلومات الشحن' : 'Shipping Information'}</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" id="checkout-name" placeholder="${isArabic ? 'الاسم الكامل' : 'Full Name'}" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="checkout-email" placeholder="${isArabic ? 'البريد الإلكتروني' : 'Email Address'}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <input type="tel" id="checkout-phone" placeholder="${isArabic ? 'رقم الهاتف' : 'Phone Number'}" required>
                        </div>
                        <div class="form-group">
                            <input type="text" id="checkout-city" placeholder="${isArabic ? 'المدينة' : 'City'}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <textarea id="checkout-address" placeholder="${isArabic ? 'العنوان الكامل' : 'Full Address'}" rows="3" required></textarea>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="proceedToPayment()">
                        ${isArabic ? 'متابعة للدفع' : 'Continue to Payment'}
                    </button>
                </form>

                <div class="order-summary">
                    <h3 data-en="Order Summary" data-ar="ملخص الطلب">${isArabic ? 'ملخص الطلب' : 'Order Summary'}</h3>
                    ${cart.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>${formatCurrency(item.price * item.quantity, 'EGP')}</span>
                        </div>
                    `).join('')}
                    <div class="order-item">
                        <strong data-en="Total" data-ar="المجموع">${isArabic ? 'المجموع' : 'Total'}</strong>
                        <strong>${formatCurrency(cart.getTotal(), 'EGP')}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function proceedToPayment() {
    // Validate shipping form
    const form = document.getElementById('checkout-form-step1');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const isArabic = getCurrentLanguage() === 'ar';
    const modal = document.getElementById('product-modal');
    
    // Update steps
    const steps = modal.querySelectorAll('.step');
    steps[0].classList.add('completed');
    steps[0].classList.remove('active');
    steps[1].classList.add('active');

    // Show payment form
    const checkoutSection = modal.querySelector('.checkout-section');
    checkoutSection.innerHTML = `
        <h3 data-en="Payment Information" data-ar="معلومات الدفع">${isArabic ? 'معلومات الدفع' : 'Payment Information'}</h3>
        <div class="payment-methods">
            <label class="payment-method">
                <input type="radio" name="payment-method" value="stripe" checked>
                <span>${isArabic ? 'بطاقة ائتمان (Stripe)' : 'Credit Card (Stripe)'}</span>
            </label>
            <label class="payment-method">
                <input type="radio" name="payment-method" value="fawry">
                <span>${isArabic ? 'فوري (Fawry)' : 'Fawry Payment'}</span>
            </label>
        </div>
        
        <div id="stripe-payment" class="payment-form">
            <div class="form-row">
                <div class="form-group">
                    <input type="text" id="card-number" placeholder="${isArabic ? 'رقم البطاقة' : 'Card Number'}" required>
                </div>
                <div class="form-group">
                    <input type="text" id="card-expiry" placeholder="${isArabic ? 'MM/YY' : 'MM/YY'}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" id="card-cvc" placeholder="${isArabic ? 'CVC' : 'CVC'}" required>
                </div>
                <div class="form-group">
                    <input type="text" id="card-name" placeholder="${isArabic ? 'اسم حامل البطاقة' : 'Cardholder Name'}" required>
                </div>
            </div>
        </div>
        
        <div id="fawry-payment" class="payment-form" style="display: none;">
            <p>${isArabic ? 'سيتم توجيهك لإتمام الدفع عبر فوري' : 'You will be redirected to complete payment via Fawry'}</p>
        </div>
        
        <div class="checkout-actions">
            <button type="button" class="btn btn-outline" onclick="backToShipping()">
                ${isArabic ? 'العودة' : 'Back'}
            </button>
            <button type="button" class="btn btn-primary" onclick="reviewOrder()">
                ${isArabic ? 'مراجعة الطلب' : 'Review Order'}
            </button>
        </div>
    `;

    // Add payment method switching
    const paymentMethods = modal.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            const stripeForm = modal.querySelector('#stripe-payment');
            const fawryForm = modal.querySelector('#fawry-payment');
            
            if (e.target.value === 'stripe') {
                stripeForm.style.display = 'block';
                fawryForm.style.display = 'none';
            } else {
                stripeForm.style.display = 'none';
                fawryForm.style.display = 'block';
            }
        });
    });
}

function backToShipping() {
    showCheckoutForm();
}

function reviewOrder() {
    const isArabic = getCurrentLanguage() === 'ar';
    const modal = document.getElementById('product-modal');
    
    // Update steps
    const steps = modal.querySelectorAll('.step');
    steps[1].classList.add('completed');
    steps[1].classList.remove('active');
    steps[2].classList.add('active');

    // Collect form data
    const shippingData = {
        name: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        phone: document.getElementById('checkout-phone').value,
        city: document.getElementById('checkout-city').value,
        address: document.getElementById('checkout-address').value
    };

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // Show order review
    const checkoutSection = modal.querySelector('.checkout-section');
    checkoutSection.innerHTML = `
        <h3 data-en="Review Your Order" data-ar="مراجعة طلبك">${isArabic ? 'مراجعة طلبك' : 'Review Your Order'}</h3>
        
        <div class="review-section">
            <h4 data-en="Shipping Address" data-ar="عنوان الشحن">${isArabic ? 'عنوان الشحن' : 'Shipping Address'}</h4>
            <p><strong>${shippingData.name}</strong></p>
            <p>${shippingData.email}</p>
            <p>${shippingData.phone}</p>
            <p>${shippingData.address}, ${shippingData.city}</p>
        </div>
        
        <div class="review-section">
            <h4 data-en="Payment Method" data-ar="طريقة الدفع">${isArabic ? 'طريقة الدفع' : 'Payment Method'}</h4>
            <p>${paymentMethod === 'stripe' ? (isArabic ? 'بطاقة ائتمان' : 'Credit Card') : 'Fawry'}</p>
        </div>
        
        <div class="checkout-actions">
            <button type="button" class="btn btn-outline" onclick="proceedToPayment()">
                ${isArabic ? 'العودة للدفع' : 'Back to Payment'}
            </button>
            <button type="button" class="btn btn-primary" onclick="submitOrder()">
                ${isArabic ? 'تأكيد الطلب' : 'Place Order'}
            </button>
        </div>
    `;
}

async function submitOrder() {
    try {
        showLoading();

        // Collect all form data
        const orderData = {
            items: cart.items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            customer_info: {
                name: document.getElementById('checkout-name').value,
                email: document.getElementById('checkout-email').value,
                phone: document.getElementById('checkout-phone').value,
                shippingAddress: {
                    address: document.getElementById('checkout-address').value,
                    city: document.getElementById('checkout-city').value
                }
            },
            total_amount: cart.getTotal(),
            payment_method: document.querySelector('input[name="payment-method"]:checked').value
        };

        const result = await apiEndpoints.submitOrder(orderData);

        hideLoading();
        closeProductModal();
        
        const isArabic = getCurrentLanguage() === 'ar';
        showMessage(
            isArabic ? 'تم تأكيد طلبك بنجاح!' : 'Your order has been placed successfully!',
            'success'
        );

        // Clear cart
        cart.clear();

        // Scroll to top
        window.scrollTo(0, 0);

    } catch (error) {
        hideLoading();
        handleError(error, 'submitOrder');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cart icon click
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }

    // Close modal on outside click
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
});

// Export cart for global use
window.cart = cart;
window.openCart = openCart;
window.closeCart = closeCart;
window.proceedToCheckout = proceedToCheckout;