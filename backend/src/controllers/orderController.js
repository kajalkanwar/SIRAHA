
import mongoose from "mongoose";
import Order from "../models/Order.js";

// Normalize order statuses to match the Order schema.
const normalizeOrderStatus = (status) => {
  if (!status) return "";

  const value = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  const aliases = {
    PLACED: "PENDING",
    ORDER_PLACED: "PENDING",
    CONFIRM: "CONFIRMED",
    PACKED: "PROCESSING",
    SHIPPING: "SHIPPED",
    COMPLETE: "DELIVERED",
    COMPLETED: "DELIVERED",
    CANCELED: "CANCELLED",
  };

  return aliases[value] || value;
};

const ALLOWED_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// Fields allowed to be updated by the shipping-details endpoint.
const SHIPPING_FIELDS = [
  "courierPartner",
  "trackingNumber",
  "trackingUrl",
  "expectedDelivery",
];

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
      discount,
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
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details.",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

   
const order = await Order.create({
  orderNumber: `SRH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,

  customerName: String(customerName).trim(),
  email: cleanEmail,
  phone,
  address,
  city,
  state,
  pincode,

  items,
  subtotal,
  shipping,
  discount: discount || 0,
  total,

  paymentMethod: paymentMethod || "COD",
  paymentStatus: "PENDING",
  orderStatus: "PENDING",

  razorpayOrderId: razorpayOrderId || "",
  razorpayPaymentId: razorpayPaymentId || "",

  courierPartner: "",
  trackingNumber: "",
  trackingUrl: "",
  expectedDelivery: null,
  deliveredAt: null,
});


    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
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

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

// Get one order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order.",
    });
  }
};


// Update order status

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const orderStatus = normalizeOrderStatus(req.body.orderStatus);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const updateFields = {
      orderStatus,
    };

    if (orderStatus === "DELIVERED") {
      updateFields.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};



// Update courier and delivery details.
// IMPORTANT: Mount this endpoint behind your existing admin authentication
// and admin authorization middleware.
export const updateShippingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "courierPartner")) {
      if (typeof req.body.courierPartner !== "string") {
        return res.status(400).json({
          success: false,
          message: "Courier partner must be text.",
        });
      }

      updates.courierPartner = req.body.courierPartner.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "trackingNumber")) {
      if (typeof req.body.trackingNumber !== "string") {
        return res.status(400).json({
          success: false,
          message: "Tracking number must be text.",
        });
      }

      updates.trackingNumber = req.body.trackingNumber.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "trackingUrl")) {
      if (typeof req.body.trackingUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Tracking URL must be text.",
        });
      }

      const trackingUrl = req.body.trackingUrl.trim();

      if (trackingUrl) {
        try {
          const parsedUrl = new URL(trackingUrl);

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid protocol");
          }
        } catch {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid HTTP or HTTPS tracking URL.",
          });
        }
      }

      updates.trackingUrl = trackingUrl;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "expectedDelivery")) {
      const value = req.body.expectedDelivery;

      if (value === null || value === "") {
        updates.expectedDelivery = null;
      } else {
        const deliveryDate = new Date(value);

        if (Number.isNaN(deliveryDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid expected delivery date.",
          });
        }

        updates.expectedDelivery = deliveryDate;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one shipping detail to update.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shipping details updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update shipping details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update shipping details.",
    });
  }
};

// Track an order for customers
export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (
      typeof orderId !== "string" ||
      !orderId.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Order ID and email are required.",
      });
    }

    const cleanOrderId = orderId.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Support both MongoDB IDs and order numbers.
    const orderIdentifiers = [{ orderNumber: cleanOrderId }];

    if (mongoose.Types.ObjectId.isValid(cleanOrderId)) {
      orderIdentifiers.push({ _id: cleanOrderId });
    }

    // Fetch current status and shipping details on every request.
    const order = await Order.findOne({
      email: cleanEmail,
      $or: orderIdentifiers,
    })
      .select(
        "orderNumber customerName email phone address city state pincode items subtotal shipping discount total paymentMethod paymentStatus orderStatus createdAt deliveredAt courierPartner trackingNumber trackingUrl expectedDelivery"
      )
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "We could not find an order matching those details.",
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
