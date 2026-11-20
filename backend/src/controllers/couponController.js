
import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

const normalizeCode = (code) =>
  String(code || "").trim().toUpperCase();

const validateCouponFields = (data) => {
  const code = normalizeCode(data.code);
  const discountType = data.discountType;
  const discountValue = Number(data.discountValue);
  const minOrderAmount = Number(data.minOrderAmount ?? 0);
  const maxDiscountAmount =
    data.maxDiscountAmount === "" ||
    data.maxDiscountAmount == null
      ? null
      : Number(data.maxDiscountAmount);

  const startDate = new Date(data.startDate);
  const expiryDate = new Date(data.expiryDate);

  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) {
    throw new Error(
      "Coupon code must be 3–30 characters using letters, numbers, _ or -."
    );
  }

  if (!["PERCENT", "FIXED"].includes(discountType)) {
    throw new Error("Choose a valid discount type.");
  }

  if (
    !Number.isFinite(discountValue) ||
    discountValue <= 0
  ) {
    throw new Error("Discount value must be greater than zero.");
  }

  if (discountType === "PERCENT" && discountValue > 100) {
    throw new Error("Percentage discount cannot exceed 100%.");
  }

  if (
    !Number.isFinite(minOrderAmount) ||
    minOrderAmount < 0
  ) {
    throw new Error("Minimum order amount is invalid.");
  }

  if (
    maxDiscountAmount !== null &&
    (!Number.isFinite(maxDiscountAmount) ||
      maxDiscountAmount < 0)
  ) {
    throw new Error("Maximum discount amount is invalid.");
  }

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(expiryDate.getTime()) ||
    expiryDate <= startDate
  ) {
    throw new Error("Expiry date must be after the start date.");
  }

  const usageLimit =
    data.usageLimit === "" || data.usageLimit == null
      ? null
      : Number(data.usageLimit);

  if (
    usageLimit !== null &&
    (!Number.isInteger(usageLimit) || usageLimit < 1)
  ) {
    throw new Error("Usage limit must be a positive whole number.");
  }

  return {
    code,
    description: String(data.description || "").trim(),
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    expiryDate,
    usageLimit,
    firstOrderOnly: Boolean(data.firstOrderOnly),
    isActive: data.isActive !== false,
  };
};

// Admin: list coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch coupons.",
    });
  }
};

// Admin: create coupon
export const createCoupon = async (req, res) => {
  try {
    const fields = validateCouponFields(req.body);

    const existing = await Coupon.findOne({
      code: fields.code,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This coupon code already exists.",
      });
    }

    const coupon = await Coupon.create(fields);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to create coupon.",
    });
  }
};

// Admin: update coupon
export const updateCoupon = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const fields = validateCouponFields(req.body);

    const duplicate = await Coupon.findOne({
      code: fields.code,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another coupon already uses this code.",
      });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update coupon.",
    });
  }
};

// Admin: delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete coupon.",
    });
  }
};

// Admin: enable / disable coupon
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.json({
      success: true,
      message: coupon.isActive
        ? "Coupon enabled."
        : "Coupon disabled.",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to change coupon status.",
    });
  }
};

// Public: validate coupon at checkout
export const validateCoupon = async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const subtotal = Number(req.body.subtotal);
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (
      !code ||
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid coupon code and order subtotal.",
      });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is invalid or inactive.",
      });
    }

    const now = new Date();

    if (now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not active yet.",
      });
    }

    if (now > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired.",
      });
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit.",
      });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.`,
      });
    }

    if (coupon.firstOrderOnly) {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Enter your email to validate this first-order coupon.",
        });
      }

      const previousOrder = await Order.findOne({
        email,
        orderStatus: { $ne: "CANCELLED" },
      }).select("_id");

      if (previousOrder) {
        return res.status(400).json({
          success: false,
          message: "This coupon is only for your first order.",
        });
      }
    }

    let discountAmount =
      coupon.discountType === "PERCENT"
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (
      coupon.discountType === "PERCENT" &&
      coupon.maxDiscountAmount !== null
    ) {
      discountAmount = Math.min(
        discountAmount,
        coupon.maxDiscountAmount
      );
    }

    discountAmount = Math.min(
      subtotal,
      Math.max(0, Math.round(discountAmount * 100) / 100)
    );

    return res.json({
      success: true,
      message: "Coupon applied successfully.",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to validate coupon right now.",
    });
  }
};
