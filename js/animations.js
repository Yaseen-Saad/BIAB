// GSAP Animations
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Ensure content is visible by default
document.addEventListener('DOMContentLoaded', function() {
    // Show all content immediately in case GSAP fails to load
    document.body.style.visibility = 'visible';
    
    // Initialize animations when GSAP is ready
    if (typeof gsap !== 'undefined') {
        initAnimations();
    } else {
        // Fallback: ensure all content is visible
        showAllContent();
    }
});

function showAllContent() {
    // Remove any hiding classes and ensure visibility
    const hiddenElements = document.querySelectorAll('.reveal, .text-reveal, .slide-up, .slide-left, .slide-right, .scale-in, .rotate-in, section, section h2, .impact-grid > *, .products-grid > *, .artisans-grid > *, .blog-grid > *, .artisan-card, .blog-card');
    hiddenElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
    });
    
    // Also ensure all section children are visible
    document.querySelectorAll('section').forEach(section => {
        Array.from(section.children).forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'none';
            child.style.visibility = 'visible';
        });
    });
}

function initAnimations() {
    // Loading animation
    initLoadingAnimation();
    
    // Header animations
    initHeaderAnimations();
    
    // Hero section animations
    initHeroAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
    
    // Product cards animations
    initProductAnimations();
    
    // Artisan cards animations
    initArtisanAnimations();
    
    // Blog cards animations
    initBlogAnimations();
    
    // Form animations
    initFormAnimations();
    
    // Button hover animations
    initButtonAnimations();
    
    // Counter animations
    initCounterAnimations();
    
    // Parallax effects
    initParallaxEffects();
}

// Loading Animation
function initLoadingAnimation() {
    const spinner = document.querySelector('.loading-spinner');
    
    if (spinner) {
        // Hide loading screen immediately if GSAP is not available
        if (typeof gsap === 'undefined') {
            spinner.style.display = 'none';
            return;
        }
        
        const spinnerElement = document.querySelector('.spinner');
        
        if (spinnerElement) {
            // Animate spinner
            gsap.to(spinnerElement, {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: "none"
            });
        }
        
        // Hide loading screen after a short delay
        setTimeout(() => {
            gsap.to(spinner, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    spinner.style.display = 'none';
                }
            });
        }, 800);
    }
}

// Header Animations
function initHeaderAnimations() {
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo h1');
    const navItems = document.querySelectorAll('.nav-list li');
    const headerActions = document.querySelectorAll('.header-actions > *');
    
    // Ensure header is visible first
    if (header) header.style.opacity = '1';
    if (logo) logo.style.opacity = '1';
    navItems.forEach(item => item.style.opacity = '1');
    headerActions.forEach(action => action.style.opacity = '1');
    
    // Only animate if GSAP is available
    if (typeof gsap === 'undefined') return;
    
    // Header entrance animation
    gsap.set([logo, ...navItems, ...headerActions], { y: -50, opacity: 0 });
    
    gsap.timeline()
        .to(logo, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
        .to(navItems, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.4")
        .to(headerActions, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.3");
    
    // Header scroll effect
    ScrollTrigger.create({
        trigger: "body",
        start: "top -80px",
        end: "bottom top",
        onToggle: self => {
            if (self.isActive) {
                gsap.to(header, { 
                    backgroundColor: "rgba(243, 237, 227, 0.98)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 4px 20px rgba(24, 68, 42, 0.1)",
                    duration: 0.3 
                });
            } else {
                gsap.to(header, { 
                    backgroundColor: "rgba(243, 237, 227, 0.95)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "none",
                    duration: 0.3 
                });
            }
        }
    });
}

// Hero Section Animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelectorAll('.hero-actions .btn');
    const heroBackground = document.querySelector('.hero-background img');
    
    // Ensure hero content is visible first
    [heroTitle, heroSubtitle, ...heroActions].forEach(el => {
        if (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
    if (heroBackground) {
        heroBackground.style.opacity = '1';
        heroBackground.style.transform = 'none';
    }
    
    // Only animate if GSAP is available
    if (typeof gsap === 'undefined') return;
    
    // Set initial states for animation
    gsap.set([heroTitle, heroSubtitle, ...heroActions], { y: 100, opacity: 0 });
    gsap.set(heroBackground, { scale: 1.2, opacity: 0 });
    
    // Create timeline
    const heroTl = gsap.timeline();
    
    heroTl
        .to(heroBackground, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" })
        .to(heroTitle, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=1.5")
        .to(heroSubtitle, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
        .to(heroActions, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.5");
    
    // Parallax effect for hero background
    gsap.to(heroBackground, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Only animate if GSAP is available
    if (typeof gsap === 'undefined') return;
    
    // Fade in animations for sections
    gsap.utils.toArray('section').forEach(section => {
        // Ensure section children are properly set up
        gsap.set(section.children, { opacity: 0, y: 50 });
        
        gsap.to(section.children, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none none"
            },
            onComplete: () => {
                // Ensure final opacity is exactly 1
                Array.from(section.children).forEach(child => {
                    child.style.opacity = '1';
                });
            }
        });
    });
    
    // Section titles animation
    gsap.utils.toArray('section h2').forEach(title => {
        gsap.set(title, { opacity: 0, y: 30 });
        
        gsap.to(title, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            onComplete: () => {
                title.style.opacity = '1';
            }
        });
    });
    
    // Stagger animations for grids
    gsap.utils.toArray('.impact-grid, .products-grid, .artisans-grid, .blog-grid').forEach(grid => {
        gsap.set(grid.children, { opacity: 0, y: 50 });
        
        gsap.to(grid.children, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            onComplete: () => {
                Array.from(grid.children).forEach(child => {
                    child.style.opacity = '1';
                });
            }
        });
    });
}

// Product Cards Animations
function initProductAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const image = card.querySelector('.product-image img');
        const info = card.querySelector('.product-info');
        
        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { 
                y: -15, 
                scale: 1.02,
                duration: 0.4, 
                ease: "power2.out" 
            });
            gsap.to(image, { 
                scale: 1.1, 
                duration: 0.6, 
                ease: "power2.out" 
            });
            gsap.to(info, { 
                y: -5, 
                duration: 0.3, 
                ease: "power2.out" 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                y: 0, 
                scale: 1,
                duration: 0.4, 
                ease: "power2.out" 
            });
            gsap.to(image, { 
                scale: 1, 
                duration: 0.6, 
                ease: "power2.out" 
            });
            gsap.to(info, { 
                y: 0, 
                duration: 0.3, 
                ease: "power2.out" 
            });
        });
    });
}

