/* ==========================================================================
   LG CORPORATE - MAIN INTERACTIVE COORDINATOR (js/script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initTechTabs();
  initTestimonialsSlider();
  initVideoFallback();
  initHeroAudio();
});

/**
 * 1. FAQ Accordion Height Animation
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items for a cleaner flow
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = '0';
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        body.style.maxHeight = `${body.scrollHeight}px`;
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support: Space/Enter on header to trigger
    header.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/**
 * 2. Technology Solutions (Enterprise Capabilities Tabs)
 */
function initTechTabs() {
  const tabButtons = document.querySelectorAll('.btn-tech-tab');
  const tabPanels = document.querySelectorAll('.tech-tab-content-panel');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tech-target');

      // Set active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Set active panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/**
 * 3. Testimonials Carousel Slider (Responsive slides, auto-advance, and dots navigation)
 */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.btn-carousel-nav.prev');
  const nextBtn = document.querySelector('.btn-carousel-nav.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let itemsPerPage = getItemsPerPage();
  let maxIndex = Math.max(0, slides.length - itemsPerPage);
  let autoPlayTimer;

  // Initial layout setup
  updateSliderPosition();
  createDots();
  startAutoPlay();

  // Create carousel navigation dots
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    
    const dotCount = slides.length - itemsPerPage + 1;
    if (dotCount <= 1) return;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      
      dot.addEventListener('click', () => {
        currentIndex = i;
        slideTransition();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function getItemsPerPage() {
    const width = window.innerWidth;
    if (width > 1024) return 3; // Desktop
    if (width > 480) return 2;  // Tablet
    return 1;                   // Mobile
  }

  function updateSliderPosition() {
    // Width of individual slide is evaluated dynamically
    const gap = 32;
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
  }

  function slideTransition() {
    updateSliderPosition();
    updateActiveDot();
  }

  function updateActiveDot() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx === currentIndex) dot.classList.add('active');
    });
  }

  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Wrap around
    }
    slideTransition();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Wrap to end
    }
    slideTransition();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  // Autoplay functionality
  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 6000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause autoplay on mouse hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);

  // Resize listener to re-evaluate slider calculations
  window.addEventListener('resize', () => {
    const prevItems = itemsPerPage;
    itemsPerPage = getItemsPerPage();
    maxIndex = Math.max(0, slides.length - itemsPerPage);
    
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    if (prevItems !== itemsPerPage) {
      createDots();
    }
    
    updateSliderPosition();
  });

  // Touch Swipe navigation support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) { // Scroll threshold
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    isDragging = false;
    startAutoPlay();
  }, { passive: true });
}

/**
 * 4. Video Fallback Poster setup
 */
function initVideoFallback() {
  const video = document.querySelector('.hero-video-wrapper video');
  
  if (!video) return;

  // Add event listener to fall back to styling overlays if video fails to load
  video.addEventListener('error', () => {
    const wrapper = document.querySelector('.hero-video-wrapper');
    if (wrapper) {
      wrapper.style.backgroundImage = "url('assets/images/about-company.jpg')";
      wrapper.style.backgroundSize = "cover";
      wrapper.style.backgroundPosition = "center";
      video.style.display = "none";
    }
  });
}

/**
 * 5. Hero Background Video Audio Controller
 */
function initHeroAudio() {
  const video = document.getElementById('heroBgVideo');
  const audioBtn = document.getElementById('btnAudioToggle');
  const audioIcon = document.getElementById('audioIcon');
  
  if (!video || !audioBtn || !audioIcon) return;

  audioBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      // Show muted speaker icon
      audioIcon.innerHTML = `<path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>`;
      audioBtn.setAttribute('aria-label', 'Unmute Hero Audio');
    } else {
      // Show unmuted waves speaker icon
      audioIcon.innerHTML = `<path d="M11.536 14.01A8.47 8.47 0 0 0 14 8c0-2.29-.91-4.365-2.38-5.88-.277-.285-.71-.343-1.053-.082a.75.75 0 0 0-.083 1.08l.013.013C11.83 4.453 12.5 6.152 12.5 8c0 1.848-.67 3.547-1.503 4.87a.75.75 0 0 0 .07 1.056c.338.272.782.234 1.07-.016zM9.73 11.724A5.47 5.47 0 0 0 11 8c0-1.53-.63-2.92-1.64-3.92a.75.75 0 0 0-1.053-.06.75.75 0 0 0-.063 1.057C9.07 5.92 9.5 6.91 9.5 8c0 1.09-.43 2.08-1.256 2.92a.75.75 0 0 0 .063 1.058.75.75 0 0 0 1.023-.254zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>`;
      audioBtn.setAttribute('aria-label', 'Mute Hero Audio');
    }
  });
}
