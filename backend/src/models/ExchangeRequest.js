
import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    originalSize: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    requestedSize: {
      type: String,
      uppercase: true,
      trim: true,
      default: "",
    },

    exchangeType: {
      type: String,
      enum: ["SIZE_EXCHANGE", "DAMAGED_ITEM"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "APPROVED",
        "REJECTED",
        "PICKUP_SCHEDULED",
        "ITEM_RECEIVED",
        "REPLACEMENT_DISPATCHED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "REQUESTED",
    },

    // Replacement stock reservation
    stockReserved: {
      type: Boolean,
      default: false,
    },

    stockReservedAt: {
      type: Date,
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      default: "",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    trackingNumber: {
      type: String,
      trim: true,
      default: "",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
exchangeRequestSchema.index({
  order: 1,
  product: 1,
  status: 1,
});

const ExchangeRequest = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema
);

export default ExchangeRequest;
