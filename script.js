// Otevírání a zavírání mobilního menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Scroll motion
const root = document.documentElement;
const updateScrollMotion = () => {
    const y = window.scrollY || window.pageYOffset;
    root.style.setProperty('--scroll', `${y * 0.6}px`);
};

window.addEventListener('scroll', updateScrollMotion, { passive: true });
updateScrollMotion();

const typeText = (element, text, speed = 28, shouldStop = () => false) => {
    let index = 0;
    element.textContent = '';

    const tick = () => {
        if (shouldStop()) return;

        if (index <= text.length) {
            element.textContent = text.slice(0, index);
            index += 1;
            window.setTimeout(tick, speed);
        }
    };

    tick();
};

const eraseText = (element, speed = 18, shouldStop = () => false) => {
    let index = element.textContent.length;

    const tick = () => {
        if (shouldStop()) return;

        if (index >= 0) {
            element.textContent = element.textContent.slice(0, -1);
            index -= 1;
            window.setTimeout(tick, speed);
        }
    };

    tick();
};

const createTypingLoop = (element, text, delayBeforeErase = 1200, eraseDelay = 600) => {
    let timeoutIds = [];
    let active = false;

    const clearTimers = () => {
        timeoutIds.forEach(id => window.clearTimeout(id));
        timeoutIds = [];
    };

    const run = () => {
        if (!active) return;

        clearTimers();
        typeText(element, text, 26, () => !active);

        const typeComplete = window.setTimeout(() => {
            if (!active) return;
            eraseText(element, 12, () => !active);

            const afterErase = window.setTimeout(() => {
                if (active) run();
            }, eraseDelay + text.length * 20);

            timeoutIds.push(afterErase);
        }, text.length * 26 + delayBeforeErase);

        timeoutIds.push(typeComplete);
    };

    return {
        start() {
            active = true;
            run();
        },
        stop() {
            active = false;
            clearTimers();
            element.textContent = '';
        }
    };
};

const typedElements = document.querySelectorAll('[data-code]');
const typingControllers = new WeakMap();

const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const element = entry.target;
        const text = element.dataset.code || '';

        if (!text) return;

        if (!typingControllers.has(element)) {
            typingControllers.set(element, createTypingLoop(element, text, 700, 500));
        }

        const controller = typingControllers.get(element);

        if (entry.isIntersecting) {
            if (!element.dataset.typingActive) {
                element.dataset.typingActive = 'true';
                controller.start();
            }
        } else {
            delete element.dataset.typingActive;
            controller.stop();
        }
    });
}, { threshold: 0.2 });

typedElements.forEach(element => typingObserver.observe(element));

// Reveal efekt při scrollování
const revealItems = document.querySelectorAll('.card, .skill-card, .project-card, .contact-details');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach(item => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
        } else {
            entry.target.classList.remove('is-active');
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.section').forEach(section => sectionObserver.observe(section));

// Přepínání motivu
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
body.classList.add('theme-dark');

if (themeToggleBtn) {
    const applyThemeLabel = () => {
        const isLight = body.classList.contains('light-mode');
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Přepnout na tmavý režim' : 'Přepnout na světlý režim');
    };

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('theme-dark', !body.classList.contains('light-mode'));
        applyThemeLabel();
    });

    applyThemeLabel();
}

// Lightbox (zvětšení obrázků)
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.querySelector('.modal-close');
const clickableImages = document.querySelectorAll('.hero-image-box img, .project-image-box img');

if (clickableImages && modal && modalImg && modalClose) {
    clickableImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        });
    });

    const closeModal = () => { modal.style.display = 'none'; };
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
