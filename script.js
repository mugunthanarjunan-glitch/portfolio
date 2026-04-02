// Custom Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }
});


window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const progress = (currentScroll / scrollableHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
});

const typingText = document.getElementById('typing-text');
const words = ["Full Stack Developer", "MERN Engineer", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = 100;
    if (isDeleting) typeSpeed /= 2;

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Intersection Observer for Scroll Reveals
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // If it's a grid, trigger stagger for children
            if (entry.target.classList.contains('skills-grid') || entry.target.classList.contains('projects-grid')) {
                const items = entry.target.querySelectorAll('.stagger');
                items.forEach((item, index) => {
                    setTimeout(() => item.classList.add('active'), index * 100);
                });
            }
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

// Navbar Scroll Toggle
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active link based on scroll
    updateActiveLink();
});

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Page Load Stagger
function pageLoadAnimation() {
    const loadElements = document.querySelectorAll('.reveal-load');
    loadElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 200 + (index * 150));
    });
}

// Form Submission Handler
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI Feedback: Loading
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Transmitting...';
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const formData = new FormData(contactForm);
        
        try {
            // Check if user replaced the placeholder key
            if (formData.get('access_key') === 'YOUR_ACCESS_KEY_HERE') {
                formStatus.textContent = '⚠️ Please replace "YOUR_ACCESS_KEY_HERE" in index.html with a real key from web3forms.com';
                formStatus.classList.add('error');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Success
                formStatus.textContent = '✓ Message Transmitted Successfully!';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                // Error from Web3Forms
                formStatus.textContent = result.message || 'Oops! Transmission failed.';
                formStatus.classList.add('error');
            }
        } catch (error) {
            // Network Error
            formStatus.textContent = 'Oops! Network error during transmission.';
            formStatus.classList.add('error');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    type();
    pageLoadAnimation();
    
    // Observe reveals
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    // Smooth Scroll Enhancement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
