// ==========================================
// 1. MOBILNÍ MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');
const body = document.body;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
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
// 5. JAZYKOVÁ MUTACE
// ==========================================
const LANGUAGE_STORAGE_KEY = 'martin-portfolio-language';
const translations = {
    en: {
        title: 'Personal Portfolio | Martin Kučera', nav: ['About', 'Skills', 'Certificates', 'Projects', 'Contact'],
        cv: 'Download CV', badge: 'Hello, I am a developer / programmer',
        hero: 'I am learning modern technologies such as Python, Django, React and JavaScript. I combine code logic with an eye for clean design.',
        viewProjects: 'View projects', moreAbout: 'More about me',
        headings: ['01. About me', '02. Skills & Technologies', '03. Certificates', '04. Projects', '05. Contact'],
        about: [
            'I am at the beginning of my programming career, but I approach problem-solving responsibly and with determination. I enjoy discovering how things work under the hood, whether it is web application development or 3D modelling.',
            'In 2025, I decided to pursue a career in development. I chose the ITnetwork, s.r.o. retraining course, where I learned programming fundamentals and technologies such as Python, Django and React. Since then, I have focused on self-study and developing my programming and web development skills.'
        ],
        stats: ['Basics & Django', 'Logic & Interaction', 'Components', 'Modelling & Patterns'],
        skills: [
            ['Frontend', 'HTML5, CSS3, JavaScript (ES6+), React. Building responsive interfaces.'],
            ['Backend', 'Python, Django Framework, REST API and working with databases (SQLite).'],
            ['Tools & Other', 'Git / GitHub, OpenSCAD (3D modelling), debugging and a desire to keep learning.']
        ],
        certs: [
            ['Python Basics', 'Programming fundamentals and solution structure in Python.'],
            ['Python Follow-up', 'Extended skills after the Python basics course.'],
            ['JavaScript Basics', 'Variables, functions, logic and interactive behaviour.'],
            ['Django Basics', 'Working with the Django framework and basic application architecture.'],
            ['React Basics', 'Components, props, state and basic render flow.'],
            ['Git', 'Working with versioning, branches and GitHub workflows.'],
            ['Modern Web Design', 'A modern approach to design and UX in web projects.'],
            ['REST API in Django', 'Creating APIs and working with data in a real project.'],
            ['SQLite', 'Database operations and working with data structures.'],
            ['NumPy', 'Working with data and mathematical operations in Python.']
        ],
        projects: [
            ['Currency Exchange App', 'An interactive console application designed to manage and calculate exchange operations. The project was created as part of my self-study in programming, with an emphasis on clean logic.'],
            ['Energy Consumption Tracking', 'A practical Python console application designed to record, calculate and analyse household energy consumption.']
        ],
        contact: 'Have a question, want to discuss a collaboration or simply connect? Send me a message!',
        form: ['Name', 'Your name', 'Email', 'your@email.com', 'Message', 'Write me a message...', 'Send message'],
        privacy: ['Privacy Policy', 'This website (Martin Kučera - Personal portfolio) is a presentation page for my projects and programming skills.', '1. What data do I collect?', 'This website does not collect any personal data for marketing or behavioural analysis (I do not use Google Analytics or tracking pixels), nor do I share it with third parties.', '2. Local storage (LocalStorage)', 'The website uses browser storage only to save your appearance preference (dark or light mode). This data never leaves your device.', '3. Contact form', 'The contact form is currently static (a design element). Data entered into it is not sent or stored on a server. To contact me, please use my direct links (for example GitHub).', '4. Contact', 'If you have questions about privacy, you can contact me through my GitHub profile.', 'Back to homepage'],
        footerPrivacy: 'Privacy Policy'
    },
    cs: {
        title: 'Osobní Portfolio | Martin Kučera', nav: ['O mně', 'Dovednosti', 'Certifikáty', 'Projekty', 'Kontakt'],
        cv: 'Stáhnout CV', badge: 'Ahoj, já jsem vývojář / programátor',
        hero: 'Učím se moderní technologie jako Python, Django, React a JavaScript. Spojuji logiku kódu s citem pro čistý design.',
        viewProjects: 'Prohlédnout projekty', moreAbout: 'Více o mně',
        headings: ['01. O mně', '02. Dovednosti & Technologie', '03. Certifikáty', '04. Projekty', '05. Kontakt'],
        about: ['Jsem na začátku své programátorské dráhy, ale k řešení problémů přistupuji zodpovědně a s odhodláním. Baví mě objevovat, jak věci fungují pod kapotou, ať už jde o vývoj webových aplikací nebo konstruování v 3D prostoru.', 'V roce 2025 jsem se rozhodl vydat se na vývojovou kariéru. Vybral jsem si rekvalifikační kurz ITnetwork, s.r.o., kde jsem získal základy programování a seznámil se s technologiemi jako Python, Django a React. Od té doby se věnuji samostudiu a rozvoji svých dovedností v oblasti programování a webového vývoje.'],
        stats: ['Základy & Django', 'Logika & Interakce', 'Komponenty', 'Modelování & Vzory'],
        skills: [['Frontend', 'HTML5, CSS3, JavaScript (ES6+), React. Tvorba responzivních rozhraní.'], ['Backend', 'Python, Django Framework, REST API, práce s databázemi (SQLite).'], ['Nástroje & Ostatní', 'Git / GitHub, OpenSCAD (3D modelování), ladění kódu a chuť neustále se učit.']],
        certs: [['Základy Pythonu', 'Programovací základy a struktura řešení v Pythonu.'], ['Python Follow up', 'Rozšířené dovednosti po základním kurzu v Pythonu.'], ['Základy JavaScriptu', 'Proměnné, funkce, logika a interaktivní chování.'], ['Základy Django', 'Práce s frameworkem Django a základní architekturou aplikace.'], ['Základy Reactu', 'Komponenty, props, stav a základní render flow.'], ['Git', 'Práce s verzováním, větvemi a workflow v GitHub.'], ['Moderní webdesign', 'Moderní přístup k designu a UX v webových projektech.'], ['REST API v Django', 'Vytváření API a práce s daty v reálném projektu.'], ['SQLite', 'Databázové operace a práce se strukturou dat.'], ['NumPy', 'Práce s daty a matematickými operacemi v Pythonu.']],
        projects: [['Směnárenská aplikace', 'Interaktivní konzolová aplikace navržená pro správu a výpočet směnárenských operací. Projekt vznikl v rámci mého sebevzdělávání v programování s důrazem na čistou logiku.'], ['Sledování spotřeby energie', 'Praktická konzolová aplikace v Pythonu navržená pro evidenci, výpočet a analýzu domácí spotřeby energií.']],
        contact: 'Máš na mě dotaz, chceš probrat spolupráci nebo se jen propojit? Napiš mi!', form: ['Jméno', 'Tvoje jméno', 'E-mail', 'tvuj@email.cz', 'Zpráva', 'Napiš mi zprávu...', 'Odeslat zprávu'],
        privacy: ['Ochrana soukromí', 'Tento web (Martin Kučera - Osobní portfolio) slouží jako prezentační stránka mých projektů a dovedností v oblasti programování.', '1. Jaká data sbírám?', 'Na těchto stránkách nesbírám žádná osobní data za účelem marketingu, analýzy chování (nepoužívám Google Analytics ani sledovací pixely) ani je neposkytuji třetím stranám.', '2. Lokální úložiště (LocalStorage)', 'Web využívá technologii úložiště prohlížeče (localStorage) výhradně pro uložení tvé preference vzhledu (zda máš aktivní tmavý, nebo světelný režim). Tato data neopouštějí tvoje zařízení.', '3. Kontaktní formulář', 'Kontaktní formulář na webu je aktuálně statický (designový prvek). Pokud do něj cokoliv vyplníš, data se nikam neodesílají ani neukládají na server. Pro kontaktování mě prosím využij přímo přes mé odkazy (např. GitHub).', '4. Kontakt', 'V případě jakýchkoliv dotazů ohledně soukromí mě můžeš kontaktovat přes můj GitHub profil.', 'Zpět na hlavní stránku'], footerPrivacy: 'Ochrana soukromí'
    },
    de: {
        title: 'Persönliches Portfolio | Martin Kučera', nav: ['Über mich', 'Fähigkeiten', 'Zertifikate', 'Projekte', 'Kontakt'],
        cv: 'CV herunterladen', badge: 'Hallo, ich bin Entwickler / Programmierer',
        hero: 'Ich lerne moderne Technologien wie Python, Django, React und JavaScript. Ich verbinde Code-Logik mit einem Gespür für klares Design.',
        viewProjects: 'Projekte ansehen', moreAbout: 'Mehr über mich',
        headings: ['01. Über mich', '02. Fähigkeiten & Technologien', '03. Zertifikate', '04. Projekte', '05. Kontakt'],
        about: ['Ich stehe am Anfang meiner Programmierkarriere, gehe Probleme aber verantwortungsvoll und entschlossen an. Ich entdecke gerne, wie Dinge unter der Oberfläche funktionieren – von Webanwendungen bis zur 3D-Konstruktion.', '2025 entschied ich mich für eine Karriere in der Entwicklung. Im Umschulungskurs von ITnetwork, s.r.o. erlernte ich Programmiergrundlagen sowie Python, Django und React. Seitdem bilde ich mich selbstständig weiter.'],
        stats: ['Grundlagen & Django', 'Logik & Interaktion', 'Komponenten', 'Modellierung & Muster'],
        skills: [['Frontend', 'HTML5, CSS3, JavaScript (ES6+), React. Entwicklung responsiver Oberflächen.'], ['Backend', 'Python, Django Framework, REST API und Datenbanken (SQLite).'], ['Werkzeuge & Sonstiges', 'Git / GitHub, OpenSCAD (3D-Modellierung), Debugging und Freude am Lernen.']],
        certs: [['Python-Grundlagen', 'Programmiergrundlagen und Lösungsstrukturen in Python.'], ['Python Follow-up', 'Erweiterte Kenntnisse nach dem Python-Grundkurs.'], ['JavaScript-Grundlagen', 'Variablen, Funktionen, Logik und interaktives Verhalten.'], ['Django-Grundlagen', 'Arbeit mit dem Django-Framework und grundlegender Anwendungsarchitektur.'], ['React-Grundlagen', 'Komponenten, Props, State und grundlegender Render-Flow.'], ['Git', 'Versionierung, Branches und GitHub-Workflows.'], ['Modernes Webdesign', 'Moderner Ansatz für Design und UX in Webprojekten.'], ['REST API in Django', 'Erstellung von APIs und Arbeit mit Daten in einem echten Projekt.'], ['SQLite', 'Datenbankoperationen und Datenstrukturen.'], ['NumPy', 'Arbeit mit Daten und mathematischen Operationen in Python.']],
        projects: [['Währungsrechner', 'Interaktive Konsolenanwendung zur Verwaltung und Berechnung von Wechselvorgängen. Entstanden im Selbststudium mit Fokus auf sauberer Logik.'], ['Energieverbrauch verfolgen', 'Praktische Python-Konsolenanwendung zur Erfassung, Berechnung und Analyse des Energieverbrauchs im Haushalt.']],
        contact: 'Hast du eine Frage, möchtest du eine Zusammenarbeit besprechen oder dich einfach vernetzen? Schreib mir!', form: ['Name', 'Dein Name', 'E-Mail', 'deine@email.de', 'Nachricht', 'Schreib mir eine Nachricht...', 'Nachricht senden'],
        privacy: ['Datenschutzerklärung', 'Diese Website (Martin Kučera - Persönliches Portfolio) präsentiert meine Projekte und Programmierkenntnisse.', '1. Welche Daten sammle ich?', 'Diese Website sammelt keine personenbezogenen Daten für Marketing oder Verhaltensanalyse (kein Google Analytics und keine Tracking-Pixel) und gibt sie nicht an Dritte weiter.', '2. Lokaler Speicher (LocalStorage)', 'Die Website nutzt den Browser-Speicher ausschließlich für deine Darstellungseinstellung (dunkler oder heller Modus). Diese Daten verlassen dein Gerät nicht.', '3. Kontaktformular', 'Das Kontaktformular ist derzeit statisch. Eingegebene Daten werden weder gesendet noch auf einem Server gespeichert. Für Kontakt nutze bitte meine direkten Links, zum Beispiel GitHub.', '4. Kontakt', 'Bei Fragen zum Datenschutz kannst du mich über mein GitHub-Profil kontaktieren.', 'Zur Startseite'], footerPrivacy: 'Datenschutzerklärung'
    }
};

