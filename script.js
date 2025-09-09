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

    // --- 4. TESTIMONIAL CAROUSEL (LÓGICA DEFINITIVA PARA BUCLE INFINITO) ---
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

        // Clonar slides para el efecto infinito
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        const updatePagination = () => {
            if (!paginationContainer) return;
            // Limpiar paginación existente
            paginationContainer.innerHTML = '';
            // Crear puntos
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('pagination-dot');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarouselPosition();
                });
                paginationContainer.appendChild(dot);
            }
        };

        const updateCarouselPosition = (withTransition = true) => {
            const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
            track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
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
            // Si llegamos al final de la primera mitad (el clon del inicio)
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarouselPosition(false);
            }
            // Si nos vamos muy a la izquierda
            if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarouselPosition(false);
            }
        });
        
        // Inicializar
        updateCarouselPosition();
    };


    // --- 5. INICIALIZACIÓN DE AOS ---
    const setupAOS = () => {
        AOS.init({
            duration: 1000,
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