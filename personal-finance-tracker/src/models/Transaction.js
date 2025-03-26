const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: false }, // Original amount
  category: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String },
  date: { type: Date, default: Date.now },
  currency: { type: String, required: true }, // Original currency
  convertedAmount: { type: Number, required: true }, // Converted amount to the preferred currency
  recurring: {
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ["daily", "weekly", "monthly"] },
    endDate: { type: Date },
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
