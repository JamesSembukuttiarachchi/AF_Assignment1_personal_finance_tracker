const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  percentageChange: { type: Number, required: true },
  // If there is income, savedAmount will be added by percentage of the income.
  // (savedAmount + (percentageChange * income))
  // If there is expense, savedAmount will be reduced by percentage of the expense.
  // (savedAmount - (percentageChange * expense))
});

module.exports = mongoose.model("Goal", goalSchema);
