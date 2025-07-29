document.addEventListener('DOMContentLoaded', function() {
    const productItems = document.querySelectorAll('.product-item');
    let zoomedItem = null;

    // Aggiungi pulsanti chiusura
    productItems.forEach(item => {
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-zoom';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        item.appendChild(closeBtn);

        // Click sull'immagine
        item.querySelector('.product-image').addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (zoomedItem) {
                zoomedItem.classList.remove('zoomed');
            }
            
            item.classList.add('zoomed');
            zoomedItem = item;
        });

        // Click sul pulsante chiudi
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            item.classList.remove('zoomed');
            zoomedItem = null;
        });
    });

    // Chiudi cliccando fuori dall'immagine zoomata
    document.addEventListener('click', function(e) {
        if (zoomedItem && !zoomedItem.contains(e.target)) {
            zoomedItem.classList.remove('zoomed');
            zoomedItem = null;
        }
    });

    // Chiudi con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && zoomedItem) {
            zoomedItem.classList.remove('zoomed');
            zoomedItem = null;
        }
    });
});