// Artisan Cards Animations
function initArtisanAnimations() {
    const artisanCards = document.querySelectorAll('.artisan-card');
    
    artisanCards.forEach(card => {
        const image = card.querySelector('.artisan-image');
        
        // Entrance animation
        gsap.set(card, { rotationY: 90, opacity: 0 });
        
        gsap.to(card, {
            rotationY: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
        
        // Hover animation
        card.addEventListener('mouseenter', () => {
            gsap.to(image, { 
                rotation: 5,
                scale: 1.1, 
                duration: 0.4, 
                ease: "power2.out" 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, { 
                rotation: 0,
                scale: 1, 
                duration: 0.4, 
                ease: "power2.out" 
            });
        });
    });
}

// Blog Cards Animations
function initBlogAnimations() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach((card, index) => {
        // Entrance animation with alternating directions
        const direction = index % 2 === 0 ? -100 : 100;
        
        gsap.set(card, { x: direction, opacity: 0 });
        
        gsap.to(card, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
}

// Form Animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                gsap.to(submitBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// Button Animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        // Ripple effect on click
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            gsap.from(ripple, {
                scale: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
        
        // Magnetic effect
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-number, .stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        counter.textContent = '0';
        
        gsap.to(counter, {
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: "top 85%",
                toggleActions: "play none none none",
                onStart: () => {
                    gsap.to({ val: 0 }, {
                        duration: 2,
                        val: target,
                        ease: "power2.out",
                        onUpdate: function() {
                            counter.textContent = Math.floor(this.targets()[0].val).toLocaleString();
                        }
                    });
                }
            }
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    // Background parallax
    const parallaxElements = document.querySelectorAll('.hero-background img, .blog-image img');
    
    parallaxElements.forEach(element => {
        gsap.to(element, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: element.closest('section, .blog-card, .hero'),
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
    
    // Floating elements
    const floatingElements = document.querySelectorAll('.impact-metric, .role-card');
    
    floatingElements.forEach((element, index) => {
        gsap.to(element, {
            y: -20,
            duration: 2 + Math.random() * 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2
        });
    });
}

// Progress bar animation
function animateProgressBar() {
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        gsap.to(progressBar, {
            width: progressBar.style.width || '0%',
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: progressBar,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    }
}

// Scroll-based reveal animations
function initRevealAnimations() {
    gsap.utils.toArray('.reveal').forEach(element => {
        gsap.set(element, { opacity: 0, y: 50 });
        
        gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });
}

// Text reveal animations
function initTextRevealAnimations() {
    gsap.utils.toArray('.text-reveal').forEach(element => {
        const words = element.textContent.split(' ');
        element.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
        
        const wordElements = element.querySelectorAll('.word');
        gsap.set(wordElements, { opacity: 0, y: 20 });
        
        gsap.to(wordElements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
}

// Mobile optimizations
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        ScrollTrigger.config({
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
        });
    }
}

// Initialize mobile optimizations
optimizeForMobile();

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    optimizeForMobile();
});

// Export functions for use in other scripts
window.animateProgressBar = animateProgressBar;
window.initRevealAnimations = initRevealAnimations;
window.initTextRevealAnimations = initTextRevealAnimations;
