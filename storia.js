document.addEventListener('DOMContentLoaded', function() {
    // Gestione del preloader (versione migliorata)
    function handlePreloader() {
        const preloader = document.querySelector('.preloader');
        
        if (!preloader) return;

        // Mostra il preloader all'inizio
        preloader.style.display = 'flex';
        
        // Funzione per nascondere il preloader
        function hidePreloader() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Rimuovi completamente dopo l'animazione
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        
        // Nascondi quando tutto è caricato
        window.addEventListener('load', function() {
            setTimeout(hidePreloader, 800); // Ritardo minimo
        });
        
        // Fallback: nascondi comunque dopo 3 secondi
        setTimeout(hidePreloader, 3000);
    }

    // Chiama la funzione del preloader
    handlePreloader();

    // Background dinamico
    const dynamicBg = document.querySelector('.dynamic-background');
    if (dynamicBg) {
        const colors = ['#000000', '#1a1a1a', '#2d2d2d', '#1a1a1a'];
        let currentColor = 0;

        function changeBackground() {
            dynamicBg.style.background = `linear-gradient(-45deg, ${colors[currentColor]}, ${colors[(currentColor + 1) % colors.length]}, ${colors[(currentColor + 2) % colors.length]}, ${colors[(currentColor + 3) % colors.length]})`;
            dynamicBg.style.backgroundSize = '400% 400%';
            currentColor = (currentColor + 1) % colors.length;
        }

        setInterval(changeBackground, 10000);
    }

    // Nascondi navbar quando si scorre verso il basso
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
            navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Effetto hover sulle immagini
    const images = document.querySelectorAll('.history-image img, .flyer-image');
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.02)';
            img.style.transition = 'transform 0.3s ease';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });

    // Menu mobile
    function setupMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;
        
        const menuToggle = document.createElement('button');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    if (window.innerWidth <= 768) {
        setupMobileMenu();
    }

    window.addEventListener('resize', function() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;
        
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            
            const toggle = document.querySelector('.menu-toggle');
            if (toggle) toggle.classList.remove('active');
        } else {
            const toggle = document.querySelector('.menu-toggle');
            if (!toggle) setupMobileMenu();
        }
    });

    // Transizione tra pagine
    function setupPageTransitions() {
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.href && this.href.includes(window.location.hostname)) {
                    e.preventDefault();
                    
                    const pageTransition = document.createElement('div');
                    pageTransition.classList.add('page-transition');
                    document.body.appendChild(pageTransition);
                    
                    setTimeout(() => {
                        pageTransition.style.transform = 'scaleY(1)';
                        pageTransition.style.transformOrigin = 'top';
                    }, 10);
                    
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 600);
                }
            });
        });
    }

    // Stile per la transizione (assicurati che questo esista nel tuo CSS)
    const transitionStyle = document.createElement('style');
    transitionStyle.innerHTML = `
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            transform: scaleY(0);
            transition: transform 0.6s ease;
            z-index: 9999;
        }
    `;
    
    document.head.appendChild(transitionStyle);

    // Inizializza le transizioni
    setupPageTransitions();
});
