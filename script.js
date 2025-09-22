document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR SCROLL EFFECT ---
    const setupNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    };

    // --- 2. MOBILE MENU TOGGLE ---
    const setupMobileMenu = () => {
        const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    };
    
    // --- 3. ACCORDIONS ---
    const setupAccordions = (selector) => {
        const items = document.querySelectorAll(selector);
        if (items.length === 0) return;

        items.forEach(item => {
            const header = item.querySelector('.service-header') || item.querySelector('.faq-question');
            if (!header) return;

            header.addEventListener('click', () => {
                const isExclusive = selector === '.service-item';
                
                if (isExclusive) {
                    const currentlyActive = document.querySelector(`${selector}.active`);
                    if (currentlyActive && currentlyActive !== item) {
                        currentlyActive.classList.remove('active');
                    }
                }
                item.classList.toggle('active');
            });
        });
    };

    // --- 4. TESTIMONIAL CAROUSEL (LÓGICA DEFINITIVA PARA BUCLE INFINITO Y BOTÓN ANTERIOR) ---
    const setupTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        const paginationContainer = carousel.querySelector('.slider-pagination');
        
        if (slides.length === 0) return;

        let currentIndex = 0;
        let isMoving = false;
        const totalSlides = slides.length;

        const getSlidesToShow = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        };

        let slidesToShow = getSlidesToShow();

        const setupClones = () => {
            track.innerHTML = '';
            slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

            for (let i = slides.length - 1; i >= slides.length - slidesToShow; i--) {
                const clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                track.insertBefore(clone, track.firstChild);
            }
            for (let i = 0; i < slidesToShow; i++) {
                const clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }
        };

        const getSlideFullWidth = () => {
            const firstSlide = track.querySelector('.slide');
            if (!firstSlide) return 0;
            const slideStyle = getComputedStyle(firstSlide);
            const margin = parseInt(slideStyle.marginRight) || 0;
            return firstSlide.offsetWidth + margin;
        };

        const updatePagination = () => {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('pagination-dot');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    if (isMoving) return;
                    currentIndex = i;
                    updateCarouselPosition(true);
                });
                paginationContainer.appendChild(dot);
            }
        };

        const updateCarouselPosition = (withTransition = true) => {
            const currentPosition = currentIndex + slidesToShow;
            track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
            track.style.transform = `translateX(-${currentPosition * getSlideFullWidth()}px)`;
            updatePagination();
        };
        
        const moveNext = () => {
            if (isMoving) return;
            isMoving = true;
            currentIndex++;
            updateCarouselPosition();
        };

        const movePrev = () => {
            if (isMoving) return;
            isMoving = true;
            currentIndex--;
            updateCarouselPosition();
        };

        nextButton.addEventListener('click', moveNext);
        prevButton.addEventListener('click', movePrev);

        track.addEventListener('transitionend', () => {
            isMoving = false;
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarouselPosition(false);
            } else if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarouselPosition(false);
            }
        });
        
        const init = () => {
            slidesToShow = getSlidesToShow();
            setupClones();
            updateCarouselPosition(false);
        };
        
        window.addEventListener('resize', init);

        init();
    };

    // --- 5. INICIALIZACIÓN DE AOS (AJUSTADA) ---
    const setupAOS = () => {
        AOS.init({
            duration: 600,  // <-- Más rápido
            offset: 150,     // <-- Se activa antes
            once: true,
            mirror: false,
        });
    };

    // --- INICIALIZACIÓN DE TODAS LAS FUNCIONES ---
    setupNavbarScroll();
    setupMobileMenu();
    setupAccordions('.service-item');
    setupAccordions('.faq-item');
    setupTestimonialCarousel();
    setupAOS();
});