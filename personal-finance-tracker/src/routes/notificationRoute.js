const express = require("express");
const router = express.Router();
const getNotifications = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const logger = require("../config/logger");

router.get("/", protect, async (req, res) => {
  try {
    logger.info("Get notifications request received");
    await getNotifications(req, res);
  } catch (err) {
    logger.error(`Error getting notifications: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
