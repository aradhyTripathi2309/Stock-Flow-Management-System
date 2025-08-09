// controllers/userController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
// controllers/userController.js
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select("-password"); // ✅ fetch full user

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Email are required." });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated." });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const otpStore = new Map(); // In-memory OTP store

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const user = req.user;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(user.email, otp);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"IMS Security" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "OTP for Password Reset",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${user.email}: ${otp}`);

    res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const user = req.user;
    const { otp, newPassword } = req.body;

    const storedOtp = otpStore.get(user.email);

    if (!storedOtp || storedOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpStore.delete(user.email); // remove OTP after use

    res.status(200).json({ success: true, message: "Password updated." });
  } catch (error) {
    console.error("❌ Error resetting password:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all users (optionally filtered by role)
const getUsers = async (req, res) => {
  console.log("⚙️ Inside getUsers controller");
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");
    console.log("📦 Users fetched:", users);
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create a new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("📥 Creating user:", name, email, role);

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    console.log("✅ User created:", newUser);

    res
      .status(201)
      .json({ success: true, message: "User added successfully." });
  } catch (error) {
    console.error("❌ Error adding user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.role = role || existingUser.role;

    await existingUser.save();
    res
      .status(200)
      .json({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🧨 Deleting user ID:", id);

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getUsers, addUser, updateUser, deleteUser };
