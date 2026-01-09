/**
 * NW Designs - Custom Cursor Module
 * Ring + Dot cursor with GSAP-like smooth follow
 * Adapts color based on background luminosity
 */

const CustomCursor = {
  ring: null,
  dot: null,
  mouseX: 0,
  mouseY: 0,
  ringX: 0,
  ringY: 0,
  isDesktop: window.innerWidth >= 768,
  isHovering: false,
  isOnDark: false,
  rafId: null,

  // Configuration matching DESIGN-PROMPT.md
  config: {
    ringSize: 32,
    dotSize: 32,
    hoverScale: 1.5,
    ringDuration: 0.5,  // GSAP-like lag for ring
    lightnessThreshold: 128,
    interactiveSelectors: 'a, button, [role="button"], input, textarea, select, label[for], .interactive, .cursor-pointer',
    minWidth: 768
  },

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (!this.isDesktop) return;

    this.ring = document.getElementById('cursor-ring');
    this.dot = document.getElementById('cursor-dot');

    if (!this.ring || !this.dot) {
      this.createCursorElements();
    }

    // Show cursors
    this.ring.classList.add('visible');
    this.dot.classList.add('visible');

    // Mouse move listener
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Mouse enter/leave document
    document.addEventListener('mouseenter', () => this.showCursor());
    document.addEventListener('mouseleave', () => this.hideCursor());

    // Interactive elements hover
    this.setupInteractiveHover();

    // Dark section detection
    this.setupDarkSectionDetection();

    // Start animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  },

  createCursorElements() {
    // Create ring
    this.ring = document.createElement('div');
    this.ring.id = 'cursor-ring';
    this.ring.className = 'cursor-ring';
    document.body.appendChild(this.ring);

    // Create dot
    this.dot = document.createElement('div');
    this.dot.id = 'cursor-dot';
    this.dot.className = 'cursor-dot';
    document.body.appendChild(this.dot);
  },

  setupInteractiveHover() {
    const addHoverListeners = (elements) => {
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => this.onHover(true));
        el.addEventListener('mouseleave', () => this.onHover(false));
      });
    };

    // Initial elements
    const interactives = document.querySelectorAll(this.config.interactiveSelectors);
    addHoverListeners(interactives);

    // Watch for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches(this.config.interactiveSelectors)) {
              addHoverListeners([node]);
            }
            const children = node.querySelectorAll?.(this.config.interactiveSelectors);
            if (children) addHoverListeners(children);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  },

  onHover(isHovering) {
    this.isHovering = isHovering;
    if (isHovering) {
      this.ring.classList.add('hover');
      this.dot.classList.add('hover');
    } else {
      this.ring.classList.remove('hover');
      this.dot.classList.remove('hover');
    }
  },

  showCursor() {
    if (this.ring) this.ring.classList.add('visible');
    if (this.dot) this.dot.classList.add('visible');
  },

  hideCursor() {
    if (this.ring) this.ring.classList.remove('visible');
    if (this.dot) this.dot.classList.remove('visible');
  },

  setupDarkSectionDetection() {
    const checkDarkSection = () => {
      if (!this.isDesktop) return;

      const element = document.elementFromPoint(this.mouseX, this.mouseY);
      if (!element) return;

      // Check if on dark section
      const darkSection = element.closest('.bg-nw-dark, [class*="bg-nw-dark"], footer, [data-cursor-light]');

      if (darkSection && !this.isOnDark) {
        this.isOnDark = true;
        this.ring.classList.add('light');
        this.dot.classList.add('light');
      } else if (!darkSection && this.isOnDark) {
        this.isOnDark = false;
        this.ring.classList.remove('light');
        this.dot.classList.remove('light');
      }
    };

    // Check periodically (100ms is efficient)
    setInterval(checkDarkSection, 100);
  },

  animate() {
    if (!this.isDesktop) return;

    // Ring follows with lag (GSAP power3.out feel)
    // Using lerp with factor ~0.08 simulates 0.5s duration
    const ringEase = 0.08;
    this.ringX += (this.mouseX - this.ringX) * ringEase;
    this.ringY += (this.mouseY - this.ringY) * ringEase;

    // Dot follows instantly (no lag per DESIGN-PROMPT.md)
    const dotX = this.mouseX;
    const dotY = this.mouseY;

    // Apply transforms
    if (this.ring) {
      this.ring.style.left = `${this.ringX}px`;
      this.ring.style.top = `${this.ringY}px`;
    }
    if (this.dot) {
      this.dot.style.left = `${dotX}px`;
      this.dot.style.top = `${dotY}px`;
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  },

  onResize() {
    this.isDesktop = window.innerWidth >= this.config.minWidth;

    if (!this.isDesktop) {
      if (this.ring) this.ring.style.display = 'none';
      if (this.dot) this.dot.style.display = 'none';
      if (this.rafId) cancelAnimationFrame(this.rafId);
    } else {
      if (this.ring) this.ring.style.display = 'block';
      if (this.dot) this.dot.style.display = 'block';
      this.animate();
    }
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.ring) this.ring.remove();
    if (this.dot) this.dot.remove();
  }
};

// Export for module bundlers or attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomCursor;
} else {
  window.CustomCursor = CustomCursor;
}
