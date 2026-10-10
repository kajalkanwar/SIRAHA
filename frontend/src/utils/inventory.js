export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export const getSizeInventory = (product) => {
  if (
    Array.isArray(product?.sizeInventory) &&
    product.sizeInventory.length > 0
  ) {
    return product.sizeInventory
      .map((item) => ({
        size: String(item?.size || "").trim().toUpperCase(),
        stock: Math.max(0, Number(item?.stock ?? 0)),
      }))
      .filter((item) => item.size);
  }

  if (Array.isArray(product?.sizes)) {
    return product.sizes
      .map((size) => ({
        size:
          typeof size === "string"
            ? size.trim().toUpperCase()
            : String(size?.size || "").trim().toUpperCase(),
        stock:
          typeof size === "object" && size !== null
            ? Math.max(0, Number(size.stock ?? 0))
            : null,
      }))
      .filter((item) => item.size);
  }

  return [];
};

export const hasSizeInventory = (product) =>
  Array.isArray(product?.sizeInventory) &&
  product.sizeInventory.length > 0;

export const getTotalStock = (product) => {
  if (hasSizeInventory(product)) {
    return product.sizeInventory.reduce(
      (total, item) => total + Math.max(0, Number(item?.stock || 0)),
      0
    );
  }

  return Math.max(0, Number(product?.stock || 0));
};

export const getStockState = (stock) => {
  const value = Math.max(0, Number(stock || 0));

  if (value === 0) {
    return {
      key: "out",
      label: "Out of Stock",
      shortLabel: "Out of Stock",
    };
  }

  if (value <= 5) {
    return {
      key: "low",
      label: `Only ${value} left`,
      shortLabel: `${value} left`,
    };
  }

  return {
    key: "available",
    label: "In Stock",
    shortLabel: "In Stock",
  };
};

export const getSizeStockState = (stock) => {
  if (stock === null || stock === undefined) {
    return {
      key: "legacy",
      label: "Available",
      disabled: false,
    };
  }

  const value = Math.max(0, Number(stock || 0));

  if (value === 0) {
    return {
      key: "out",
      label: "Out of Stock",
      disabled: true,
    };
  }

  if (value <= 5) {
    return {
      key: "low",
      label: `Only ${value} left`,
      disabled: false,
    };
  }

  return {
    key: "available",
    label: "In Stock",
    disabled: false,
  };
};