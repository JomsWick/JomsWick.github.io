/* =====================================================================
   Jomel A. Ang — portfolio scripts (vanilla JS, no libraries)
   ===================================================================== */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------- typing effect in the hero ---------------------- */
(async function typeRoles() {
    const target = document.getElementById('text');
    if (!target) return;

    const phrases = ['Web Developer', 'Web Designer', 'UI/UX Designer', 'Graphic Designer'];
    const speed = 100;
    let index = 0;

    if (reduceMotion) {
        target.textContent = phrases[0];
        return;
    }

    while (true) {
        const word = phrases[index];

        for (let i = 0; i < word.length; i++) {
            target.textContent = word.substring(0, i + 1);
            await sleep(speed);
        }

        await sleep(speed * 10);

        for (let i = word.length; i > 0; i--) {
            target.textContent = word.substring(0, i - 1);
            await sleep(speed);
        }

        await sleep(speed * 5);
        index = (index + 1) % phrases.length;
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    /* ---------------------- mobile tab menu ---------------------- */
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    const closeMenu = () => {
        if (!navbar || !menuIcon) return;
        navbar.classList.remove('active');
        menuIcon.classList.remove('open');
        menuIcon.setAttribute('aria-expanded', 'false');
    };

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            const open = navbar.classList.toggle('active');
            menuIcon.classList.toggle('open', open);
            menuIcon.setAttribute('aria-expanded', String(open));
        });

        navbar.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', closeMenu));
    }

    /* -------- sticky header, scroll spy, progress bar, status bar -------- */
    const header = document.querySelector('.header');
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const tabs = Array.from(document.querySelectorAll('.navbar .tab'));
    const scrollBar = document.getElementById('scroll-bar');
    const statusFile = document.getElementById('status-file');
    const statusProgress = document.getElementById('status-progress');
    const toTop = document.getElementById('to-top');

    const fileNames = {
        home: 'home.js',
        about: 'about.md',
        skills: 'skills.json',
        portfolio: 'portfolio.tsx',
        contact: 'contact.js'
    };

    let ticking = false;

    const updateOnScroll = () => {
        ticking = false;
        const y = window.scrollY;

        if (header) header.classList.toggle('sticky', y > 60);
        if (toTop) toTop.classList.toggle('show', y > 600);

        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(100, Math.max(0, (y / scrollable) * 100)) : 0;

        if (scrollBar) scrollBar.style.width = progress + '%';
        if (statusProgress) statusProgress.textContent = Math.round(progress) + '%';

        const line = y + window.innerHeight * 0.3;
        let current = sections[0];

        sections.forEach((section) => {
            if (section.offsetTop <= line) current = section;
        });

        if (current) {
            tabs.forEach((tab) => {
                tab.classList.toggle('active', tab.getAttribute('href') === '#' + current.id);
            });
            if (statusFile) statusFile.textContent = fileNames[current.id] || current.id;
        }
    };

    const requestScrollUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateOnScroll);
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);
    updateOnScroll();

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------------------- portfolio filters ---------------------- */
    const filters = Array.from(document.querySelectorAll('.filter'));
    const projects = Array.from(document.querySelectorAll('.portfolio-box'));

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.filter;

            filters.forEach((other) => {
                const on = other === button;
                other.classList.toggle('active', on);
                other.setAttribute('aria-pressed', String(on));
            });

            projects.forEach((project) => {
                const match = target === 'all' || project.dataset.category === target;
                project.classList.toggle('is-hidden', !match);
                if (match) project.classList.add('visible');
            });
        });
    });

    /* ---------------------- reveal windows on scroll ---------------------- */
    const revealables = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealables.forEach((el) => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealables.forEach((el, i) => {
            el.style.transitionDelay = (i % 3) * 90 + 'ms';
            observer.observe(el);
        });
    }

    /* ---------------------- theme toggle ---------------------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const storedTheme = (() => {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    })();

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (!themeToggle) return;
        themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
        themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    };

    applyTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
        });
    }

    document.addEventListener('click', closeMenu);

    /* ---------------------- contact form (EmailJS) ---------------------- */
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');
    const contactForm = document.getElementById('contact-form');

    const showModal = (text) => {
        if (!modal || !modalMessage) return;
        modalMessage.textContent = text;
        modal.classList.add('show');
    };

    const hideModal = () => modal && modal.classList.remove('show');

    if (typeof emailjs !== 'undefined') emailjs.init('DiYCwEJYiCo_dglXd');

    /* inline validation, reported like linter output */
    const describe = (input) => {
        const key = input.name || input.id || 'field';
        const v = input.validity;

        if (v.valueMissing) return `${key} is required`;
        if (v.typeMismatch) return input.type === 'email' ? `${key} expects a valid email address` : `${key} has an invalid value`;
        if (v.tooShort) return `${key} is too short`;
        return input.validationMessage || `${key} is invalid`;
    };

    /* the status bar reports form errors like an editor reports problems */
    const statusbar = document.querySelector('.statusbar');
    const problemCount = document.getElementById('problem-count');
    const problemIcon = document.querySelector('#status-problems i');

    const updateProblems = () => {
        if (!contactForm || !problemCount) return;
        const count = contactForm.querySelectorAll('.field.invalid').length;

        problemCount.textContent = count;
        if (statusbar) statusbar.classList.toggle('has-problems', count > 0);
        if (problemIcon) problemIcon.className = count > 0 ? 'fa fa-circle-exclamation' : 'fa fa-circle-check';
    };

    const validateField = (input) => {
        const field = input.closest('.field');
        if (!field) return true;

        const slot = field.querySelector('.field-error');
        const ok = input.checkValidity();

        field.classList.toggle('invalid', !ok);
        if (slot) slot.textContent = ok ? '' : describe(input);
        input.setAttribute('aria-invalid', String(!ok));
        updateProblems();

        return ok;
    };

    if (contactForm) {
        const fields = Array.from(contactForm.querySelectorAll('input, textarea'));

        fields.forEach((input) => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                const field = input.closest('.field');
                if (field && field.classList.contains('invalid')) validateField(input);
            });
        });

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const invalid = fields.filter((input) => !validateField(input));

            if (invalid.length) {
                invalid[0].focus();
                showModal(invalid.length + ' problem' + (invalid.length > 1 ? 's' : '') + ' found. Check the highlighted fields.');
                setTimeout(hideModal, 3000);
                return;
            }

            if (typeof emailjs === 'undefined') {
                showModal('Mail service unavailable. Please try again later.');
                setTimeout(hideModal, 3000);
                return;
            }

            emailjs.sendForm('service_z5we367', 'template_dl5rauw', this).then(
                () => {
                    showModal('Your message has been sent!');
                    setTimeout(() => {
                        hideModal();
                        contactForm.reset();
                        contactForm.querySelectorAll('.field.invalid').forEach((f) => f.classList.remove('invalid'));
                        updateProblems();
                    }, 3000);
                },
                (error) => {
                    console.log('Error sending message:', error);
                    showModal('There was an error sending your message. Please try again.');
                    setTimeout(hideModal, 3000);
                }
            );
        });
    }

    if (closeButton) closeButton.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) hideModal();
    });

    /* ---------------------- parallax on the ambient windows ---------------------- */
    const layers = [
        { el: document.querySelector('.cw-1'), depth: 26 },
        { el: document.querySelector('.cw-2'), depth: -18 },
        { el: document.querySelector('.cw-3'), depth: 14 }
    ].filter((layer) => layer.el);

    if (reduceMotion || !layers.length || window.innerWidth <= 768) return;

    let pointerX = 0, pointerY = 0, offsetY = 0, queued = false;

    const render = () => {
        queued = false;
        layers.forEach(({ el, depth }) => {
            el.style.setProperty('--px', (pointerX * depth).toFixed(2) + 'px');
            el.style.setProperty('--py', (pointerY * depth + offsetY * depth * 0.006).toFixed(2) + 'px');
        });
    };

    const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', (event) => {
        pointerX = (event.clientX / window.innerWidth) * 2 - 1;
        pointerY = (event.clientY / window.innerHeight) * 2 - 1;
        schedule();
    });

    window.addEventListener('scroll', () => {
        offsetY = window.scrollY;
        schedule();
    }, { passive: true });
});
