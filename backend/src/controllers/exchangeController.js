
import mongoose from "mongoose";

import ExchangeRequest from "../models/ExchangeRequest.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const ACTIVE_STATUSES = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "ITEM_RECEIVED",
  "REPLACEMENT_DISPATCHED",
];

const ALLOWED_STATUSES = [
  "APPROVED",
  "REJECTED",
  "PICKUP_SCHEDULED",
  "ITEM_RECEIVED",
  "REPLACEMENT_DISPATCHED",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_TRANSITIONS = {
  REQUESTED: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["PICKUP_SCHEDULED", "CANCELLED"],
  PICKUP_SCHEDULED: ["ITEM_RECEIVED", "CANCELLED"],
  ITEM_RECEIVED: ["REPLACEMENT_DISPATCHED"],
  REPLACEMENT_DISPATCHED: ["COMPLETED"],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

// Escape a size string before using it in a regular expression.
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Size that must be reserved for the replacement.
const getReplacementSize = (request) => {
  return request.exchangeType === "SIZE_EXCHANGE"
    ? request.requestedSize
    : request.originalSize;
};

// --------------------------------------------------
// STOCK HELPERS
// --------------------------------------------------

// Atomically deduct stock for a replacement.
const reserveReplacementStock = async (request) => {
  const replacementSize = getReplacementSize(request);
  const sizeRegex = new RegExp(
    `^${escapeRegex(replacementSize)}$`,
    "i"
  );

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: request.product,
      status: "active",
      stock: { $gte: request.quantity },
      sizeInventory: {
        $elemMatch: {
          size: { $regex: sizeRegex },
          stock: { $gte: request.quantity },
        },
      },
    },
    {
      $inc: {
        "sizeInventory.$.stock": -request.quantity,
        stock: -request.quantity,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedProduct;
};

// Restore reserved stock if an exchange is cancelled
// before the replacement is dispatched.
const restoreReplacementStock = async (request) => {
  const replacementSize = getReplacementSize(request);
  const sizeRegex = new RegExp(
    `^${escapeRegex(replacementSize)}$`,
    "i"
  );

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: request.product,
      sizeInventory: {
        $elemMatch: {
          size: { $regex: sizeRegex },
        },
      },
    },
    {
      $inc: {
        "sizeInventory.$.stock": request.quantity,
        stock: request.quantity,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedProduct;
};

// --------------------------------------------------
// CREATE EXCHANGE REQUEST (CUSTOMER)
// POST /api/exchanges
// --------------------------------------------------

export const createExchangeRequest = async (req, res) => {
  try {
    const {
      orderId,
      email,
      productId,
      originalSize,
      requestedSize,
      exchangeType,
      quantity = 1,
      description,
      photos = [],
    } = req.body;

    if (
      !orderId ||
      !email ||
      !productId ||
      !originalSize ||
      !exchangeType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required exchange details.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order or product ID.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }

    if (typeof originalSize !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid original size.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOriginalSize = originalSize.trim().toUpperCase();

    const normalizedRequestedSize =
      typeof requestedSize === "string"
        ? requestedSize.trim().toUpperCase()
        : "";

    if (
      !["SIZE_EXCHANGE", "DAMAGED_ITEM"].includes(exchangeType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid exchange type.",
      });
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid whole number greater than zero.",
      });
    }

    if (exchangeType === "SIZE_EXCHANGE") {
      if (!normalizedRequestedSize) {
        return res.status(400).json({
          success: false,
          message: "Please select the size you want to exchange for.",
        });
      }

      if (normalizedRequestedSize === normalizedOriginalSize) {
        return res.status(400).json({
          success: false,
          message: "Please select a different size.",
        });
      }
    }

    if (
      exchangeType === "DAMAGED_ITEM" &&
      (typeof description !== "string" || !description.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please describe the damage to the product.",
      });
    }

    // Find order using order ID and customer email.
    const order = await Order.findOne({
      _id: orderId,
      email: normalizedEmail,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please check your order ID and email.",
      });
    }

   // Only delivered orders can be exchanged.
if (order.orderStatus !== "DELIVERED") {
  return res.status(400).json({
    success: false,
    message: "You can request an exchange only for delivered orders.",
  });
}

// Check the 7-day exchange window.
if (!order.deliveredAt) {
  return res.status(400).json({
    success: false,
    message: "Delivery date is unavailable. Please contact Sirraha support.",
  });
}

const EXCHANGE_PERIOD_DAYS = 7;
const exchangeDeadline = new Date(order.deliveredAt);

exchangeDeadline.setDate(
  exchangeDeadline.getDate() + EXCHANGE_PERIOD_DAYS
);

if (new Date() > exchangeDeadline) {
  return res.status(400).json({
    success: false,
    message: "The 7-day exchange period has expired.",
  });
}

    // Find the matching product and size in the order.
    const matchingItems = order.items.filter((item) => {
      const itemProductId = String(
        item.product?._id || item.product
      );

      return (
        itemProductId === String(productId) &&
        String(item.size).trim().toUpperCase() ===
          normalizedOriginalSize
      );
    });

    if (matchingItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "This product and size were not found in your order.",
      });
    }

    if (matchingItems.length > 1) {
      return res.status(400).json({
        success: false,
        message:
          "This product appears more than once in your order. Please contact support for an exchange.",
      });
    }

    const orderItem = matchingItems[0];

    if (requestedQuantity > orderItem.quantity) {
      return res.status(400).json({
        success: false,
        message: `You can request an exchange for a maximum of ${orderItem.quantity} item(s).`,
      });
    }

    // Prevent another active request for the same order item.
    const existingRequest = await ExchangeRequest.findOne({
      order: order._id,
      product: productId,
      originalSize: normalizedOriginalSize,
      status: { $in: ACTIVE_STATUSES },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "An exchange request for this product and size is already in progress.",
      });
    }

    // Check replacement product and size availability.
    const product = await Product.findById(productId);

    if (!product || product.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "This product is currently unavailable.",
      });
    }

    const replacementSize =
      exchangeType === "SIZE_EXCHANGE"
        ? normalizedRequestedSize
        : normalizedOriginalSize;

    const replacementInventory = product.sizeInventory.find(
      (item) =>
        item.size.trim().toUpperCase() === replacementSize
    );

    if (!replacementInventory) {
      return res.status(400).json({
        success: false,
        message: "The replacement size is not available for this product.",
      });
    }

    if (replacementInventory.stock < requestedQuantity) {
      return res.status(400).json({
        success: false,
        message:
          "There is not enough stock available in the replacement size.",
      });
    }

    // Validate and clean photo information.
    if (!Array.isArray(photos)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exchange photos.",
      });
    }

    const validPhotos = photos
      .filter(
        (photo) =>
          photo &&
          typeof photo.url === "string" &&
          photo.url.trim()
      )
      .map((photo) => ({
        url: photo.url.trim(),
        publicId:
          typeof photo.publicId === "string"
            ? photo.publicId
            : "",
      }));

    // Create request. No stock is deducted at this stage.
    const exchangeRequest = await ExchangeRequest.create({
      order: order._id,
      customerName: order.customerName,
      email: order.email,
      product: productId,
      productName: orderItem.name,
      productImage: orderItem.image || "",
      quantity: requestedQuantity,
      originalSize: normalizedOriginalSize,
      requestedSize:
        exchangeType === "SIZE_EXCHANGE"
          ? normalizedRequestedSize
          : normalizedOriginalSize,
      exchangeType,
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      photos: validPhotos,
    });

    return res.status(201).json({
      success: true,
      message: "Your exchange request has been submitted successfully.",
      exchangeRequest,
    });
  } catch (error) {
    console.error("Create Exchange Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit exchange request.",
    });
  }
};