const setText = (selector, value, index = 0) => {
    const elements = document.querySelectorAll(selector);
    if (elements[index]) elements[index].textContent = value;
};

const translatePage = (language) => {
    const t = translations[language] || translations.en;
    document.documentElement.lang = language;
    document.title = document.body.classList.contains('privacy-page') ? t.privacy[0] + ' | Martin Kučera' : t.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && !document.body.classList.contains('privacy-page')) {
        description.content = {
            en: 'Personal portfolio of Martin Kučera, a developer focused on Python, Django, React and modern web development.',
            cs: 'Osobní portfolio Martina Kučery, vývojáře zaměřeného na Python, Django, React a moderní webový vývoj.',
            de: 'Persönliches Portfolio von Martin Kučera, Entwickler mit Fokus auf Python, Django, React und moderne Webentwicklung.'
        }[language];
    }
    t.nav.forEach((value, index) => setText('.nav-links a', value, index));
    setText('.header-cv-btn', t.cv);
    setText('.badge', t.badge);
    setText('.hero-content > p', t.hero);
    setText('.hero-buttons .btn-primary', t.viewProjects);
    setText('.hero-buttons .btn-secondary', t.moreAbout);
    t.headings.forEach((value, index) => setText('.section-title', `// ${value}`, index));
    t.about.forEach((value, index) => setText('.about-card > p', value, index));
    t.stats.forEach((value, index) => setText('.stat-desc', value, index));
    t.skills.forEach((value, index) => { setText('.skill-card h3', value[0], index); setText('.skill-card p', value[1], index); });
    t.certs.forEach((value, index) => { setText('.cert-card h3', value[0], index); setText('.cert-card p', value[1], index); });
    t.projects.forEach((value, index) => { setText('.project-card h3', value[0], index); setText('.project-card p', value[1], index); });
    setText('.contact-text', t.contact);
    setText('footer a[href="privacy.html"]', t.footerPrivacy);
    ['label[for="name"]', '#name', 'label[for="email"]', '#email', 'label[for="message"]', '#message'].forEach((selector, index) => {
        const values = [t.form[0], t.form[1], t.form[2], t.form[3], t.form[4], t.form[5]];
        if (index % 2 === 1) document.querySelector(selector)?.setAttribute('placeholder', values[index]);
        else setText(selector, values[index]);
    });
    setText('.form-card button', t.form[6]);
    if (document.body.classList.contains('privacy-page')) {
        setText('.privacy-section .section-title', `// ${t.privacy[0]}`);
        setText('.privacy-intro', t.privacy[1]);
        [2, 4, 6, 8].forEach((sourceIndex, index) => setText('.privacy-card h3', t.privacy[sourceIndex], index));
        [3, 5, 7, 9].forEach((sourceIndex, index) => setText('.privacy-card p:not(.privacy-intro)', t.privacy[sourceIndex], index));
        setText('.privacy-footer-btn a', t.privacy[10]);
    }
    const consentText = {
        en: ['Privacy and settings', 'This website only stores your appearance preference. No analytics or marketing cookies are stored without your consent.', 'Accept all', 'Reject', 'Store appearance preference', 'Anonymous analytics (not used)', 'Marketing cookies (not used)', 'Save settings', 'Close'],
        cs: ['Soukromí a nastavení', 'Na tomto webu ukládáme pouze vaši volbu vzhledu. Bez vašeho souhlasu neukládáme žádné analytické ani marketingové cookies.', 'Přijmout vše', 'Odmítnout', 'Ukládat preferenci vzhledu', 'Anonymní analytika (nepoužíváme)', 'Marketingové cookies (nepoužíváme)', 'Uložit nastavení', 'Zavřít'],
        de: ['Datenschutz und Einstellungen', 'Diese Website speichert nur deine Darstellungseinstellung. Ohne deine Zustimmung werden keine Analyse- oder Marketing-Cookies gespeichert.', 'Alle akzeptieren', 'Ablehnen', 'Darstellungseinstellung speichern', 'Anonyme Analyse (nicht verwendet)', 'Marketing-Cookies (nicht verwendet)', 'Einstellungen speichern', 'Schließen']
    }[language];
    if (document.getElementById('gdpr-banner')) {
        setText('#gdpr-banner .gdpr-banner__copy strong', consentText[0]);
        setText('#gdpr-banner .gdpr-banner__copy p', consentText[1]);
        setText('[data-gdpr-action="accept"]', consentText[2]);
        setText('[data-gdpr-action="reject"]', consentText[3]);
        setText('.gdpr-option span', consentText[4], 0);
        setText('.gdpr-option span', consentText[5], 1);
        setText('.gdpr-option span', consentText[6], 2);
        setText('[data-gdpr-action="save-settings"]', consentText[7]);
        setText('[data-gdpr-action="close-settings"]', consentText[8]);
        document.getElementById('gdpr-banner').setAttribute('aria-label', consentText[0]);
    }
    document.querySelectorAll('.language-btn').forEach(button => button.classList.toggle('is-active', button.dataset.language === language));
};

