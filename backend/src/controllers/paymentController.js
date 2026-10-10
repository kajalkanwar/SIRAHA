import crypto from "crypto";
import razorpay from "../config/razorpay.js";

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `sirraha_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order.",
    });
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay payment details.",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });
  } catch (error) {
    console.error(
      "Razorpay payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
};