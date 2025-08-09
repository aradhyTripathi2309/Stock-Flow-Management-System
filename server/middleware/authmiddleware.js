import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  console.log("🔐 authMiddleware hit!");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("❌ No token");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user info from DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Invalid token", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
