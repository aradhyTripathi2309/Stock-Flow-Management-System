import Category from "../models/Category.js"; // Import the Category model
import mongoose from "mongoose";

  const addCategory = async (req, res) => {
    try {
      const { categoryName, categoryDescription } = req.body;
      // Validate input

      const existingCategory = await Category.findOne({
        categoryName: categoryName,
      });
      console.log("Received data:", categoryName, categoryDescription);

      if (existingCategory) {
        return res
          .status(400)
          .json({ success: false, message: "Category already exists." });
      }
      const newCategory = new Category({
        categoryName,
        categoryDescription, // Store the userId to associate the category with the user
      });
      console.log("Creating new category:", newCategory);

      await newCategory.save();
      console.log("✅ Category saved to MongoDB!");
      res
        .status(201)
        .json({ success: true, message: "Category added successfully." });
    } catch (error) {
      console.error("Error adding category:", error.message, error.stack);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  };
const getCategories = async (req, res) => {
  console.log("⚙️ Inside getCategories controller");
  try {
    const categories = await Category.find();
    console.log("📦 Fetched from DB:", categories);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("❌ Controller error:", error.message);
    res.status(500).json({ success: false, message: "Error in controller" });
  }
};



const updateCategory = async (req, res) => {
  const { id } = req.params; // Get the category ID from the request parameters
  const { categoryName, categoryDescription } = req.body; // Get the updated data from
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found." });
  }
  existingCategory.categoryName = categoryName || existingCategory.categoryName;
  existingCategory.categoryDescription =
    categoryDescription || existingCategory.categoryDescription;
  await existingCategory.save();
  res
    .status(200)
    .json({ success: true, message: "Category updated successfully." });
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🧨 Deleting category ID:", id);
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
