import Announcement from "../models/announcementModel.js";

/* =====================================================
   GET ACTIVE ANNOUNCEMENTS
   Public API
===================================================== */

export const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error(
      "Get announcements error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements.",
    });
  }
};


/* =====================================================
   GET ALL ANNOUNCEMENTS
   Admin only
===================================================== */

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({
        order: 1,
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error(
      "Get all announcements error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements.",
    });
  }
};


/* =====================================================
   CREATE ANNOUNCEMENT
   Admin only
===================================================== */

export const createAnnouncement = async (req, res) => {
  try {
    const { text, isActive = true, order = 0 } =
      req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Announcement text is required.",
      });
    }

    const announcement =
      await Announcement.create({
        text: text.trim(),
        isActive,
        order,
      });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    console.error(
      "Create announcement error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create announcement.",
    });
  }
};


/* =====================================================
   UPDATE ANNOUNCEMENT
   Admin only
===================================================== */

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const { text, isActive, order } = req.body;

    const announcement =
      await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Announcement text cannot be empty.",
        });
      }

      announcement.text = text.trim();
    }

    if (isActive !== undefined) {
      announcement.isActive = isActive;
    }

    if (order !== undefined) {
      announcement.order = order;
    }

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    console.error(
      "Update announcement error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update announcement.",
    });
  }
};


/* =====================================================
   DELETE ANNOUNCEMENT
   Admin only
===================================================== */

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement =
      await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete announcement error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete announcement.",
    });
  }
};