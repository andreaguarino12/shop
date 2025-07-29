document.addEventListener('DOMContentLoaded', function() {
    // Background dinamico
    const dynamicBg = document.querySelector('.dynamic-background');
    const colors = ['#000000', '#1a1a1a', '#2d2d2d', '#1a1a1a'];
    let currentColor = 0;

    function changeBackground() {
        dynamicBg.style.background = `linear-gradient(-45deg, ${colors[currentColor]}, ${colors[(currentColor + 1) % colors.length]}, ${colors[(currentColor + 2) % colors.length]}, ${colors[(currentColor + 3) % colors.length]})`;
        dynamicBg.style.backgroundSize = '400% 400%';
        currentColor = (currentColor + 1) % colors.length;
    }

    setInterval(changeBackground, 10000);

    // Animazione cornetta del telefono
    const phoneIcon = document.querySelector('.vibrating-icon');
    
    function ringPhone() {
        phoneIcon.style.animation = 'vibrate 0.2s linear infinite alternate';
        setTimeout(() => {
            phoneIcon.style.animation = 'none';
            setTimeout(() => {
                phoneIcon.style.animation = 'vibrate 0.2s linear infinite alternate';
            }, 2000);
        }, 2000);
    }

    setInterval(ringPhone, 6000);

    // Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.querySelector('.preloader').style.opacity = '0';
            document.querySelector('.preloader').style.visibility = 'hidden';
        }, 1000);
    });

    // Orologio reale
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        
        const hourHand = document.querySelector('.hour-hand');
        const minuteHand = document.querySelector('.minute-hand');
        
        hourHand.style.transform = `rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
        minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
    }

    setInterval(updateClock, 60000);
    updateClock();

    // Particelle per la mappa
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'map-particles';
        mapContainer.appendChild(particlesContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'map-particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const xPos = Math.random() * 100;
            particle.style.setProperty('--random-x', `${xPos}%`);
            
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 25}s`;
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            if (Math.random() > 0.7) {
                particle.style.backgroundColor = `rgba(200, 230, 255, ${Math.random() * 0.5 + 0.3})`;
            }
            
            particlesContainer.appendChild(particle);
        }
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
            // Scorrendo verso il basso
            navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
            // Scorrendo verso l'alto
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
});