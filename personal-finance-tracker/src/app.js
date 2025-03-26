const express = require("express");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const morgan = require("morgan");

const budgetRoutes = require("./routes/budgetRoute");
const reportRoutes = require("./routes/reportRoute");
const goalRoutes = require("./routes/goalRoute");
const notificationRoutes = require("./routes/notificationRoute");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const transactionRoutes = require("./routes/transactionRoute");

const app = express();

// Connect to MongoDB
connectDB()
  .then(() => {
    logger.info("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  });

// Scheduler setup (for cron jobs)
logger.info("Attempting to start the scheduler...");
try {
  require("./scheduler"); // Start the scheduler when the app starts
  logger.info("Scheduler started successfully.");
} catch (error) {
  logger.error(`Failed to start the scheduler: ${error.message}`);
}

// Middleware setup
app.use(express.json());
app.use(morgan("combined", { stream: logger.stream.write })); // HTTP request logging

// API Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  logger.info("Root route accessed.");
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
