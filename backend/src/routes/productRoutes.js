import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PRODUCT IMAGE UPLOAD
|--------------------------------------------------------------------------
*/

router.post(
  "/upload-images",
  protect,
  adminOnly,
  upload.array("images", 8),
  uploadProductImages
);

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

router.post("/", protect, adminOnly, createProduct);

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

router.get("/", getProducts);

/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
|--------------------------------------------------------------------------
*/

router.get("/:id", getProductById);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

router.put("/:id", protect, adminOnly, updateProduct);

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;