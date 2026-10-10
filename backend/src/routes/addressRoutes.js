import express from "express";

import {
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress,
} from "../controllers/addressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all saved addresses
router.get("/", protect, getSavedAddresses);

// Add a new saved address
router.post("/", protect, addSavedAddress);

// Update a saved address
router.put("/:addressId", protect, updateSavedAddress);

// Delete a saved address
router.delete("/:addressId", protect, deleteSavedAddress);

export default router;