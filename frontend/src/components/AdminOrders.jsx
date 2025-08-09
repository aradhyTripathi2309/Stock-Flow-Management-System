// components/AdminOrders.jsx

import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/order");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/order/${orderId}/status`, { status: newStatus });

      Swal.fire({
        icon: "success",
        title: "Order Status Updated",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
      Swal.fire("Error", "Could not update order status", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white"
    >
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 animate-fade-in-down">
        All Retailer Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-5 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-300">
                    {order.customer?.name || "Unknown Customer"} (
                    {order.customer?.email || "No Email"})
                  </h2>
                  <p className="text-sm text-gray-400">
                    Placed on:{" "}
                    <span className="text-white">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Total: ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="bg-cyan-500 text-white rounded-md px-3 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <ul className="mt-3 divide-y divide-gray-700 text-sm text-gray-300">
                {order.products.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <div>
                      {item.product?.name || "Unknown Product"} ×{" "}
                      {item.quantity}
                      <div className="text-gray-400 text-xs">
                        ₹{item.product?.price?.toFixed(2) || "0.00"} ×{" "}
                        {item.quantity} = ₹
                        {item.product?.price
                          ? (item.quantity * item.product.price).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          item.product
                            ? item.product.stock === 0
                              ? "bg-red-500"
                              : item.product.stock < 5
                              ? "bg-yellow-500"
                              : "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {item.product
                          ? item.product.stock === 0
                            ? "Out of Stock"
                            : item.product.stock < 5
                            ? "Low Stock"
                            : "In Stock"
                          : "Unknown"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {order.notes && (
                <p className="mt-2 text-gray-500 text-sm">
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrders;
