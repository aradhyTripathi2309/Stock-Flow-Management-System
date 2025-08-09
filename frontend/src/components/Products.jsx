import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";
import api from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showModel, setShowModel] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    price: "",
    stock: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [orders, setOrders] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const closeModel = () => {
    setShowModel(false);
    setEditProduct(null);
    setFormData({
      name: "",
      category: "",
      supplier: "",
      price: "",
      stock: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = editProduct 
        ? await api.put(`/product/${editProduct}`, formData)
        : await api.post("/product/add", formData);

      if (res.data.success) {
        await Swal.fire({
          title: "Success!",
          text: `Product ${editProduct ? "updated" : "added"} successfully!`,
          icon: "success",
          confirmButtonColor: "#059669",
          background: "#1f2937",
          color: "#f9fafb",
          timer: 2000,
          showConfirmButton: false,
        });
        closeModel();
        fetchProducts();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error submitting product. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.delete(`/product/${id}`);

      if (res.data.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Product has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#059669",
          background: "#1f2937",
          color: "#f9fafb",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchProducts();
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete product. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error deleting product. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      supplier: product.supplier,
      price: product.price,
      stock: product.stock,
    });
    setEditProduct(product._id);
    setShowModel(true);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "bg-red-600";
    if (stock <= 5) return "bg-yellow-500";
    return "bg-green-600";
  };

  return (
    <motion.div
      className="text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-cyan-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
         Products Management
      </motion.h1>

      <div className="flex justify-between items-center mb-6 gap-3 animate-fade-in-down transition-all duration-500">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 px-4 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition duration-300 ease-in-out"
          />
          <button
            onClick={() => console.log("Searching:", searchTerm)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
          >
            🔍 Search
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditProduct(null);
              setShowModel(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md hover:scale-105 transition duration-300"
          >
            Add Product
          </button>

          {/* Order button - navigate based on user role */}
          <button
            onClick={() => {
              if (user?.role === "admin") {
                navigate("/admin/dashboard/orders");
              } else if (user?.role === "customer") {
                navigate("/customer/dashboard/place-order");
              } else {
                alert("Please login to place orders");
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md hover:scale-105 transition duration-300"
          >
             Place Order
          </button>
        </div>
      </div>

      {!loading ? (
        <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                S No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p, index) => (
                <tr key={p._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {p.supplier}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${getStockColor(
                        p.stock
                      )}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}

      {/* Modal */}
      {showModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-2xl border border-cyan-500">
            <button
              className="absolute top-3 right-4 text-white text-xl hover:text-red-500"
              onClick={closeModel}
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {editProduct ? "Update Product" : "Add Product"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="supplier"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-semibold transition"
              >
                {editProduct ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={closeModel}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Products;
