/**
 * R&P SPORTS — Gallery & Lightbox JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item, .product-card-filterable');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initLightbox() {
  const lightboxModal = document.querySelector('.lightbox-modal');
  if (!lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector('.lightbox-img');
  const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
  const closeBtn = lightboxModal.querySelector('.lightbox-close');
  const triggerItems = document.querySelectorAll('.lightbox-trigger');

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'R&P SPORTS Garment';
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggerItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img');
      const src = item.getAttribute('data-img-src') || img?.src;
      const caption = item.getAttribute('data-caption') || img?.alt || 'R&P SPORTS Manufacturing';
      if (src) openLightbox(src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
}
