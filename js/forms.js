// Form handling and validation
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormSubmissions();
        this.setupFormValidation();
        this.setupTabSwitching();
    }

    setupFormSubmissions() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Donation form
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', this.handleDonationForm.bind(this));
        }

        // Textile donation form
        const textileForm = document.getElementById('textile-donation-form');
        if (textileForm) {
            textileForm.addEventListener('submit', this.handleTextileDonationForm.bind(this));
        }

        // Volunteer form
        const volunteerForm = document.getElementById('volunteer-form');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', this.handleVolunteerForm.bind(this));
        }

        // Join Artisan form
        const joinArtisanForm = document.getElementById('join-artisan-form');
        if (joinArtisanForm) {
            joinArtisanForm.addEventListener('submit', this.handleJoinArtisanForm.bind(this));
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
        }

        // Setup amount buttons
        this.setupAmountButtons();
    }

    setupFormValidation() {
        // Real-time validation for email fields
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', this.validateEmail.bind(this));
        });

        // Real-time validation for phone fields
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', this.formatPhoneNumber.bind(this));
        });

        // Custom amount validation
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', this.validateAmount.bind(this));
        }
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    setupAmountButtons() {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmount = document.getElementById('custom-amount');

        amountButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                amountButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set the amount value
                const amount = button.getAttribute('data-amount');
                if (customAmount) {
                    customAmount.value = amount;
                }
            });
        });

        if (customAmount) {
            customAmount.addEventListener('input', () => {
                // Remove active class from preset buttons when custom amount is entered
                amountButtons.forEach(btn => btn.classList.remove('active'));
            });
        }
    }

    switchTab(tabId) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and button
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(`${tabId}-tab`);

        if (selectedButton) selectedButton.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
    }

    async handleContactForm(e) {
        e.preventDefault();
        
        try {
            showLoading();

            const formData = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                message: document.getElementById('contact-message').value.trim()
            };

            if (!this.validateContactForm(formData)) {
                hideLoading();
                return;
            }

            await apiEndpoints.submitContact(formData);
            
            hideLoading();
            this.resetForm('contact-form');
            
            showSuccessMessage(
                'Thank you for your message! We will get back to you soon.',
                'شكرًا لرسالتك! سنتواصل معك قريبًا.'
            );

        } catch (error) {
            hideLoading();
            handleError(error, 'contact form submission');
        }
    }

    async handleDonationForm(e) {
        e.preventDefault();
        
        try {
            showLoading();

            const customAmount = document.getElementById('custom-amount').value;
            const selectedAmount = document.querySelector('.amount-btn.active')?.getAttribute('data-amount');
            const amount = parseFloat(customAmount || selectedAmount);

            if (!amount || amount <= 0) {
                hideLoading();
                const isArabic = getCurrentLanguage() === 'ar';
                showMessage(
                    isArabic ? 'يرجى اختيار مبلغ صحيح للتبرع' : 'Please select a valid donation amount',
                    'error'
                );
                return;
            }

            const formData = {
                amount: amount,
                donor_name: document.getElementById('donor-name').value.trim(),
                email: document.getElementById('donor-email').value.trim(),
                type: document.querySelector('input[name="donation-type"]:checked').value
            };

            if (!this.validateDonationForm(formData)) {
                hideLoading();
                return;
            }

            await apiEndpoints.submitDonation(formData);
            
            hideLoading();
            this.resetForm('donation-form');
            
            showSuccessMessage(
                'Thank you for your generous donation!',
                'شكرًا لك على تبرعك الكريم!'
            );

        } catch (error) {
            hideLoading();
            handleError(error, 'donation form submission');
        }
    }

    async handleTextileDonationForm(e) {
        e.preventDefault();
        
        try {
            showLoading();

            const formData = {
                name: document.getElementById('textile-name').value.trim(),
                email: document.getElementById('textile-email').value.trim(),
                phone: document.getElementById('textile-phone').value.trim(),
                company: document.getElementById('textile-company').value.trim(),
                message: document.getElementById('textile-message').value.trim()
            };

            if (!this.validateTextileForm(formData)) {
                hideLoading();
                return;
            }

            await apiEndpoints.submitTextileDonation(formData);
            
            hideLoading();
            this.resetForm('textile-donation-form');
            
            showSuccessMessage(
                'Thank you for your textile donation inquiry! We will contact you soon.',
                'شكرًا لاستفسارك حول التبرع بالمنسوجات! سنتواصل معك قريبًا.'
            );

        } catch (error) {
            hideLoading();
            handleError(error, 'textile donation form submission');
        }
    }

    async handleVolunteerForm(e) {
        e.preventDefault();
        
        try {
            showLoading();

            const formData = {
                name: document.getElementById('volunteer-name').value.trim(),
                email: document.getElementById('volunteer-email').value.trim(),
                phone: document.getElementById('volunteer-phone').value.trim(),
                skills: document.getElementById('volunteer-skills').value.trim(),
                availability: document.getElementById('volunteer-availability').value.trim(),
                message: document.getElementById('volunteer-message').value.trim()
            };

            if (!this.validateVolunteerForm(formData)) {
                hideLoading();
                return;
            }

            await apiEndpoints.submitVolunteer(formData);
            
            hideLoading();
            this.resetForm('volunteer-form');
            
            showSuccessMessage(
                'Thank you for your volunteer application! We will review it and get back to you.',
                'شكرًا لطلب التطوع! سنراجعه ونتواصل معك.'
            );

        } catch (error) {
            hideLoading();
            handleError(error, 'volunteer form submission');
        }
    }

    async handleJoinArtisanForm(e) {
        e.preventDefault();
        
        try {
            showLoading();

            const formData = {
                name: document.getElementById('artisan-name').value.trim(),
                phone: document.getElementById('artisan-phone').value.trim(),
                email: document.getElementById('artisan-email').value.trim(),
                location: document.getElementById('artisan-location').value.trim(),
                skills: document.getElementById('artisan-skills').value,
                experience: document.getElementById('artisan-experience').value.trim(),
                availability: document.getElementById('artisan-availability').value.trim()
            };

            if (!this.validateJoinArtisanForm(formData)) {
                hideLoading();
                return;
            }

            await apiEndpoints.submitJoinArtisan(formData);
            
            hideLoading();
            this.resetForm('join-artisan-form');
            
            showSuccessMessage(
                'شكرًا لك! تم استلام طلبك وسنتواصل معك قريباً لبدء رحلتك معنا.',
                'Thank you! We received your application and will contact you soon to start your journey with us.'
            );

        } catch (error) {
            hideLoading();
            handleError(error, 'join artisan form submission');
        }
    }

    async handleNewsletterForm(e) {
        e.preventDefault();
        
        try {
            const email = document.getElementById('newsletter-email').value.trim();

            if (!this.validateEmail({ target: { value: email } })) {
                return;
            }

            await apiEndpoints.subscribeNewsletter(email);
            
            this.resetForm('newsletter-form');
            
            showSuccessMessage(
                'Thank you for subscribing to our newsletter!',
                'شكرًا لاشتراكك في نشرتنا الإخبارية!'
            );

        } catch (error) {
            handleError(error, 'newsletter subscription');
        }
    }

    // Validation methods
    validateContactForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showValidationError('contact-name', 'Please enter a valid name', 'يرجى إدخال اسم صحيح');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showValidationError('contact-email', 'Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        if (!data.message || data.message.length < 10) {
            this.showValidationError('contact-message', 'Please enter a message with at least 10 characters', 'يرجى إدخال رسالة لا تقل عن 10 أحرف');
            return false;
        }

        return true;
    }

    validateDonationForm(data) {
        if (!this.isValidEmail(data.email)) {
            this.showValidationError('donor-email', 'Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        return true;
    }

    validateTextileForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showValidationError('textile-name', 'Please enter a valid name', 'يرجى إدخال اسم صحيح');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showValidationError('textile-email', 'Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        return true;
    }

    validateJoinArtisanForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showValidationError('artisan-name', 'يرجى إدخال اسم صحيح', 'Please enter a valid name');
            return false;
        }

        if (!data.phone || data.phone.length < 10) {
            this.showValidationError('artisan-phone', 'يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number');
            return false;
        }

        if (data.email && !this.isValidEmail(data.email)) {
            this.showValidationError('artisan-email', 'يرجى إدخال بريد إلكتروني صحيح', 'Please enter a valid email address');
            return false;
        }

        if (!data.location || data.location.length < 2) {
            this.showValidationError('artisan-location', 'يرجى إدخال المحافظة أو المنطقة', 'Please enter your governorate or area');
            return false;
        }

        if (!data.skills) {
            this.showValidationError('artisan-skills', 'يرجى اختيار مهارتك الأساسية', 'Please select your primary skill');
            return false;
        }

        return true;
    }

    validateVolunteerForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showValidationError('volunteer-name', 'Please enter a valid name', 'يرجى إدخال اسم صحيح');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showValidationError('volunteer-email', 'Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        return true;
    }

    validateEmail(e) {
        const email = e.target.value;
        const input = e.target;
        
        if (email && !this.isValidEmail(email)) {
            input.style.borderColor = 'var(--error)';
            return false;
        } else {
            input.style.borderColor = 'var(--soft-sand)';
            return true;
        }
    }

    validateAmount(e) {
        const amount = parseFloat(e.target.value);
        const input = e.target;
        
        if (isNaN(amount) || amount <= 0) {
            input.style.borderColor = 'var(--error)';
            return false;
        } else {
            input.style.borderColor = 'var(--soft-sand)';
            return true;
        }
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format Egyptian phone numbers
        if (value.startsWith('20')) {
            value = value.substring(2);
        }
        
        if (value.length >= 10) {
            value = value.substring(0, 10);
            value = `+20 ${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
        } else if (value.length >= 6) {
            value = `+20 ${value.substring(0, 3)} ${value.substring(3)}`;
        } else if (value.length >= 3) {
            value = `+20 ${value}`;
        }
        
        e.target.value = value;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationError(inputId, messageEn, messageAr) {
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = 'var(--error)';
            input.focus();
        }

        const message = getCurrentLanguage() === 'ar' ? messageAr : messageEn;
        showMessage(message, 'error');
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            
            // Reset custom styling
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.style.borderColor = 'var(--soft-sand)';
            });

            // Reset amount buttons
            const amountButtons = form.querySelectorAll('.amount-btn');
            amountButtons.forEach(btn => btn.classList.remove('active'));
        }
    }
}

// Initialize form manager
const formManager = new FormManager();

// Export for global use
window.formManager = formManager;