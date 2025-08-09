// routes/user.js

import express from "express";
import {
  getProfile,
  updateProfile,
  sendOtp,
  resetPassword,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// ✅ Profile Routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/send-otp", authMiddleware, sendOtp);
router.post("/reset-password", authMiddleware, resetPassword);

// ✅ Admin-only User Management Routes
router.get("/", authMiddleware, getUsers);
router.post("/", authMiddleware, addUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
