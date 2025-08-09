// components/CustomerPlaceOrder.jsx

import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const CustomerPlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data.products);
        setError("");
      } catch (err) {
        console.error("Error loading products", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQtyChange = (productId, qty) => {
    const quantity = Math.max(0, Number(qty));

    setSelected((prev) => {
      const exists = prev.find((item) => item.product === productId);
      if (exists) {
        return prev.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { product: productId, quantity }];
      }
    });
  };

  const handlePlaceOrder = async () => {
    const filtered = selected.filter((item) => item.quantity > 0);

    if (filtered.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "No products selected",
        text: "Please enter quantity for at least one product.",
        background: "#0f172a",
        color: "#fff",
      });
    }

    try {
      await api.post("/order", {
        products: filtered,
        notes,
      });

Swal.fire({
        icon: "success",
        title: "Order Placed Successfully! ",
        text: "Thank you for your order!",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#06b6d4",
        timer: 3000,
        timerProgressBar: true
      }).then(() => { window.location.reload(); }); // Refresh page to show orders

      // Reset form
      setSelected([]);
      setNotes("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Place Order",
        text: error.response?.data?.message || "Please try again later.",
        background: "#0f172a",
        color: "#fff",
      });
    }
  };

  const getSelectedQuantity = (productId) =>
    selected.find((item) => item.product === productId)?.quantity || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white"
    >
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 animate-fade-in-down">
        Place New Order
      </h1>

      {loading ? (
        <p className="text-center text-gray-400 mt-20">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-20">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No products available to order.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-5 rounded-xl shadow-md transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-300">
                    {product.name}
                  </h2>
                  <p className="text-gray-400">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-500">₹ {product.price}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={product.stock}
                  className="bg-gray-700 text-white w-20 px-2 py-1 rounded-md border border-cyan-500"
                  onChange={(e) => handleQtyChange(product._id, e.target.value)}
                  value={getSelectedQuantity(product._id)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <textarea
          placeholder="Any special notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600"
        ></textarea>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handlePlaceOrder}
        disabled={loading || products.length === 0}
        className="mt-6 bg-cyan-500 hover:bg-cyan-600 py-2 px-6 rounded-md font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Order
      </motion.button>
    </motion.div>
  );
};

export default CustomerPlaceOrder;
