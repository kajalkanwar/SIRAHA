import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  UploadCloud,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Copy,
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../../constants/api";

import {
  SIZE_OPTIONS,
  getTotalStock,
  getStockState,
} from "../../utils/inventory";

const CATEGORIES = [
  "Short Kurtis",
  "Long Kurtis",
  "Co-ord Sets",
  "Top",
  "Palazzos",
  "Farshi Salwar Suit",
];

const COLORS = {
  espresso: "#43231C",
  brown: "#5A3026",
  brownSoft: "#765348",
  gold: "#C8A15A",
  goldSoft: "#EFE3C8",
  cream: "#FBF8F2",
  creamDeep: "#F5EFE5",
  paper: "#FFFDF9",
  border: "#E8DED2",
  borderDark: "#D9CBBE",
  text: "#2D211D",
  muted: "#7C6B61",
  mutedLight: "#A2948B",
  success: "#58745E",
  successBg: "#EEF5EF",
  warning: "#9A7332",
  warningBg: "#FBF4E3",
  danger: "#A6534C",
  dangerBg: "#FBEDEC",
};

const createEmptySizeInventory = () =>
  SIZE_OPTIONS.map((size) => ({
    size,
    stock: 0,
  }));

const createEmptyForm = () => ({
  name: "",
  category: "",
  description: "",
  price: "",
  salePrice: "",
  isOnSale: false,
  stock: 0,
  sizeInventory: createEmptySizeInventory(),
  legacySizes: ["S", "M", "L", "XL"],
  useSizeInventory: true,
  images: [],
  isNew: true,
  isFeatured: false,
  status: "active",
});

const getProductId = (product) => product?._id || product?.id;

const getInventoryRows = (product) => {
  if (
    Array.isArray(product?.sizeInventory) &&
    product.sizeInventory.length > 0
  ) {
    return SIZE_OPTIONS.map((size) => {
      const item = product.sizeInventory.find(
        (entry) => String(entry?.size || "").toUpperCase() === size
      );

      return {
        size,
        stock: item ? Math.max(0, Number(item.stock || 0)) : 0,
      };
    });
  }

  return [];
};

const getStockBadgeClass = (key) => {
  if (key === "out") {
    return "bg-[#FBEDEC] text-[#A6534C]";
  }

  if (key === "low") {
    return "bg-[#FBF4E3] text-[#9A7332]";
  }

  return "bg-[#EEF5EF] text-[#58745E]";
};

