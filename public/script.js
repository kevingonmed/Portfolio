// Global variables
let currentFilter = 'all';



// Custom Cursor
const cursor = {
    dot: document.querySelector('.cursor-dot'),
    outline: document.querySelector('.cursor-outline'),

    init() {
        if (!this.dot || !this.outline) return;

        document.addEventListener('mousemove', (e) => {
            this.dot.style.left = e.clientX + 'px';
            this.dot.style.top = e.clientY + 'px';

            this.outline.style.left = (e.clientX - 20) + 'px';
            this.outline.style.top = (e.clientY - 20) + 'px';
        });

        // Add hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.outline.classList.add('hover');
                this.dot.style.transform = 'scale(1.5)';
            });

            el.addEventListener('mouseleave', () => {
                this.outline.classList.remove('hover');
                this.dot.style.transform = 'scale(1)';
            });
        });
    }
};

// Loading Screen
const loadingScreen = {
    init() {
        const loading = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('progressBar');

        if (!loading || !progressBar) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loading.classList.add('hidden');
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 150);
    }
};

// Scroll Progress Bar
const scrollProgress = {
    init() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            progressBar.style.width = scrollPercent + '%';
        });
    }
};

// Typing Animation
const typingAnimation = {
    init() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = typingElement.getAttribute('data-text').split(',');
        let currentText = 0;
        let currentChar = 0;
        let isDeleting = false;

        const typeText = () => {
            const current = texts[currentText];

            if (isDeleting) {
                typingElement.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typingElement.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentChar === current.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentText = (currentText + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        };

        typeText();
    }
};

// Counter Animation
const counterAnimation = {
    init() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        // Intersection Observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
};

// Magnetic Effect
const magneticEffect = {
    init() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
};

// Scroll Animations
const scrollAnimations = {
    init() {
        const animatedElements = document.querySelectorAll('.fade-in-up, .reveal-text, .reveal-left, .reveal-right, .reveal-up');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
};

// Projects Carousel
const projectsCarousel = {
    init() {
        this.carousel = document.getElementById('projectsCarousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        if (!this.carousel || !this.prevBtn || !this.nextBtn) return;

        this.scrollAmount = 380; // Card width + gap
        this.setupEventListeners();
        this.updateNavigationButtons();
    },

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.scrollPrev());
        this.nextBtn.addEventListener('click', () => this.scrollNext());

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProjects(e.target.getAttribute('data-filter')));
        });

        // Update navigation on scroll
        this.carousel.addEventListener('scroll', () => {
            this.updateNavigationButtons();
        });

        // Touch/swipe support
        let startX = 0;
        let scrollLeft = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - this.carousel.offsetLeft;
            scrollLeft = this.carousel.scrollLeft;
        });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - this.carousel.offsetLeft;
            const walk = (x - startX) * 2;
            this.carousel.scrollLeft = scrollLeft - walk;
        });

        this.carousel.addEventListener('touchend', () => {
            startX = 0;
        });
    },

    scrollPrev() {
        this.carousel.scrollBy({
            left: -this.scrollAmount,
            behavior: 'smooth'
        });
    },

    scrollNext() {
        this.carousel.scrollBy({
            left: this.scrollAmount,
            behavior: 'smooth'
        });
    },

    updateNavigationButtons() {
        const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;

        this.prevBtn.disabled = this.carousel.scrollLeft <= 0;
        this.nextBtn.disabled = this.carousel.scrollLeft >= maxScroll - 1;
    },

    filterProjects(filterValue) {
        // Update active filter button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filterValue}"]`).classList.add('active');

        const projectCards = document.querySelectorAll('.project-card-enhanced');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInScale 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        // Reset scroll position and update navigation
        this.carousel.scrollLeft = 0;
        setTimeout(() => {
            this.updateNavigationButtons();
        }, 100);

        currentFilter = filterValue;
    }
};

