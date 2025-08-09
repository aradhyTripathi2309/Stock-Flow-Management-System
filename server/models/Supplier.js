import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
    supplierEmail: { type: String, required: true },
    supplierPhone: { type: String, required: true },
    supplierAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const SupplierModal = mongoose.model("Supplier", supplierSchema);
export default SupplierModal;