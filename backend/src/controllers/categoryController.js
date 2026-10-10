
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const createSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const validId = (id) => mongoose.isValidObjectId(id);

export const getCategories = async (req, res) => {
  try {
    const filter = {};

    // The storefront receives active categories by default.
    // The admin can use ?all=true to see inactive categories too.
    if (req.query.all !== "true") {
      filter.status = "active";
    }

    const categories = await Category.find(filter).sort({
      sortOrder: 1,
      name: 1,
    });

    return res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      message: "Unable to fetch categories.",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder, status } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required.",
      });
    }

    const cleanName = name.trim();
    const slug = createSlug(cleanName);

    if (!slug) {
      return res.status(400).json({
        message: "Please enter a valid category name.",
      });
    }

    const existing = await Category.findOne({
      $or: [
        { name: { $regex: `^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
        { slug },
      ],
    });

    if (existing) {
      return res.status(409).json({
        message: "A category with this name already exists.",
      });
    }

    const order = Number(sortOrder ?? 0);

    if (!Number.isFinite(order)) {
      return res.status(400).json({
        message: "Sort order must be a valid number.",
      });
    }

    if (status !== undefined && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid category status.",
      });
    }

    const category = await Category.create({
      name: cleanName,
      slug,
      description: typeof description === "string" ? description.trim() : "",
      image: typeof image === "string" ? image.trim() : "",
      sortOrder: order,
      status: status || "active",
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this name or slug already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to create category.",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const { name, description, image, status, sortOrder } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Category name cannot be empty.",
        });
      }

      const cleanName = name.trim();
      const slug = createSlug(cleanName);

      if (!slug) {
        return res.status(400).json({
          message: "Please enter a valid category name.",
        });
      }

      const duplicate = await Category.findOne({
        _id: { $ne: id },
        $or: [
          { name: { $regex: `^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
          { slug },
        ],
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Another category already uses this name.",
        });
      }

      category.name = cleanName;
      category.slug = slug;
    }

    if (description !== undefined) {
      category.description =
        typeof description === "string" ? description.trim() : "";
    }

    if (image !== undefined) {
      category.image = typeof image === "string" ? image.trim() : "";
    }

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          message: "Status must be active or inactive.",
        });
      }

      category.status = status;
    }

    if (sortOrder !== undefined) {
      const order = Number(sortOrder);

      if (!Number.isFinite(order)) {
        return res.status(400).json({
          message: "Sort order must be a valid number.",
        });
      }

      category.sortOrder = order;
    }

    await category.save();

    return res.json(category);
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this name or slug already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to update category.",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const assignedProducts = await Product.countDocuments({
      category: {
        $regex: `^${category.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (assignedProducts > 0) {
      return res.status(409).json({
        message:
          "This category has products assigned to it. Deactivate it instead, or reassign those products first.",
      });
    }

    await category.deleteOne();

    return res.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({
      message: "Unable to delete category.",
    });
  }
};
