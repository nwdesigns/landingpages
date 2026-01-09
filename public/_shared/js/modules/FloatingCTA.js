/**
 * NW Designs - Floating CTA Module
 * Mobile floating button that hides near contact form
 */

const FloatingCTA = {
  element: null,
  observer: null,

  init() {
    this.element = document.querySelector('.floating-cta');
    if (!this.element) return;

    const contactSection = document.getElementById('contatto');
    const footer = document.querySelector('footer');

    if (!contactSection && !footer) return;

    const observerOptions = {
      threshold: 0,
      rootMargin: '0px'
    };

    let visibleTargets = new Set();

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleTargets.add(entry.target);
        } else {
          visibleTargets.delete(entry.target);
        }
      });

      // Hide if any target is visible
      if (visibleTargets.size > 0) {
        this.hide();
      } else {
        this.show();
      }
    }, observerOptions);

    if (contactSection) this.observer.observe(contactSection);
    if (footer) this.observer.observe(footer);

    // Apply transition
    this.element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  },

  show() {
    if (this.element) {
      this.element.style.opacity = '1';
      this.element.style.pointerEvents = 'auto';
      this.element.style.transform = 'translateX(-50%) translateY(0)';
    }
  },

  hide() {
    if (this.element) {
      this.element.style.opacity = '0';
      this.element.style.pointerEvents = 'none';
      this.element.style.transform = 'translateX(-50%) translateY(20px)';
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
  module.exports = FloatingCTA;
} else {
  window.FloatingCTA = FloatingCTA;
}