// Smooth Scrolling for Navigation
const smoothScrolling = {
    init() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// Contact Form Handler
const contactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please complete all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Create mailto link
            const mailtoLink = `mailto:gon22043@byui.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Reset form
            form.reset();

            // Show success message
            this.showSuccessMessage();
        });
    },

    showSuccessMessage() {
        const submitBtn = document.querySelector('.form-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        const originalIcon = submitBtn.querySelector('i').className;

        submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
        submitBtn.querySelector('i').className = 'fas fa-check';
        submitBtn.style.background = 'linear-gradient(135deg, #34C759, #28a745)';

        setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.querySelector('i').className = originalIcon;
            submitBtn.style.background = '';
        }, 3000);
    }
};

// Resume Download Function
function downloadResume() {
    // Download the PDF
    const link = document.createElement('a');
    link.href = 'images/Kevin_Gonzalez_Resume_2025.pdf';
    link.download = 'Kevin_Gonzalez_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Header Scroll Effect
const headerScrollEffect = {
    init() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.8)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
            }

            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }
};

// Enhanced Project Card Interactions
const projectInteractions = {
    init() {
        const projectCards = document.querySelectorAll('.project-card-enhanced');

        projectCards.forEach(card => {
            // Add click handler for the entire card
            card.addEventListener('click', (e) => {
                // Check if click was on a link or button
                if (e.target.closest('a') || e.target.closest('button')) {
                    return; // Let the link/button handle the click
                }

                // Find the GitHub link in this card
                const githubLink = card.querySelector('.project-action-btn[href*="github"]');
                if (githubLink) {
                    window.open(githubLink.href, '_blank', 'noopener,noreferrer');
                }
            });

            // Prevent event bubbling for links
            const links = card.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });
        });
    }
};

// Keyboard Navigation
const keyboardNavigation = {
    init() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    // Close any modals or reset states
                    const activeModals = document.querySelectorAll('.modal.active');
                    activeModals.forEach(modal => {
                        modal.classList.remove('active');
                    });
                    break;

                case 'ArrowLeft':
                    if (e.target.closest('.projects-carousel-container')) {
                        e.preventDefault();
                        projectsCarousel.scrollPrev();
                    }
                    break;

                case 'ArrowRight':
                    if (e.target.closest('.projects-carousel-container')) {
                        e.preventDefault();
                        projectsCarousel.scrollNext();
                    }
                    break;
            }
        });
    }
};

// Performance Optimization
const performanceOptimization = {
    init() {
        // Preload images for better performance
        this.preloadImages();

        // Add intersection observer for lazy loading animations
        this.setupLazyAnimations();
    },

    preloadImages() {
        const imageUrls = [
            // Add any image URLs you want to preload
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },

    setupLazyAnimations() {
        // Add staggered animation delays for focus items
        const focusItems = document.querySelectorAll('.focus-item[data-delay]');
        focusItems.forEach((item, index) => {
            const delay = item.getAttribute('data-delay') || (index * 200);
            item.style.animationDelay = `${delay}ms`;
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    loadingScreen.init();
    cursor.init();
    scrollProgress.init();
    typingAnimation.init();
    counterAnimation.init();
    magneticEffect.init();
    scrollAnimations.init();
    projectsCarousel.init();
    smoothScrolling.init();
    contactForm.init();
    headerScrollEffect.init();
    projectInteractions.init();
    keyboardNavigation.init();
    performanceOptimization.init();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .project-card-enhanced {
            animation: slideInFromRight 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
});

// Window load event for final initialization
window.addEventListener('load', () => {
    // Ensure loading screen disappears
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);

    // Initialize carousel navigation after everything is loaded
    setTimeout(() => {
        if (projectsCarousel.updateNavigationButtons) {
            projectsCarousel.updateNavigationButtons();
        }
    }, 1500);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate animations if needed
    scrollAnimations.init();
    magneticEffect.init();

    // Update carousel navigation
    if (projectsCarousel.updateNavigationButtons) {
        projectsCarousel.updateNavigationButtons();
    }
});

// Prevent right-click context menu (optional)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add smooth scroll behavior for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Error handling for external links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[target="_blank"]');
    if (link) {
        // Add error handling for external links
        link.addEventListener('error', () => {
            console.warn('Failed to load external link:', link.href);
        });
    }
});

// Add loading states for buttons
const addLoadingState = (button, duration = 2000) => {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
    }, duration);
};

// Utility functions
const utils = {
    // Debounce function for scroll events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for frequent events
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for global access
window.downloadResume = downloadResume;
window.utils = utils;