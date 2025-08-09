// src/components/CustomerProducts.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5175/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.products || [];
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5175/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.categories || [];
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrder = async (productId) => {
    try {
      const res = await axios.post("/api/order", { productId });
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-cyan-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Product Catalog
      </motion.h1>

      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
          <select
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">Search Products</label>
          <input
            type="text"
            placeholder="Enter product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              <AnimatePresence>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      className="hover:bg-gray-800 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="bg-cyan-600 text-white px-2 py-1 rounded-full text-xs">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <div className="text-lg font-medium mb-2">No products found</div>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerProducts;
