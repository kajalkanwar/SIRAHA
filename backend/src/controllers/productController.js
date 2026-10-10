import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

const normalizeSizeInventory = (sizeInventory) => {
  if (!Array.isArray(sizeInventory)) return [];

  const seen = new Set();

  return sizeInventory
    .map((item) => ({
      size: String(item?.size || "").trim().toUpperCase(),
      stock: Math.max(0, Number(item?.stock ?? 0)),
    }))
    .filter((item) => {
      if (!item.size || seen.has(item.size)) return false;
      seen.add(item.size);
      return true;
    });
};

const getTotalStock = (sizeInventory, fallbackStock = 0) => {
  if (sizeInventory.length > 0) {
    return sizeInventory.reduce(
      (total, item) => total + Number(item.stock || 0),
      0
    );
  }

  return Math.max(0, Number(fallbackStock || 0));
};

const normalizeSizes = (sizes, sizeInventory) => {
  if (sizeInventory.length > 0) {
    return sizeInventory.map((item) => item.size);
  }

  if (!Array.isArray(sizes)) return [];

  return [
    ...new Set(
      sizes
        .map((size) => String(size || "").trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
};

const validateProductInput = ({
  name,
  description,
  category,
  price,
  isOnSale,
  salePrice,
}) => {
  if (!name || !description || !category) {
    return "Name, description and category are required.";
  }

  if (price === undefined || price === null || price === "") {
    return "Product price is required.";
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return "Price cannot be negative and must be a valid number.";
  }

  if (isOnSale === true) {
    if (salePrice === undefined || salePrice === null || salePrice === "") {
      return "Sale price is required when sale is enabled.";
    }

    const numericSalePrice = Number(salePrice);

    if (
      !Number.isFinite(numericSalePrice) ||
      numericSalePrice < 0 ||
      numericSalePrice >= numericPrice
    ) {
      return "Sale price must be lower than the regular price.";
    }
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      salePrice,
      isOnSale,
      images,
      sizes,
      sizeInventory,
      stock,
      isNew,
      isFeatured,
      status,
    } = req.body;

    const validationError = validateProductInput({
      name,
      description,
      category,
      price,
      isOnSale,
      salePrice,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const normalizedInventory = normalizeSizeInventory(sizeInventory);
    const normalizedSizes = normalizeSizes(sizes, normalizedInventory);
    const totalStock = getTotalStock(normalizedInventory, stock);

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      salePrice:
        isOnSale === true && salePrice !== "" ? Number(salePrice) : null,
      isOnSale: Boolean(isOnSale),
      images: Array.isArray(images) ? images : [],
      sizes: normalizedSizes,
      sizeInventory: normalizedInventory,
      stock: totalStock,
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
|--------------------------------------------------------------------------
*/
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      salePrice,
      isOnSale,
      images,
      sizes,
      sizeInventory,
      stock,
      isNew,
      isFeatured,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const validationError = validateProductInput({
      name,
      description,
      category,
      price,
      isOnSale,
      salePrice,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const normalizedInventory = normalizeSizeInventory(sizeInventory);

    /*
     * If this is an old product and the admin has not yet entered
     * sizeInventory, preserve its existing total stock.
     */
    const totalStock = getTotalStock(
      normalizedInventory,
      stock !== undefined && stock !== "" ? stock : product.stock
    );

    const normalizedSizes = normalizeSizes(
      sizes,
      normalizedInventory
    );

    product.name = name.trim();
    product.description = description.trim();
    product.category = category.trim();
    product.price = Number(price);
    product.isOnSale = Boolean(isOnSale);
    product.salePrice =
      isOnSale === true && salePrice !== "" ? Number(salePrice) : null;

    product.images = Array.isArray(images) ? images : product.images;

    product.sizes = normalizedSizes;

    /*
     * Only replace sizeInventory when it was actually supplied.
     * This keeps old products safe until they are edited in the new
     * inventory interface.
     */
    if (Array.isArray(sizeInventory)) {
      product.sizeInventory = normalizedInventory;
      product.stock = totalStock;
    } else {
      product.stock = Math.max(
        0,
        Number(stock !== undefined && stock !== "" ? stock : product.stock)
      );
    }

    product.isNew =
      isNew !== undefined ? Boolean(isNew) : product.isNew;

    product.isFeatured =
      isFeatured !== undefined
        ? Boolean(isFeatured)
        : product.isFeatured;

    product.status = status || product.status;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPLOAD PRODUCT IMAGES TO CLOUDINARY
|--------------------------------------------------------------------------
*/
export const uploadProductImages = async (req, res) => {
  try {
    if (
      !req.files ||
      !Array.isArray(req.files) ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image.",
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "sirraha/products",
                resource_type: "image",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );

            uploadStream.end(file.buffer);
          })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
};
