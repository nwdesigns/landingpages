/**
 * NW Designs - Scroll Animations Module
 * Intersection Observer based reveal animations
 */

const ScrollAnimations = {
  observer: null,

  config: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  },

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show all elements immediately
      document.querySelectorAll('[data-animate], section').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.config
    );

    // Observe sections without [data-animate] attribute (backward compat)
    document.querySelectorAll('section').forEach(section => {
      if (!section.hasAttribute('data-animate')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
      this.observer.observe(section);
    });

    // Observe elements with [data-animate] attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      this.observer.observe(el);
    });

    // Observe stagger containers
    document.querySelectorAll('[data-animate-stagger]').forEach(el => {
      this.observer.observe(el);
    });

    // Immediately show hero section
    const hero = document.querySelector('section:first-of-type');
    if (hero) {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
      hero.classList.add('animate-in');
    }
  },

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        // For sections without data-animate, apply direct styles
        if (!entry.target.hasAttribute('data-animate')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }

        this.observer.unobserve(entry.target);
      }
    });
  },

  // Manual trigger for dynamically added elements
  observe(element) {
    if (this.observer && element) {
      this.observer.observe(element);
    }
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollAnimations;
} else {
  window.ScrollAnimations = ScrollAnimations;
}
