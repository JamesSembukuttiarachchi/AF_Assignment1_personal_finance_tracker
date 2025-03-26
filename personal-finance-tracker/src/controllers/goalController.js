const Goal = require("../models/Goal");
const logger = require("../config/logger");

// Create a new financial goal
exports.createGoal = async (req, res) => {
  try {
    const {
      goalName,
      targetAmount,
      savedAmount,
      targetDate,
      percentageChange,
    } = req.body;
    const goal = new Goal({
      goalName,
      targetAmount,
      savedAmount: savedAmount || 0,
      targetDate,
      percentageChange,
      userId: req.user.id,
    });

    await goal.save();
    logger.info(
      `Goal created for user ${req.user.id}: ${goalName}, Target: ${targetAmount}`
    );
    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (err) {
    logger.error(`Error creating goal for user ${req.user.id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    logger.info(`Fetched goals for user ${req.user.id}`);
    res.json(goals);
  } catch (err) {
    logger.error(
      `Error fetching goals for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Update a financial goal
exports.updateGoal = async (req, res) => {
  try {
    const {
      goalName,
      targetAmount,
      savedAmount,
      targetDate,
      percentageChange,
    } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { goalName, targetAmount, savedAmount, targetDate, percentageChange },
      { new: true }
    );

    logger.info(
      `Goal updated for user ${req.user.id}: ${goalName}, Target: ${targetAmount}`
    );
    res.json(goal);
  } catch (err) {
    logger.error(`Error updating goal for user ${req.user.id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Add income or expense to the goal's savedAmount
exports.modifySavedAmount = async (req, res) => {
  try {
    const { income, expense } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Calculate the updated savedAmount based on income or expense
    if (income) {
      goal.savedAmount += goal.percentageChange * income;
    }
    if (expense) {
      goal.savedAmount -= goal.percentageChange * expense;
    }

    await goal.save();
    logger.info(
      `Updated savedAmount for user ${req.user.id}: ${goal.goalName}`
    );
    res.json({ message: "Goal savedAmount updated successfully", goal });
  } catch (err) {
    logger.error(
      `Error modifying savedAmount for user ${req.user.id}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    logger.info(`Goal deleted for user ${req.user.id}: ${req.params.id}`);
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting goal for user ${req.user.id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
