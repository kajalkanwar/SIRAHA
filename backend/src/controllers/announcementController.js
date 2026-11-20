
import Announcement from "../models/announcementModel.js";

const validateAnnouncement = (body) => {
  const title = String(body.title || "").trim();
  const message = String(body.message || "").trim();

  if (!title || !message) {
    return {
      valid: false,
      message: "Title and message are required.",
    };
  }

  if (title.length > 100 || message.length > 250) {
    return {
      valid: false,
      message: "Title or message exceeds the allowed length.",
    };
  }

  const allowedOccasions = [
    "General",
    "Festive Sale",
    "Diwali",
    "Holi",
    "Wedding Season",
    "New Collection",
    "Shipping Offer",
    "Other",
  ];

  const occasion = body.occasion || "General";

  if (!allowedOccasions.includes(occasion)) {
    return {
      valid: false,
      message: "Please select a valid occasion.",
    };
  }

  const startDate = body.startDate
    ? new Date(body.startDate)
    : null;

  const endDate = body.endDate
    ? new Date(body.endDate)
    : null;

  if (
    (startDate && Number.isNaN(startDate.getTime())) ||
    (endDate && Number.isNaN(endDate.getTime()))
  ) {
    return {
      valid: false,
      message: "Please enter valid announcement dates.",
    };
  }

  if (startDate && endDate && endDate <= startDate) {
    return {
      valid: false,
      message: "End date must be after the start date.",
    };
  }

  const priority = Number(body.priority ?? 0);

  if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
    return {
      valid: false,
      message: "Priority must be a whole number from 0 to 100.",
    };
  }

  return {
    valid: true,
    data: {
      title,
      message,
      occasion,
      priority,
      startDate,
      endDate,
      isActive: body.isActive === true,
    },
  };
};

// Public: get the announcement currently eligible for display.

export const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: { $exists: false } },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: null },
            { endDate: { $exists: false } },
            { endDate: { $gt: now } },
          ],
        },
      ],
    })
      .sort({ priority: -1, updatedAt: -1 })
      .select("title message occasion priority");

    return res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error("Get public announcements error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load announcements.",
    });
  }
};


// Admin: list every announcement, including inactive and scheduled ones.
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error("Get all announcements error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load announcements.",
    });
  }
};

// Admin: create.
export const createAnnouncement = async (req, res) => {
  try {
    const result = validateAnnouncement(req.body);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const announcement = await Announcement.create(result.data);

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Create announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create announcement.",
    });
  }
};

// Admin: update.
export const updateAnnouncement = async (req, res) => {
  try {
    const result = validateAnnouncement(req.body);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      result.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Update announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update announcement.",
    });
  }
};

// Admin: delete.
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.id
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Delete announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete announcement.",
    });
  }
};
