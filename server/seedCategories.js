// seedCategories.js - Script to seed categories based on existing product data
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected (for category seeding)");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    await connectDB();

    // Get unique categories from existing products
    const uniqueCategories = await Product.distinct("category");
    console.log("🔍 Found unique categories:", uniqueCategories);

    // Category descriptions mapping
    const categoryDescriptions = {
      "Car": "Batteries designed for automobiles, cars, and light vehicles with high starting power",
      "Bike": "Compact batteries for motorcycles, scooters, and two-wheeler vehicles", 
      "Tractor": "Heavy-duty batteries for agricultural tractors and farm equipment",
      "Inverter": "Deep-cycle batteries for home inverters and backup power systems",
      "E-Rickshaw": "Batteries specifically designed for electric rickshaws and e-vehicles",
      "Commercial": "Industrial grade batteries for trucks, buses, and commercial vehicles"
    };

    // Clear existing categories
    await Category.deleteMany({});
    console.log("🧹 Cleared existing categories");

    // Create categories based on product data
    const categoriesToCreate = uniqueCategories.map(categoryName => ({
      categoryName,
      categoryDescription: categoryDescriptions[categoryName] || `Batteries and components for ${categoryName} category`
    }));

    if (categoriesToCreate.length > 0) {
      await Category.insertMany(categoriesToCreate);
      console.log(`✅ Successfully seeded ${categoriesToCreate.length} categories:`);
      categoriesToCreate.forEach(cat => console.log(`   - ${cat.categoryName}: ${cat.categoryDescription}`));
    } else {
      console.log("⚠️ No categories found in products to seed");
    }

    console.log("🎉 Category seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Category seeding failed:", err.message);
    process.exit(1);
  }
};

seedCategories();
