import express from "express";

import {
  getReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: retrieve customer reviews.
router.get("/", getReviews);

// Public: submit a review with up to 3 photos.
router.post("/", upload.array("photos", 1), createReview);

// Admin only: delete an inappropriate review.
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;