import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/add", authMiddleware, addProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
