// Global variables
let currentSlide = {
    classProjects: 0,
    personalProjects: 0
};

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

// Project Filter
const projectFilter = {
    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card-enhanced');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInScale 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
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
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Create mailto link
            const mailtoLink = `mailto:gon22043@byui.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Reset form
            form.reset();

            // Show success message
            alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo.');
        });
    }
};

// Download Resume Function
function downloadResume() {
    // You can replace this with an actual resume file URL
    alert('Resume download will be implemented soon!');
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
    projectFilter.init();
    smoothScrolling.init();
    contactForm.init();
    headerScrollEffect.init();

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
});

// Prevent right-click context menu (optional)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any modals or reset states
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate animations if needed
    scrollAnimations.init();
    magneticEffect.init();
});

// Preload images for better performance
const preloadImages = () => {
    const imageUrls = [
        // Add any image URLs you want to preload
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};

// Call preload when page starts loading
preloadImages();