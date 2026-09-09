// ==========================================
// 1. MOBILNÍ MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');
const body = document.body;

if (hamburger && navMenu) {
    const closeMobileMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
        if (
            navMenu.classList.contains('active')
            && !navMenu.contains(event.target)
            && !hamburger.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });
}

// ==========================================
// 2. SCROLL MOTION (PARALLAX EFEKT)
// ==========================================
const root = document.documentElement;
const updateScrollMotion = () => {
    const y = window.scrollY || window.pageYOffset;
    root.style.setProperty('--scroll', `${y * 0.6}px`);
};

window.addEventListener('scroll', updateScrollMotion, { passive: true });
updateScrollMotion();

// ==========================================
// 3. PSACÍ EFEKT (TYPING EFFECT)
// ==========================================
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

// ==========================================
// 4. OBSERVERY PRO ANIMACE PŘI SCROLLU
// ==========================================
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

// ==========================================
// 5. GDPR A SPRÁVA MOTIVŮ (STORAGE)
// ==========================================
const GDPR_STORAGE_KEY = 'martin-portfolio-gdpr-v1';
const THEME_STORAGE_KEY = 'martin-portfolio-theme';

const safeStorage = {
    get(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
        try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    },
    remove(key) {
        try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
};

const getConsent = () => {
    const raw = safeStorage.get(GDPR_STORAGE_KEY);
    if (!raw) {
        return { decision: false, necessary: true, theme: true, analytics: false, marketing: false, version: 1 };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            decision: Boolean(parsed.decision),
            necessary: true,
            theme: Boolean(parsed.theme),
            analytics: false,
            marketing: false,
            version: 1
        };
    } catch (e) {
        return { decision: false, necessary: true, theme: true, analytics: false, marketing: false, version: 1 };
    }
};

const saveConsent = (config = {}) => {
    const nextConsent = {
        decision: true,
        necessary: true,
        theme: Boolean(config.theme),
        analytics: false,
        marketing: false,
        version: 1,
        savedAt: new Date().toISOString()
    };

    safeStorage.set(GDPR_STORAGE_KEY, JSON.stringify(nextConsent));

    if (nextConsent.theme) {
        const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        safeStorage.set(THEME_STORAGE_KEY, currentTheme);
    } else {
        safeStorage.remove(THEME_STORAGE_KEY);
    }

    return nextConsent;
};

const applyTheme = (theme) => {
    const isLight = theme === 'light';
    body.classList.toggle('light-mode', isLight);
};

const initializeTheme = () => {
    const consent = getConsent();
    const savedTheme = safeStorage.get(THEME_STORAGE_KEY);
    const preferredTheme = consent.theme && savedTheme === 'light' ? 'light' : 'dark';
    applyTheme(preferredTheme);
};

const injectGdprBanner = () => {
    if (document.getElementById('gdpr-banner') || document.getElementById('gdpr-settings-panel')) return;

    const consent = getConsent();
    if (consent.decision) return;

    const banner = document.createElement('div');
    banner.id = 'gdpr-banner';
    banner.setAttribute('role', 'dialog');
    const copy = document.body.dataset;
    banner.setAttribute('aria-label', copy.gdprTitle);
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
        <div class="gdpr-banner__content">
            <div class="gdpr-banner__copy">
                <strong>${copy.gdprTitle}</strong>
                <p>${copy.gdprDescription}</p>
            </div>
            <div class="gdpr-banner__actions">
                <button class="gdpr-btn gdpr-btn--primary" data-gdpr-action="accept">${copy.gdprAccept}</button>
                <button class="gdpr-btn gdpr-btn--ghost" data-gdpr-action="reject">${copy.gdprReject}</button>
            </div>
        </div>
        <div class="gdpr-banner__panel" id="gdpr-settings-panel" hidden>
            <div class="gdpr-banner__settings">
                <label class="gdpr-option">
                    <input type="checkbox" id="gdpr-theme-checkbox" checked />
                    <span>${copy.gdprTheme}</span>
                </label>
                <label class="gdpr-option is-disabled">
                    <input type="checkbox" disabled />
                    <span>${copy.gdprAnalytics}</span>
                </label>
                <label class="gdpr-option is-disabled">
                    <input type="checkbox" disabled />
                    <span>${copy.gdprMarketing}</span>
                </label>
            </div>
            <div class="gdpr-banner__settings-actions">
                <button class="gdpr-btn gdpr-btn--primary" data-gdpr-action="save-settings">${copy.gdprSave}</button>
                <button class="gdpr-btn gdpr-btn--ghost" data-gdpr-action="close-settings">${copy.gdprClose}</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    banner.querySelectorAll('[data-gdpr-action]').forEach((button) => {
        button.addEventListener('click', () => {
            const action = button.dataset.gdprAction;

            if (action === 'accept') {
                saveConsent({ theme: true });
                banner.remove();
                return;
            }
            if (action === 'reject') {
                saveConsent({ theme: false });
                banner.remove();
                return;
            }
            if (action === 'save-settings') {
                const themeCheckbox = document.getElementById('gdpr-theme-checkbox');
                const themeChecked = themeCheckbox ? themeCheckbox.checked : false;
                saveConsent({ theme: themeChecked });
                banner.remove();
                return;
            }
            if (action === 'close-settings') {
                banner.remove();
            }
        });
    });
};

const themeToggleBtn = document.getElementById('theme-toggle');
initializeTheme();

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isLight = body.classList.contains('light-mode');
        const nextTheme = isLight ? 'dark' : 'light';
        applyTheme(nextTheme);

        const consent = getConsent();
        if (consent.theme) {
            safeStorage.set(THEME_STORAGE_KEY, nextTheme);
        }
    });
}

injectGdprBanner();

// ==========================================
// 7. LIGHTBOX (ZVĚTŠENÍ OBRÁZKŮ)
// ==========================================
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.querySelector('.modal-close');
const clickableImages = document.querySelectorAll('.hero-image-box img, .project-image-box img');

if (clickableImages.length > 0 && modal && modalImg && modalClose) {
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