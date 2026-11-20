
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required."],
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: [true, "Announcement message is required."],
      trim: true,
      maxlength: 250,
    },

    occasion: {
      type: String,
      enum: [
        "General",
        "Festive Sale",
        "Diwali",
        "Holi",
        "Wedding Season",
        "New Collection",
        "Shipping Offer",
        "Other",
      ],
      default: "General",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

announcementSchema.index({
  isActive: 1,
  priority: -1,
  startDate: 1,
  endDate: 1,
});

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

export default Announcement;
