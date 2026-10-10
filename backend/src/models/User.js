import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFORMATION
    // ==========================================

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // ==========================================
    // USER ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ==========================================
    // SAVED ADDRESSES
    // ==========================================

    addresses: [
      {
        fullName: {
          type: String,
          required: true,
          trim: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        pincode: {
          type: String,
          required: true,
          trim: true,
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ==========================================
    // OTP AUTHENTICATION
    // ==========================================

    otpHash: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpLastSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;