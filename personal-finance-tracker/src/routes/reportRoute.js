const express = require("express");
const router = express.Router();
const { generateMonthlyReport } = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");

// Generate Monthly Report Route
router.post("/generate", protect, generateMonthlyReport);

module.exports = router;
