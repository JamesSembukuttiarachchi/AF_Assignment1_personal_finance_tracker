const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserById,
  updateUserRole,
  getUserById,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// User profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Admin routes for managing users
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id/role", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUserById);

module.exports = router;
