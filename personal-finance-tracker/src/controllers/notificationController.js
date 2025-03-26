const Notification = require("../models/Notification");
const logger = require("../config/logger");

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    logger.info(`Fetched notifications for user ${req.user._id}`);
    res.send(notifications);
  } catch (err) {
    logger.error(
      `Error fetching notifications for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Get unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({
      userId: req.user._id,
      isRead: false,
    });
    logger.info(`Fetched unread notifications for user ${req.user._id}`);
    res.send(unreadNotifications);
  } catch (err) {
    logger.error(
      `Error fetching unread notifications for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};

// Mark notifications as read
exports.markNotificationsAsRead = async (req, res) => {
  const { notificationIds } = req.body; // Expect an array of notification IDs to mark as read
  try {
    const updatedNotifications = await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: req.user._id },
      { isRead: true }
    );
    logger.info(`Marked notifications as read for user ${req.user._id}`);
    res.send(updatedNotifications);
  } catch (err) {
    logger.error(
      `Error marking notifications as read for user ${req.user._id}: ${err.message}`
    );
    res.status(400).send(err);
  }
};
