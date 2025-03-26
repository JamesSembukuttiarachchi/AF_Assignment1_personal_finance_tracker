const cron = require("node-cron");
const { runNotificationService } = require("./utils/notificationService"); // Make sure the path is correct
const logger = require("./config/logger");

// Schedule the notification service to run every day at midnight (00:00)
cron.schedule("* * * * *", async () => {
  logger.info("Notification service cron job started.");

  try {
    logger.info("Starting notification service...");
    await runNotificationService(); // Call the notification service
    logger.info("Notification service completed successfully.");
  } catch (error) {
    logger.error(`Error running notification service: ${error.message}`);
  }
});

// Log that the scheduler is initialized and running
logger.info("Notification scheduler is running...");
