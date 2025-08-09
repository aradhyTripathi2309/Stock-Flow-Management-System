import Order from "../models/OrderModel.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// 📦 Enhanced Create Order with Transaction Support
export const createOrderWithTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products, notes } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No products selected." 
      });
    }

    let totalAmount = 0;
    const productUpdates = [];

    // Validate stock availability first
    for (let item of products) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.product}` 
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      productUpdates.push({
        product,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order first
    const order = new Order({
      customer: req.user._id,
      products,
      totalAmount,
      notes,
    });

    await order.save({ session });

    // Update product stocks
    for (let update of productUpdates) {
      update.product.stock -= update.quantity;
      await update.product.save({ session });
    }

    await session.commitTransaction();
    
    // Populate the order for response
    await order.populate("products.product", "name price stock");
    
    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully", 
      order 
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Order Transaction Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to place order. Please try again." 
    });
  } finally {
    session.endSession();
  }
};

// 📊 Get Order Analytics (Admin only)
export const getOrderAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin only." 
      });
    }

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "delivered" });
    
    const revenueData = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { 
        _id: "$products.product", 
        totalQuantity: { $sum: "$products.quantity" },
        totalRevenue: { $sum: { $multiply: ["$products.quantity", "$totalAmount"] } }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: { 
        from: "products", 
        localField: "_id", 
        foreignField: "_id", 
        as: "productInfo" 
      }},
      { $unwind: "$productInfo" },
      { $project: {
        name: "$productInfo.name",
        totalQuantity: 1,
        currentStock: "$productInfo.stock"
      }}
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        topProducts
      }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch analytics" 
    });
  }
};

// 🔄 Cancel Order (Customer can cancel pending orders)
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Check if user owns the order or is admin
    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      await session.abortTransaction();
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: "Can only cancel pending orders" 
      });
    }

    // Restore stock for cancelled order
    for (let item of order.products) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId).session(session);
    
    await session.commitTransaction();
    
    res.status(200).json({ 
      success: true, 
      message: "Order cancelled successfully" 
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Cancel Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel order" 
    });
  } finally {
    session.endSession();
  }
};