// --------------------------------------------------
// GET CUSTOMER EXCHANGE REQUESTS
// GET /api/exchanges/track
// --------------------------------------------------

export const getCustomerExchangeRequests = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: "Order ID and email are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const order = await Order.findOne({
      _id: orderId,
      email: normalizedEmail,
    }).select("_id");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const exchangeRequests = await ExchangeRequest.find({
      order: order._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: exchangeRequests.length,
      exchangeRequests,
    });
  } catch (error) {
    console.error("Get Customer Exchange Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exchange requests.",
    });
  }
};

// --------------------------------------------------
// GET ALL EXCHANGE REQUESTS (ADMIN)
// GET /api/exchanges
// --------------------------------------------------

export const getExchangeRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      const allStatuses = [
        "REQUESTED",
        "APPROVED",
        "REJECTED",
        "PICKUP_SCHEDULED",
        "ITEM_RECEIVED",
        "REPLACEMENT_DISPATCHED",
        "COMPLETED",
        "CANCELLED",
      ];

      if (!allStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid exchange request status.",
        });
      }

      filter.status = status;
    }

    const exchangeRequests = await ExchangeRequest.find(filter)
      .populate("order", "orderNumber orderStatus")
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: exchangeRequests.length,
      exchangeRequests,
    });
  } catch (error) {
    console.error("Get Exchange Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exchange requests.",
    });
  }
};

// --------------------------------------------------
// GET SINGLE EXCHANGE REQUEST (ADMIN)
// GET /api/exchanges/:id
// --------------------------------------------------

export const getExchangeRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exchange request ID.",
      });
    }

    const exchangeRequest = await ExchangeRequest.findById(id)
      .populate("order")
      .populate("product");

    if (!exchangeRequest) {
      return res.status(404).json({
        success: false,
        message: "Exchange request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      exchangeRequest,
    });
  } catch (error) {
    console.error("Get Exchange Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exchange request.",
    });
  }
};

// --------------------------------------------------
// UPDATE EXCHANGE REQUEST STATUS (ADMIN)
// PATCH /api/exchanges/:id/status
// --------------------------------------------------

