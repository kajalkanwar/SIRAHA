import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
} from "../controllers/orderController.js";

import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer creates an order
router.post("/", createOrder);

// Only admin can view all orders
router.get("/", protectAdmin, getOrders);

// Customer tracks an order
router.get("/track", trackOrder);

// Only admin can view one order
router.get("/:id", protectAdmin, getOrderById);

// Only admin can update order status
router.put("/:id/status", protectAdmin, updateOrderStatus);

export default router;