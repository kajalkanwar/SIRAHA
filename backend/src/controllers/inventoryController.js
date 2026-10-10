
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getInventory = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("name category images sizes sizeInventory stock status")
      .sort({ updatedAt: -1 });

    return res.json(products);
  } catch (error) {
    console.error("Get inventory error:", error);
    return res.status(500).json({
      message: "Unable to fetch inventory.",
    });
  }
};

export const updateProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sizeInventory } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    if (!Array.isArray(sizeInventory)) {
      return res.status(400).json({
        message: "Size inventory must be an array.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const cleanedInventory = [];
    const seenSizes = new Set();

    for (const item of sizeInventory) {
      const size =
        typeof item.size === "string" ? item.size.trim() : "";
      const stock = Number(item.stock);

      if (!size) {
        return res.status(400).json({
          message: "Every inventory entry needs a size.",
        });
      }

      if (seenSizes.has(size.toLowerCase())) {
        return res.status(400).json({
          message: `Duplicate inventory size: ${size}.`,
        });
      }

      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({
          message: `Stock for size ${size} must be a non-negative whole number.`,
        });
      }

      seenSizes.add(size.toLowerCase());
      cleanedInventory.push({ size, stock });
    }

    const totalStock = cleanedInventory.reduce(
      (sum, item) => sum + item.stock,
      0
    );

    // Keep sizes even when their stock is zero. The storefront can
    // use this list to display unavailable size options.
    product.sizeInventory = cleanedInventory;
    product.sizes = cleanedInventory.map((item) => item.size);
    product.stock = totalStock;

    await product.save();

    return res.json({
      message: "Inventory updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update inventory error:", error);
    return res.status(500).json({
      message: "Unable to update inventory.",
    });
  }
};
