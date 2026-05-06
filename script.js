// The Rest Is Tech - Modern Website JavaScript
// Premium interactions and smooth animations

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Toggle mobile menu
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add background on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }

    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger animations for grid items
            if (entry.target.classList.contains('service-card')) {
                const cards = document.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section-header, .service-card, .about-content, .about-visual, .cta-card').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero background
const heroBackground = document.querySelector('.hero-background');
window.addEventListener('scroll', () => {
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic gradient animation on mouse move
const hero = document.querySelector('.hero');
const gradientOrbs = document.querySelectorAll('.gradient-orb');

hero?.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { width, height } = hero.getBoundingClientRect();

    const xPercent = (clientX / width) * 100;
    const yPercent = (clientY / height) * 100;

    gradientOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.01;
        const x = (xPercent - 50) * speed;
        const y = (yPercent - 50) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Button hover effects
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-glass');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Service card tilt effect
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = entry.target;
            const value = target.innerText;
            const isPercentage = value.includes('%');
            const isMillions = value.includes('M');
            const numValue = parseInt(value.replace(/[^0-9]/g, ''));

            let current = 0;
            const increment = numValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numValue) {
                    current = numValue;
                    clearInterval(timer);
                }

                let display = Math.floor(current);
                if (isPercentage) display += '%';
                if (isMillions) display += 'M+';
                else if (!isPercentage && display > 99) display += '+';

                target.innerText = display;
            }, 30);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// Form handling (for future contact form)
const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form submitted:', Object.fromEntries(formData));
    // Add actual form submission logic here
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');

    // Initialize tooltips or other third-party libraries if needed
    console.log('The Rest Is Tech - Site initialized');
});

// Performance optimization - lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}