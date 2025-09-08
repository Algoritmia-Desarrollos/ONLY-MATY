document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR SCROLL EFFECT ---
    // Agrega una clase a la barra de navegación cuando se hace scroll para cambiar su estilo.
    const setupNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return; // Si no hay navbar, no hacemos nada.
        
        window.addEventListener('scroll', () => {
            // Añade o quita la clase 'scrolled' dependiendo de la posición del scroll.
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    };

    // --- 2. MOBILE MENU TOGGLE ---
    // Maneja la apertura y cierre del menú de navegación en dispositivos móviles.
    const setupMobileMenu = () => {
        const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return; // Si no existen, no hacemos nada.

        // Abre/cierra el menú al hacer clic en el ícono de hamburguesa.
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cierra el menú móvil si se hace clic en cualquier enlace dentro de él.
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    };
    
    // --- 3. ACCORDIONS (for Services and FAQ sections) ---
    // Gestiona la funcionalidad de acordeón para elementos colapsables.
    const setupAccordions = (selector) => {
        const items = document.querySelectorAll(selector);
        if (items.length === 0) return; // Si no hay elementos, no hacemos nada.

        items.forEach(item => {
            // El encabezado que activa el acordeón puede ser '.service-header' o '.faq-question'.
            const header = item.querySelector('.service-header') || item.querySelector('.faq-question');
            if (!header) return;

            header.addEventListener('click', () => {
                // Decide si solo un acordeón puede estar abierto a la vez (exclusivo, como Servicios)
                // o si múltiples pueden estarlo (no exclusivo, como FAQ).
                const isExclusive = selector === '.service-item';
                
                if (isExclusive) {
                    const currentlyActive = document.querySelector(`${selector}.active`);
                    // Si hay un acordeón activo y no es el que acabamos de clicar, lo cierra.
                    if (currentlyActive && currentlyActive !== item) {
                        currentlyActive.classList.remove('active');
                    }
                }
                // Alterna la clase 'active' para abrir/cerrar el acordeón actual.
                item.classList.toggle('active');
            });
        });
    };

    // --- 4. TESTIMONIAL CAROUSEL ---
    // Implementa un carrusel básico para la sección de testimonios.
    const setupTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return; // Si no hay carrusel, no hacemos nada.

        const track = carousel.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        
        let currentIndex = 0; // Índice del slide actual.

        // Calcula el ancho de un slide, incluyendo el margen.
        // Se asume que todos los slides tienen el mismo ancho y margen.
        const getSlideWidth = () => {
            if (slides.length === 0) return 0;
            const slideStyle = getComputedStyle(slides[0]);
            return slides[0].offsetWidth + 
                   parseFloat(slideStyle.marginLeft) + 
                   parseFloat(slideStyle.marginRight);
        };

        // Actualiza la posición del carrusel.
        const updateCarousel = () => {
            // Ajusta el transform X para mostrar el slide correcto.
            track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
        };

        // Maneja el clic en el botón "Siguiente".
        nextButton.addEventListener('click', () => {
            // Determina cuántos slides se muestran por vista (ej: 3 para desktop, 2 para tablet, 1 para mobile).
            // Esto necesita un cálculo más dinámico basado en media queries o JS avanzado,
            // pero para este setup básico, asumimos una vista de 3 slides en desktop.
            // Para una responsividad más robusta, este "slides.length - X" debería ser dinámico.
            // Por ahora, 'slides.length - 3' permite que los últimos 3 slides se muestren sin desbordar.
            // Considera ajustar este número o implementar una lógica más inteligente.
            const slidesInView = window.innerWidth >= 992 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
            if (currentIndex < slides.length - slidesInView) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Maneja el clic en el botón "Anterior".
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Opcional: Recalcular el ancho del slide y actualizar el carrusel al redimensionar la ventana.
        window.addEventListener('resize', () => {
            updateCarousel(); // Asegura que el carrusel se ajuste si cambia el tamaño de la ventana.
        });

        // Inicializar el carrusel en el primer slide.
        updateCarousel();
    };

    // --- 5. INITIALIZE AOS ---
    // Initializes the AOS library to trigger animations on scroll.
    const setupAOS = () => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    };

    // --- INICIALIZACIÓN DE TODAS LAS FUNCIONES AL CARGAR EL CONTENIDO DEL DOM ---
    setupNavbarScroll();
    setupMobileMenu();
    setupAccordions('.service-item'); // Acordeón para la sección de servicios (exclusivo)
    setupAccordions('.faq-item');     // Acordeón para la sección de preguntas frecuentes (no exclusivo)
    setupTestimonialCarousel();
    setupAOS();
});