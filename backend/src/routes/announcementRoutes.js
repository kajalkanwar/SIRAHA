
import express from "express";

import {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: customers can view active announcements without logging in.
router.get("/active", getActiveAnnouncements);

// Admin-only: all management operations require authentication.
router.get("/", protect, adminOnly, getAllAnnouncements);

router.post("/", protect, adminOnly, createAnnouncement);

router.put("/:id", protect, adminOnly, updateAnnouncement);

router.delete("/:id", protect, adminOnly, deleteAnnouncement);

export default router;
