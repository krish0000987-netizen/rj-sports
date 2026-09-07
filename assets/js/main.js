/**
 * R&P SPORTS — Main JavaScript
 * Handles navigation, hero slideshow (3s timer), forms, and WhatsApp triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHeroSlider();
  initForms();
  initProductInquiries();
});

/* ==========================================================================
   HEADER SCROLL EFFECT
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburgerBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   HERO SLIDESHOW (3-SECOND AUTO INTERVAL)
   ========================================================================== */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider-section');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = slider.querySelector('.slide-dots');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 3000; // 3 seconds per specification

  // Create dot indicators if container exists
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = slider.querySelectorAll('.slide-dot');

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  const startTimer = () => {
    stopTimer();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopTimer = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  const restartTimer = () => {
    stopTimer();
    startTimer();
  };

  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);

  startTimer();
}

/* ==========================================================================
   FORMS & WHATSAPP INTEGRATION
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('.quote-form, .contact-form, .custom-rfq-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value || 'Valued Customer';
      const company = form.querySelector('[name="company"]')?.value || 'N/A';
      const phone = form.querySelector('[name="phone"]')?.value || 'N/A';
      const email = form.querySelector('[name="email"]')?.value || 'N/A';
      const product = form.querySelector('[name="product"]')?.value || 'Garment Manufacturing';
      const qty = form.querySelector('[name="quantity"]')?.value || 'Bulk';
      const message = form.querySelector('[name="message"]')?.value || '';

      const text = `*New Manufacturing Inquiry — R&P SPORTS*%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `🏢 *Company:* ${encodeURIComponent(company)}%0A` +
        `📱 *Phone:* ${encodeURIComponent(phone)}%0A` +
        `✉️ *Email:* ${encodeURIComponent(email)}%0A` +
        `👕 *Garment Requirement:* ${encodeURIComponent(product)}%0A` +
        `📦 *Estimated Quantity:* ${encodeURIComponent(qty)}%0A` +
        `📝 *Message:* ${encodeURIComponent(message)}`;

      const waUrl = `https://wa.me/919672145942?text=${text}`;

      showToast('Redirecting your inquiry to R&P SPORTS WhatsApp...');
      setTimeout(() => {
        window.open(waUrl, '_blank');
        form.reset();
      }, 1000);
    });
  });
}

function initProductInquiries() {
  const enquireBtns = document.querySelectorAll('.btn-enquire-product');
  enquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product-name') || 'Garment Product';
      const text = `Hello R&P SPORTS, I am interested in manufacturing *${encodeURIComponent(productName)}*. Please share details regarding minimum order quantities and bulk production timeline.`;
      const waUrl = `https://wa.me/919672145942?text=${text}`;
      window.open(waUrl, '_blank');
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
