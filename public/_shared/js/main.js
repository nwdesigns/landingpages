/**
 * NW Designs - Main JavaScript Loader
 * Initializes all modules for landing pages
 *
 * Usage in HTML:
 * <script src="../_shared/js/main.js" data-source="luxury"></script>
 *
 * The data-source attribute sets the form source identifier
 */

(function() {
  'use strict';

  // Get source from script tag
  const currentScript = document.currentScript;
  const source = currentScript?.dataset?.source || 'landing';

  // Wait for modules to load (if using separate files)
  // Or use inline modules below

  // ============================================
  // Module Definitions (Inline for single-file usage)
  // ============================================

  // Import modules if they exist globally, otherwise define inline
  const modules = {
    CustomCursor: window.CustomCursor || null,
    FormValidation: window.FormValidation || null,
    SmoothScroll: window.SmoothScroll || null,
    ScrollAnimations: window.ScrollAnimations || null,
    CounterAnimation: window.CounterAnimation || null,
    FloatingCTA: window.FloatingCTA || null,
    GoldPriceWidget: window.GoldPriceWidget || null
  };

  // ============================================
  // Initialize All Modules
  // ============================================

  const init = () => {
    // Custom Cursor (desktop only)
    if (modules.CustomCursor) {
      modules.CustomCursor.init();
    }

    // Form Validation with source
    if (modules.FormValidation) {
      modules.FormValidation.init(source);
    }

    // Smooth Scroll
    if (modules.SmoothScroll) {
      modules.SmoothScroll.init(100); // 100px navbar offset
    }

    // Scroll Animations
    if (modules.ScrollAnimations) {
      modules.ScrollAnimations.init();
    }

    // Counter Animation
    if (modules.CounterAnimation) {
      modules.CounterAnimation.init();
    }

    // Floating CTA (mobile)
    if (modules.FloatingCTA) {
      modules.FloatingCTA.init();
    }

    // Gold Price Widget (only for gold-traders)
    if (source === 'gold-traders' && modules.GoldPriceWidget) {
      modules.GoldPriceWidget.init();
    }

    console.log(`[NW] Landing page initialized: ${source}`);
  };

  // ============================================
  // DOM Ready
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