const ProductManagement = () => {
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm);

  const itemsPerPage = 8;

  // ---------------------------------------------------------------------------
  // FETCH PRODUCTS
  // ---------------------------------------------------------------------------

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err?.message || "Failed to load products.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      try {
        const data = await getProducts();

        if (!mounted) return;

        setProducts(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load products:", err);
        setError(err?.message || "Failed to load products.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialLoad();

    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // CLEAR SUCCESS MESSAGE
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // ---------------------------------------------------------------------------
  // FILTERING
  // ---------------------------------------------------------------------------

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product?.name?.toLowerCase().includes(searchValue) ||
        product?.description?.toLowerCase().includes(searchValue) ||
        product?.category?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product?.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------

  const totalProducts = products.length;

  const totalStockUnits = products.reduce(
    (total, product) => total + getTotalStock(product),
    0
  );


  const lowStockProducts = products.filter((product) => {
    const stock = getTotalStock(product);
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockProducts = products.filter(
    (product) => getTotalStock(product) === 0
  ).length;

  // ---------------------------------------------------------------------------
  // FORM HELPERS
  // ---------------------------------------------------------------------------

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const openAddForm = () => {
    setError("");
    setSuccess("");
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving || uploading) return;

    setShowForm(false);
    resetForm();
    setError("");
  };

  // ---------------------------------------------------------------------------
  // EDIT PRODUCT
  // ---------------------------------------------------------------------------

  const openEditForm = (product) => {
    setError("");
    setSuccess("");
    setEditingId(getProductId(product));

    const hasInventory =
      Array.isArray(product?.sizeInventory) &&
      product.sizeInventory.length > 0;

    const existingSizes =
      Array.isArray(product?.sizes) && product.sizes.length > 0
        ? product.sizes.map((size) => String(size).toUpperCase())
        : ["S", "M", "L", "XL"];

    const sizeInventory = hasInventory
      ? getInventoryRows(product)
      : createEmptySizeInventory();

    setForm({
      name: product?.name || "",
      category: product?.category || "",
      description: product?.description || "",
      price: product?.price ?? "",
      salePrice: product?.salePrice ?? "",
      isOnSale: Boolean(product?.isOnSale),
      stock: Number(product?.stock || 0),
      sizeInventory,
      legacySizes: existingSizes,
      useSizeInventory: hasInventory,
      images: Array.isArray(product?.images) ? product.images : [],
      isNew: product?.isNew !== false,
      isFeatured: Boolean(product?.isFeatured),
      status: product?.status || "active",
    });

    setShowForm(true);
  };

  // ---------------------------------------------------------------------------
  // SIZE INVENTORY
  // ---------------------------------------------------------------------------

  const updateSizeStock = (size, value) => {
    const normalizedSize = String(size).toUpperCase();

    setForm((previous) => ({
      ...previous,
      useSizeInventory: true,
      sizeInventory: previous.sizeInventory.map((item) =>
        item.size === normalizedSize
          ? {
              ...item,
              stock:
                value === ""
                  ? 0
                  : Math.max(0, Math.floor(Number(value) || 0)),
            }
          : item
      ),
    }));
  };

  const enableSizeInventory = () => {
    setForm((previous) => ({
      ...previous,
      useSizeInventory: true,
      sizeInventory:
        previous.sizeInventory.length === SIZE_OPTIONS.length
          ? previous.sizeInventory
          : createEmptySizeInventory(),
    }));
  };

  const calculatedFormStock = form.useSizeInventory
    ? form.sizeInventory.reduce(
        (total, item) => total + Math.max(0, Number(item.stock || 0)),
        0
      )
    : Math.max(0, Number(form.stock || 0));

  const formStockState = getStockState(calculatedFormStock);

  // ---------------------------------------------------------------------------
  // IMAGE UPLOAD
  // ---------------------------------------------------------------------------

  const handleImageSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (selectedFiles.length + form.images.length > 8) {
      setError("You can upload a maximum of 8 images.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedUrls = await uploadProductImages(selectedFiles);

      setForm((previous) => ({
        ...previous,
        images: [...previous.images, ...uploadedUrls],
      }));

      setSuccess("Images uploaded successfully.");
    } catch (err) {
      console.error("Image upload failed:", err);
      setError(err?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  // ---------------------------------------------------------------------------
  // SAVE PRODUCT
  // ---------------------------------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const price = Number(form.price);
    const salePrice = Number(form.salePrice);

    if (!trimmedName) {
      setError("Please enter a product name.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!trimmedDescription) {
      setError("Please enter a product description.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      form.isOnSale &&
      (form.salePrice === "" ||
        !Number.isFinite(salePrice) ||
        salePrice < 0 ||
        salePrice >= price)
    ) {
      setError("Sale price must be lower than the regular price.");
      return;
    }

    if (form.useSizeInventory && form.sizeInventory.length === 0) {
      setError("Please configure at least one size.");
      return;
    }

    const normalizedInventory = form.useSizeInventory
      ? SIZE_OPTIONS.map((size) => {
          const item = form.sizeInventory.find(
            (entry) => entry.size === size
          );

          return {
            size,
            stock: Math.max(0, Math.floor(Number(item?.stock || 0))),
          };
        })
      : [];

    try {
      setSaving(true);

      const productData = {
        name: trimmedName,
        category: form.category,
        description: trimmedDescription,
        price,
        salePrice: form.isOnSale ? salePrice : null,
        isOnSale: Boolean(form.isOnSale),

        stock: form.useSizeInventory
          ? normalizedInventory.reduce(
              (total, item) => total + item.stock,
              0
            )
          : Math.max(0, Math.floor(Number(form.stock || 0))),

        sizes: form.useSizeInventory
          ? normalizedInventory.map((item) => item.size)
          : form.legacySizes,

        sizeInventory: form.useSizeInventory
          ? normalizedInventory
          : undefined,

        images: form.images,
        isNew: Boolean(form.isNew),
        isFeatured: Boolean(form.isFeatured),
        status: form.status,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(productData);
        setSuccess("Product added successfully.");
      }

      setShowForm(false);
      resetForm();

      setLoading(true);
      await loadProducts();
    } catch (err) {
      console.error("Unable to save product:", err);
      setError(err?.message || "Unable to save product.");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DELETE PRODUCT
  // ---------------------------------------------------------------------------

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product?.name || "this product"}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(getProductId(product));

      setSuccess("Product deleted successfully.");

      setLoading(true);
      await loadProducts();
    } catch (err) {
      console.error("Unable to delete product:", err);
      setError(err?.message || "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DUPLICATE PRODUCT
  // ---------------------------------------------------------------------------

  const duplicateProduct = (product) => {
    setError("");
    setSuccess("");
    setEditingId(null);

    const hasInventory =
      Array.isArray(product?.sizeInventory) &&
      product.sizeInventory.length > 0;

    setForm({
      name: `${product?.name || "Product"} Copy`,
      category: product?.category || "",
      description: product?.description || "",
      price: product?.price ?? "",
      salePrice: product?.salePrice ?? "",
      isOnSale: Boolean(product?.isOnSale),
      stock: Number(product?.stock || 0),
      sizeInventory: hasInventory
        ? getInventoryRows(product)
        : createEmptySizeInventory(),
      legacySizes:
        Array.isArray(product?.sizes) && product.sizes.length > 0
          ? product.sizes
          : ["S", "M", "L", "XL"],
      useSizeInventory: hasInventory,
      images: Array.isArray(product?.images) ? product.images : [],
      isNew: product?.isNew !== false,
      isFeatured: Boolean(product?.isFeatured),
      status: product?.status || "active",
    });

    setShowForm(true);
  };

  // ---------------------------------------------------------------------------
  // FORMATTERS
  // ---------------------------------------------------------------------------

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const discountPercentage =
    form.isOnSale && Number(form.price) > 0 && Number(form.salePrice) > 0
      ? Math.round(
          ((Number(form.price) - Number(form.salePrice)) /
            Number(form.price)) *
            100
        )
      : 0;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{ backgroundColor: COLORS.cream }}
    >
      <div className="mx-auto max-w-[1540px]">
        {/* HEADER */}
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-px w-8"
                style={{ backgroundColor: COLORS.gold }}
              />
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: COLORS.brownSoft }}
              >
                Sirraha Admin
              </p>
            </div>

            <h1
              className="font-['Cormorant_Garamond'] text-4xl font-semibold leading-none sm:text-5xl"
              style={{ color: COLORS.espresso }}
            >
              Product Management
            </h1>

            <p
              className="mt-3 max-w-2xl text-sm leading-6"
              style={{ color: COLORS.muted }}
            >
              Add, edit and manage your Sirraha collection, pricing, imagery
              and size-wise inventory from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(67,35,28,0.16)] transition hover:-translate-y-0.5"
            style={{ backgroundColor: COLORS.brown }}
          >
            <Plus size={18} />
            Add Product
          </button>
        </header>

        {/* ALERTS */}
        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm"
            style={{
              borderColor: "#EBCBC7",
              backgroundColor: COLORS.dangerBg,
              color: COLORS.danger,
            }}
          >
            <AlertCircle className="mt-0.5 shrink-0" size={17} />

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-full p-1 transition hover:bg-black/5"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div
            className="mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm"
            style={{
              borderColor: "#D5E4D6",
              backgroundColor: COLORS.successBg,
              color: COLORS.success,
            }}
          >
            <CheckCircle2 size={17} />
            <span>{success}</span>
          </div>
        )}

        {/* SUMMARY */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Products"
            value={totalProducts}
            note="Catalog items"
            icon={<Package size={19} />}
          />

          <SummaryCard
            label="Inventory Units"
            value={totalStockUnits}
            note="Across all sizes"
            icon={<CheckCircle2 size={19} />}
          />

          <SummaryCard
            label="Low Stock"
            value={lowStockProducts}
            note="1–5 units remaining"
            icon={<AlertCircle size={19} />}
            warning
          />

          <SummaryCard
            label="Out of Stock"
            value={outOfStockProducts}
            note="Still visible in catalog"
            icon={<XCircle size={19} />}
            danger
          />
        </section>

        {/* PRODUCT AREA */}
        <section
          className="overflow-hidden rounded-2xl border bg-white shadow-[0_10px_40px_rgba(67,35,28,0.05)]"
          style={{ borderColor: COLORS.border }}
        >
          {/* SEARCH BAR */}
          <div
            className="flex flex-col gap-3 border-b p-4 md:flex-row"
            style={{ borderColor: COLORS.creamDeep }}
          >
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.mutedLight }}
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products, categories or descriptions..."
                className="w-full rounded-xl border bg-[#FFFCF8] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#B0A49D] focus:ring-2"
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.text,
                  "--tw-ring-color": `${COLORS.gold}55`,
                }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border bg-[#FFFCF8] px-4 py-3 text-sm outline-none focus:ring-2"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.text,
                "--tw-ring-color": `${COLORS.gold}55`,
              }}
            >
              <option value="All Categories">All Categories</option>

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr
                  className="border-b text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    borderColor: COLORS.creamDeep,
                    backgroundColor: "#FEFCF8",
                    color: COLORS.mutedLight,
                  }}
                >
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Sale Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <TableMessage message="Loading products..." />
                ) : paginatedProducts.length === 0 ? (
                  <TableMessage message="No products found." />
                ) : (
                  paginatedProducts.map((product) => {
                    const stock = getTotalStock(product);
                    const stockStatus = getStockState(stock);
                    const image = product?.images?.[0];

                    return (
                      <tr
                        key={getProductId(product)}
                        className="border-b transition hover:bg-[#FFFCF8]"
                        style={{ borderColor: "#F2ECE5" }}
                      >
                        <td className="px-5 py-3.5">
                          <ProductImage
                            image={image}
                            name={product?.name}
                            className="h-14 w-14"
                          />
                        </td>

                        <td className="px-5 py-3.5">
                          <p
                            className="max-w-[220px] truncate text-sm font-medium"
                            style={{ color: COLORS.text }}
                          >
                            {product?.name}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {product?.isNew && (
                              <MiniTag label="New" tone="gold" />
                            )}

                            {product?.isFeatured && (
                              <MiniTag label="Featured" tone="brown" />
                            )}
                          </div>
                        </td>

                        <td
                          className="px-5 py-3.5 text-sm"
                          style={{ color: COLORS.muted }}
                        >
                          {product?.category || "—"}
                        </td>

                        <td
                          className="px-5 py-3.5 text-sm font-medium"
                          style={{ color: COLORS.text }}
                        >
                          {formatPrice(product?.price)}
                        </td>

                        <td className="px-5 py-3.5">
                          {product?.isOnSale && product?.salePrice ? (
                            <div>
                              <p
                                className="text-sm font-semibold"
                                style={{ color: COLORS.brown }}
                              >
                                {formatPrice(product.salePrice)}
                              </p>
                              <p
                                className="text-xs line-through"
                                style={{ color: COLORS.mutedLight }}
                              >
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          ) : (
                            <span style={{ color: COLORS.mutedLight }}>—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: COLORS.text }}
                          >
                            {stock}
                          </p>
                          {Array.isArray(product?.sizeInventory) &&
                            product.sizeInventory.length > 0 && (
                              <p
                                className="mt-0.5 text-[10px]"
                                style={{ color: COLORS.mutedLight }}
                              >
                                Size-wise
                              </p>
                            )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium ${getStockBadgeClass(
                              stockStatus.key
                            )}`}
                          >
                            {stockStatus.label}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <ProductActions
                            product={product}
                            onEdit={openEditForm}
                            onDuplicate={duplicateProduct}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE / TABLET */}
          <div className="grid gap-3 p-4 lg:hidden">
            {loading ? (
              <div
                className="py-12 text-center text-sm"
                style={{ color: COLORS.muted }}
              >
                Loading products...
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div
                className="py-12 text-center text-sm"
                style={{ color: COLORS.muted }}
              >
                No products found.
              </div>
            ) : (
              paginatedProducts.map((product) => {
                const stock = getTotalStock(product);
                const stockStatus = getStockState(stock);
                const image = product?.images?.[0];

                return (
                  <article
                    key={getProductId(product)}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.paper,
                    }}
                  >
                    <div className="flex gap-4">
                      <ProductImage
                        image={image}
                        name={product?.name}
                        className="h-24 w-20 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3
                              className="truncate text-sm font-semibold"
                              style={{ color: COLORS.text }}
                            >
                              {product?.name}
                            </h3>

                            <p
                              className="mt-1 text-xs"
                              style={{ color: COLORS.muted }}
                            >
                              {product?.category}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium ${getStockBadgeClass(
                              stockStatus.key
                            )}`}
                          >
                            {stockStatus.label}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {product?.isOnSale && product?.salePrice ? (
                            <>
                              <span
                                className="font-semibold"
                                style={{ color: COLORS.brown }}
                              >
                                {formatPrice(product.salePrice)}
                              </span>

                              <span
                                className="text-xs line-through"
                                style={{ color: COLORS.mutedLight }}
                              >
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span
                              className="font-semibold"
                              style={{ color: COLORS.text }}
                            >
                              {formatPrice(product?.price)}
                            </span>
                          )}

                          <span
                            className="text-xs"
                            style={{ color: COLORS.muted }}
                          >
                            {stock} units
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {product?.isNew && (
                            <MiniTag label="New" tone="gold" />
                          )}
                          {product?.isFeatured && (
                            <MiniTag label="Featured" tone="brown" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-4 flex justify-end gap-2 border-t pt-3"
                      style={{ borderColor: "#F0E9E1" }}
                    >
                      <ActionButton
                        label="Edit"
                        icon={<Pencil size={14} />}
                        onClick={() => openEditForm(product)}
                        tone="brown"
                      />

                      <ActionButton
                        label="Duplicate"
                        icon={<Copy size={14} />}
                        onClick={() => duplicateProduct(product)}
                        tone="gold"
                      />

                      <ActionButton
                        label="Delete"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDelete(product)}
                        tone="danger"
                      />
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          <div
            className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: COLORS.creamDeep }}
          >
            <p className="text-xs" style={{ color: COLORS.mutedLight }}>
              Showing{" "}
              {filteredProducts.length === 0
                ? 0
                : (safePage - 1) * itemsPerPage + 1}{" "}
              – {Math.min(safePage * itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>

            <div className="flex items-center gap-1.5">
              <PaginationButton
                disabled={safePage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
              >
                <ChevronLeft size={16} />
              </PaginationButton>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(0, 5)
                .map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="h-9 w-9 rounded-lg text-xs font-medium transition"
                    style={
                      safePage === page
                        ? {
                            backgroundColor: COLORS.brown,
                            color: "#fff",
                          }
                        : {
                            border: `1px solid ${COLORS.borderDark}`,
                            color: COLORS.muted,
                            backgroundColor: COLORS.paper,
                          }
                    }
                  >
                    {page}
                  </button>
                ))}

              <PaginationButton
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                <ChevronRight size={16} />
              </PaginationButton>
            </div>
          </div>
        </section>
      </div>

      {/* ADD / EDIT DRAWER */}
      {showForm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-[#241611]/45 backdrop-blur-[3px]"
            onClick={closeForm}
          />

          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[680px] overflow-y-auto shadow-2xl"
            style={{ backgroundColor: COLORS.cream }}
          >
            {/* DRAWER HEADER */}
            <div
              className="sticky top-0 z-20 flex items-center justify-between border-b px-6 py-5 backdrop-blur-xl"
              style={{
                borderColor: COLORS.border,
                backgroundColor: "rgba(251,248,242,0.94)",
              }}
            >
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="h-px w-5"
                    style={{ backgroundColor: COLORS.gold }}
                  />
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: COLORS.brownSoft }}
                  >
                    Sirraha Collection
                  </span>
                </div>

                <h2
                  className="font-['Cormorant_Garamond'] text-3xl font-semibold"
                  style={{ color: COLORS.espresso }}
                >
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{ color: COLORS.muted }}
                >
                  Complete the product information and inventory below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving || uploading}
                className="rounded-full p-2 transition hover:bg-[#F0E7DD] disabled:opacity-50"
                style={{ color: COLORS.muted }}
                aria-label="Close product form"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-7 p-6">
              {/* PRODUCT DETAILS */}
              <FormSection
                eyebrow="01"
                title="Product Details"
                description="Basic information customers will see."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Product Name *" className="sm:col-span-2">
                    <input
                      value={form.name}
                      onChange={(event) =>
                        updateForm("name", event.target.value)
                      }
                      placeholder="e.g. Emerald Straight Kurti"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Category *">
                    <select
                      value={form.category}
                      onChange={(event) =>
                        updateForm("category", event.target.value)
                      }
                      className="admin-input"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Total Stock">
                    <div
                      className="flex h-[46px] items-center justify-between rounded-xl border px-4"
                      style={{
                        borderColor: COLORS.borderDark,
                        backgroundColor: COLORS.creamDeep,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="font-['Cormorant_Garamond'] text-2xl font-semibold"
                          style={{ color: COLORS.brown }}
                        >
                          {calculatedFormStock}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: COLORS.muted }}
                        >
                          units
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${getStockBadgeClass(
                          formStockState.key
                        )}`}
                      >
                        {formStockState.label}
                      </span>
                    </div>
                  </Field>

                  <Field label="Price (₹) *">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateForm("price", event.target.value)
                      }
                      placeholder="1499"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Sale Price (₹)">
                    <input
                      type="number"
                      min="0"
                      value={form.salePrice}
                      disabled={!form.isOnSale}
                      onChange={(event) =>
                        updateForm("salePrice", event.target.value)
                      }
                      placeholder="Optional"
                      className="admin-input disabled:cursor-not-allowed disabled:bg-[#F1EAE2] disabled:text-[#A69A92]"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* SALE */}
              <section
                className="rounded-2xl border p-4"
                style={{
                  borderColor: COLORS.goldSoft,
                  backgroundColor: "#FCF7ED",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: COLORS.text }}
                    >
                      Enable Sale
                    </p>
                    <p
                      className="mt-1 text-xs leading-5"
                      style={{ color: COLORS.muted }}
                    >
                      Show the original price with a sale price on the
                      storefront.
                    </p>
                  </div>

                  <Toggle
                    checked={form.isOnSale}
                    onChange={() =>
                      updateForm("isOnSale", !form.isOnSale)
                    }
                  />
                </div>

                {form.isOnSale && (
                  <div className="mt-4 rounded-xl border border-[#E7D9BF] bg-white/70 p-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-[0.12em]"
                          style={{ color: COLORS.mutedLight }}
                        >
                          Customer saving
                        </p>
                        <p
                          className="mt-1 text-lg font-semibold"
                          style={{ color: COLORS.brown }}
                        >
                          {discountPercentage > 0
                            ? `${discountPercentage}%`
                            : "—"}
                        </p>
                      </div>

                      <p
                        className="text-xs text-right"
                        style={{ color: COLORS.muted }}
                      >
                        Regular: {formatPrice(form.price)}
                        <br />
                        Sale: {formatPrice(form.salePrice)}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* SIZE INVENTORY */}
              <FormSection
                eyebrow="02"
                title="Size Inventory"
                description="Every size remains visible. Enter 0 when that size is unavailable."
                action={
                  !form.useSizeInventory ? (
                    <button
                      type="button"
                      onClick={enableSizeInventory}
                      className="rounded-lg border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        borderColor: COLORS.gold,
                        color: COLORS.brown,
                        backgroundColor: "#FCF7ED",
                      }}
                    >
                      Enable Size Stock
                    </button>
                  ) : null
                }
              >
                {form.useSizeInventory ? (
                  <div
                    className="overflow-hidden rounded-2xl border bg-white"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div
                      className="grid grid-cols-[56px_1fr_auto] gap-3 border-b px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        borderColor: COLORS.creamDeep,
                        backgroundColor: "#FEFCF8",
                        color: COLORS.mutedLight,
                      }}
                    >
                      <span>Size</span>
                      <span>Units</span>
                      <span>Status</span>
                    </div>

                    {form.sizeInventory.map((item) => {
                      const stock = Number(item.stock || 0);
                      const state = getStockState(stock);

                      return (
                        <div
                          key={item.size}
                          className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0"
                          style={{ borderColor: "#F2ECE5" }}
                        >
                          <span
                            className="text-xs font-semibold tracking-[0.12em]"
                            style={{ color: COLORS.brown }}
                          >
                            {item.size}
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(event) =>
                              updateSizeStock(
                                item.size,
                                event.target.value
                              )
                            }
                            className="h-10 w-full rounded-lg border bg-[#FFFCF8] px-3 text-sm outline-none focus:ring-2"
                            style={{
                              borderColor: COLORS.borderDark,
                              color: COLORS.text,
                              "--tw-ring-color": `${COLORS.gold}55`,
                            }}
                            aria-label={`${item.size} stock`}
                          />

                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-medium ${getStockBadgeClass(
                              state.key
                            )}`}
                          >
                            {state.label}
                          </span>
                        </div>
                      );
                    })}

                    <div
                      className="flex items-center justify-between border-t px-4 py-3"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.creamDeep,
                      }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: COLORS.muted }}
                      >
                        Total inventory
                      </span>
                      <span
                        className="font-['Cormorant_Garamond'] text-xl font-semibold"
                        style={{ color: COLORS.brown }}
                      >
                        {calculatedFormStock} units
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.creamDeep,
                    }}
                  >
                    <p
                      className="text-xs leading-5"
                      style={{ color: COLORS.muted }}
                    >
                      This is an older product using overall stock. Its
                      existing stock is preserved. Enable size inventory only
                      when you are ready to enter quantities separately for
                      XS, S, M, L, XL and XXL.
                    </p>
                  </div>
                )}
              </FormSection>

              {/* DESCRIPTION */}
              <FormSection
                eyebrow="03"
                title="Description"
                description="Write a polished description for the product page."
              >
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Write a detailed description of the product..."
                  className="admin-input resize-none"
                />
              </FormSection>

              {/* IMAGES */}
              <FormSection
                eyebrow="04"
                title="Product Images"
                description="Upload up to 8 product images. The first image becomes the main image."
                action={
                  <span
                    className="text-xs font-medium"
                    style={{ color: COLORS.muted }}
                  >
                    {form.images.length}/8
                  </span>
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />

                <button
                  type="button"
                  disabled={uploading || form.images.length >= 8}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-9 text-center transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: COLORS.borderDark,
                    backgroundColor: "#FEFCF8",
                  }}
                >
                  {uploading ? (
                    <>
                      <div
                        className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#E7D9BF] border-t-[#5A3026]"
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: COLORS.brown }}
                      >
                        Uploading images...
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: COLORS.mutedLight }}
                      >
                        Please wait
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud
                        size={28}
                        strokeWidth={1.6}
                        className="mb-3"
                        style={{ color: COLORS.brown }}
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ color: COLORS.text }}
                      >
                        Upload to Cloudinary
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: COLORS.muted }}
                      >
                        JPG, PNG or WEBP · Maximum 5 MB each
                      </p>
                    </>
                  )}
                </button>

                {form.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {form.images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative aspect-[3/4] overflow-hidden rounded-xl"
                        style={{ backgroundColor: COLORS.creamDeep }}
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-[#241611]/75 p-1.5 text-white transition hover:bg-[#241611]"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X size={13} />
                        </button>

                        {index === 0 && (
                          <span
                            className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
                            style={{
                              color: COLORS.brown,
                              backgroundColor: "rgba(255,253,249,0.92)",
                            }}
                          >
                            Main
                          </span>
                        )}
                      </div>
                    ))}

                    {form.images.length < 8 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed transition hover:bg-white"
                        style={{
                          borderColor: COLORS.borderDark,
                          color: COLORS.brown,
                          backgroundColor: "#FEFCF8",
                        }}
                        aria-label="Add another image"
                      >
                        <ImagePlus size={23} />
                      </button>
                    )}
                  </div>
                )}
              </FormSection>

              {/* SETTINGS */}
              <FormSection
                eyebrow="05"
                title="Store Settings"
                description="Control how the product is presented across Sirraha."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckSetting
                    title="New Arrival"
                    description="Show the NEW badge"
                    checked={form.isNew}
                    onChange={(checked) => updateForm("isNew", checked)}
                  />

                  <CheckSetting
                    title="Featured Product"
                    description="Include in featured collections"
                    checked={form.isFeatured}
                    onChange={(checked) =>
                      updateForm("isFeatured", checked)
                    }
                  />
                </div>

                <div className="mt-4">
                  <Field label="Product Status">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm("status", event.target.value)
                      }
                      className="admin-input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                </div>
              </FormSection>

              {/* ACTIONS */}
              <div
                className="sticky bottom-0 -mx-6 flex gap-3 border-t px-6 py-4 backdrop-blur-xl"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: "rgba(251,248,242,0.95)",
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving || uploading}
                  className="flex-1 rounded-xl border bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#F7F0E8] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: COLORS.borderDark,
                    color: COLORS.muted,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(67,35,28,0.15)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: COLORS.brown }}
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// SMALL UI COMPONENTS
// -----------------------------------------------------------------------------

