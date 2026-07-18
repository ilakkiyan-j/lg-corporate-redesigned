/* ==========================================================================
   LG CORPORATE - ANIMATION CONTROLLER (js/animations.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initHeroParallax();
  initMagneticButtons();
  initTimelineProgress();
});

/**
 * 1. Scroll-Reveal Controller (GSAP-style reveals using Intersection Observer)
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Parse custom delay and duration attributes
        const delay = el.getAttribute('data-delay') || '0';
        const duration = el.getAttribute('data-duration') || '800';
        
        el.style.transitionDelay = `${delay}ms`;
        el.style.transitionDuration = `${duration}ms`;
        
        el.classList.add('active');
        
        // Unobserve after animating in to preserve resources
        observer.unobserve(el);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters viewport
    threshold: 0.1
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * 2. Hero Video Scroll Parallax & Zoom (Cached layout size queries)
 */
function initHeroParallax() {
  const videoWrapper = document.querySelector('.hero-video-wrapper');
  const heroSection = document.querySelector('.hero-section');
  
  if (!videoWrapper || !heroSection) return;

  let ticking = false;
  let heroHeight = heroSection.offsetHeight;

  // Cache height on resize to prevent layout queries on scroll
  window.addEventListener('resize', () => {
    heroHeight = heroSection.offsetHeight;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset;
        
        // Only run calculations if hero is in viewport
        if (scrollPosition <= heroHeight) {
          const percentage = scrollPosition / heroHeight;
          
          // Parallax zoom: scales down from 1.1 to 1.0 based on scroll
          const scale = 1.1 - (percentage * 0.1);
          // Parallax translate: slide video slower than normal scroll speed
          const translate = scrollPosition * 0.35;

          videoWrapper.style.transform = `scale(${scale}) translateY(${translate}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 3. Magnetic Buttons (Fluid, spring-like mouse follow interaction)
 */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.btn, .btn-carousel-nav, .social-link, .hero-audio-toggle');

  // Disable on touch screens to prevent issues
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      
      // Calculate coordinates relative to the button's center
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      // Define limits (maximum movement in pixels)
      const maxMove = 12;
      const factor = 0.35; // Sensitivity factor
      
      const moveX = x * factor;
      const moveY = y * factor;
      
      btn.style.transform = `translate(${Math.max(-maxMove, Math.min(maxMove, moveX))}px, ${Math.max(-maxMove, Math.min(maxMove, moveY))}px)`;
      
      if (btn.classList.contains('btn-primary')) {
        btn.style.boxShadow = `0 ${8 + (moveY * 0.5)}px ${24 + (Math.abs(moveX) * 0.5)}px rgba(230, 57, 70, 0.35)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      
      setTimeout(() => {
        btn.style.transition = '';
      }, 500);
    });
  });
}

/**
 * 4. Timeline Scroll Progress Indicator with Item Activation (Cached & Optimized)
 */
function initTimelineProgress() {
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineProgress || !timelineContainer || timelineItems.length === 0) return;
  
  let ticking = false;
  let timelineTop = 0;
  let timelineHeight = 0;
  let itemPositions = [];

  // Pre-calculate positions to prevent synchronous layout triggers inside scroll thread
  function calculatePositions() {
    const rect = timelineContainer.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    timelineTop = rect.top + scrollTop;
    timelineHeight = timelineContainer.offsetHeight;

    itemPositions = [];
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      itemPositions.push({
        element: item,
        top: itemRect.top + scrollTop - 120
      });
    });
  }

  // Calculate once initially and bind to resize event
  calculatePositions();
  window.addEventListener('resize', calculatePositions, { passive: true });
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const triggerPoint = scrollY + (windowHeight * 0.65); // Trigger line at 65% of screen height
        
        // 1. Calculate timeline progress bar height
        if (triggerPoint >= timelineTop && triggerPoint <= timelineTop + timelineHeight) {
          const relativePercent = ((triggerPoint - timelineTop) / timelineHeight) * 100;
          timelineProgress.style.height = `${Math.min(100, Math.max(0, relativePercent))}%`;
        } else if (triggerPoint < timelineTop) {
          timelineProgress.style.height = '0%';
        } else if (triggerPoint > timelineTop + timelineHeight) {
          timelineProgress.style.height = '100%';
        }
        
        // 2. Activate timeline card nodes as they pass the trigger point
        itemPositions.forEach(item => {
          if (triggerPoint >= item.top) {
            item.element.classList.add('active');
          } else {
            item.element.classList.remove('active');
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
