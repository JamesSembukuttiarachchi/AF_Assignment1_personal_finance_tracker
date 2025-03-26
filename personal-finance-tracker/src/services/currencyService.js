const axios = require("axios");
const { BASE_URL } = require("../config/frankfurterConfig");

class CurrencyService {
  // Fetch real-time exchange rates for a given base currency
  async getExchangeRates(baseCurrency) {
    try {
      const response = await axios.get(
        `${BASE_URL}/latest?from=${baseCurrency}`
      );
      return response.data.rates; // Example: { USD: 1.1, GBP: 0.85, EUR: 1 }
    } catch (error) {
      console.error(
        "Error fetching exchange rates from Frankfurter API:",
        error
      );
      return null;
    }
  }

  // Convert an amount from one currency to another using real-time rates
  async convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount; // No conversion needed

    const rates = await this.getExchangeRates(fromCurrency);
    if (!rates || !rates[toCurrency]) {
      throw new Error(
        `Conversion rate not available for ${fromCurrency} to ${toCurrency}`
      );
    }

    return amount * rates[toCurrency]; // Convert and return the amount
  }
}

module.exports = new CurrencyService();