const SummaryCard = ({
  label,
  value,
  note,
  icon,
  warning = false,
  danger = false,
}) => {
  const accent = danger
    ? COLORS.danger
    : warning
    ? COLORS.warning
    : COLORS.brown;

  const accentBg = danger
    ? COLORS.dangerBg
    : warning
    ? COLORS.warningBg
    : COLORS.creamDeep;

  return (
    <div
      className="rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgba(67,35,28,0.04)]"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: COLORS.mutedLight }}
          >
            {label}
          </p>

          <p
            className="mt-2 font-['Cormorant_Garamond'] text-4xl font-semibold leading-none"
            style={{ color: COLORS.espresso }}
          >
            {value}
          </p>
        </div>

        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: accentBg, color: accent }}
        >
          {icon}
        </span>
      </div>

      <p className="mt-3 text-xs" style={{ color: COLORS.muted }}>
        {note}
      </p>
    </div>
  );
};

const ProductImage = ({ image, name, className = "" }) => (
  <div
    className={`overflow-hidden rounded-xl ${className}`}
    style={{ backgroundColor: COLORS.creamDeep }}
  >
    {image ? (
      <img
        src={image}
        alt={name || "Product"}
        className="h-full w-full object-cover"
      />
    ) : (
      <div
        className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.12em]"
        style={{ color: COLORS.mutedLight }}
      >
        No image
      </div>
    )}
  </div>
);

