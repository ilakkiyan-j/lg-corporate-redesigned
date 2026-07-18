# LG Corporate - Website Redesign Project

A premium, highly performant, and fully responsive redesign of the official corporate portal for **LG Corporate (LG Technology)** based in Coimbatore, Tamil Nadu, India.

---

## 🔗 Project Links & Live Comparisons

*   **Official Live Website:** [https://lgcorporate.in](https://lgcorporate.in) (For comparison)
*   **Redesigned Live Website:** [https://lg-corporate-redesigned.pages.dev/](https://lg-corporate-redesigned.pages.dev/) (Redesigned Preview)

---

## 🎨 Redesign Goals & Key Improvements

1.  **Modern Cinematic Hero Section**
    *   Replaced static layouts with a full-viewport, loop-playing industrial background video (`assets/videos/hero.mp4`).
    *   Added a custom **Audio Enable/Mute Toggle** (`#btnAudioToggle`) in the bottom-right corner to allow users to play background audio in compliance with autoplay rules.
    *   Repositioned primary and secondary call-to-action buttons absolutely at `bottom: 27%` (desktop) and `bottom: 12%` (mobile) to prevent text overlaps with the burned-in video copy.

2.  **Fluid Mobile Responsiveness (Adaptability)**
    *   Eliminated layout squishing or collapsing heights under small breakpoints.
    *   Set container grids (`.stats-card-grid`, `.services-grid`, `.industries-grid`) to transition fluidly from 3 columns (desktop) to 2 columns (tablet) and 1 column (mobile devices).
    *   Modified the sticky centered navbar to collapse into a smooth slide-out drawer menu (`.mobile-menu-overlay`) on mobile screens.
    *   Integrated CSS `clamp()` variables for fluid typography sizing across different screen aspect ratios.

3.  **Performance Optimization (Zero Scroll Lag)**
    *   Removed scroll repaints and layout thrashing (forced synchronous reflows) by caching DOM geometry values (e.g., `offsetTop`, `offsetHeight`, `scrollHeight`) outside scroll loops.
    *   Linked scrolling trackers in both navbar link highlights and corporate timeline progress meters to active animations via layout-cached positions.

4.  **Verified Copy & Branding**
    *   Cleaned and formatted address: **LG Corporate (LG Technology), Gandhipuram, Coimbatore - 641012, Tamil Nadu, India**.
    *   Injected official company profile and multi-industry vision statement into both homepage and about subpages.

---

## 📁 Repository Structure

```
lg-corporate/
│
├── README.md               # Redesign and comparison documentation
├── index.html              # Main landing page featuring all sections
│
├── css/
│   ├── utilities.css       # Global design variables, grids, and resets
│   ├── animations.css      # Smooth transitions and viewport reveals
│   ├── style.css           # Principal component layouts
│   └── responsive.css      # Custom breakpoint media overrides
│
├── js/
│   ├── navbar.js           # Scroll triggers, active links, and drawers
│   ├── counter.js          # Intersection-based numeric incrementer
│   ├── animations.js       # GSAP-style slide/scale scroll reveals
│   └── script.js           # Subpage triggers, carousels, and audio toggle
│
└── pages/
    ├── about.html          # Corporate mission, profile, and vision page
    ├── services.html       # Industrial services & CAD blueprint listings
    ├── products.html       # Cloud ERP platforms & telemetry routers
    ├── industries.html     # Mobility, machinery, and software details
    ├── careers.html        # Talent staffing openings and requirements
    └── contact.html        # Direct email forms & office address listings
```

---

## 🚀 How to Run the Project

1.  Clone this repository to your local computer.
2.  Open [index.html](index.html) directly in any modern web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). No server setup, Node modules, or package builders are required.
3.  Click the speaker button in the bottom-right of the hero to unmute the cinematic track.
