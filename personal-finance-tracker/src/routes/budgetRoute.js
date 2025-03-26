const express = require("express");
const router = express.Router();
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

// Budget routes
router.post("/add", protect, createBudget);
router.get("/", protect, getBudgets);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