export const updateExchangeRequestStatus = async (req, res) => {
  let reservedProduct = null;
  let requestId = null;
  let reservedQuantity = 0;
  let reservedSize = "";

  try {
    const { id } = req.params;

    const {
      status,
      adminNote,
      rejectionReason,
      trackingNumber,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exchange request ID.",
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid exchange status.",
      });
    }

    if (
      typeof adminNote === "string" &&
      adminNote.length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin note cannot exceed 1000 characters.",
      });
    }

    if (
      status === "REJECTED" &&
      (typeof rejectionReason !== "string" ||
        !rejectionReason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejecting this request.",
      });
    }

    const exchangeRequest = await ExchangeRequest.findById(id);

    if (!exchangeRequest) {
      return res.status(404).json({
        success: false,
        message: "Exchange request not found.",
      });
    }

    const currentStatus = exchangeRequest.status;

    if (!STATUS_TRANSITIONS[currentStatus]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change exchange status from ${currentStatus} to ${status}.`,
      });
    }

    requestId = exchangeRequest._id;

    // ----------------------------------------------
    // APPROVE: reserve replacement stock first
    // ----------------------------------------------

    if (status === "APPROVED") {
      if (exchangeRequest.stockReserved) {
        return res.status(409).json({
          success: false,
          message: "Stock has already been reserved for this request.",
        });
      }

      reservedSize = getReplacementSize(exchangeRequest);
      reservedQuantity = exchangeRequest.quantity;

      reservedProduct = await reserveReplacementStock(
        exchangeRequest
      );

      if (!reservedProduct) {
        return res.status(409).json({
          success: false,
          message:
            `Insufficient stock for replacement size ${reservedSize}. Please check inventory.`,
        });
      }
    }

    // ----------------------------------------------
    // UPDATE REQUEST STATUS ATOMICALLY
    // ----------------------------------------------

    const updateFields = {
      status,
    };

    if (status === "APPROVED") {
      updateFields.stockReserved = true;
      updateFields.stockReservedAt = new Date();
    }

    if (status === "REJECTED") {
      updateFields.rejectionReason = rejectionReason.trim();
    }

    if (status === "COMPLETED") {
      updateFields.completedAt = new Date();
    }

    if (status === "CANCELLED" && exchangeRequest.stockReserved) {
      updateFields.stockReserved = false;
      updateFields.stockReservedAt = null;
    }

    if (adminNote !== undefined) {
      updateFields.adminNote = adminNote.trim();
    }

    if (trackingNumber !== undefined) {
      if (typeof trackingNumber !== "string") {
        // Roll back a reservation if the request is invalid.
        if (reservedProduct) {
          await restoreReplacementStock(exchangeRequest);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid tracking number.",
        });
      }

      updateFields.trackingNumber = trackingNumber.trim();
    }

    const updatedRequest = await ExchangeRequest.findOneAndUpdate(
      {
        _id: id,
        status: currentStatus,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRequest) {
      // Another admin action changed this request.
      // Restore stock reserved by this failed approval.
      if (reservedProduct) {
        const restored = await restoreReplacementStock(
          exchangeRequest
        );

        if (!restored) {
          console.error(
            "CRITICAL: Could not restore stock after failed exchange approval:",
            id
          );
        }
      }

      return res.status(409).json({
        success: false,
        message:
          "This exchange request was updated by another action. Please refresh and try again.",
      });
    }

    // ----------------------------------------------
    // CANCEL: restore stock if it was reserved
    // ----------------------------------------------

    if (
      status === "CANCELLED" &&
      exchangeRequest.stockReserved
    ) {
      const restoredProduct = await restoreReplacementStock(
        exchangeRequest
      );

      if (!restoredProduct) {
        // Attempt to revert cancellation so stock and request
        // do not silently become inconsistent.
        await ExchangeRequest.findOneAndUpdate(
          {
            _id: id,
            status: "CANCELLED",
            stockReserved: false,
          },
          {
            $set: {
              status: currentStatus,
              stockReserved: true,
              stockReservedAt:
                exchangeRequest.stockReservedAt || new Date(),
            },
          }
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to restore replacement stock. The cancellation could not be completed.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Exchange request updated successfully.",
      exchangeRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Update Exchange Request Error:", error);

    // Best-effort rollback if an error occurs after reserving stock.
    if (reservedProduct && requestId) {
      try {
        const currentRequest = await ExchangeRequest.findById(
          requestId
        );

        if (!currentRequest?.stockReserved) {
          const restored = await restoreReplacementStock(
            currentRequest || {
              product: reservedProduct._id,
              quantity: reservedQuantity,
              requestedSize: reservedSize,
              originalSize: reservedSize,
              exchangeType: "SIZE_EXCHANGE",
            }
          );

          if (!restored) {
            console.error(
              "CRITICAL: Stock rollback failed for exchange:",
              requestId
            );
          }
        }
      } catch (rollbackError) {
        console.error("Exchange stock rollback error:", rollbackError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update exchange request.",
    });
  }
};
