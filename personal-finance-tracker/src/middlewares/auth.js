const jwt = require("jsonwebtoken");
const logger = require("../logger");
const User = require("../models/User");

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      logger.warn("Access denied: No token provided");
      return res.status(401).send("Access Denied: No token provided");
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;

      // Log successful verification
      logger.info(`User ${req.user._id} authenticated`);

      if (role && req.user.role !== role) {
        logger.warn(
          `User ${req.user._id} attempted to access a route with insufficient permissions`
        );
        return res.status(403).send("Permission Denied: Insufficient role");
      }

      next();
    } catch (err) {
      logger.error(`Invalid Token: ${err.message}`);
      res.status(400).send("Invalid Token: Please log in again");
    }
  };
};
