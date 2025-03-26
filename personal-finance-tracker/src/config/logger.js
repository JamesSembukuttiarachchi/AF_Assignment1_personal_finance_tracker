const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

// Define custom log format with timestamp in blue
const customFormat = printf(({ level, message, timestamp }) => {
  // Blue color ANSI code is \x1b[34m, reset color is \x1b[0m
  const coloredTimestamp = `\x1b[34m${timestamp}\x1b[0m`;
  return `${coloredTimestamp} [${level}]: ${message}`;
});

// Define custom colors for different log levels
const customColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
  verbose: "cyan",
};

// Apply custom colors to Winston
require("winston").addColors(customColors);

// Create a logger instance
const logger = createLogger({
  level: "info", // Set the minimum logging level
  format: combine(
    colorize({ all: true }), // Apply colorize to all levels
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Timestamp format
    customFormat // Custom formatting with colored timestamp
  ),
  transports: [
    // Console logging with colors
    new transports.Console(),

    // Error log rotation (daily)
    new DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d", // Keep logs for 14 days
    }),

    // Combined log rotation (daily)
    new DailyRotateFile({
      filename: "logs/%DATE%-combined.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

module.exports = logger;
