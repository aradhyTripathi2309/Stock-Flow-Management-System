import express from "express";
import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Test route working" });
});

// Main Routes
router.get("/", getSuppliers); // Public
router.post("/add", authMiddleware, addSupplier); // Protected
router.put("/:id", authMiddleware, updateSupplier); // Protected
router.delete("/:id", authMiddleware, deleteSupplier); // Protected

export default router;
