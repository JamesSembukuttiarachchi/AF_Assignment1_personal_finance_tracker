const Budget = require("../models/Budget");
const logger = require("../config/logger");

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const budget = new Budget({
      category,
      amount,
      month,
      userId: req.user.id,
    });

    await budget.save();
    logger.info(
      `Budget created for user ${req.user.id}: ${category}, ${amount}, Month: ${month}`
    );
    res.status(201).json({ message: "Budget created successfully", budget });
  } catch (err) {
    logger.error(
      `Error creating budget for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Get all budgets for the authenticated user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    logger.info(`Fetched budgets for user ${req.user.id}`);
    res.json(budgets);
  } catch (err) {
    logger.error(
      `Error fetching budgets for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { category, amount, month },
      { new: true }
    );
    logger.info(
      `Budget updated for user ${req.user.id}: ${category}, ${amount}, Month: ${month}`
    );
    res.json(budget);
  } catch (err) {
    logger.error(
      `Error updating budget for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    logger.info(`Budget deleted for user ${req.user.id}: ${req.params.id}`);
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    logger.error(
      `Error deleting budget for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};
