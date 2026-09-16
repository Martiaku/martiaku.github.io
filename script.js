document.addEventListener('DOMContentLoaded', () => {
    // Načtení uloženého jazyka (nebo defaultně češtiny)
    const savedLang = localStorage.getItem('language') || 'cs';
    setLanguage(savedLang);

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

// 4. Funkce pro přepínání jazyků
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
}