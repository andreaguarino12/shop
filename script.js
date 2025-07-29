document.addEventListener('DOMContentLoaded', function() {
    // 1. SISTEMA AVANZATO DI GESTIONE NAVIGAZIONE E RICARICHE
    let isReloading = false;
    let reloadCount = 0;
    const maxReloads = 2;

    const navigationHandler = {
        init() {
            // Verifica subito lo stato della pagina
            this.checkPageState();
            
            // Aggiungi tutti gli event listener necessari
            window.addEventListener('pageshow', this.handlePageShow.bind(this));
            window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
            window.addEventListener('unload', this.handleUnload.bind(this));
        },
        
        checkPageState() {
            const navEntry = performance.getEntriesByType('navigation')[0] || {};
            const isFromCache = navEntry.type === 'back_forward' || 
                              performance.navigation?.type === 2 ||
                              document.body.classList.contains('page-cached');
            
            if (isFromCache && !isReloading) {
                console.log('Page loaded from cache, initiating reload sequence');
                this.scheduleReloads();
            }
            
            // Ripristina sempre l'opacità
            document.body.style.opacity = '1';
            document.body.classList.remove('page-exiting', 'page-cached');
        },
        
        scheduleReloads() {
            if (reloadCount >= maxReloads) return;
            
            isReloading = true;
            const delays = [1000, 2000]; // Prima dopo 1s, poi dopo 2s
            
            delays.forEach((delay, index) => {
                setTimeout(() => {
                    if (!document.body.classList.contains('page-exiting') && 
                        reloadCount < maxReloads) {
                        console.log(`Executing reload ${index + 1} of ${maxReloads}`);
                        reloadCount++;
                        window.location.reload();
                    }
                }, delay);
            });
        },
        
        handlePageShow(event) {
            if (event.persisted) {
                console.log('Page restored from bfcache');
                document.body.classList.add('page-cached');
                this.checkPageState();
            }
        },
        
        handleBeforeUnload() {
            document.body.classList.add('page-exiting');
            document.body.style.opacity = '0';
        },
        
        handleUnload() {
            // Pulizia finale
            isReloading = false;
        }
    };

    // Inizializza il sistema di navigazione
    navigationHandler.init();

    // 2. PRELOADER (ORIGINALE)
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 800);
    });

    // 3. SLIDESHOW PREMIUM (ORIGINALE)
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    let isAnimating = false;

    function showSlide(n) {
        if (isAnimating) return;
        isAnimating = true;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        setTimeout(() => {
            isAnimating = false;
        }, 1500);
    }

    function startSlideshow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000);
    }

    // 4. TOUCH PER SLIDESHOW MOBILE (ORIGINALE)
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            showSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX + 50) {
            showSlide(currentSlide - 1);
        }
    }

    // 5. NAVIGAZIONE PALLINI (ORIGINALE)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideshow();
        });
    });

    // 6. MENU MOBILE PREMIUM (ORIGINALE)
    function setupMobileMenu() {
        const menuToggle = document.createElement('button');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            headerContainer.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                document.querySelector('.main-menu').classList.toggle('active');
            });
        }
    }

    // 7. MOBILE SIDE MENU TOGGLE (RAFFORZATO)
    function setupMobileSideMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (!mobileMenuBtn) return;

        const mobileMenu = document.querySelector('.mobile-side-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuItems = document.querySelectorAll('.mobile-nav > ul > li');
        
        const overlay = document.createElement('div');
        overlay.classList.add('mobile-menu-overlay');
        document.body.appendChild(overlay);

        const toggleMenu = (open) => {
            if (open) {
                mobileMenu.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu(true);
        });
        
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu(false);
        });

        overlay.addEventListener('click', function() {
            toggleMenu(false);
        });
        
        mobileMenuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.mobile-submenu');
            
            if (link && submenu) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                toggleMenu(false);
            }
        });
    }

    // 8. SEARCH BAR AVANZATA (ORIGINALE)
    function setupSearchBar() {
        const searchIcon = document.querySelector('.search-icon');
        const searchBar = document.querySelector('.search-bar');
        const searchInput = searchBar?.querySelector('.search-input');
        const suggestionsBox = searchBar?.querySelector('.search-suggestions');

        if (!searchIcon || !searchBar || !searchInput || !suggestionsBox) return;

        const searchData = [
            { name: "Borse in ecopelle", url: "borsecopelle.html" },
            { name: "Bracciali", url: "bracciali.html" },
            { name: "Cinture", url: "cinture.html" },
            { name: "Collane", url: "collane.html" },
            { name: "Collezione Borse", url: "collezione_borse.html" },
            { name: "Argento", url: "argento.html" },
            { name: "Homepage", url: "index.html" },
            { name: "Orecchini", url: "orecchini.html" },
            { name: "Portafogli", url: "portafogli.html" },
            { name: "Acciaio", url: "acciaio.html" }
        ];

        const toggleSearch = (show) => {
            if (show) {
                searchBar.classList.add('active');
                searchInput.focus();
            } else {
                searchBar.classList.remove('active');
                suggestionsBox.style.opacity = '0';
                suggestionsBox.style.visibility = 'hidden';
                suggestionsBox.style.transform = 'translateY(10px)';
                searchInput.value = '';
            }
        };

        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSearch(!searchBar.classList.contains('active'));
        });

        searchInput.addEventListener('input', function() {
            const value = this.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';

            if (!value) {
                suggestionsBox.style.opacity = '0';
                suggestionsBox.style.visibility = 'hidden';
                return;
            }

            const matches = searchData.filter(item => 
                item.name.toLowerCase().includes(value)
            );

            if (matches.length > 0) {
                matches.forEach(item => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion');
                    suggestion.innerHTML = `
                        <span>${item.name}</span>
                        <i class="fas fa-chevron-right"></i>
                    `;
                    suggestion.addEventListener('click', () => {
                        document.body.classList.add('page-exiting');
                        document.body.style.opacity = '0';
                        setTimeout(() => {
                            window.location.href = item.url;
                        }, 300);
                    });
                    suggestionsBox.appendChild(suggestion);
                });
            } else {
                const noMatch = document.createElement('div');
                noMatch.classList.add('no-match');
                noMatch.textContent = "Nessun risultato trovato.";
                suggestionsBox.appendChild(noMatch);
            }

            suggestionsBox.style.opacity = '1';
            suggestionsBox.style.visibility = 'visible';
            suggestionsBox.style.transform = 'translateY(0)';
        });

        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target)) {
                toggleSearch(false);
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchBar.classList.contains('active')) {
                toggleSearch(false);
            }
        });
    }

    // 9. LOGO ANIMATION PREMIUM (ORIGINALE)
    function setupLogoAnimation() {
        const logo = document.querySelector('.main-logo');
        if (logo) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 15;
                logo.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    }

    // 10. FOOTER SU SCROLL AVANZATO (ORIGINALE)
    function setupFooter() {
        const footer = document.querySelector('.modern-footer');
        if (!footer) return;
        
        let lastScroll = 0;
        let isHidden = false;

        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;
            
            if (currentScroll <= 50) {
                footer.style.transform = 'translateY(0)';
                isHidden = false;
                return;
            }

            if (currentScroll > lastScroll && !isHidden) {
                footer.style.transform = 'translateY(100%)';
                isHidden = true;
            } else if (currentScroll < lastScroll && isHidden) {
                footer.style.transform = 'translateY(0)';
                isHidden = false;
            }

            lastScroll = currentScroll;
        });
    }

    // 11. EFFETTI PREMIUM PER MENU (ORIGINALE)
    function setupMenuEffects() {
        const menuItems = document.querySelectorAll('.main-menu > ul > li');
        
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 300 + (index * 100));
            }, 500);

            item.addEventListener('click', function(e) {
                if (window.innerWidth > 768) {
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple-effect');
                    
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 1000);
                }
            });
        });

        const infoItem = document.querySelector('.info-menu-item');
        if (infoItem) {
            setTimeout(() => {
                infoItem.style.opacity = '0';
                infoItem.style.transform = 'translateY(20px) translateX(-30px)';
                infoItem.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                setTimeout(() => {
                    infoItem.style.opacity = '1';
                    infoItem.style.transform = 'translateY(-50%) translateX(-250px)';
                }, 400);
            }, 500);
        }
    }

    // 12. EFFETTI HOVER PALLINI (ORIGINALE)
    function setupDotsEffects() {
        dots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.5)';
                dot.style.background = 'rgba(255,255,255,0.8)';
            });
            
            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'scale(1)';
                    dot.style.background = 'rgba(255,255,255,0.5)';
                }
            });
        });
    }

    // 13. HERO PARALLAX AVANZATO (ORIGINALE)
    function setupHeroParallax() {
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                hero.style.transform = `translateY(${y}px) translateX(${x}px)`;
            });
        }
    }

    // 14. TRANSIZIONE TRA PAGINE (RAFFORZATO)
    function setupPageTransitions() {
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.href && this.href.includes(window.location.hostname)) {
                    e.preventDefault();
                    
                    // Aggiungi classe per segnalare la transizione
                    document.body.classList.add('page-exiting');
                    document.body.style.opacity = '0';
                    
                    // Salva lo stato della pagina corrente
                    sessionStorage.setItem('pageTransition', 'in-progress');
                    
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 600);
                }
            });
        });
    }

    // 15. INIZIALIZZAZIONE COMPLETA
    function init() {
        // Prima il menu mobile
        if (window.innerWidth <= 1024) {
            setupMobileSideMenu();
        }
        
        // Poi tutto il resto
        showSlide(0);
        startSlideshow();
        setupMobileMenu();
        setupSearchBar();
        setupLogoAnimation();
        setupFooter();
        setupMenuEffects();
        setupDotsEffects();
        setupHeroParallax();
        setupPageTransitions();

        // Eventi globali
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const menu = document.querySelector('.main-menu');
                if (menu) menu.classList.remove('active');
                
                const toggle = document.querySelector('.menu-toggle');
                if (toggle) toggle.classList.remove('active');
            }
        });

        // Verifica se c'è una transizione in corso
        if (sessionStorage.getItem('pageTransition') === 'in-progress') {
            sessionStorage.removeItem('pageTransition');
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        } else {
            document.body.style.opacity = '1';
        }
    }

    init();
});