/**
 * NW Designs - Form Validation Module
 * Real-time validation, AJAX submission, progress tracking
 */

const FormValidation = {
  form: null,
  fields: [],
  progressBar: null,
  source: 'landing', // Override per vertical

  // Field configuration
  fieldConfig: [
    { id: 'nome', type: 'text', required: true },
    { id: 'cognome', type: 'text', required: true },
    { id: 'email', type: 'email', required: true },
    { id: 'azienda', type: 'text', required: true },
    { id: 'privacy', type: 'checkbox', required: true }
  ],

  init(source = 'landing') {
    this.source = source;
    this.form = document.getElementById('lead-form');
    if (!this.form) return;

    this.fields = this.fieldConfig;
    this.progressBar = document.getElementById('form-progress-bar');

    // Real-time validation on blur
    this.fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        input.addEventListener('blur', () => this.validateField(field));
        input.addEventListener('input', () => {
          this.clearError(field.id);
          this.updateProgress();
        });
        input.addEventListener('change', () => this.updateProgress());
      }
    });

    // Form submission
    this.form.addEventListener('submit', (e) => this.onSubmit(e));

    // Initial progress update
    this.updateProgress();
  },

  validateField(field) {
    const input = document.getElementById(field.id);
    if (!input) return true;

    let isValid = true;

    if (field.required) {
      if (field.type === 'checkbox') {
        isValid = input.checked;
      } else {
        isValid = input.value.trim() !== '';
      }
    }

    if (isValid && field.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value);
    }

    if (!isValid) {
      this.showError(field.id);
    } else {
      this.clearError(field.id);
    }

    return isValid;
  },

  showError(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
    }

    // For checkbox, show error message
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
    this.fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  },

  updateProgress() {
    if (!this.progressBar) return;

    const requiredFields = this.form.querySelectorAll('[required]');
    let filled = 0;

    requiredFields.forEach(field => {
      if (field.type === 'checkbox') {
        if (field.checked) filled++;
      } else if (field.value.trim() !== '') {
        filled++;
      }
    });

    const progress = requiredFields.length > 0
      ? (filled / requiredFields.length) * 100
      : 0;

    this.progressBar.style.width = `${progress}%`;
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.validateAll()) {
      // Focus first invalid field
      const firstError = this.form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Collect form data
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Add source identifier
    data.source = this.source;
    data.privacy = formData.has('privacy') ? '1' : '';

    // Show loading state
    this.form.classList.add('form-loading');
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    // Send to main site API (cross-origin)
    fetch('https://www.nwdesigns.it/api/send-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Redirect to thank you page
        window.location.href = 'grazie.html';
      } else {
        throw new Error(result.error || result.errors?.join(', ') || 'Errore sconosciuto');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.form.classList.remove('form-loading');
      if (submitBtn) submitBtn.disabled = false;
      alert('Si è verificato un errore: ' + error.message);
    });
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidation;
} else {
  window.FormValidation = FormValidation;
}
