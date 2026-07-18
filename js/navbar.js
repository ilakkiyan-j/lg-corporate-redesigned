/* ==========================================================================
   LG CORPORATE - NAVBAR & NAVIGATION SYSTEMS (js/navbar.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initAnnouncementBar();
  initMobileMenu();
  initSearchOverlay();
});

/**
 * 1. Navbar Scroll Behaviors & Progress Indicator
 */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const progressBar = document.querySelector('.scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!header) return;

  const scrollThreshold = 40;
  let ticking = false;
  
  // Cache DOM layout values to prevent synchronous layouts (reflow) on scroll
  let docHeight = 0;
  let sectionPositions = [];

  function cacheLayoutPositions() {
    docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    sectionPositions = [];
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const top = rect.top + scrollTop - 180;
      sectionPositions.push({
        id: section.getAttribute('id'),
        top: top,
        bottom: top + section.offsetHeight
      });
    });
  }

  // Pre-calculate positions once initially and bind to resize event
  cacheLayoutPositions();
  window.addEventListener('resize', cacheLayoutPositions, { passive: true });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        
        // 1. Add/remove scroll class
        if (scrollY > scrollThreshold) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        // 2. Scroll progress bar width calculation using cached docHeight
        if (progressBar && docHeight > 0) {
          const scrollPercent = (scrollY / docHeight) * 100;
          progressBar.style.width = `${scrollPercent}%`;
        }

        // 3. Active navigation link tracking using cached section positions
        let currentSectionId = '';
        for (let i = 0; i < sectionPositions.length; i++) {
          const pos = sectionPositions[i];
          if (scrollY >= pos.top && scrollY < pos.bottom) {
            currentSectionId = pos.id;
            break;
          }
        }

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}` || 
              link.getAttribute('href').endsWith(`#${currentSectionId}`)) {
            link.classList.add('active');
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 2. Closable Announcement Bar with Layout Adjustments
 */
function initAnnouncementBar() {
  const announcement = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-bar-close');
  
  if (!announcement || !closeBtn) return;

  // Check storage to see if user has already dismissed it
  if (sessionStorage.getItem('lg-announcement-dismissed') === 'true') {
    announcement.classList.add('closed');
    document.body.classList.add('announcement-closed');
  }

  closeBtn.addEventListener('click', () => {
    announcement.classList.add('closed');
    document.body.classList.add('announcement-closed');
    sessionStorage.setItem('lg-announcement-dismissed', 'true');
  });
}

/**
 * 3. Mobile Navigation Drawer (Hamburger toggle & Stagger animations)
 */
function initMobileMenu() {
  const menuTrigger = document.querySelector('.btn-menu-trigger');
  const menuClose = document.querySelector('.mobile-menu-close');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuTrigger || !menuOverlay) return;

  function openMenu() {
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
    
    // Stagger slide mobile navigation links
    mobileLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
      link.style.transition = `opacity 0.5s ease ${0.15 + (index * 0.08)}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + (index * 0.08)}s`;
      
      // Force repaint
      link.offsetHeight;
      
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    });

    // Keyboard accessibility focus trapping
    menuClose.focus();
  }

  function closeMenu() {
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
    
    mobileLinks.forEach(link => {
      link.style.transition = 'none';
      link.style.opacity = '';
      link.style.transform = '';
    });
  }

  menuTrigger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  // Close when clicking on any menu link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close drawer if user resizes back to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && menuOverlay.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 4. Fullscreen Search Overlay Portal with Accessibility Focus
 */
function initSearchOverlay() {
  const searchTrigger = document.querySelector('.btn-search-trigger');
  const searchClose = document.querySelector('.search-close');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-input');
  
  if (!searchTrigger || !searchOverlay || !searchInput) return;

  function openSearch() {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Focus search input after transitions complete
    setTimeout(() => {
      searchInput.focus();
      triggerPlaceholderTyping();
    }, 300);
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchTrigger.focus();
  }

  searchTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Close search overlay with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
      closeSearch();
    }
  });

  // Typing effect inside search bar on open
  let typingTimer;
  function triggerPlaceholderTyping() {
    const text = 'Search solutions, industries, projects...';
    let index = 0;
    searchInput.placeholder = '';
    
    clearInterval(typingTimer);
    
    typingTimer = setInterval(() => {
      if (index < text.length) {
        searchInput.placeholder += text.charAt(index);
        index++;
      } else {
        clearInterval(typingTimer);
      }
    }, 30);
  }
}
