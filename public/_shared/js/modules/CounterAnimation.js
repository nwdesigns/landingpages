/**
 * NW Designs - Counter Animation Module
 * Animates numbers on scroll using Intersection Observer
 */

const CounterAnimation = {
  observer: null,
  animated: new Set(),

  config: {
    duration: 2000, // ms
    threshold: 0.5,
    easing: (t) => 1 - Math.pow(1 - t, 3) // ease-out-cubic
  },

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show final values immediately
      document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
      });
      return;
    }

    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: this.config.threshold }
    );

    counters.forEach(counter => {
      // Store original value and set to 0
      const target = parseInt(counter.dataset.counter, 10);
      counter.dataset.target = target;
      counter.textContent = '0' + (counter.dataset.suffix || '');
      this.observer.observe(counter);
    });
  },

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animated.has(entry.target)) {
        this.animated.add(entry.target);
        this.animateCounter(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  },

  animateCounter(element) {
    const target = parseInt(element.dataset.target || element.dataset.counter, 10);
    const suffix = element.dataset.suffix || '';
    const duration = this.config.duration;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = this.config.easing(progress);
      const current = Math.floor(easedProgress * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.animated.clear();
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CounterAnimation;
} else {
  window.CounterAnimation = CounterAnimation;
}
