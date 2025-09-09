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
        let cloneCount = 0;
        let isMoving = false;
        const totalSlides = slides.length;

        for (let i = totalSlides - 1; i >= totalSlides - 3; i--) {
            track.insertBefore(slides[i].cloneNode(true), slides[0]);
            cloneCount++;
        }
        for (let i = 0; i < 3; i++) {
            track.appendChild(slides[i].cloneNode(true));
            cloneCount++;
        }

        const allVisibleSlides = Array.from(track.children);

        const getSlideFullWidth = () => {
            if (!allVisibleSlides[0]) return 0;
            const slideStyle = getComputedStyle(allVisibleSlides[0]);
            const margin = parseInt(slideStyle.marginRight) || 0;
            return allVisibleSlides[0].offsetWidth + margin;
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
            const currentPosition = currentIndex + 3;
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
        
        window.addEventListener('resize', () => {
            updateCarouselPosition(false);
        });

        currentIndex = 0;
        updateCarouselPosition(false);
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