import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";

import { getProducts } from "../../constants/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalStock = products.reduce(
    (total, product) => total + (product.stock || 0),
    0
  );

  const featuredProducts = products.filter(
    (product) => product.isFeatured
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[240px] shrink-0 bg-[#0E5B3B] text-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white"
              >
                <FiGrid size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              <Link
                to="/admin/products"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiPackage size={18} />
                <span className="text-sm font-medium">Products</span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiShoppingBag size={18} />
                <span className="text-sm font-medium">Orders</span>
              </Link>

              <Link
                to="/admin/customers"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <FiUsers size={18} />
                <span className="text-sm font-medium">Customers</span>
              </Link>
            </nav>
          </div>

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <FiLogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="h-[76px] bg-white border-b border-gray-200 flex items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#0E5B3B]"
            aria-label="Open sidebar"
          >
            <FiMenu size={24} />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs text-gray-400">
              Welcome back, Kajal
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#1F2937]">
              Dashboard
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

        {/* Dashboard Content */}
        <div className="py-8 sm:py-10 lg:py-12">
        <div className="site-container">
            {/* Mobile Heading */}
            <div className="lg:hidden mb-8">
              <p className="text-sm text-gray-400">
                Welcome back, Kajal
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1F2937]">
                Dashboard
              </h2>
            </div>

            {/* Page Heading */}
            <div className="hidden lg:flex items-end justify-between mb-8">
              <div>
                <p className="text-sm text-gray-400">
                  Overview of your store
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#1F2937]">
                  Store Overview
                </h1>
              </div>

              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0E5B3B] text-white text-sm font-medium hover:bg-[#124F36] transition"
              >
                <FiPackage size={17} />
                Manage Products
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Total Products */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Total Products
                    </p>

                    <h3 className="mt-4 text-3xl font-semibold text-[#1F2937]">
                      {loading ? "—" : products.length}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#E8F1EC] text-[#0E5B3B] flex items-center justify-center">
                    <FiPackage size={22} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  Products in your store
                </p>
              </div>

              {/* Total Stock */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Total Stock
                    </p>

                    <h3 className="mt-4 text-3xl font-semibold text-[#1F2937]">
                      {loading ? "—" : totalStock}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#F8F1DD] text-[#A27B25] flex items-center justify-center">
                    <FiShoppingBag size={22} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  Items currently available
                </p>
              </div>

              {/* Featured Products */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Featured Products
                    </p>

                    <h3 className="mt-4 text-3xl font-semibold text-[#1F2937]">
                      {loading ? "—" : featuredProducts}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#F3E8E8] text-[#9B5C5C] flex items-center justify-center">
                    <FiGrid size={22} />
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  Products highlighted on your store
                </p>
              </div>
            </div>

            {/* Recent Products */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-7 py-6 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">
                    Recent Products
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Your latest product additions
                  </p>
                </div>

                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0E5B3B] hover:underline"
                >
                  View all
                  <FiChevronRight size={16} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
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
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-7 py-12 text-center text-sm text-gray-400"
                        >
                          Loading products...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-7 py-12 text-center text-sm text-gray-400"
                        >
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.slice(0, 5).map((product) => (
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

export default AdminDashboard;