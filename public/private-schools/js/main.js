/**
 * NW Designs - Private Schools Landing Page
 * Main JavaScript (Refined Italian Minimalism)
 */

(function() {
  'use strict';

  const CustomCursor = {
    ring: null, dot: null, mouseX: 0, mouseY: 0, ringX: 0, ringY: 0, dotX: 0, dotY: 0,
    isDesktop: window.innerWidth >= 768, isHovering: false, isOnDark: false,

    init() {
      if (!this.isDesktop) return;
      this.ring = document.getElementById('cursor-ring');
      this.dot = document.getElementById('cursor-dot');
      if (!this.ring || !this.dot) return;

      document.addEventListener('mousemove', (e) => this.onMouseMove(e));
      const interactives = document.querySelectorAll('.interactive, a, button, input, textarea, select, label[for]');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => this.onHover(true));
        el.addEventListener('mouseleave', () => this.onHover(false));
      });
      this.setupDarkSectionDetection();
      this.animate();
      window.addEventListener('resize', () => {
        this.isDesktop = window.innerWidth >= 768;
        if (!this.isDesktop) { this.ring.style.display = 'none'; this.dot.style.display = 'none'; }
        else { this.ring.style.display = 'block'; this.dot.style.display = 'block'; }
      });
    },

    onMouseMove(e) { this.mouseX = e.clientX; this.mouseY = e.clientY; },

    onHover(isHovering) {
      this.isHovering = isHovering;
      if (isHovering) { this.ring.classList.add('hover'); this.dot.classList.add('hover'); }
      else { this.ring.classList.remove('hover'); this.dot.classList.remove('hover'); }
    },

    setupDarkSectionDetection() {
      const checkDarkSection = () => {
        const element = document.elementFromPoint(this.mouseX, this.mouseY);
        if (!element) return;
        const isDark = element.closest('.bg-nw-dark, [class*="bg-nw-dark"], footer');
        if (isDark && !this.isOnDark) { this.isOnDark = true; this.ring.classList.add('light'); this.dot.classList.add('light'); }
        else if (!isDark && this.isOnDark) { this.isOnDark = false; this.ring.classList.remove('light'); this.dot.classList.remove('light'); }
      };
      setInterval(checkDarkSection, 100);
    },

    animate() {
      if (!this.isDesktop) return;
      const ringEase = 0.15;
      this.ringX += (this.mouseX - this.ringX) * ringEase;
      this.ringY += (this.mouseY - this.ringY) * ringEase;
      const dotEase = 0.25;
      this.dotX += (this.mouseX - this.dotX) * dotEase;
      this.dotY += (this.mouseY - this.dotY) * dotEase;
      this.ring.style.left = `${this.ringX}px`;
      this.ring.style.top = `${this.ringY}px`;
      this.dot.style.left = `${this.dotX}px`;
      this.dot.style.top = `${this.dotY}px`;
      requestAnimationFrame(() => this.animate());
    }
  };

  const FormValidation = {
    form: null, fields: [],

    init() {
      this.form = document.getElementById('lead-form');
      if (!this.form) return;
      this.fields = [
        { id: 'nome', type: 'text', required: true },
        { id: 'cognome', type: 'text', required: true },
        { id: 'email', type: 'email', required: true },
        { id: 'azienda', type: 'text', required: true },
        { id: 'privacy', type: 'checkbox', required: true }
      ];
      this.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
          input.addEventListener('blur', () => this.validateField(field));
          input.addEventListener('input', () => this.clearError(field.id));
        }
      });
      this.form.addEventListener('submit', (e) => this.onSubmit(e));
    },

    validateField(field) {
      const input = document.getElementById(field.id);
      if (!input) return true;
      let isValid = true;
      if (field.required) {
        if (field.type === 'checkbox') isValid = input.checked;
        else isValid = input.value.trim() !== '';
      }
      if (isValid && field.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value);
      }
      if (!isValid) this.showError(field.id);
      else this.clearError(field.id);
      return isValid;
    },

    showError(fieldId) {
      const input = document.getElementById(fieldId);
      if (!input) return;
      const formGroup = input.closest('.form-group');
      if (formGroup) formGroup.classList.add('error');
      if (input.type === 'checkbox') {
        const label = input.closest('label');
        if (label) {
          const errorMsg = label.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.classList.remove('hidden');
        }
      }
    },

    clearError(fieldId) {
      const input = document.getElementById(fieldId);
      if (!input) return;
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.classList.add('hidden');
      }
    },

    validateAll() {
      let isValid = true;
      this.fields.forEach(field => { if (!this.validateField(field)) isValid = false; });
      return isValid;
    },

    onSubmit(e) {
      e.preventDefault();
      if (!this.validateAll()) {
        const firstError = this.form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
        return;
      }
      const formData = new FormData(this.form);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });
      data.source = 'private-schools';
      data.privacy = formData.has('privacy') ? '1' : '';

      this.form.classList.add('form-loading');
      const submitBtn = this.form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) window.location.href = 'grazie.html';
        else throw new Error(result.error || result.errors?.join(', ') || 'Errore sconosciuto');
      })
      .catch(error => {
        console.error('Error:', error);
        this.form.classList.remove('form-loading');
        if (submitBtn) submitBtn.disabled = false;
        alert('Si è verificato un errore: ' + error.message);
      });
    }
  };

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            const navHeight = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        });
      });
    }
  };

  const ScrollAnimations = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('animate-in'); observer.unobserve(entry.target); }
        });
      }, observerOptions);
      document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
      });
      const style = document.createElement('style');
      style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
      document.head.appendChild(style);
      const hero = document.querySelector('section:first-of-type');
      if (hero) { hero.style.opacity = '1'; hero.style.transform = 'translateY(0)'; }
    }
  };

  // ============================================
  // Floating CTA Visibility (Mobile)
  // ============================================

  const FloatingCTA = {
    init() {
      const floatingCta = document.querySelector('.floating-cta');
      if (!floatingCta) return;

      const contactSection = document.getElementById('contatto');
      const footer = document.querySelector('footer');

      if (!contactSection && !footer) return;

      const observerOptions = {
        threshold: 0,
        rootMargin: '0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            floatingCta.style.opacity = '0';
            floatingCta.style.pointerEvents = 'none';
          } else {
            const anyVisible = entries.some(e => e.isIntersecting);
            if (!anyVisible) {
              floatingCta.style.opacity = '1';
              floatingCta.style.pointerEvents = 'auto';
            }
          }
        });
      }, observerOptions);

      if (contactSection) observer.observe(contactSection);
      if (footer) observer.observe(footer);

      floatingCta.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    CustomCursor.init();
    FormValidation.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    FloatingCTA.init();
  });

})();
