const Report = require("../models/Report");
const Transaction = require("../models/Transaction");
const logger = require("../config/logger");

// Generate Monthly Report Controller
exports.generateMonthlyReport = async (req, res) => {
  const { month, year, tags } = req.body;

  // Validate month and year
  if (!month || !year) {
    return res.status(400).send({ error: "Month and year are required." });
  }

  try {
    logger.info(
      `Generating monthly report for user ${req.user._id} for ${month}/${year}`
    );

    // Calculate the start and end dates for the given month
    const startDate = new Date(year, month - 1, 1); // Month is zero-based, so subtract 1
    const endDate = new Date(year, month, 0); // Using the 0th day of the next month to get the last day of the month

    // Build the query with the date range and optional tag filters
    const query = {
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    };

    if (tags && tags.length > 0) {
      query.tags = { $in: tags }; // Filter transactions that have one or more of the provided tags
    }

    const transactions = await Transaction.find(query);

    if (!transactions.length) {
      return res
        .status(404)
        .send({ message: "No transactions found for the specified month." });
    }

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Create a new report document
    const report = new Report({
      userId: req.user._id,
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      categories: calculateCategoryWiseTotals(transactions),
    });

    const savedReport = await report.save();
    logger.info(
      `Monthly report generated successfully for user ${req.user._id}`
    );
    res.send(savedReport);
  } catch (err) {
    logger.error(
      `Error generating report for user ${req.user._id}: ${err.message}`
    );
    res
      .status(500)
      .send({ error: "An error occurred while generating the report." });
  }
};

// Helper function to calculate category-wise totals
const calculateCategoryWiseTotals = (transactions) => {
  const categories = {};
  transactions.forEach((transaction) => {
    categories[transaction.category] =
      (categories[transaction.category] || 0) + transaction.amount;
  });
  return Object.keys(categories).map((category) => ({
    category,
    totalAmount: categories[category],
  }));
};
