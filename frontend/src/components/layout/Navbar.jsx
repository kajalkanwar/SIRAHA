
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HiOutlineBars3 } from "react-icons/hi2";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
} from "react-icons/fi";

import Sidebar from "./Sidebar";
import { useCart } from "../../hooks/useCart";

function Navbar({ onSearchOpen, onSearchCategory }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const navigate = useNavigate();

  const { cartCount, openCart } = useCart();

  // MAIN NAVIGATION
  const mainNavigation = [
    { label: "Home", path: "/" },
    { label: "All Collection", path: "/collection" },
    { label: "New Arrivals", path: "/collection?type=new-arrivals" },
    { label: "Best Sellers", path: "/collection?type=best-sellers" },
    { label: "Track Order", path: "/track-order" },
  ];

  // SIRRAHA CATEGORIES
  const categories = [
    {
      label: "Short Kurtis",
      path: "/search?q=Short%20Kurtis",
      searchQuery: "Short Kurtis",
    },
    {
      label: "Long Kurtis",
      path: "/search?q=Long%20Kurtis",
      searchQuery: "Long Kurtis",
    },
    {
      label: "Co-ord Sets",
      path: "/search?q=Co-ord%20Sets",
      searchQuery: "Co-ord Sets",
    },
    {
      label: "Tops",
      path: "/search?q=Tops",
      searchQuery: "Tops",
    },
    {
      label: "Palazzos",
      path: "/search?q=Palazzos",
      searchQuery: "Palazzos",
    },
    {
      label: "Farshi Salwar Suit",
      path: "/search?q=Farshi%20Salwar%20Suit",
      searchQuery: "Farshi Salwar Suit",
    },
  ];

  // SEARCH
  const handleSearchClick = () => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    if (onSearchOpen) {
      onSearchOpen();
    }
  };

  // SEARCH BY CATEGORY
  const handleCategorySearch = (category) => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    if (onSearchCategory) {
      onSearchCategory(category.searchQuery || category.label);
      return;
    }

    navigate(category.path);
  };

  // ACCOUNT
  const handleAccountClick = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  // NAVIGATION
  const handleNavigation = (path) => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    if (path.startsWith("/search")) {
      const searchQuery = new URLSearchParams(
        path.split("?")[1] || ""
      ).get("q");

      if (onSearchCategory && searchQuery) {
        onSearchCategory(decodeURIComponent(searchQuery));
        return;
      }

      if (onSearchOpen) {
        onSearchOpen();
        return;
      }
    }

    navigate(path);
  };

  // CART
  const handleCartClick = () => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);
    openCart();
  };

  return (
    <>
      <nav className="relative z-[100] m-0 w-full bg-white">
        {/* TOP ROW: LOGO AND ACTION ICONS */}
        <div
          className="
            relative mx-auto flex w-full items-center justify-center
  h-[48px] px-4
  sm:h-[52px] sm:px-6
  md:h-[60px] md:px-8
  lg:h-[64px] lg:px-12
  xl:h-[68px]
          "
        >
          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            className="
              absolute left-3 top-1/2 z-[320]
              flex h-10 w-10 -translate-y-1/2
              items-center justify-center
              text-[#4B1F1B] transition-colors
              hover:text-[#A98243]
              sm:left-5 md:hidden
            "
          >
            <HiOutlineBars3 className="h-[22px] w-[22px] stroke-[1.3]" />
          </button>

          {/* CENTERED SIRRAHA LOGO */}
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
            className="
              group flex min-w-0 items-center justify-center
              border-0 bg-transparent p-0 outline-none
            "
          >
            <span
              className="
                whitespace-nowrap
                font-['Cormorant_Garamond',serif]
                text-[29px] font-medium leading-none
                tracking-[0.22em] text-[#4B1F1B]
                transition-colors duration-300
                group-hover:text-[#69352D]
                sm:text-[32px] sm:tracking-[0.24em]
                md:text-[37px] md:tracking-[0.27em]
                lg:text-[40px] lg:tracking-[0.30em]
              "
            >
              SIRRAHA
            </span>
          </button>

          {/* RIGHT ACTION ICONS */}
          <div
            className="
              absolute right-2 top-1/2 flex
              -translate-y-1/2 items-center gap-1
              sm:right-4 sm:gap-2
              md:right-7 md:gap-3
              lg:right-10 lg:gap-4
              xl:right-12
            "
          >
            {/* SEARCH */}
            <button
              type="button"
              aria-label="Open search"
              onClick={handleSearchClick}
              className="
                flex h-9 w-9 items-center justify-center
                text-[#4B1F1B] transition-colors
                hover:text-[#A98243]
                sm:h-10 sm:w-10
              "
            >
              <FiSearch className="h-[19px] w-[19px] stroke-[1.4] sm:h-5 sm:w-5" />
            </button>

            {/* ACCOUNT */}
            <button
              type="button"
              aria-label="Account"
              onClick={handleAccountClick}
              className="
                hidden h-9 w-9 items-center justify-center
                text-[#4B1F1B] transition-colors
                hover:text-[#A98243]
                sm:flex sm:h-10 sm:w-10
              "
            >
              <FiUser className="h-[19px] w-[19px] stroke-[1.4] sm:h-5 sm:w-5" />
            </button>

            {/* CART */}
            <button
              type="button"
              aria-label="Open shopping bag"
              onClick={handleCartClick}
              className="
                relative flex h-9 w-9 items-center justify-center
                text-[#4B1F1B] transition-colors
                hover:text-[#A98243]
                sm:h-10 sm:w-10
              "
            >
              <FiShoppingBag className="h-[20px] w-[20px] stroke-[1.4]" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute right-0 top-0 flex
                    h-[16px] min-w-[16px] items-center
                    justify-center rounded-full
                    bg-[#C8A15A] px-1
                    font-['Poppins',sans-serif]
                    text-[9px] font-medium leading-none
                    text-white
                    sm:right-0.5 sm:top-0.5
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP NAVIGATION: NO DIVIDER LINE */}
        <div className="hidden bg-white md:block">
          <div
            className="
              mx-auto flex min-h-[38px] w-full
              items-center justify-center
              gap-5 overflow-visible px-4
              lg:gap-8 lg:px-8
              xl:gap-10 xl:px-12
              2xl:gap-12
            "
          >
            {/* MAIN LINKS */}
            {mainNavigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className="
                  shrink-0 whitespace-nowrap
                  py-2
                  font-['Poppins',sans-serif]
                  text-[10px] font-normal uppercase
                  tracking-[1.5px] text-[#4B1F1B]
                  transition-colors duration-200
                  hover:text-[#A98243]
                  lg:text-[11px] lg:tracking-[1.7px]
                "
              >
                {item.label}
              </button>
            ))}

            {/* CATEGORIES DROPDOWN */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoryOpen((previous) => !previous)}
                className="
                  flex items-center gap-2 whitespace-nowrap
                  py-4
                  font-['Poppins',sans-serif]
                  text-[10px] font-normal uppercase
                  tracking-[1.5px] text-[#4B1F1B]
                  transition-colors duration-200
                  hover:text-[#A98243]
                  lg:text-[11px] lg:tracking-[1.7px]
                "
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
              >
                Categories
              </button>


{/* CATEGORIES DROPDOWN — REFINED FROSTED GLASS */}
{isCategoryOpen && (
  <div
    className="
      absolute
      left-0
      top-full
      z-[320]
      w-[260px]
      pt-2
    "
  >
    <div
      className="
        w-full
        overflow-hidden
        rounded-b-md
        border border-white/40
        bg-[#FFFDFB]/80
        shadow-[0_10px_30px_rgba(53,20,17,0.10)]
        backdrop-blur-xl
      "
    >
      {categories.map((category, index) => (
        <button
          key={category.label}
          type="button"
          onClick={() => handleCategorySearch(category)}
          className={`
            flex
            w-full
            items-center
            px-7
            py-3
            text-left
            font-['Poppins',sans-serif]
            text-[14px]
            font-normal
            leading-[1.5]
            tracking-[0.1px]
            text-[#4B1F1B]
            transition-all
            duration-200
            hover:bg-white/60
            hover:pl-8
            hover:text-[#A98243]
            ${
              index !== categories.length - 1
                ? "border-b border-[#4B1F1B]/[0.05]"
                : ""
            }
          `}
        >
          {category.label}
        </button>
      ))}
    </div>
  </div>
)}


            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        mainNavigation={mainNavigation}
        onNavigate={handleNavigation}
      />
    </>
  );
}

export default Navbar;
