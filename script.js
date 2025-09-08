document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR SCROLL & MOBILE MENU ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // --- 2. ACCORDION (SERVICIOS) ---
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.service-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
    

    // --- 3. ACCORDION (FAQ) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });


    // --- 4. CAROUSEL DE TESTIMONIOS ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        // Clonar slides para efecto infinito
        const clonesCount = slides.length;
        for(let i = 0; i < clonesCount; i++) {
            track.appendChild(slides[i].cloneNode(true));
        }
        for(let i = clonesCount - 1; i >= 0; i--) {
            track.prepend(slides[i].cloneNode(true));
        }
        
        const allSlides = Array.from(track.children);

        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.style.transition = 'transform 0.5s ease-in-out';
        };

        const shiftSlides = () => {
            if (currentIndex >= slides.length + clonesCount) {
                track.style.transition = 'none';
                currentIndex = clonesCount;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            if (currentIndex < clonesCount) {
                track.style.transition = 'none';
                currentIndex = currentIndex + slides.length;
                 track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
        }
        
        nextButton.addEventListener('click', () => {
            currentIndex++;
            updateSlidePosition();
        });

        prevButton.addEventListener('click', () => {
            currentIndex--;
            updateSlidePosition();
        });

        track.addEventListener('transitionend', shiftSlides);

        // Swipe functionality
        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID;

        const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        
        const dragStart = (e) => {
            isDragging = true;
            startPos = getPositionX(e);
            animationID = requestAnimationFrame(animation);
            track.style.transition = 'none';
        };

        const drag = (e) => {
            if (isDragging) {
                const currentPosition = getPositionX(e);
                currentTranslate = prevTranslate + currentPosition - startPos;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
        };

        const dragEnd = () => {
            isDragging = false;
            cancelAnimationFrame(animationID);
            
            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -100 && currentIndex < allSlides.length - 1) currentIndex++;
            if (movedBy > 100 && currentIndex > 0) currentIndex--;

            updateSlidePosition();
        };

        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart);
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('touchend', dragEnd);
        track.addEventListener('mouseleave', dragEnd);
        track.addEventListener('mousemove', drag);
        track.addEventListener('touchmove', drag);

        function animation() {
            if(isDragging) requestAnimationFrame(animation);
        }
        
        // Inicialización
        currentIndex = clonesCount;
        prevTranslate = -currentIndex * slideWidth;
        track.style.transform = `translateX(${prevTranslate}px)`;
    }
});