document.addEventListener('DOMContentLoaded', function() {
    const productItems = document.querySelectorAll('.product-item');

    if (!productItems.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'product-lightbox';
    lightbox.innerHTML = `
        <div class="product-lightbox-card" role="dialog" aria-modal="true" aria-labelledby="product-lightbox-title">
            <div class="product-lightbox-media">
                <img src="" alt="" class="product-lightbox-image">
            </div>
            <div class="product-lightbox-content">
                <button class="product-lightbox-close" type="button" aria-label="Chiudi anteprima">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-lightbox-kicker">Collezione Acciaio</div>
                <h2 class="product-lightbox-title" id="product-lightbox-title"></h2>
                <div class="product-lightbox-price"></div>
                <p class="product-lightbox-description"></p>
                <div class="product-lightbox-meta">
                    <span class="product-lightbox-pill">Disponibile</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.product-lightbox-image');
    const lightboxTitle = lightbox.querySelector('.product-lightbox-title');
    const lightboxPrice = lightbox.querySelector('.product-lightbox-price');
    const lightboxDescription = lightbox.querySelector('.product-lightbox-description');
    const lightboxClose = lightbox.querySelector('.product-lightbox-close');

    const openLightbox = item => {
        const image = item.querySelector('img');
        const name = item.querySelector('.product-name')?.textContent?.trim() || 'Prodotto';
        const price = item.querySelector('.product-price')?.textContent?.trim() || '';

        lightboxImage.src = image?.getAttribute('src') || '';
        lightboxImage.alt = image?.getAttribute('alt') || name;
        lightboxTitle.textContent = name;
        lightboxPrice.textContent = price;
        lightboxDescription.textContent = name;

        lightbox.classList.add('open');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
    };

    productItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Apri ${item.querySelector('.product-name')?.textContent?.trim() || `prodotto ${index + 1}`}`);

        item.addEventListener('click', function() {
            openLightbox(item);
        });

        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(item);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    const revealTargets = document.querySelectorAll('.product-item, .pagination, .modern-footer');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('premium-reveal', 'is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(target => {
        target.classList.add('premium-reveal');
        revealObserver.observe(target);
    });
});
