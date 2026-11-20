
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FiMenu, FiLogOut } from "react-icons/fi";

import AdminSidebar from "../components/admin/AdminSidebar";

function getStoredAdminUser() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user?.role !== "admin") {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unable to read admin user:", error);
    return null;
  }
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminUser] = useState(getStoredAdminUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  }, [adminUser, navigate]);

 useEffect(() => {
  const timer = setTimeout(() => {
    setSidebarOpen(false);
  }, 0);

  return () => clearTimeout(timer);
}, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin") return "Dashboard";
    if (path.includes("/products")) return "Products";
    if (path.includes("/categories")) return "Categories";
    if (path.includes("/inventory")) return "Inventory";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/customers")) return "Customers";
    if (path.includes("/coupons")) return "Coupons";
    if (path.includes("/reviews")) return "Reviews";
    if (path.includes("/exchanges")) return "Exchange Requests";
    if (path.includes("/announcement")) return "Announcement Bar";

    return "Admin Panel";
  };

  if (!adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E5DDD8] border-t-[#4B1F1B]" />

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#6B5651]">
            Loading Sirraha Admin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#351C19]">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[80] bg-[#351411]/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ADMIN SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* MAIN AREA */}
      <div className="min-h-screen lg:pl-[260px]">
        {/* MOBILE AND SMALL-SCREEN HEADER */}
        <header className="sticky top-0 z-[60] flex h-[74px] items-center justify-between border-b border-[#F1ECE9] bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
          {/* LEFT SIDE */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin sidebar"
              aria-expanded={sidebarOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E5DDD8] bg-white text-[#4B1F1B] transition hover:border-[#C8A15A]"
            >
              <FiMenu size={20} />
            </button>

            <div className="min-w-0">
              <p className="hidden text-[9px] uppercase tracking-[0.18em] text-[#918477] sm:block">
                Sirraha Administration
              </p>

              <h1 className="truncate font-serif text-xl font-medium text-[#351411] sm:text-2xl">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* RIGHT SIDE: LOGOUT ONLY */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E5DDD8] bg-white text-[#4B1F1B] transition hover:border-[#C8A15A] hover:bg-[#FBF7F1]"
          >
            <FiLogOut size={18} />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-h-[calc(100vh-74px)] lg:min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
