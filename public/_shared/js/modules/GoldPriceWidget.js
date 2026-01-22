/**
 * NW Designs - Gold Price Widget Module
 * Fetches live gold price from goldprice.org API
 */

const GoldPriceWidget = {
  container: null,
  priceElement: null,
  timestampElement: null,
  apiUrl: 'https://data-asg.goldprice.org/dbXRates/EUR',

  // Fallback price if API fails
  fallbackPrice: 78.50,

  init() {
    this.container = document.getElementById('gold-widget');
    if (!this.container) return;

    this.priceElement = this.container.querySelector('[data-gold-price]');
    this.timestampElement = this.container.querySelector('[data-gold-timestamp]');

    // Try to fetch live price
    this.fetchPrice();

    // Refresh every 5 minutes
    setInterval(() => this.fetchPrice(), 5 * 60 * 1000);
  },

  async fetchPrice() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('API response not ok');

      const data = await response.json();

      // API returns: { items: [{ xauPrice: number, ... }] }
      // Gold price per troy ounce, we need to convert to grams
      // 1 troy ounce = 31.1035 grams
      const pricePerOunce = data.items?.[0]?.xauPrice;

      if (pricePerOunce) {
        const pricePerGram = pricePerOunce / 31.1035;
        this.updateDisplay(pricePerGram);
      } else {
        throw new Error('Invalid API data');
      }
    } catch (error) {
      console.warn('Gold price fetch failed, using fallback:', error);
      this.updateDisplay(this.fallbackPrice);
    }
  },

  updateDisplay(pricePerGram) {
    if (this.priceElement) {
      // Format price with 2 decimals and Euro symbol
      const formatted = pricePerGram.toFixed(2).replace('.', ',');
      this.priceElement.textContent = `€${formatted}`;
    }

    if (this.timestampElement) {
      const now = new Date();
      const formatted = now.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      this.timestampElement.textContent = formatted;
    }

    // Add update animation
    if (this.container) {
      this.container.classList.add('updated');
      setTimeout(() => this.container.classList.remove('updated'), 500);
    }
  },

  // Manual refresh
  refresh() {
    this.fetchPrice();
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoldPriceWidget;
} else {
  window.GoldPriceWidget = GoldPriceWidget;
}
