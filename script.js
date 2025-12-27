// Load footer categories
function loadFooterCategories() {
    const footerCategories = document.getElementById('footerCategories');
    if (footerCategories) {
        const categories = JSON.parse(localStorage.getItem('autoparts_categories') || '[]');
        
        if (categories.length === 0) {
            footerCategories.innerHTML = '<li><a href="products.html">No categories yet</a></li>';
            footerCategories.classList.remove('categories-columns');
        } else {
            // Create category links that filter products when clicked
            footerCategories.innerHTML = categories.map(category => 
                `<li><a href="products.html?category=${category.id}">${category.name}</a></li>`
            ).join('');
            
            // Add multi-column class if there are more than 5 categories
            if (categories.length > 5) {
                footerCategories.classList.add('categories-columns');
            } else {
                footerCategories.classList.remove('categories-columns');
            }
        }
    }
}

// Load footer categories on page load
loadFooterCategories();

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(n) {
    if (slides.length === 0) return;
    
    // Wrap around
    if (n >= totalSlides) currentSlide = 0;
    if (n < 0) currentSlide = totalSlides - 1;
    
    // Remove active class from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= totalSlides) currentSlide = 0;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    showSlide(currentSlide);
}

// Auto-play carousel
let autoPlayInterval;
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event listeners for carousel
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');

if (prevButton) {
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
}

// Dots navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        stopAutoPlay();
        startAutoPlay();
    });
});

// Start auto-play if carousel exists
if (slides.length > 0) {
    startAutoPlay();
    
    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation for Elements
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

// Observe sections and cards
document.querySelectorAll('.about, .products, .contact, .product-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    }
});

// CTA Button Click Handler
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    const productsSection = document.querySelector('#products');
    const offset = 70;
    const targetPosition = productsSection.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// Buy Button Handlers
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.closest('.product-card').querySelector('h3').textContent;
        alert(`Interested in ${productName}? Contact us for more details and pricing!`);
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your inquiry! Our team will contact you within 24 hours.');
        contactForm.reset();
    });
}

// Contact Page Form Handler
const contactFormPage = document.querySelector('.contact-form-page');
if (contactFormPage) {
    contactFormPage.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! Our team will get back to you within 24 hours.');
        contactFormPage.reset();
    });
}

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const numTarget = parseInt(target);
    let current = 0;
    const increment = numTarget / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numTarget) {
            element.textContent = numTarget + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, 16);
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-item h3');
            statNumbers.forEach(stat => {
                const value = parseInt(stat.textContent);
                animateCounter(stat, value);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

console.log('AutoParts Pro - Website Loaded Successfully!');
