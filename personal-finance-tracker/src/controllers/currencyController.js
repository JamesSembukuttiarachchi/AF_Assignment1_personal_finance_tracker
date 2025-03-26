const currencyService = require("../services/currencyService");

const getExchangeRates = async (req, res) => {
  try {
    const { from, to, amount } = req.query; // e.g., from=USD, to=EUR, amount=100

    // Fetch exchange rates using CurrencyService
    const rates = await currencyService.getExchangeRates(from);

    if (!rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    // Check if the target currency is available in the rates
    if (!rates[to]) {
      return res.status(400).json({ error: `No rate available for ${to}` });
    }

    const exchangeRate = rates[to];
    const convertedAmount = (exchangeRate * amount).toFixed(2);
    res.json({ convertedAmount, exchangeRate });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getExchangeRates };
