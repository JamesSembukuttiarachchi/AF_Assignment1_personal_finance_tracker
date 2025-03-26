const express = require("express");
const router = express.Router();
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const { protect } = require("../middlewares/authMiddleware");

// Goal routes
router.post("/add", protect, createGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);

module.exports = router;
