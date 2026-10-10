import express from "express";

import {
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

// ==========================================
// PASSWORDLESS CUSTOMER AUTHENTICATION
// ==========================================

// Send OTP to email or mobile
router.post("/send-otp", sendOtp);

// Verify OTP and login
router.post("/verify-otp", verifyOtp);

export default router;