
import express from "express";

import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Checkout: public coupon validation
router.post("/validate", validateCoupon);

// Admin: protected coupon management
router.get("/", protect, adminOnly, getCoupons);
router.post("/", protect, adminOnly, createCoupon);
router.put("/:id", protect, adminOnly, updateCoupon);
router.patch("/:id/toggle", protect, adminOnly, toggleCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
