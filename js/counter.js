/* ==========================================================================
   LG CORPORATE - STATS NUMBER COUNTER (js/counter.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAnimatedCounters();
});

/**
 * 1. Intersection Observer Animated Counters
 */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');

  if (counterElements.length === 0) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el);
        observer.unobserve(el); // Animate once
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  counterElements.forEach(el => {
    counterObserver.observe(el);
  });
}

/**
 * 2. Exponential Ease-Out Count Up Animation
 */
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-counter-target'));
  const duration = parseInt(element.getAttribute('data-counter-duration')) || 2200;
  const suffix = element.getAttribute('data-counter-suffix') || '';
  const prefix = element.getAttribute('data-counter-prefix') || '';
  const decimalPlaces = parseInt(element.getAttribute('data-counter-decimals')) || 0;
  
  if (isNaN(target)) return;

  const startTimestamp = performance.now();

  // Ease Out Expo easing function for premium feel
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function updateCount(currentTime) {
    const elapsed = currentTime - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    
    // Apply easing
    const easedProgress = easeOutExpo(progress);
    
    // Calculate intermediate value
    const currentValue = easedProgress * target;
    
    // Format number
    let formattedValue = currentValue.toFixed(decimalPlaces);
    
    // Set value in element DOM
    element.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      // Ensure target is exactly hit at the end
      element.textContent = `${prefix}${target.toFixed(decimalPlaces)}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}
