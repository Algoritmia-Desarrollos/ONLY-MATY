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

    // --- 4. TESTIMONIAL CAROUSEL (VERSIÓN CORREGIDA) ---
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
        let isTransitioning = false;
        
        const slidesToClone = 3;
        for (let i = 0; i < slidesToClone; i++) {
            track.appendChild(slides[i].cloneNode(true));
        }
        for (let i = slides.length - 1; i >= slides.length - slidesToClone; i--) {
            track.insertBefore(slides[i].cloneNode(true), slides[0]);
        }
        
        const getSlideWidth = () => slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight) * 2;

        const setInitialPosition = () => {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${getSlideWidth() * slidesToClone}px)`;
        };
        
        setInitialPosition();

        let dots = [];
        if (paginationContainer) {
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('pagination-dot');
                paginationContainer.appendChild(dot);
                dots.push(dot);
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i;
                    moveToSlide();
                });
            }
        }
        
        const updatePagination = () => {
            if (!dots.length) return;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const moveToSlide = (direction) => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            let targetIndex;
            if (direction === 'next') {
                targetIndex = slidesToClone + currentIndex + 1;
            } else if (direction === 'prev') {
                targetIndex = slidesToClone + currentIndex - 1;
            } else {
                targetIndex = slidesToClone + currentIndex;
            }
             
            track.style.transform = `translateX(-${getSlideWidth() * targetIndex}px)`;
            track.style.transition = 'transform 0.5s ease-in-out';
            updatePagination();
        };

        nextButton.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex++;
            moveToSlide('next');
        });

        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex--;
            moveToSlide('prev');
        });

        track.addEventListener('transitionend', () => {
            if (currentIndex >= slides.length) {
                currentIndex = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(-${getSlideWidth() * (slidesToClone + currentIndex)}px)`;
            }
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
                track.style.transition = 'none';
                track.style.transform = `translateX(-${getSlideWidth() * (slidesToClone + currentIndex)}px)`;
            }
            // **LA LÍNEA CLAVE QUE ARREGLA EL BUG**
            updatePagination();
            isTransitioning = false;
        });
        
        updatePagination();
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