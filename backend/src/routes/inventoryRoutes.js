
import express from "express";

import {
  getInventory,
  updateProductInventory,
} from "../controllers/inventoryController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getInventory);

router.put(
  "/:productId",
  protect,
  adminOnly,
  updateProductInventory
);

export default router;