const ProductActions = ({ product, onEdit, onDuplicate, onDelete }) => (
  <div className="flex justify-end gap-1.5">
    <IconButton
      title="Edit product"
      onClick={() => onEdit(product)}
      tone="brown"
    >
      <Pencil size={15} />
    </IconButton>

    <IconButton
      title="Duplicate product"
      onClick={() => onDuplicate(product)}
      tone="gold"
    >
      <Copy size={15} />
    </IconButton>

    <IconButton
      title="Delete product"
      onClick={() => onDelete(product)}
      tone="danger"
    >
      <Trash2 size={15} />
    </IconButton>
  </div>
);

const IconButton = ({ children, title, onClick, tone }) => {
  const styles = {
    brown: {
      backgroundColor: "#F4EDE5",
      color: COLORS.brown,
    },
    gold: {
      backgroundColor: "#F8F0DF",
      color: "#896A2D",
    },
    danger: {
      backgroundColor: COLORS.dangerBg,
      color: COLORS.danger,
    },
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="rounded-lg p-2 transition hover:-translate-y-0.5"
      style={styles[tone]}
    >
      {children}
    </button>
  );
};

const ActionButton = ({ label, icon, onClick, tone }) => {
  const styles = {
    brown: {
      backgroundColor: "#F4EDE5",
      color: COLORS.brown,
    },
    gold: {
      backgroundColor: "#F8F0DF",
      color: "#896A2D",
    },
    danger: {
      backgroundColor: COLORS.dangerBg,
      color: COLORS.danger,
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition hover:-translate-y-0.5"
      style={styles[tone]}
    >
      {icon}
      {label}
    </button>
  );
};

const PaginationButton = ({ children, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-[#F8F0E8] disabled:cursor-not-allowed disabled:opacity-35"
    style={{
      borderColor: COLORS.borderDark,
      color: COLORS.muted,
      backgroundColor: COLORS.paper,
    }}
  >
    {children}
  </button>
);

const MiniTag = ({ label, tone }) => {
  const styles =
    tone === "gold"
      ? {
          backgroundColor: "#F8F0DF",
          color: "#896A2D",
        }
      : {
          backgroundColor: "#F4EDE5",
          color: COLORS.brown,
        };

  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em]"
      style={styles}
    >
      {label}
    </span>
  );
};

const FormSection = ({
  eyebrow,
  title,
  description,
  action,
  children,
}) => (
  <section>
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-semibold tracking-[0.16em]"
            style={{ color: COLORS.gold }}
          >
            {eyebrow}
          </span>

          <span
            className="h-px w-5"
            style={{ backgroundColor: COLORS.borderDark }}
          />
        </div>

        <h3
          className="mt-1 font-['Cormorant_Garamond'] text-2xl font-semibold"
          style={{ color: COLORS.espresso }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="mt-1 text-xs leading-5"
            style={{ color: COLORS.muted }}
          >
            {description}
          </p>
        )}
      </div>

      {action}
    </div>

    {children}
  </section>
);

const Field = ({ label, children, className = "" }) => (
  <div className={className}>
    <label
      className="mb-2 block text-xs font-semibold"
      style={{ color: COLORS.text }}
    >
      {label}
    </label>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className="relative h-7 w-12 shrink-0 rounded-full transition"
    style={{
      backgroundColor: checked ? COLORS.brown : "#D8CEC4",
    }}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const CheckSetting = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <label
    className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-white px-4 py-4"
    style={{ borderColor: COLORS.border }}
  >
    <div>
      <p
        className="text-sm font-semibold"
        style={{ color: COLORS.text }}
      >
        {title}
      </p>
      <p
        className="mt-1 text-xs"
        style={{ color: COLORS.muted }}
      >
        {description}
      </p>
    </div>

    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 cursor-pointer accent-[#5A3026]"
    />
  </label>
);

const TableMessage = ({ message }) => (
  <tr>
    <td
      colSpan="8"
      className="px-5 py-16 text-center text-sm"
      style={{ color: COLORS.muted }}
    >
      {message}
    </td>
  </tr>
);

export default ProductManagement;
