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

        let currentIndex = 0; // Este índice se refiere al slide "real" actual (0 a totalSlides-1)
        let cloneCount = 0; // Número de clones insertados al inicio y al final
        let isMoving = false;
        const totalSlides = slides.length; // Número de slides originales

        // Clonar slides para el efecto infinito (al menos 3 de cada lado para bucle suave con 3 visibles)
        // Clonar los últimos 3 slides y ponerlos al principio
        for (let i = totalSlides - 1; i >= totalSlides - 3; i--) {
            track.insertBefore(slides[i].cloneNode(true), slides[0]);
            cloneCount++;
        }
        // Clonar los primeros 3 slides y ponerlos al final
        for (let i = 0; i < 3; i++) {
            track.appendChild(slides[i].cloneNode(true));
            cloneCount++;
        }

        const allVisibleSlides = Array.from(track.children); // Ahora incluye los clones

        // Calcular el ancho de un slide (incluyendo su margen, si lo hubiera)
        // Esto es crucial para un desplazamiento correcto con múltiples slides visibles
        const getSlideFullWidth = () => {
            if (!allVisibleSlides[0]) return 0; // Evitar errores si no hay slides
            const slideStyle = getComputedStyle(allVisibleSlides[0]);
            const margin = parseInt(slideStyle.marginRight) || 0; // Asumimos margen derecho
            return allVisibleSlides[0].offsetWidth + margin;
        };

        const updatePagination = () => {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = ''; // Limpiar paginación existente
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
            const currentPosition = currentIndex + 3; // +3 por los 3 clones al inicio
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
            // Si el índice real está fuera de los límites de los slides originales, reajustar
            if (currentIndex >= totalSlides) { // Pasó el último slide y entró en el clon del primero
                currentIndex = 0;
                updateCarouselPosition(false);
            } else if (currentIndex < 0) { // Retrocedió del primer slide y entró en el clon del último
                currentIndex = totalSlides - 1;
                updateCarouselPosition(false);
            }
        });
        
        // Ajustar en caso de cambio de tamaño de ventana
        window.addEventListener('resize', () => {
            updateCarouselPosition(false); // Sin transición para evitar saltos al redimensionar
        });

        // Posición inicial: mostrar el primer slide "real", pero con los clones previos
        currentIndex = 0; // Asegurarse de que el índice empieza en el primer slide real
        updateCarouselPosition(false); // Establecer la posición inicial sin transición
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