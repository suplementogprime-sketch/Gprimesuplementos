/* ============================================================
   GPRIME — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Header scroll behavior ----
    const header = document.getElementById('header');
    const topBar = document.getElementById('top-bar');
    let lastScroll = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 60) {
            header.classList.add('header--scrolled');
            topBar.style.transform = 'translateY(-100%)';
            topBar.style.position = 'fixed';
            topBar.style.top = '0';
            topBar.style.left = '0';
            topBar.style.right = '0';
        } else {
            header.classList.remove('header--scrolled');
            topBar.style.transform = '';
            topBar.style.position = '';
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- Mobile menu ----
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const hamburger = menuToggle.querySelector('.hamburger');

    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('active');
        hamburger.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // ---- Search overlay ----
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    searchToggle.addEventListener('click', () => {
        searchOverlay.hidden = !searchOverlay.hidden;
        if (!searchOverlay.hidden) {
            searchInput.focus();
        }
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.hidden = true;
    });

    // ---- Hero Slider ----
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('hero__slide--active');
        dots[currentSlide].classList.remove('hero__dot--active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('hero__slide--active');
        dots[currentSlide].classList.add('hero__dot--active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
        clearInterval(slideInterval);
    }

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(parseInt(dot.dataset.dot));
            startAutoplay();
        });
    });

    startAutoplay();

    // ---- Stats counter animation ----
    const statNumbers = document.querySelectorAll('.stat-item__number');
    let statsAnimated = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                
                num.textContent = current.toLocaleString('pt-BR');

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    num.textContent = target.toLocaleString('pt-BR');
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ---- Scroll reveal animations ----
    const revealElements = document.querySelectorAll(
        '.product-card, .category-card, .athlete-card, .blog-card, .split-feature__content-inner, .section-header, .benefit-item'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal--visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Stats observer
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Newsletter form ----
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            if (email) {
                alert('E-mail cadastrado com sucesso! Você receberá nossas novidades.');
                newsletterForm.reset();
            }
        });
    }

});
