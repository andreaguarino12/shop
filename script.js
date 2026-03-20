document.addEventListener('DOMContentLoaded', function() {
    let vantaEffect = null;
    const navigationHandler = {
        init() {
            this.checkPageState();
            window.addEventListener('pageshow', this.handlePageShow.bind(this));
            window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        },
        
        checkPageState() {
            const navEntry = performance.getEntriesByType('navigation')[0] || {};
            const isFromCache = navEntry.type === 'back_forward' || performance.navigation?.type === 2;

            if (isFromCache) {
                document.querySelectorAll('.mobile-submenu').forEach(submenu => {
                    submenu.style.display = 'none';
                });
                document.querySelectorAll('.mobile-nav-toggle.active').forEach(button => {
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                });
            }

            document.body.style.opacity = '1';
            document.body.classList.remove('page-exiting', 'page-cached');
        },
        
        handlePageShow(event) {
            if (event.persisted) {
                document.body.classList.add('page-cached');
                this.checkPageState();
            }
        },
        
        handleBeforeUnload() {
            document.body.classList.add('page-exiting');
            document.body.style.opacity = '0';
        }
    };
    navigationHandler.init();
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 800);
    });
    function setupVantaBackground() {
        const vantaTarget = document.querySelector('#vanta-topology-bg');
        if (!vantaTarget || typeof VANTA === 'undefined' || typeof VANTA.TOPOLOGY !== 'function') {
            return;
        }

        if (vantaEffect) {
            vantaEffect.destroy();
        }

        const isMobile = window.innerWidth <= 768;

        vantaEffect = VANTA.TOPOLOGY({
            el: vantaTarget,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xb68a5c,
            backgroundColor: 0xfbf6ee,
            points: isMobile ? 9.0 : 11.0,
            maxDistance: isMobile ? 18.0 : 20.0,
            spacing: isMobile ? 16.0 : 18.0,
            showDots: false
        });
    }
    function setupMobileMenu() {
        if (window.innerWidth <= 1024) return;

        const menuToggle = document.querySelector('.menu-toggle');
        const mainMenu = document.querySelector('.main-menu');

        if (menuToggle && mainMenu) {
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mainMenu.classList.toggle('active');
            });
        }
    }
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
            const button = item.querySelector('.mobile-nav-toggle');
            const submenu = item.querySelector('.mobile-submenu');
            
            if (button && submenu) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.innerWidth > 1024) return;

                    const isOpen = submenu.style.display === 'block';

                    mobileMenuItems.forEach(otherItem => {
                        const otherButton = otherItem.querySelector('.mobile-nav-toggle');
                        const otherSubmenu = otherItem.querySelector('.mobile-submenu');

                        if (otherItem !== item && otherButton && otherSubmenu) {
                            otherSubmenu.style.display = 'none';
                            otherButton.classList.remove('active');
                            otherButton.setAttribute('aria-expanded', 'false');
                        }
                    });

                    submenu.style.display = isOpen ? 'none' : 'block';
                    button.classList.toggle('active', !isOpen);
                    button.setAttribute('aria-expanded', String(!isOpen));
                });
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                toggleMenu(false);
            }
        });
    }
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
    function setupMenuEffects() {
        const menuTriggers = document.querySelectorAll('.info-menu-item, .main-menu > ul > li');
        const menuItems = document.querySelectorAll('.main-menu > ul > li');
        const desktopMedia = window.matchMedia('(min-width: 1025px)');
        const closeAllDropdowns = (exceptTrigger = null) => {
            menuTriggers.forEach(trigger => {
                if (trigger !== exceptTrigger) {
                    trigger.classList.remove('dropdown-open');
                    const button = trigger.querySelector('.menu-trigger');
                    if (button) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        };
        
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

        menuTriggers.forEach(trigger => {
            const dropdown = trigger.querySelector('.dropdown');
            const button = trigger.querySelector('.menu-trigger');
            if (!dropdown) return;

            let leaveTimeout;

            const openDropdown = () => {
                clearTimeout(leaveTimeout);
                closeAllDropdowns(trigger);
                trigger.classList.add('dropdown-open');
                if (button) {
                    button.setAttribute('aria-expanded', 'true');
                }
            };

            const closeDropdown = () => {
                leaveTimeout = setTimeout(() => {
                    trigger.classList.remove('dropdown-open');
                    if (button) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                }, 120);
            };

            if (desktopMedia.matches) {
                if (button) {
                    button.addEventListener('mouseenter', openDropdown);
                }
                trigger.addEventListener('mouseleave', closeDropdown);
                dropdown.addEventListener('mouseenter', openDropdown);
                dropdown.addEventListener('mouseleave', closeDropdown);
            }

            if (button) {
                button.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();

                    const isOpen = trigger.classList.contains('dropdown-open');
                    if (isOpen) {
                        closeDropdown();
                    } else {
                        openDropdown();
                    }
                });
            }

            trigger.addEventListener('focusin', openDropdown);
            trigger.addEventListener('focusout', event => {
                if (trigger.contains(event.relatedTarget)) return;
                closeDropdown();
            });
        });

        document.addEventListener('click', event => {
            if (!event.target.closest('.main-menu')) {
                closeAllDropdowns();
            }
        });

        window.addEventListener('resize', () => {
            if (!desktopMedia.matches) {
                closeAllDropdowns();
            }
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
    function setupPageTransitions() {
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.href && this.href.includes(window.location.hostname)) {
                    e.preventDefault();
                    document.body.classList.add('page-exiting');
                    document.body.style.opacity = '0';
                    sessionStorage.setItem('pageTransition', 'in-progress');
                    
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 600);
                }
            });
        });
    }
    function init() {
        if (window.innerWidth <= 1024) {
            setupMobileSideMenu();
        }
        setupVantaBackground();
        setupMobileMenu();
        setupSearchBar();
        setupLogoAnimation();
        setupFooter();
        setupMenuEffects();
        setupHeroParallax();
        setupPageTransitions();
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const menu = document.querySelector('.main-menu');
                if (menu) menu.classList.remove('active');
                
                const toggle = document.querySelector('.menu-toggle');
                if (toggle) toggle.classList.remove('active');
            }
        });

        let vantaResizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(vantaResizeTimer);
            vantaResizeTimer = setTimeout(() => {
                setupVantaBackground();
            }, 180);
        });

        window.addEventListener('unload', function() {
            if (vantaEffect) {
                vantaEffect.destroy();
                vantaEffect = null;
            }
        });
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
