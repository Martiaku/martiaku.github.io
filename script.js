document.addEventListener('DOMContentLoaded', () => {
    // Načtení uloženého jazyka (nebo defaultně češtiny)
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    initializePrivacyNotice();

    // 1. Motivy (Dark/Light)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // 2. Mobilní menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        const closeMobileMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        };

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMobileMenu));
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

    // 3. Psací efekt kódu pouze pro prvky viditelné ve viewportu
    const typeText = (element, text, speed = 26, shouldStop = () => false) => {
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

    const eraseText = (element, speed = 12, shouldStop = () => false) => {
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

    const createTypingLoop = (element, text) => {
        let timeoutId;
        let active = false;

        const run = () => {
            if (!active) return;
            typeText(element, text, 26, () => !active);
            timeoutId = window.setTimeout(() => {
                if (!active) return;
                eraseText(element, 12, () => !active);
                timeoutId = window.setTimeout(run, 700 + text.length * 20);
            }, text.length * 26 + 700);
        };

        return {
            start() {
                active = true;
                run();
            },
            stop() {
                active = false;
                window.clearTimeout(timeoutId);
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
                typingControllers.set(element, createTypingLoop(element, text));
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

    // 4. Zobrazení karet při skrolování
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});
// 5. GDPR banner
const privacyNoticeCopy = {
    cs: {
        title: 'Soukromí na tomto webu',
        message: 'Tento web neukládá osobní údaje na vlastní server. LocalStorage používá pouze pro zapamatování motivu a jazyka. Data z kontaktního formuláře jsou zpracována a uložena službou třetí strany.',
    accept: 'Rozumím',
    reject: 'Odmítám',
    link: 'Více o soukromí'
    },
    en: {
    title: 'Privacy on this website',
    message: 'This website does not store personal data on its own server. LocalStorage is used only for theme and language settings. Contact form submissions are processed and stored via a third-party service.',
    accept: 'Got it',
    reject: 'Decline',
    link: 'More about privacy'
    },
    de: {
    title: 'Datenschutz auf dieser Website',
    message: 'Diese Website speichert keine personenbezogenen Daten auf einem eigenen Server. LocalStorage wird nur für Design und Sprache verwendet. Daten aus dem Kontaktformular werden über einen Drittanbieter verarbeitet und gespeichert.',
    accept: 'Verstanden',
    reject: 'Ablehnen',
    link: 'Mehr zum Datenschutz'
    }
};

function initializePrivacyNotice() {
    if (localStorage.getItem('privacyNoticeDismissed') === 'true') return;

    const banner = document.createElement('aside');
    banner.id = 'gdpr-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
        <div class="gdpr-banner__content">
            <div class="gdpr-banner__copy">
                <strong data-privacy-title></strong>
                <p data-privacy-message></p>
                <a href="privacy.html" data-privacy-link></a>
            </div>
            <div class="gdpr-banner__actions">
                <button type="button" class="gdpr-btn gdpr-btn--ghost" data-privacy-reject></button>
                <button type="button" class="gdpr-btn gdpr-btn--primary" data-privacy-dismiss></button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
    updatePrivacyNotice(document.body.dataset.language || 'cs');

    banner.querySelector('[data-privacy-dismiss]').addEventListener('click', () => {
        localStorage.setItem('privacyNoticeDismissed', 'true');
        banner.remove();
    });

    banner.querySelector('[data-privacy-reject]').addEventListener('click', () => {
        banner.remove();
    });
}

function updatePrivacyNotice(lang) {
    const banner = document.getElementById('gdpr-banner');
    if (!banner) return;

    const copy = privacyNoticeCopy[lang] || privacyNoticeCopy.cs;
    banner.querySelector('[data-privacy-title]').textContent = copy.title;
    banner.querySelector('[data-privacy-message]').textContent = copy.message;
    banner.querySelector('[data-privacy-dismiss]').textContent = copy.accept;
    banner.querySelector('[data-privacy-reject]').textContent = copy.reject;

    const privacyLink = banner.querySelector('[data-privacy-link]');
    privacyLink.textContent = copy.link;
    privacyLink.href = 'privacy.html';
}

//6. Funkce pro přepínání jazyků
function setLanguage(lang) {
    localStorage.setItem('language', lang); // Uložení volby jazyka

    document.body.setAttribute('data-language', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('is-active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${lang}'`)) {
            btn.classList.add('is-active');
        }
    });

    document.querySelectorAll('[data-cs]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });

    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.getAttribute(`data-${lang}`)) {
        pageTitle.textContent = pageTitle.getAttribute(`data-${lang}`);
    }

    const metaDesc = document.getElementById('meta-desc');
    if (metaDesc && metaDesc.getAttribute(`data-${lang}`)) {
        metaDesc.setAttribute('content', metaDesc.getAttribute(`data-${lang}`));
    }

    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
        const href = cvLink.getAttribute(`data-${lang}`);
        const text = cvLink.getAttribute(`data-text-${lang}`);
        if (href) cvLink.setAttribute('href', href);
        if (text) cvLink.textContent = text;
    }

    updatePrivacyNotice(lang);
}