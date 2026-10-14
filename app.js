
'use strict';

/* ========================================
   MUTUA — JAVASCRIPT PRINCIPAL
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeader();
    initSmoothScroll();
    initRevealAnimations();
    initSkillFilters();
    initSkillSearch();
    initForms();
    initPasswordToggles();
    initBackToTop();
    initCurrentYear();
});

/* ========================================
   MENÚ MÓVIL
======================================== */

function initMobileMenu() {
    const menuButton = document.querySelector(
        '.menu-toggle, .hamburger, #menu-toggle, [data-menu-toggle]'
    );

    const navigation = document.querySelector(
        '.nav-links, .nav-menu, #nav-menu, [data-navigation]'
    );

    if (!menuButton || !navigation) return;

    menuButton.setAttribute('aria-expanded', 'false');

    menuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('active');

        menuButton.classList.toggle('active', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    });

    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('active');
            menuButton.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            navigation.classList.remove('active');
            menuButton.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ========================================
   ENCABEZADO AL DESPLAZARSE
======================================== */

function initHeader() {
    const header = document.querySelector(
        '.header, header, [data-header]'
    );

    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ========================================
   DESPLAZAMIENTO SUAVE
======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');

            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            if (history.replaceState) {
                history.replaceState(null, '', targetId);
            }
        });
    });
}

/* ========================================
   ANIMACIONES DE ENTRADA
======================================== */

function initRevealAnimations() {
    const elements = document.querySelectorAll(
        '.reveal, .fade-in, .animate-on-scroll, [data-reveal]'
    );

    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
    });

    elements.forEach(element => observer.observe(element));
}

/* ========================================
   FILTROS DE HABILIDADES
======================================== */

function initSkillFilters() {
    const filterButtons = document.querySelectorAll(
        '[data-filter], .filter-btn'
    );

    const skillCards = document.querySelectorAll(
        '[data-category], .skill-card'
    );

    if (!filterButtons.length || !skillCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = (
                button.dataset.filter ||
                button.dataset.category ||
                'all'
            ).toLowerCase();

            filterButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);

                if (active) {
                    item.setAttribute('aria-pressed', 'true');
                } else {
                    item.setAttribute('aria-pressed', 'false');
                }
            });

            skillCards.forEach(card => {
                const category = (
                    card.dataset.category || ''
                ).toLowerCase();

                const matches =
                    filter === 'all' ||
                    filter === '*' ||
                    category === filter;

                card.hidden = !matches;
            });
        });
    });
}

/* ========================================
   BÚSQUEDA DE HABILIDADES
======================================== */

function initSkillSearch() {
    const searchInputs = document.querySelectorAll(
        '#skill-search, #search-input, [data-skill-search]'
    );

    searchInputs.forEach(input => {
        input.addEventListener('input', () => {
            const query = input.value
                .trim()
                .toLocaleLowerCase('es');

            const cards = document.querySelectorAll(
                '.skill-card, [data-searchable]'
            );

            cards.forEach(card => {
                const searchableText = (
                    card.innerText ||
                    card.textContent ||
                    ''
                ).toLocaleLowerCase('es');

                card.hidden = !searchableText.includes(query);
            });
        });
    });
}

/* ========================================
   VALIDACIÓN DE FORMULARIOS
======================================== */

function initForms() {
    document.querySelectorAll('form').forEach(form => {
        const fields = form.querySelectorAll(
            'input[required], textarea[required], select[required]'
        );

        fields.forEach(field => {
            field.addEventListener('input', () => {
                field.setCustomValidity('');
                field.removeAttribute('aria-invalid');
            });
        });

        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }

            const emailFields = form.querySelectorAll(
                'input[type="email"]'
            );

            for (const email of emailFields) {
                if (email.value && !email.validity.valid) {
                    event.preventDefault();
                    email.setAttribute('aria-invalid', 'true');
                    email.reportValidity();
                    return;
                }
            }
        });
    });
}

/* ========================================
   MOSTRAR / OCULTAR CONTRASEÑA
======================================== */

function initPasswordToggles() {
    document.querySelectorAll(
        '[data-toggle-password], .toggle-password'
    ).forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.togglePassword;

            const input = targetId
                ? document.getElementById(targetId)
                : button.parentElement?.querySelector('input[type="password"], input[type="text"]');

            if (!input) return;

            const showing = input.type === 'password';

            input.type = showing ? 'text' : 'password';
            button.setAttribute('aria-pressed', String(showing));
            button.setAttribute(
                'aria-label',
                showing ? 'Ocultar contraseña' : 'Mostrar contraseña'
            );
        });
    });
}

/* ========================================
   BOTÓN VOLVER ARRIBA
======================================== */

function initBackToTop() {
    const button = document.querySelector(
        '#back-to-top, .back-to-top, [data-back-to-top]'
    );

    if (!button) return;

    const updateVisibility = () => {
        button.classList.toggle('visible', window.scrollY > 350);
    };

    updateVisibility();

    window.addEventListener('scroll', updateVisibility, {
        passive: true
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   AÑO AUTOMÁTICO DEL FOOTER
======================================== */

function initCurrentYear() {
    document.querySelectorAll('[data-current-year], #current-year').forEach(
        element => {
            element.textContent = new Date().getFullYear();
        }
    );
});

/* ========================================
   MUTUA — CARGA DE DATOS JSON
======================================== */

async function loadMutuaData() {
    try {
        const response = await fetch('./data.json');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log('MUTUA: datos cargados correctamente', data);

        renderSkillCards(data.skills);

        return data;
    } catch (error) {
        console.error('MUTUA: no se pudieron cargar los datos.', error);
        return null;
    }
}

/* ========================================
   RENDERIZAR HABILIDADES
======================================== */

function renderSkillCards(skills = []) {
    const skillsContainer = document.querySelector('.skills-grid');

    if (!skillsContainer || !Array.isArray(skills)) return;

    skillsContainer.replaceChildren();

    const fragment = document.createDocumentFragment();

    skills
        .filter(skill => skill.active)
        .forEach(skill => {
            const article = document.createElement('article');
            article.className = 'skill-card reveal';
            article.dataset.category = skill.category;

            const art = document.createElement('div');
            art.className = `skill-card-art art-${skill.category}`;

            const symbol = document.createElement('span');
            symbol.textContent = getSkillSymbol(skill.category);
            art.appendChild(symbol);

            const content = document.createElement('div');
            content.className = 'skill-card-content';

            const category = document.createElement('span');
            category.className = 'skill-category';
            category.textContent = skill.category.toUpperCase();

            const title = document.createElement('h3');
            title.textContent = skill.name;

            const description = document.createElement('p');
            description.textContent = skill.description;

            const link = document.createElement('a');
            link.className = 'text-link';
            link.href = '#contacto';
            link.textContent = 'Me interesa ↗';

            content.append(category, title, description, link);
            article.append(art, content);
            fragment.appendChild(article);
        });

    skillsContainer.appendChild(fragment);

    initRevealAnimations();
    initSkillFilters();
    initSkillSearch();
}

function getSkillSymbol(category) {
    const symbols = {
        creatividad: '✳',
        tecnologia: '</>',
        idiomas: 'あA',
        bienestar: '❋'
    };

    return symbols[category] || '✦';
}

/* ========================================
   INICIAR CARGA
======================================== */

loadMutuaData();
