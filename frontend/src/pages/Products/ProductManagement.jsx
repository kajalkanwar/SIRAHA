import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../constants/api";

const emptyForm = {
  productCode: "",
  description: "",
  price: "",
  category: "",
  images: "",
  sizes: "",
  stock: "",
  isFeatured: false,
};

function ProductManagement() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ADMIN CHECK + INITIAL LOAD
  // ========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const user = storedUser
      ? JSON.parse(storedUser)
      : null;

    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    // Delay the initial state update until after the effect finishes.
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [navigate]);

  // ========================================
  // FORM INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ========================================
  // CREATE / UPDATE PRODUCT
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const productData = {
        productCode: form.productCode.trim(),

        description: form.description.trim(),

        price: Number(form.price),

        category: form.category.trim(),

        images: form.images
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean),

        sizes: form.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        stock: Number(form.stock),

        isFeatured: form.isFeatured,
      };

      if (editingId) {
        await updateProduct(editingId, productData);

        setMessage("Product updated successfully.");
      } else {
        await createProduct(productData);

        setMessage("Product added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await fetchProducts();
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // EDIT PRODUCT
  // ========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      productCode: product.productCode || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      images: product.images?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
      stock: product.stock ?? "",
      isFeatured: product.isFeatured || false,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteProduct(id);

      setMessage("Product deleted successfully.");

      await fetchProducts();
    } catch (error) {
      setError(error.message || "Failed to delete product");
    }
  };

  // ========================================
  // CANCEL FORM
  // ========================================

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // ========================================
  // CATEGORY FILTER
  // ========================================

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.productCode
        ?.toLowerCase()
        .includes(searchText) ||
      product.description
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[240px] shrink-0 bg-[#0E5B3B] text-white transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className="px-6 py-7 border-b border-white/10">

            <div className="flex items-center justify-between">

              <h1 className="font-serif text-3xl tracking-wide">
                Sirraha
              </h1>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
                aria-label="Close sidebar"
              >
                <FiX size={22} />
              </button>

            </div>

            <p className="mt-2 text-[10px] uppercase tracking-[3px] text-white/60">
              Admin Panel
            </p>

          </div>

          {/* Navigation */}
          <div className="px-4 py-7">

            <p className="px-3 mb-4 text-[10px] uppercase tracking-[2px] text-white/40">
              Menu
            </p>

            <nav className="space-y-2">

              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiGrid size={18} />
                <span className="text-sm font-medium">
                  Dashboard
                </span>
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white"
              >
                <FiPackage size={18} />
                <span className="text-sm font-medium">
                  Products
                </span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiShoppingBag size={18} />
                <span className="text-sm font-medium">
                  Orders
                </span>
              </Link>

              <Link
                to="/admin/customers"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiUsers size={18} />
                <span className="text-sm font-medium">
                  Customers
                </span>
              </Link>

            </nav>
          </div>

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-white/10">

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <FiLogOut size={18} />

              <span className="text-sm font-medium">
                Logout
              </span>
            </button>

          </div>

        </div>
      </aside>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main className="flex-1 min-w-0">

        {/* Topbar */}
        <header className="h-[76px] bg-white border-b border-gray-200 flex items-center justify-between px-5 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#0E5B3B]"
            aria-label="Open sidebar"
          >
            <FiMenu size={24} />
          </button>

          <div className="hidden lg:block">

            <p className="text-xs text-gray-400">
              Manage your store
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#1F2937]">
              Products
            </h2>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-[#0E5B3B] text-white flex items-center justify-center text-sm font-semibold">
              K
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-medium text-gray-700">
                Kajal
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>

            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="py-8 sm:py-10 lg:py-12">

          <div className="site-container">

            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">

              <div>

                <p className="text-sm text-gray-400">
                  Inventory management
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-[#1F2937]">
                  Products
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Add and manage products in your Sirraha store.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setForm(emptyForm);
                  setError("");
                  setMessage("");
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0E5B3B] text-white text-sm font-medium hover:bg-[#124F36] transition"
              >
                <FiPlus size={18} />
                Add Product
              </button>

            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ========================================
                ADD / EDIT FORM
            ======================================== */}

            {showForm && (
              <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-xl font-semibold text-[#1F2937]">
                      {editingId
                        ? "Edit Product"
                        : "Add Product"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Enter the product details below.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="Close form"
                  >
                    <FiX size={22} />
                  </button>

                </div>

                <form onSubmit={handleSubmit}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Product Code */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Code
                      </label>

                      <input
                        type="text"
                        name="productCode"
                        value={form.productCode}
                        onChange={handleChange}
                        placeholder="Example: SRH002"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Category */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Example: Kurtis"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Price */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Example: 1299"
                        min="0"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Stock */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>

                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Example: 10"
                        min="0"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Sizes */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sizes
                      </label>

                      <input
                        type="text"
                        name="sizes"
                        value={form.sizes}
                        onChange={handleChange}
                        placeholder="Example: S, M, L, XL"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Images */}
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URLs
                      </label>

                      <input
                        type="text"
                        name="images"
                        value={form.images}
                        onChange={handleChange}
                        placeholder="Paste image URL(s), separated by commas"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the product..."
                        rows="4"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none resize-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                      />

                    </div>

                    {/* Featured */}
                    <div className="md:col-span-2">

                      <label className="flex items-center gap-3 cursor-pointer">

                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={form.isFeatured}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#0E5B3B]"
                        />

                        <span className="text-sm text-gray-700">
                          Mark as featured product
                        </span>

                      </label>

                    </div>

                  </div>

                  {/* Form Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-6 border-t border-gray-100">

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-3 rounded-xl bg-[#0E5B3B] text-white text-sm font-medium hover:bg-[#124F36] transition disabled:opacity-60"
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Product"
                        : "Save Product"}
                    </button>

                  </div>

                </form>
              </div>
            )}

            {/* ========================================
                SEARCH AND FILTER
            ======================================== */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">

              <div className="flex flex-col md:flex-row gap-4">

                <div className="relative flex-1">

                  <FiSearch
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by product code or description..."
                    className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-[#0E5B3B] focus:ring-2 focus:ring-[#0E5B3B]/10"
                  />

                </div>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#0E5B3B]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* ========================================
                PRODUCT TABLE
            ======================================== */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="flex items-center justify-between px-5 sm:px-7 py-6 border-b border-gray-100">

                <div>

                  <h2 className="text-lg font-semibold text-[#1F2937]">
                    All Products
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>

                </div>

                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#0E5B3B] hover:underline"
                >
                  Dashboard
                  <FiChevronRight size={16} />
                </Link>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[1.5px] text-gray-400 border-b border-gray-100">

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Product Code
                      </th>

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Category
                      </th>

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Price
                      </th>

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Stock
                      </th>

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Featured
                      </th>

                      <th className="px-5 sm:px-7 py-4 font-medium">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-7 py-12 text-center text-sm text-gray-400"
                        >
                          Loading products...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-7 py-12 text-center text-sm text-gray-400"
                        >
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                        >

                          <td className="px-5 sm:px-7 py-5 text-sm font-medium text-gray-700">
                            {product.productCode}
                          </td>

                          <td className="px-5 sm:px-7 py-5 text-sm text-gray-500">
                            {product.category}
                          </td>

                          <td className="px-5 sm:px-7 py-5 text-sm text-gray-700">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </td>

                          <td className="px-5 sm:px-7 py-5 text-sm text-gray-700">
                            {product.stock}
                          </td>

                          <td className="px-5 sm:px-7 py-5">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                product.isFeatured
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {product.isFeatured
                                ? "Yes"
                                : "No"}
                            </span>

                          </td>

                          <td className="px-5 sm:px-7 py-5">

                            <div className="flex items-center gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(product)
                                }
                                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
                                aria-label="Edit product"
                              >
                                <FiEdit2 size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(product._id)
                                }
                                className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                                aria-label="Delete product"
                              >
                                <FiTrash2 size={16} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      ))
                    )}

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductManagement;