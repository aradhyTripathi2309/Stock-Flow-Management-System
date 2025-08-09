import Order from "../models/OrderModel.js";
import Product from "../models/Product.js";

// 📦 Create Order (Customer places an order)
export const createOrder = async (req, res) => {
  try {
    const { products, notes } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products selected." });
    }

    let totalAmount = 0;

    // Validate & Deduct Stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found." });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      customer: req.user._id,
      products,
      totalAmount,
      notes,
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👤 Customer: View own orders
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Customer Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👨‍💼 Admin: View all orders
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin only." 
      });
    }

    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("products.product", "name price stock")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Admin Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin only." 
      });
    }

    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔴 Cancel Order (Customer can cancel pending orders)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Check if user owns the order or is admin
    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. You can only cancel your own orders." 
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel ${order.status} orders. Only pending orders can be cancelled.` 
      });
    }

    // Restore stock for cancelled order
    for (let item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);
    
    res.status(200).json({ 
      success: true, 
      message: "Order cancelled successfully. Stock has been restored." 
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel order" 
    });
  }
};
