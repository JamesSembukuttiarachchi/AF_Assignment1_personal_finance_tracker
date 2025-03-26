const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

// Protect middleware to authenticate users
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      // Log successful authentication
      logger.info(
        `User ${req.user._id} ${req.user.role} authenticated successfully`
      );

      next();
    } catch (err) {
      // Log failed authentication
      logger.error(`Authentication failed for token: ${err.message}`);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    // Log missing token error
    logger.warn("No token provided, authorization failed");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware to check for admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // Log successful admin role validation
    logger.info(`User ${req.user._id} has admin role`);

    next();
  } else {
    // Log failed admin validation
    logger.warn(
      `User ${req.user._id} attempted to access admin route without proper permissions`
    );
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
