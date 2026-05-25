/* ============================================
   Premium Portfolio — Interactions & Animations
   ============================================ */

// EmailJS Configuration — replace with your credentials from https://www.emailjs.com/
const EMAILJS_CONFIG = {
    publicKey: 'SFVDQK0ks8UvICwm_',
    serviceId: 'service_eepiasy',
    templateId: 'template_e27ec5b',
};

// ---- DOM References ----
const loader = document.getElementById('loader');
const cursorGlow = document.getElementById('cursor-glow');
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const typingEl = document.getElementById('typing-text');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');
const particleCanvas = document.getElementById('particle-canvas');

// ---- Page Loader ----
function initLoader() {
    document.body.classList.add('loading');

    const hideLoader = () => {
        loader?.classList.add('hidden');
        document.body.classList.remove('loading');
        initHeroAnimations();
    };

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 1200);
    });

    setTimeout(hideLoader, 3500);
}

// ---- Cursor Glow ----
function initCursorGlow() {
    if (!cursorGlow || window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// ---- Floating Particles ----
function initParticles() {
    if (!particleCanvas) return;

    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function createParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 18));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.2,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = particleCanvas.width;
            if (p.x > particleCanvas.width) p.x = 0;
            if (p.y < 0) p.y = particleCanvas.height;
            if (p.y > particleCanvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity * 0.35})`;
            ctx.fill();

            particles.slice(i + 1).forEach((p2) => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
        createParticles();
        draw();
    });
}

// ---- Scroll Progress & Navbar ----
function initScrollHandlers() {
    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

        if (scrollProgress) scrollProgress.style.width = `${progress}%`;
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
        backToTop?.classList.toggle('visible', window.scrollY > 500);

        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    let current = 'home';

    sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
    });

    links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ---- Typing Animation ----
const typingPhrases = [
    'Full Stack Developer',
    'MERN Engineer',
    'UI Architect',
    'Problem Solver',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    if (!typingEl) return;

    const current = typingPhrases[phraseIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        speed = 2200;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        speed = 500;
    }

    setTimeout(typeText, speed);
}

// ---- Mobile Navigation ----
function initMobileNav() {
    navToggle?.addEventListener('click', () => {
        const isOpen = navLinks?.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks?.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ---- Smooth Scroll ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = navbar?.offsetHeight || 80;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth',
            });
        });
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- GSAP Animations ----
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-eyebrow, .hero-title, .hero-role, .hero-desc, .hero-actions, .hero-stats', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 1.3,
    });

    gsap.from('.hero-visual', {
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.5,
    });

    gsap.from('.about-header', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-header',
            start: 'top 88%',
            once: true,
        },
    });

    gsap.utils.toArray('.about-feature-card').forEach((card, i) => {
        gsap.fromTo(
            card,
            { y: 48, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: i * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                    once: true,
                },
            }
        );
    });

    gsap.from('.about-panel', {
        y: 56,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-panel',
            start: 'top 90%',
            once: true,
        },
    });

    gsap.utils.toArray('.about-check').forEach((row, i) => {
        gsap.fromTo(
            row,
            { x: 24, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.55,
                delay: i * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about-panel__checks',
                    start: 'top 92%',
                    once: true,
                },
            }
        );
    });

    gsap.from('.about-cta', {
        y: 44,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-cta',
            start: 'top 93%',
            once: true,
        },
    });

    gsap.utils.toArray('.skills-block').forEach((block, i) => {
        gsap.fromTo(
            block,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.75,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: block,
                    start: 'top 90%',
                    once: true,
                },
            }
        );
    });

    gsap.utils.toArray('.skill-item').forEach((card, i) => {
        gsap.fromTo(
            card,
            { y: 28, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                delay: (i % 6) * 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 94%',
                    once: true,
                },
            }
        );
    });

    gsap.from('.skills-cta', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.skills-cta',
            start: 'top 92%',
            once: true,
        },
    });

    gsap.utils.toArray('.project-showcase-card').forEach((card, i) => {
        gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.85,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    once: true,
                },
            }
        );
    });

    gsap.from('.experience-header', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.experience-header',
            start: 'top 88%',
            once: true,
        },
    });

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const fromX = item.matches(':nth-of-type(even)') ? 28 : -28;

        gsap.fromTo(
            item,
            { x: fromX, y: 28, opacity: 0 },
            {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.78,
                delay: i * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    once: true,
                },
            }
        );
    });

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        gsap.to(timeline, {
            '--timeline-progress': '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: timeline,
                start: 'top 70%',
                end: 'bottom 62%',
                scrub: true,
            },
        });
    }

    gsap.from('.experience-cta', {
        y: 42,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.experience-cta',
            start: 'top 92%',
            once: true,
        },
    });

    ScrollTrigger.refresh();
}

function initHeroAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.from('.float-icon__card', {
            scale: 0.6,
            opacity: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'back.out(1.6)',
            delay: 0.4,
        });

        gsap.from('.tech-orbit', {
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: 'power2.out',
            delay: 0.6,
        });
    }
}

// ---- AOS ----
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: window.innerWidth < 480 ? 'phone' : false,
        });
    }
}

// ---- EmailJS Contact Form ----
function initContactForm() {
    if (!contactForm) return;

    const isConfigured =
        EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
        EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
        EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID';

    if (isConfigured && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const templateParams = {
            from_name: name,
            reply_to: email,
            subject,
            message,
            to_name: 'Mugunthan Arjunan',
        };

        try {
            if (!isConfigured) {
                throw new Error('CONFIGURE');
            }

            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );

            formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            formStatus.classList.add('success');
            contactForm.reset();
        } catch (err) {
            if (err.message === 'CONFIGURE') {
                formStatus.textContent =
                    'EmailJS is not configured yet. Add your keys in script.js (EMAILJS_CONFIG).';
            } else {
                formStatus.textContent = 'Failed to send. Please try again or email me directly.';
            }
            formStatus.classList.add('error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ---- Project Showcase Hover ----
function initProjectHover() {
    document.querySelectorAll('.project-showcase-card').forEach((card) => {
        const frame = card.querySelector('.project-visual__frame');
        if (!frame) return;

        card.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            frame.style.transform = `scale(1.03) translateY(-4px) perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            frame.style.removeProperty('transform');
        });
    });
}

// ---- Skill proficiency dots ----
function initSkillDots() {
    document.querySelectorAll('.skill-item').forEach((item) => {
        const container = item.querySelector('.skill-item__dots');
        if (!container) return;

        const level = parseInt(item.getAttribute('data-level') || '4', 10);
        const total = 5;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            if (i < level) dot.classList.add('active');
            container.appendChild(dot);
        }
    });
}

// ---- About panel mouse glow ----
function initAboutMouseGlow() {
    const panel = document.querySelector('.about-panel');
    const glow = panel?.querySelector('.about-panel__mouse-glow');
    if (!panel || !glow) return;

    panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        glow.style.setProperty('--about-mx', `${x}%`);
        glow.style.setProperty('--about-my', `${y}%`);
    });

    panel.addEventListener('mouseleave', () => {
        glow.style.setProperty('--about-mx', '50%');
        glow.style.setProperty('--about-my', '45%');
    });
}

// ---- Experience timeline interactions ----
function initExperienceInteractions() {
    document.querySelectorAll('.timeline-content').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) scale(1.01) perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('transform');
        });
    });
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursorGlow();
    initParticles();
    initScrollHandlers();
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initProjectHover();
    initSkillDots();
    initAboutMouseGlow();
    initExperienceInteractions();
    initAOS();

    setTimeout(() => {
        typeText();
        initGSAP();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 1300);
    });
});
