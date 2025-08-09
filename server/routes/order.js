import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Debug route to test if orders route is working
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Order routes are working!" });
});

// Debug route to test auth middleware
router.get("/debug-my", (req, res) => {
  res.json({ success: true, message: "Debug /my route reached without auth" });
});

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getCustomerOrders);
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/:id/cancel", authMiddleware, cancelOrder);
router.get("/", authMiddleware, getAllOrders);

export default router;
