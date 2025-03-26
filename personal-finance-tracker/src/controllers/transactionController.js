const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const Budget = require("../models/Budget");
const User = require("../models/User");
const logger = require("../config/logger");
const currencyService = require("../services/currencyService");
const { runNotificationService } = require("../utils/notificationService"); // Make sure the path is correct

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const {
    type,
    amount,
    currency,
    category,
    tags,
    description,
    recurring,
    date,
  } = req.body;
  const userId = req.user._id;

  try {
    // Fetch user preferences
    const user = await User.findById(userId);
    if (!user) {
      logger.error(`User not found: ${userId}`);
      return res.status(404).send("User not found");
    }

    // Convert amount to the user's preferred currency
    let convertedAmount = amount;
    if (currency !== user.preferredCurrency) {
      convertedAmount = await currencyService.convertAmount(
        amount,
        currency,
        user.preferredCurrency
      );
    }

    // Create the transaction
    const transaction = new Transaction({
      userId,
      type,
      convertedAmount,
      currency: user.preferredCurrency,
      category,
      tags,
      description,
      date,
      recurring,
    });

    const savedTransaction = await transaction.save();
    logger.info(
      `Transaction created for user ${userId}: ${savedTransaction._id}`
    );

    // Auto-save feature: Allocate % of income to savings
    if (type === "income") {
      const goals = await Goal.find({ userId, percentageChange: { $gt: 0 } });

      for (const goal of goals) {
        goal.savedAmount += (goal.percentageChange / 100) * amount;
        await goal.save();
      }

      await runNotificationService();
    }

    // Update budget if transaction is an expense
    if (type === "expense") {
      const month = date.substring(0, 7); // Extract "YYYY-MM"
      const budget = await Budget.findOne({ userId, category, month });

      if (budget) {
        budget.currentSpending += convertedAmount;
        await budget.save();
      }
    }

    res.send(savedTransaction);
  } catch (err) {
    logger.error(
      `Error creating transaction for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Get all transactions for the authenticated user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });
    logger.info(`Fetched transactions for user ${req.user._id}`);
    res.send(transactions);
  } catch (err) {
    logger.error(
      `Error fetching transactions for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.userId.toString() !== req.user._id) {
      logger.warn(`Transaction not found or unauthorized: ${id}`);
      return res.status(404).send("Transaction not found");
    }
    logger.info(`Fetched transaction for user ${req.user._id}: ${id}`);
    res.send(transaction);
  } catch (err) {
    logger.error(
      `Error fetching transaction for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.userId.toString() !== req.user._id) {
      logger.warn(`Transaction not found or unauthorized: ${id}`);
      return res.status(404).send("Transaction not found");
    }

    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();
    logger.info(`Transaction updated for user ${req.user._id}: ${id}`);
    res.send(updatedTransaction);
  } catch (err) {
    logger.error(
      `Error updating transaction for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction || transaction.userId.toString() !== req.user._id) {
      logger.warn(`Transaction not found or unauthorized: ${id}`);
      return res.status(404).send("Transaction not found");
    }

    // Update budget if the transaction is an expense
    if (transaction.type === "expense") {
      const month = transaction.date.toISOString().substring(0, 7); // Extract "YYYY-MM"
      const budget = await Budget.findOne({
        userId: req.user._id,
        category: transaction.category,
        month,
      });

      if (budget) {
        budget.currentSpending -= transaction.amount;
        await budget.save();
      }
    }

    await transaction.deleteOne();
    logger.info(`Transaction deleted for user ${req.user._id}: ${id}`);
    res.send({ message: "Transaction deleted successfully" });
  } catch (err) {
    logger.error(
      `Error deleting transaction for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};
