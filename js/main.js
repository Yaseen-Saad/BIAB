// Main application logic
class HandmadeByEgyptApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Initialize core functionality
            await this.loadInitialData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup scroll effects
            this.setupScrollEffects();
            
            // Setup smooth scrolling
            this.setupSmoothScrolling();
            
            // Initialize GSAP animations after data is loaded (if available)
            setTimeout(() => {
                if (window.initAnimations && typeof gsap !== 'undefined') {
                    window.initAnimations();
                }
            }, 100);
            
            // Hide loading
            hideLoading();
            
        } catch (error) {
            hideLoading();
            console.error('App initialization error:', error);
            // Ensure content is visible even if there's an error
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }
    }

    async loadInitialData() {
        try {
            // Load critical data in parallel
            await Promise.all([
                this.loadImpactMetrics(),
                this.loadFeaturedProducts(),
                this.loadArtisans(),
                this.loadBlogPosts(),
                this.loadCollectionPoints()
            ]);
            
            console.log('All data loaded successfully');
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Load fallback data to ensure content is visible
            this.loadFallbackData();
        }
    }
    
    loadFallbackData() {
        // Load static fallback data if API fails
        if (window.mockData) {
            this.renderImpactMetrics(window.mockData.impactMetrics);
            this.renderProducts(window.mockData.products, 'featured-products');
            this.renderArtisans(window.mockData.artisans);
            this.renderBlogPosts(window.mockData.blogPosts);
            this.renderCollectionPoints(window.mockData.collectionPoints);
        } else {
            // Create minimal content if no data is available
            this.createMinimalContent();
        }
    }
    
    createMinimalContent() {
        // Create basic content structure to ensure sections are visible
        const impactContainer = document.getElementById('impact-metrics');
        if (impactContainer) {
            impactContainer.innerHTML = `
                <div class="impact-metric floating">
                    <div class="metric-number">2,847</div>
                    <div class="metric-label">KG of Textiles Diverted</div>
                </div>
                <div class="impact-metric floating">
                    <div class="metric-number">35</div>
                    <div class="metric-label">Women Trained</div>
                </div>
                <div class="impact-metric floating">
                    <div class="metric-number">125,000</div>
                    <div class="metric-label">Income Disbursed (EGP)</div>
                </div>
            `;
        }
        
        const productsContainer = document.getElementById('featured-products');
        if (productsContainer) {
            productsContainer.innerHTML = `
                <div class="product-card card-modern">
                    <div class="product-image">
                        <img src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" alt="Handwoven Tote Bag">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">Handwoven Tote Bag</h3>
                        <div class="product-price pulse">350 EGP</div>
                        <p class="product-description">Beautiful handwoven tote bag made from upcycled cotton fabrics.</p>
                        <button class="btn btn-primary add-to-cart glow">Add to Cart</button>
                    </div>
                </div>
                <div class="product-card card-modern">
                    <div class="product-image">
                        <img src="https://images.pexels.com/photos/6249509/pexels-photo-6249509.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" alt="Embroidered Table Runner">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">Embroidered Table Runner</h3>
                        <div class="product-price pulse">280 EGP</div>
                        <p class="product-description">Elegant table runner featuring intricate hand embroidery.</p>
                        <button class="btn btn-primary add-to-cart glow">Add to Cart</button>
                    </div>
                </div>
            `;
        }
        
        const artisansContainer = document.getElementById('artisans-grid');
        if (artisansContainer) {
            artisansContainer.innerHTML = `
                <div class="artisan-card">
                    <div class="artisan-image">
                        <img src="https://images.pexels.com/photos/8070577/pexels-photo-8070577.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Fatma Hassan">
                    </div>
                    <h3 class="artisan-name">Fatma Hassan</h3>
                    <p class="artisan-bio">A skilled artisan from rural Giza with 15 years of experience in textile crafts.</p>
                </div>
                <div class="artisan-card">
                    <div class="artisan-image">
                        <img src="https://images.pexels.com/photos/8964999/pexels-photo-8964999.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Aisha Mohamed">
                    </div>
                    <h3 class="artisan-name">Aisha Mohamed</h3>
                    <p class="artisan-bio">A young entrepreneur from Aswan who creates beautiful home décor items.</p>
                </div>
            `;
        }
        
        const blogContainer = document.getElementById('blog-grid');
        if (blogContainer) {
            blogContainer.innerHTML = `
                <div class="blog-card">
                    <div class="blog-image">
                        <img src="https://images.pexels.com/photos/8964906/pexels-photo-8964906.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" alt="Blog post">
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">Empowering Women Through Sustainable Crafts</h3>
                        <div class="blog-date">January 15, 2024</div>
                        <p class="blog-excerpt">Our mission goes beyond creating beautiful products. We believe in the transformative power of providing economic opportunities...</p>
                    </div>
                </div>
            `;
        }
    }

    async loadImpactMetrics() {
        try {
            const metrics = await dataLoader.loadWithCache('impact-metrics', 
                () => apiEndpoints.getImpactMetrics()
            );

            this.renderImpactMetrics(metrics);
            this.updateCampaignProgress(metrics);
        } catch (error) {
            console.error('Error loading impact metrics:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderImpactMetrics(window.mockData.impactMetrics);
                this.updateCampaignProgress(window.mockData.impactMetrics);
            }
        }
    }

    renderImpactMetrics(metrics) {
        const container = document.getElementById('impact-metrics');
        if (!container) return;

        const isArabic = getCurrentLanguage() === 'ar';
        
        container.innerHTML = `
            <div class="impact-metric floating">
                <div class="metric-number">${formatNumber(metrics.textiles_diverted_kg)}</div>
                <div class="metric-label" data-en="KG of Textiles Diverted" data-ar="كيلو من المنسوجات المعاد تدويرها">
                    ${isArabic ? 'كيلو من المنسوجات المعاد تدويرها' : 'KG of Textiles Diverted'}
                </div>
            </div>
            <div class="impact-metric floating">
                <div class="metric-number">${formatNumber(metrics.women_trained)}</div>
                <div class="metric-label" data-en="Women Trained" data-ar="امرأة مدربة">
                    ${isArabic ? 'امرأة مدربة' : 'Women Trained'}
                </div>
            </div>
            <div class="impact-metric floating">
                <div class="metric-number">${formatCurrency(metrics.income_disbursed_egp, 'EGP')}</div>
                <div class="metric-label" data-en="Income Disbursed" data-ar="دخل موزع">
                    ${isArabic ? 'دخل موزع' : 'Income Disbursed'}
                </div>
            </div>
        `;

        // Render detailed impact stats
        const detailedContainer = document.getElementById('detailed-impact');
        if (detailedContainer) {
            detailedContainer.innerHTML = `
                <div class="impact-stat">
                    <div class="stat-number">${formatNumber(metrics.textiles_diverted_kg)}</div>
                    <div class="stat-label" data-en="Textiles Diverted (KG)" data-ar="منسوجات معاد تدويرها (كيلو)">
                        ${isArabic ? 'منسوجات معاد تدويرها (كيلو)' : 'Textiles Diverted (KG)'}
                    </div>
                </div>
                <div class="impact-stat">
                    <div class="stat-number">${formatNumber(metrics.women_trained)}</div>
                    <div class="stat-label" data-en="Women Trained" data-ar="نساء مدربات">
                        ${isArabic ? 'نساء مدربات' : 'Women Trained'}
                    </div>
                </div>
                <div class="impact-stat">
                    <div class="stat-number">${formatCurrency(metrics.income_disbursed_egp, 'EGP')}</div>
                    <div class="stat-label" data-en="Income Generated" data-ar="دخل محقق">
                        ${isArabic ? 'دخل محقق' : 'Income Generated'}
                    </div>
                </div>
            `;
        }
    }

    updateCampaignProgress(metrics) {
        const progressBar = document.getElementById('campaign-progress');
        const raisedAmount = document.getElementById('raised-amount');
        const goalAmount = document.getElementById('goal-amount');

        if (progressBar && raisedAmount && goalAmount) {
            const percentage = Math.min((metrics.current_campaign_raised_egp / metrics.current_campaign_goal_egp) * 100, 100);
            
            progressBar.style.width = `${percentage}%`;
            raisedAmount.textContent = formatNumber(metrics.current_campaign_raised_egp);
            goalAmount.textContent = formatNumber(metrics.current_campaign_goal_egp);
        }
    }

    async loadFeaturedProducts() {
        try {
            const products = await dataLoader.loadWithCache('featured-products', 
                () => apiEndpoints.getFeaturedProducts()
            );

            this.renderProducts(products, 'featured-products');
        } catch (error) {
            console.error('Error loading featured products:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderProducts(window.mockData.products.slice(0, 6), 'featured-products');
            }
        }
    }

    async loadAllProducts() {
        try {
            showLoading();
            
            const products = await dataLoader.loadWithCache('all-products', 
                () => apiEndpoints.getProducts()
            );

            this.renderProducts(products, 'all-products-grid');
            
            // Show all products section
            const allProductsSection = document.getElementById('all-products');
            if (allProductsSection) {
                allProductsSection.style.display = 'block';
                allProductsSection.scrollIntoView({ behavior: 'smooth' });
            }

            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Error loading all products:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderProducts(window.mockData.products, 'all-products-grid');
                
                // Show all products section
                const allProductsSection = document.getElementById('all-products');
                if (allProductsSection) {
                    allProductsSection.style.display = 'block';
                    allProductsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }

    renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products.map((product, index) => {
            const name = getLocalizedText(product, 'name');
            const description = getLocalizedText(product, 'description');
            const animationClass = index % 2 === 0 ? 'slide-left' : 'slide-right';
            
            return `
                <div class="product-card card-modern ${animationClass}" onclick="showProductDetail('${product._id}')">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${name}" loading="lazy" 
                             onerror="loadImageWithFallback(this, '${product.images[0]}')">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${name}</h3>
                        <div class="product-price pulse">${formatCurrency(product.price, 'EGP')}</div>
                        <p class="product-description">${description}</p>
                        <button class="btn btn-primary add-to-cart glow" onclick="event.stopPropagation(); addToCart('${product._id}')">
                            <span data-en="Add to Cart" data-ar="أضف للسلة">${getCurrentLanguage() === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Trigger animations after rendering
        if (window.initProductAnimations) {
            setTimeout(() => window.initProductAnimations(), 100);
        }
    }

    async loadArtisans() {
        try {
            const artisans = await dataLoader.loadWithCache('artisans', 
                () => apiEndpoints.getArtisans()
            );

            this.renderArtisans(artisans);
        } catch (error) {
            console.error('Error loading artisans:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderArtisans(window.mockData.artisans);
            }
        }
    }

    renderArtisans(artisans) {
        const container = document.getElementById('artisans-grid');
        if (!container) return;

        container.innerHTML = artisans.map(artisan => {
            const name = getLocalizedText(artisan, 'name');
            const bio = getLocalizedText(artisan, 'bio');
            
            return `
                <div class="artisan-card">
                    <div class="artisan-image">
                        <img src="${artisan.image_url}" alt="${name}" loading="lazy"
                             onerror="loadImageWithFallback(this, '${artisan.image_url}')">
                    </div>
                    <h3 class="artisan-name">${name}</h3>
                    <p class="artisan-bio">${bio}</p>
                </div>
            `;
        }).join('');
    }

    async loadBlogPosts() {
        try {
            const posts = await dataLoader.loadWithCache('blog-posts', 
                () => apiEndpoints.getBlogPosts()
            );

            this.renderBlogPosts(posts);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderBlogPosts(window.mockData.blogPosts);
            }
        }
    }

    renderBlogPosts(posts) {
        const container = document.getElementById('blog-grid');
        if (!container) return;

        container.innerHTML = posts.map(post => {
            const title = getLocalizedText(post, 'title');
            const content = getLocalizedText(post, 'content');
            const excerpt = content.substring(0, 150) + '...';
            
            return `
                <div class="blog-card" onclick="showBlogPost('${post._id}')">
                    <div class="blog-image">
                        <img src="${post.image_url}" alt="${title}" loading="lazy"
                             onerror="loadImageWithFallback(this, '${post.image_url}')">
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">${title}</h3>
                        <div class="blog-date">${formatDate(post.date)}</div>
                        <p class="blog-excerpt">${excerpt}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadCollectionPoints() {
        try {
            const points = await dataLoader.loadWithCache('collection-points', 
                () => apiEndpoints.getCollectionPoints()
            );

            this.renderCollectionPoints(points);
        } catch (error) {
            console.error('Error loading collection points:', error);
            // Use fallback data
            if (window.mockData) {
                this.renderCollectionPoints(window.mockData.collectionPoints);
            }
        }
    }

    renderCollectionPoints(points) {
        const container = document.getElementById('collection-points');
        if (!container) return;

        const isArabic = getCurrentLanguage() === 'ar';
        
        container.innerHTML = `
            <h3 data-en="Collection Points" data-ar="نقاط التجميع">${isArabic ? 'نقاط التجميع' : 'Collection Points'}</h3>
            ${points.map(point => {
                const name = getLocalizedText(point, 'name');
                const address = getLocalizedText(point, 'address');
                const hours = getLocalizedText(point, 'hours');
                
                return `
                    <div class="collection-point">
                        <h4>${name}</h4>
                        <p><strong data-en="Address:" data-ar="العنوان:">${isArabic ? 'العنوان:' : 'Address:'}</strong> ${address}</p>
                        <p><strong data-en="Hours:" data-ar="المواعيد:">${isArabic ? 'المواعيد:' : 'Hours:'}</strong> ${hours}</p>
                        <p><strong data-en="Phone:" data-ar="الهاتف:">${isArabic ? 'الهاتف:' : 'Phone:'}</strong> ${point.contact_phone}</p>
                    </div>
                `;
            }).join('')}
        `;
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('open');
                menuToggle.classList.toggle('open');
                document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
            });
        }

        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Keyboard navigation for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    openModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    setupScrollEffects() {
        // Header scroll effect
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        const handleScroll = throttle(() => {
            const currentScrollY = window.scrollY;
            
            if (header) {
                if (currentScrollY > 100) {
                    header.style.backgroundColor = 'rgba(248, 246, 244, 0.98)';
                    header.style.boxShadow = 'var(--shadow-sm)';
                } else {
                    header.style.backgroundColor = 'rgba(248, 246, 244, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }

            lastScrollY = currentScrollY;
        }, 100);

        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.impact-metric, .product-card, .artisan-card, .blog-card, .role-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Product detail modal
async function showProductDetail(productId) {
    try {
        showLoading();
        
        const product = await apiEndpoints.getProduct(productId);
        const artisan = product.artisan_id ? await apiEndpoints.getArtisan(product.artisan_id) : null;
        
        hideLoading();
        
        const modal = document.getElementById('product-modal');
        const isArabic = getCurrentLanguage() === 'ar';
        
        const name = getLocalizedText(product, 'name');
        const description = getLocalizedText(product, 'description');
        const materials = getLocalizedText(product, 'materials');
        const care = getLocalizedText(product, 'care');
        
        modal.innerHTML = `
            <div class="modal-content product-modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="close-modal" onclick="closeProductModal()">&times;</button>
                </div>
                <div class="product-detail">
                    <div class="product-gallery">
                        <div class="product-main-image">
                            <img id="main-product-image" src="${product.images[0]}" alt="${name}">
                        </div>
                        ${product.images.length > 1 ? `
                            <div class="product-thumbnails">
                                ${product.images.map((img, index) => `
                                    <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                                        <img src="${img}" alt="${name}">
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="product-details">
                        <h1>${name}</h1>
                        <div class="product-price">${formatCurrency(product.price, 'EGP')}</div>
                        <p class="product-description">${description}</p>
                        
                        <div class="product-meta">
                            <h4 data-en="Materials" data-ar="المواد">${isArabic ? 'المواد' : 'Materials'}</h4>
                            <p>${materials}</p>
                            <h4 data-en="Care Instructions" data-ar="تعليمات العناية">${isArabic ? 'تعليمات العناية' : 'Care Instructions'}</h4>
                            <p>${care}</p>
                        </div>
                        
                        <div class="quantity-selector">
                            <label data-en="Quantity:" data-ar="الكمية:">${isArabic ? 'الكمية:' : 'Quantity:'}</label>
                            <input type="number" id="product-quantity" class="quantity-input" value="1" min="1" max="${product.stock}">
                        </div>
                        
                        <button class="btn btn-primary" onclick="addToCartFromModal('${product._id}')">
                            <span data-en="Add to Cart" data-ar="أضف للسلة">${isArabic ? 'أضف للسلة' : 'Add to Cart'}</span>
                        </button>
                        
                        ${artisan ? `
                            <div class="artisan-story">
                                <h4 data-en="Artisan Story" data-ar="قصة الحرفية">${isArabic ? 'قصة الحرفية' : 'Artisan Story'}</h4>
                                <p><strong>${getLocalizedText(artisan, 'name')}</strong></p>
                                <p>${getLocalizedText(artisan, 'bio')}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        hideLoading();
        handleError(error, 'loading product details');
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function changeMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Add to cart functions
async function addToCart(productId) {
    try {
        const product = await apiEndpoints.getProduct(productId);
        cart.addItem(product, 1);
    } catch (error) {
        handleError(error, 'adding product to cart');
    }
}

async function addToCartFromModal(productId) {
    try {
        const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
        const product = await apiEndpoints.getProduct(productId);
        cart.addItem(product, quantity);
        closeProductModal();
    } catch (error) {
        handleError(error, 'adding product to cart');
    }
}

// Blog post modal
async function showBlogPost(postId) {
    try {
        showLoading();
        
        const post = await apiEndpoints.getBlogPost(postId);
        
        hideLoading();
        
        const modal = document.getElementById('product-modal');
        const title = getLocalizedText(post, 'title');
        const content = getLocalizedText(post, 'content');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal" onclick="closeProductModal()">&times;</button>
                </div>
                <div style="padding: var(--spacing-xl);">
                    <img src="${post.image_url}" alt="${title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--spacing-md);">
                    <div style="color: #666; margin-bottom: var(--spacing-md);">${formatDate(post.date)} • ${post.author}</div>
                    <div style="line-height: 1.8; color: var(--text-color);">${content}</div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        hideLoading();
        handleError(error, 'loading blog post');
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Global functions for onclick handlers
window.loadAllProducts = () => app.loadAllProducts();
window.showProductDetail = showProductDetail;
window.closeProductModal = closeProductModal;
window.changeMainImage = changeMainImage;
window.addToCart = addToCart;
window.addToCartFromModal = addToCartFromModal;
window.showBlogPost = showBlogPost;
window.scrollToSection = scrollToSection;

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new HandmadeByEgyptApp();
});