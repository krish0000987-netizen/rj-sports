/**
 * R&P SPORTS — Main JavaScript
 * Handles theme toggle (white mode default), navigation, hero slideshow (3s timer), mobile drawer, forms, and WhatsApp triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initMobileNav();
  initHeroSlider();
  initForms();
  initProductInquiries();
});

/* ==========================================================================
   THEME TOGGLE (WHITE MODE DEFAULT)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('rp-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  updateThemeIcons(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rp-theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  });
}

/* ==========================================================================
   HEADER SCROLL EFFECT
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
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
  const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
  const closeBtns = document.querySelectorAll('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!drawer || !overlay) return;

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburgerBtns.forEach(btn => {
    btn.addEventListener('click', openDrawer);
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeDrawer);
  });

  overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
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
  const slideDuration = 3000;

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

  // Mobile touch swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  slider.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopTimer();
    }
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      // Only trigger if horizontal swipe is greater than vertical movement
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startTimer();
    }
  }, { passive: true });

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
