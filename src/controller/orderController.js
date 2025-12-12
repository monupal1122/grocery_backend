import Order from "../model/OrderModel.js";
import Product from "../model/product.js";
import Address from "../model/addressModel.js";
import Cart from "../model/cartModel.js";
import Profile from "../model/Profile.js";
//import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "../utils/emailService.js";

/**
 * @desc Create new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const { addressId, items, totalAmount, deliveryTime, paymentMethod, paymentId } = req.body;
    const userId = req.user._id; // assuming you use auth middleware

    if (!addressId || !items || items.length === 0) {
      return res.status(400).json({ message: "Address and items are required" });
    }

    // validate address belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // optional: validate product IDs and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.warn(`Product not found: ${item.productId}, skipping validation`);
        // Don't return error, just skip validation for missing products
        continue;
      }
      calculatedTotal += product.price * item.quantity;
    }

    const order = new Order({
      userId,
      addressId,
      items,
      totalAmount: totalAmount || calculatedTotal,
      paymentMethod: paymentMethod || "cash_on_delivery",
      paymentId,
      paymentStatus: paymentMethod === "online" ? "Paid" : "Pending",
      deliveryTime,
    });

    await order.save();

    // Clear the user's cart after successful order
    try {
      await Cart.findOneAndDelete({ userId });
    } catch (cartErr) {
      console.warn("Failed to clear cart after order:", cartErr.message);
    }

    // Populate order data and send confirmation email
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "email username")
      .populate("addressId");
    console.log(populatedOrder);
    
    await sendOrderConfirmationEmail(populatedOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all orders for logged-in user
 * @route GET /api/orders/my
 * @access Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate("addressId")
      .populate("items.productId", "name price images deliveryStatus")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get single order details
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("addressId")
      .populate("items.productId", "name price images imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Update delivery or payment status (admin)
 * @route PUT /api/orders/:id/status
 * @access Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("userId", "email username")
      .populate("addressId");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldDeliveryStatus = order.deliveryStatus;

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();

    // Send status update email if delivery status changed
    if (deliveryStatus && deliveryStatus !== oldDeliveryStatus) {
      const populatedOrder = await Order.findById(order._id)
        .populate("userId", "email username")
        .populate("addressId");
      
      await sendOrderStatusUpdateEmail(populatedOrder, oldDeliveryStatus, deliveryStatus);
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Delete order (admin)
 * @route DELETE /api/orders/:id
 * @access Private/Admin
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all orders (Admin)
 * @route GET /api/order/all
 * @access Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email username")
      .populate("addressId")
      .populate("items.productId");
console.log(orders);

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @desc Get orders grouped by user (Admin)
 * @route GET /api/orders/by-user
 * @access Private/Admin
 */
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price image imageUrl")
      .sort({ createdAt: -1 });

    // Group orders by user
    const userOrders = {};
    orders.forEach(order => {
      const userId = order.userId._id.toString();
      if (!userOrders[userId]) {
        userOrders[userId] = {
          user: order.userId,
          orders: [],
          totalOrders: 0,
          totalAmount: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          outForDeliveryOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0
        };
      }

      userOrders[userId].orders.push(order);
      userOrders[userId].totalOrders += 1;
      userOrders[userId].totalAmount += order.totalAmount;

      // Count by status
      switch (order.deliveryStatus) {
        case 'Pending':
          userOrders[userId].pendingOrders += 1;
          break;
        case 'Confirmed':
          userOrders[userId].confirmedOrders += 1;
          break;
        case 'Out for delivery':
          userOrders[userId].outForDeliveryOrders += 1;
          break;
        case 'Delivered':
          userOrders[userId].deliveredOrders += 1;
          break;
        case 'Cancelled':
          userOrders[userId].cancelledOrders += 1;
          break;
      }
    });

    res.status(200).json(Object.values(userOrders));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Update all orders for a user
 * @route PUT /api/orders/user/:userId/status
 * @access Private/Admin
 */
export const updateOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fromStatus, toStatus } = req.body;

    const result = await Order.updateMany(
      { userId, deliveryStatus: fromStatus },
      { deliveryStatus: toStatus }
    );

    res.status(200).json({
      message: `Updated ${result.modifiedCount} orders for user`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
