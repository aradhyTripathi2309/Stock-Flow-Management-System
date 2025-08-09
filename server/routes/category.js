import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Test route working" });
});

// Main Routes
router.get("/", getCategories); // Public
router.post("/add", authMiddleware, addCategory); // Protected
router.put("/:id", authMiddleware, updateCategory); // Protected
router.delete("/:id", authMiddleware, deleteCategory); // Protected

export default router;
