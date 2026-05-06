// The Rest Is Tech - Premium Interactions
// Subtle, purposeful animations without gimmicks

// Navigation behavior
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll-based navigation styling
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for subtle shadow
    if (currentScroll > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll (only on desktop)
    if (window.innerWidth > 768) {
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    }

    lastScroll = currentScroll;
    ticking = false;
}

// Throttle scroll events for performance
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Mobile menu toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Subtle fade-in for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to key sections
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll(
        '.service-card, .phase, .case-card, .section-header'
    );

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
});

// Metric counter animation (simple, no libraries)
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value, .case-metric-value');

    metrics.forEach(metric => {
        const finalValue = metric.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('£') || finalValue.includes('M');
        const isRating = finalValue.includes('/');

        // Skip animation for ratings
        if (isRating) return;

        // Extract numeric value
        let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        let prefix = finalValue.match(/[£$]/)?.[0] || '';
        let suffix = '';

        if (isPercentage) suffix = '%';
        if (finalValue.includes('M')) suffix = 'M';
        if (finalValue.includes('+')) suffix = '+';

        // Animate from 0 to final value
        let current = 0;
        const increment = numericValue / 30; // 30 steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }

            // Format the display
            let display = current;
            if (numericValue > 100 && !isPercentage) {
                display = Math.floor(current);
            } else {
                display = current.toFixed(isPercentage ? 0 : 1);
            }

            metric.textContent = prefix + display + suffix;
        }, 50);
    });
}

// Trigger metric animation when hero metrics come into view
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateMetrics();
            metricsObserver.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.5 });

const heroMetrics = document.querySelector('.hero-metrics');
if (heroMetrics) {
    metricsObserver.observe(heroMetrics);
}

// Keyboard navigation for hamburger menu
hamburger?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Escape key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Improve touch responsiveness
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // Swipe right to open menu
    if (touchEndX - touchStartX > 100 && !navMenu.classList.contains('active')) {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Swipe left to close menu
    if (touchStartX - touchEndX > 100 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Performance: Lazy load images if any are added later
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
}

// Print styles helper
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Analytics helper (if needed)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const label = this.textContent.trim();
        trackEvent('CTA', 'click', label);
    });
});

// Initialize
console.log('The Rest Is Tech - Premium consulting experience initialized');