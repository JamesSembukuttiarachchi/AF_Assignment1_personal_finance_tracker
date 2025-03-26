const User = require("../models/User");
const logger = require("../config/logger");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    logger.info("Fetched all users");
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      logger.info(`Fetched profile for user: ${req.user.id}`);
      res.json(user);
    } else {
      logger.warn(`User profile not found for: ${req.user.id}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    logger.error(`Error fetching user profile: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, preferredCurrency } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn(`User not found for update: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.preferredCurrency = preferredCurrency || user.preferredCurrency;

    await user.save();
    logger.info(`User profile updated for: ${req.user.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error updating user profile: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      logger.warn(`User not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    logger.info(`User deleted successfully: ${req.params.id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      logger.warn(`User not found for role update: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role || user.role;

    await user.save();
    logger.info(`User role updated for: ${req.params.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error updating user role: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      logger.warn(`User not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Fetched user by ID: ${req.params.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user by ID: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
