const Notification = require("../models/Notification");
const Goal = require("../models/Goal");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const logger = require("../config/logger");
const moment = require("moment");

// Utility function to create notifications
const createNotification = async (userId, message, type) => {
  const notification = new Notification({
    userId,
    message,
    type, // either "alert" or "reminder"
  });

  try {
    await notification.save();
    logger.info(`Notification created for user ${userId}: ${message}`);
  } catch (err) {
    logger.error(
      `Error creating notification for user ${userId}: ${err.message}`
    );
  }
};

// Goal Reached 80%
const checkGoalsForAlerts = async () => {
  const goals = await Goal.find();
  const now = moment();
  for (let goal of goals) {
    const percentageSaved = (goal.savedAmount / goal.targetAmount) * 100;
    if (percentageSaved >= 80 && !goal.notificationSent) {
      // Log the alert to the terminal
      logger.info(
        `Alert: Goal "${goal.goalName}" for user ${goal.userId} has reached 80% of the target!`
      );
      // Send alert
      await createNotification(
        goal.userId,
        `Goal "${goal.goalName}" has reached 80% of the target!`,
        "alert"
      );
      goal.notificationSent = true; // Mark as notified
      await goal.save();
    }
  }
};

// Budget Spent 80%
const checkBudgetsForAlerts = async () => {
  const budgets = await Budget.find();
  for (let budget of budgets) {
    const transactions = await Transaction.find({
      userId: budget.userId,
      category: budget.category,
      date: { $gte: moment().startOf("month"), $lte: moment().endOf("month") },
    });
    const totalSpent = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    const percentageSpent = (totalSpent / budget.amount) * 100;

    if (percentageSpent >= 80) {
      await createNotification(
        budget.userId,
        `You have spent 80% of your budget for category: ${budget.category}`,
        "alert"
      );
    }
  }
};

// Recurring Transaction Reminder (2 days prior)
const checkRecurringTransactionsForReminders = async () => {
  const transactions = await Transaction.find({
    "recurring.isRecurring": true,
  });
  const now = moment();
  for (let transaction of transactions) {
    const nextTransactionDate = moment(transaction.date).add(
      1,
      transaction.recurring.recurrencePattern
    ); // Add recurrence pattern to current date
    if (nextTransactionDate.isBetween(now.add(2, "days"), now.add(3, "days"))) {
      await createNotification(
        transaction.userId,
        `You have a recurring transaction due in 2 days: ${transaction.description}`,
        "reminder"
      );
    }
  }
};

// Main function to run all checks
const runNotificationService = async () => {
  await checkGoalsForAlerts();
  await checkBudgetsForAlerts();
  await checkRecurringTransactionsForReminders();
};

// You can run this function periodically, e.g., with a cron job, to check the conditions.
module.exports = { runNotificationService };
