// seed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";
import batteryData from "./batteryData.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected (for seeding)");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    // 🔐 Seed admin user
    const existingUser = await User.findOne({ email: "ashishtkmg@gmail.com" });
    if (existingUser) {
      console.log("⚠️ Admin user already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const adminUser = new User({
        name: "admin",
        email: "ashishtkmg@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("✅ Admin user created");
    }

    // 🛒 Seed battery products
    // 🛒 Seed battery products
    await Product.deleteMany({});
    console.log("🧹 Existing products cleared");

    const enrichedData = batteryData.map((battery) => ({
      ...battery,
      supplier: "SF Sonic Ltd", // default supplier name
    }));
    await Product.insertMany(enrichedData);
    console.log("✅ Battery products seeded");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
