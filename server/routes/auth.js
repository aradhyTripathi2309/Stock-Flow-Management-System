import express from "express";
import { loginController } from "../controllers/AuthController.js"; 
import { registerController } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/login", loginController);
 // ✅ FIXED
 router.post("/register", registerController); 

export default router;
