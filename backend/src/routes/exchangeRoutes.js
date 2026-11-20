import express from "express";

import {
  createExchangeRequest,
  getCustomerExchangeRequests,
  getExchangeRequests,
  getExchangeRequestById,
  updateExchangeRequestStatus,
} from "../controllers/exchangeController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", createExchangeRequest);

router.get("/track", getCustomerExchangeRequests);

// Admin routes
router.get("/", protect, adminOnly, getExchangeRequests);

router.get("/:id", protect, adminOnly, getExchangeRequestById);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateExchangeRequestStatus
);

export default router;