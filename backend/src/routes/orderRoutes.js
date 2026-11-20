
import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
  updateShippingDetails,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer checkout
router.post("/", createOrder);

// Customer order tracking
router.get("/track", trackOrder);

// Admin-only order management
router.get("/", protect, adminOnly, getOrders);

router.get("/:id", protect, adminOnly, getOrderById);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

router.patch("/:id/shipping", protect, adminOnly, updateShippingDetails);

export default router;
