import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";

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
    console.error(
      "Unable to read admin user:",
      error
    );

    return null;
  }
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Read the admin user when the component initializes.
   *
   * This avoids calling setState inside useEffect.
   */
  const [adminUser] = useState(getStoredAdminUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * Redirect unauthorized users.
   *
   * No setState is used here.
   */
  useEffect(() => {
    if (!adminUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  }, [adminUser, navigate]);

  /*
   * Close the mobile sidebar whenever the
   * user changes route.
   *
   * We don't need an effect for this anymore because
   * AdminSidebar closes itself when a navigation item
   * is clicked.
   */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin") {
      return "Dashboard";
    }

    if (path.includes("/products")) {
      return "Products";
    }

    if (path.includes("/categories")) {
      return "Categories";
    }

    if (path.includes("/inventory")) {
      return "Inventory";
    }

    if (path.includes("/orders")) {
      return "Orders";
    }

    if (path.includes("/customers")) {
      return "Customers";
    }

    if (path.includes("/coupons")) {
      return "Coupons";
    }

    if (path.includes("/reviews")) {
      return "Reviews";
    }

    if (path.includes("/exchanges")) {
      return "Exchange Requests";
    }

    if (path.includes("/announcement")) {
      return "Announcement Bar";
    }

    return "Admin Panel";
  };

  /*
   * While checking authentication.
   */
  if (!adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0]">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#DED4C4]
              border-t-[#5A3026]
            "
          />

          <p
            className="
              mt-4
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#71655B]
            "
          >
            Loading Sirraha Admin
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#3A2A20]">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-[80]
            bg-[#43231C]/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="min-h-screen lg:pl-[260px]">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header
          className="
            sticky
            top-0
            z-[60]
            h-[74px]
            border-b
            border-[#EAE2D5]
            bg-[#FFFDF9]/95
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              justify-between
              px-4
              sm:px-6
              lg:px-8
            "
          >

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="flex items-center gap-4">

              {/* Mobile menu button */}

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[#DED4C4]
                  bg-[#FAF7F0]
                  text-[#5A3026]
                  transition
                  hover:border-[#C8A15A]
                  hover:bg-[#F2EBDD]
                  lg:hidden
                "
                aria-label="Open admin sidebar"
              >
                <FiMenu size={19} />
              </button>

              {/* Page title */}

              <div>

                <p
                  className="
                    hidden
                    text-[10px]
                    uppercase
                    tracking-[0.22em]
                    text-[#918477]
                    sm:block
                  "
                >
                  Sirraha Administration
                </p>

                <h1
                  className="
                    font-serif
                    text-2xl
                    font-medium
                    text-[#43231C]
                    sm:text-[27px]
                  "
                >
                  {getPageTitle()}
                </h1>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex items-center gap-3 sm:gap-5">

              {/* Notification */}

              <button
                type="button"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[#DED4C4]
                  bg-[#FAF7F0]
                  text-[#5A3026]
                  transition
                  hover:border-[#C8A15A]
                  hover:bg-[#F2EBDD]
                "
                aria-label="Notifications"
              >
                <FiBell size={17} />

                <span
                  className="
                    absolute
                    right-[8px]
                    top-[7px]
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#A98243]
                  "
                />
              </button>

              {/* Desktop admin information */}

              <div className="hidden items-center gap-3 sm:flex">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#5A3026]
                    font-serif
                    text-lg
                    text-[#FFFDF9]
                  "
                >
                  {adminUser.name
                    ?.charAt(0)
                    ?.toUpperCase() || "A"}
                </div>

                <div>

                  <p className="text-sm font-medium text-[#3A2A20]">
                    {adminUser.name || "Admin"}
                  </p>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.14em]
                      text-[#918477]
                    "
                  >
                    Administrator
                  </p>

                </div>

                <FiChevronDown
                  size={15}
                  className="text-[#918477]"
                />

              </div>

              {/* Mobile logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[#DED4C4]
                  bg-[#FAF7F0]
                  text-[#5A3026]
                  transition
                  hover:border-[#C8A15A]
                  hover:bg-[#F2EBDD]
                  sm:hidden
                "
                aria-label="Logout"
              >
                <FiLogOut size={17} />
              </button>

            </div>

          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="min-h-[calc(100vh-74px)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;