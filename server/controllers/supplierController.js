import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";

// ✅ ADD Supplier
const addSupplier = async (req, res) => {
  try {
    const { supplierName, supplierEmail, supplierPhone, supplierAddress } =
      req.body;

    const existingSupplier = await Supplier.findOne({ supplierName });

    if (existingSupplier) {
      return res
        .status(400)
        .json({ success: false, message: "Supplier already exists." });
    }

    const newSupplier = new Supplier({
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress,
    });

    await newSupplier.save();

    res
      .status(201)
      .json({ success: true, message: "Supplier added successfully." });
  } catch (error) {
    console.error("❌ Error adding Supplier:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ✅ GET All Suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error("❌ Error fetching suppliers:", error.message);
    res.status(500).json({ success: false, message: "Error in controller" });
  }
};

// ✅ UPDATE Supplier by ID
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, supplierEmail, supplierPhone, supplierAddress } =
      req.body;

    const updated = await Supplier.findByIdAndUpdate(
      id,
      {
        supplierName,
        supplierEmail,
        supplierPhone,
        supplierAddress,
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Supplier updated successfully." });
  } catch (error) {
    console.error("❌ Error updating Supplier:", error.message);
    res.status(500).json({ success: false, message: "Update failed." });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Incoming DELETE request");
    console.log("🧨 ID Received:", id);

    if (!id) {
      console.log("❌ No ID received in params");
      return res.status(400).json({ success: false, message: "Missing ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid MongoDB ObjectId:", id);
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const deleted = await Supplier.findByIdAndDelete(id);

    if (!deleted) {
      console.log("❌ No supplier found with ID:", id);
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    console.log("✅ Supplier deleted:", deleted._id);
    res
      .status(200)
      .json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteSupplier:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