const initializeLanguage = () => {
    const saved = safeStorage.get(LANGUAGE_STORAGE_KEY);
    const pageLanguage = document.body.dataset.language;
    const language = ['en', 'cs', 'de'].includes(pageLanguage)
        ? pageLanguage
        : (['en', 'cs', 'de'].includes(saved) ? saved : 'en');
    translatePage(language);
    document.querySelectorAll('.language-btn').forEach(button => button.addEventListener('click', () => {
        const nextLanguage = button.dataset.language;
        safeStorage.set(LANGUAGE_STORAGE_KEY, nextLanguage);
    }));
};

// ==========================================
// 6. GDPR A SPRÁVA MOTIVŮ (STORAGE)
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

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Přepnout na tmavý režim' : 'Přepnout na světlý režim');
    }
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
    banner.setAttribute('aria-label', 'Soukromí a nastavení cookies');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
        <div class="gdpr-banner__content">
            <div class="gdpr-banner__copy">
                <strong>Soukromí a nastavení</strong>
                <p>Na tomto webu ukládáme pouze vaši volbu vzhledu. Bez vašeho souhlasu neukládáme žádné analytické ani marketingové cookies.</p>
            </div>
            <div class="gdpr-banner__actions">
                <button class="gdpr-btn gdpr-btn--primary" data-gdpr-action="accept">Přijmout vše</button>
                <button class="gdpr-btn gdpr-btn--ghost" data-gdpr-action="reject">Odmítnout</button>
            </div>
        </div>
        <div class="gdpr-banner__panel" id="gdpr-settings-panel" hidden>
            <div class="gdpr-banner__settings">
                <label class="gdpr-option">
                    <input type="checkbox" id="gdpr-theme-checkbox" checked />
                    <span>Ukládat preferenci vzhledu</span>
                </label>
                <label class="gdpr-option is-disabled">
                    <input type="checkbox" disabled />
                    <span>Anonymní analytika (nepoužíváme)</span>
                </label>
                <label class="gdpr-option is-disabled">
                    <input type="checkbox" disabled />
                    <span>Marketingové cookies (nepoužíváme)</span>
                </label>
            </div>
            <div class="gdpr-banner__settings-actions">
                <button class="gdpr-btn gdpr-btn--primary" data-gdpr-action="save-settings">Uložit nastavení</button>
                <button class="gdpr-btn gdpr-btn--ghost" data-gdpr-action="close-settings">Zavřít</button>
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
                const themeChecked = document.getElementById('gdpr-theme-checkbox')?.checked;
                saveConsent({ theme: Boolean(themeChecked) });
                banner.remove();
                return;
            }
            if (action === 'close-settings') {
                const panel = document.getElementById('gdpr-settings-panel');
                if (panel) panel.hidden = true;
            }
        });
    });
};

initializeLanguage();
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
const currentLanguage = document.body.dataset.language || safeStorage.get(LANGUAGE_STORAGE_KEY) || 'en';
translatePage(currentLanguage);

// ==========================================
// 6. LIGHTBOX (ZVĚTŠENÍ OBRÁZKŮ)
// ==========================================
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