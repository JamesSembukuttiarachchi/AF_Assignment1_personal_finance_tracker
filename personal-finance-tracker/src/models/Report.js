const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalIncome: { type: Number },
  totalExpense: { type: Number },
  categories: [
    {
      category: { type: String },
      totalAmount: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Report", reportSchema);
