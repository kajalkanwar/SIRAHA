import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required order details.",
      });
    }

    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      subtotal,
      shipping,
      total,

      paymentMethod: paymentMethod || "COD",

      // New orders should never be marked as paid
      // directly from frontend data.
      paymentStatus: "Pending",

      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
      razorpaySignature: razorpaySignature || "",
    });

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Unable to place order.",
    });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Unable to fetch orders.",
    });
  }
};

// Get one order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      message: "Unable to fetch order.",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Unable to update order status.",
    });
  }
};
// Track order for customers

export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: "Order ID and email are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const order = await Order.findOne({
      _id: orderId,
      email: cleanEmail,
    })
      .populate("items.product")
      .select(
        "customerName email items subtotal shipping total paymentMethod paymentStatus status createdAt"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "We could not find an order matching those details.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to track order.",
    });
  }
};