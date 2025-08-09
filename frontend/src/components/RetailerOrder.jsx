import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const RetailerOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([{ product: "", quantity: 1 }]);
  const [notes, setNotes] = useState("");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load products",
          background: "#0f172a",
          color: "#fff",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (orderItems.length > 1) {
      const updated = orderItems.filter((_, i) => i !== index);
      setOrderItems(updated);
    }
  };

  const placeOrder = async () => {
    // Filter out items without selected products
    const validItems = orderItems.filter(
      (item) => item.product && item.quantity > 0
    );

    if (validItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Products Selected",
        text: "Please select at least one product",
        background: "#0f172a",
        color: "#fff",
      });
      return;
    }

    try {
      console.log("🚀 Placing order with data:", {
        products: validItems,
        notes,
      });
      const res = await api.post("/order", {
        products: validItems,
        notes,
      });

      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully! 🎉",
        text: `Order total: ₹${res.data.order.totalAmount.toFixed(2)}`,
        background: "#0f172a",
        color: "#fff",
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form
      setOrderItems([{ product: "", quantity: 1 }]);
      setNotes("");

      // Refresh orders after a short delay
      setTimeout(() => {
        fetchOrders();
      }, 1000);
    } catch (err) {
      console.error(
        " Order placing failed",
        err?.response?.data || err.message
      );
      console.error("Full error:", err);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to place order. Please check the console for more details.",
        background: "#0f172a",
        color: "#fff",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/my");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(
        "Fetch orders failed",
        err?.response?.data || err.message
      );
    }
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    // Only allow cancellation of pending orders
    if (orderStatus !== "pending") {
      Swal.fire({
        icon: "warning",
        title: "Cannot Cancel Order",
        text: `Only pending orders can be cancelled. This order is ${orderStatus}.`,
        background: "#0f172a",
        color: "#fff",
      });
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      background: "#0f172a",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Order",
      cancelButtonText: "Keep Order",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/order/${orderId}/cancel`);

        Swal.fire({
          icon: "success",
          title: "Order Cancelled! ",
          text: "Your order has been cancelled and stock has been restored.",
          background: "#0f172a",
          color: "#fff",
          timer: 3000,
          timerProgressBar: true,
        });

        // Refresh orders list
        fetchOrders();
      } catch (err) {
        console.error(
          " Cancel order failed",
          err?.response?.data || err.message
        );
        Swal.fire({
          icon: "error",
          title: "Cancellation Failed",
          text: err?.response?.data?.message || "Failed to cancel order",
          background: "#0f172a",
          color: "#fff",
        });
      }
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      order.products.some((item) =>
        item.product?.name?.toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((order) =>
      sortStatus === "All"
        ? true
        : order.status.toLowerCase() === sortStatus.toLowerCase()
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 text-white min-h-screen bg-gradient-to-b from-gray-900 to-black"
    >
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">
         Place New Order
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading products...</p>
      ) : (
        <div className="space-y-4 mb-6">
          {orderItems.map((item, index) => {
            const selectedProduct = products.find(
              (p) => p._id === item.product
            );
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg"
              >
                <select
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", e.target.value)
                  }
                  className="p-2 rounded bg-gray-900 border border-gray-600 text-white"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} (Stock: {product.stock})
                    </option>
                  ))}
                </select>

                {selectedProduct && (
                  <div className="text-sm text-gray-300">
                    <div>Price: ₹{selectedProduct.price}</div>
                    <div>Available: {selectedProduct.stock}</div>
                  </div>
                )}

                <input
                  type="number"
                  min={1}
                  max={selectedProduct?.stock || 999}
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  className="p-2 rounded bg-gray-900 border border-gray-600 text-white"
                  placeholder="Quantity"
                />

                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 text-white"
                  disabled={orderItems.length === 1}
                >
                   Remove
                </button>
              </div>
            );
          })}

          <button
            onClick={addItem}
            className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700"
          >
             Add Another Product
          </button>

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded mt-4"
          />

          <button
            onClick={placeOrder}
            className="bg-green-600 px-6 py-2 mt-3 rounded hover:bg-green-700"
          >
             Submit Order
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-3 text-cyan-400">
         My Orders
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder=" Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-900 border border-gray-600"
        />
        <select
          value={sortStatus}
          onChange={(e) => setSortStatus(e.target.value)}
          className="p-2 rounded bg-gray-900 border border-gray-600"
        >
          <option value="All">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 p-4 rounded shadow-sm border border-gray-700"
            >
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold">
                  Order #{order._id.slice(-6)}
                </span>{" "}
                — {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="mt-2">
                {order.products.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    {item.product.name} × {item.quantity}
                  </div>
                ))}
              </div>
              <div className="text-sm text-cyan-400 mt-2 font-medium">
                Total: ₹{order.totalAmount.toFixed(2)}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "pending"
                        ? "text-yellow-400"
                        : order.status === "confirmed"
                        ? "text-blue-400"
                        : order.status === "shipped"
                        ? "text-purple-400"
                        : order.status === "delivered"
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                {/* Cancel button - only show for pending orders */}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id, order.status)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                     Cancel Order
                  </button>
                )}
              </div>

              {order.notes && (
                <div className="text-xs text-gray-400 mt-2">
                  Notes: {order.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RetailerOrder;
