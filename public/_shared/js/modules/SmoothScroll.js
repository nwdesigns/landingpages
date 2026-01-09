/**
 * NW Designs - Smooth Scroll Module
 * Anchor link scrolling with navbar offset
 */

const SmoothScroll = {
  navOffset: 100, // Account for fixed navbar

  init(offset = 100) {
    this.navOffset = offset;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
    });
  },

  handleClick(e, anchor) {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      this.scrollTo(target);
    }
  },

  scrollTo(element) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - this.navOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  // Utility: scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmoothScroll;
} else {
  window.SmoothScroll = SmoothScroll;
}
