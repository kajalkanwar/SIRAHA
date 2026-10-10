import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HiOutlineBars3 } from "react-icons/hi2";

import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
} from "react-icons/fi";

import Sidebar from "./Sidebar";
import { useCart } from "../../hooks/useCart";

function Navbar({
  onSearchOpen,
  onSearchCategory,
}) {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isCategoryOpen, setIsCategoryOpen] =
    useState(false);

  const navigate = useNavigate();

  // =========================================================
  // CART
  // =========================================================

  const {
    cartCount,
    openCart,
  } = useCart();

  // =========================================================
  // MAIN NAVIGATION
  // =========================================================

  const mainNavigation = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "All Collection",
      path: "/collection",
    },
    {
      label: "New Arrivals",
      path: "/collection?type=new-arrivals",
    },
    {
      label: "Best Sellers",
      path: "/collection?type=best-sellers",
    },
    {
      label: "Track Order",
      path: "/track-order",
    },
  ];

  // =========================================================
  // SIRRAHA CATEGORIES
  // =========================================================

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

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchClick = () => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    if (onSearchOpen) {
      onSearchOpen();
    }
  };

  // =========================================================
  // SEARCH CATEGORY
  // =========================================================

  const handleCategorySearch = (category) => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    if (onSearchCategory) {
      onSearchCategory(category);
      return;
    }

    // Fallback only if search callback hasn't been connected yet.
    navigate(category.path);
  };

  // =========================================================
  // ACCOUNT
  // =========================================================

  const handleAccountClick = () => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (path) => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    // -------------------------------------------------------
    // SEARCH LINKS
    // -------------------------------------------------------
    // This catches old /search?q=... links coming from the
    // mobile Sidebar or anywhere else using this function.
    // Instead of opening a new page, we open the new search
    // panel on the homepage.
    // -------------------------------------------------------

    if (path.startsWith("/search")) {
      const searchQuery =
        new URLSearchParams(
          path.split("?")[1] || ""
        ).get("q");

      if (onSearchCategory && searchQuery) {
        onSearchCategory(
          decodeURIComponent(searchQuery)
        );

        return;
      }

      if (onSearchOpen) {
        onSearchOpen();
        return;
      }
    }

    navigate(path);
  };

  // =========================================================
  // OPEN CART
  // =========================================================

  const handleCartClick = () => {
    setIsCategoryOpen(false);
    setIsSidebarOpen(false);

    openCart();
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className="
          relative
          z-[100]
          w-full
          border-b
          border-[#DED4C4]
          bg-[#FAF7F0]/95
          shadow-[0_4px_24px_rgba(67,35,28,0.05)]
          backdrop-blur-xl
        "
      >
        {/* ===================================================
            TOP NAVIGATION
        =================================================== */}

        <div
          className="
            relative
            mx-auto
            flex
            h-[58px]
            w-full
            items-center
            justify-center
            px-14
            sm:h-[62px]
            sm:px-20
            md:h-[66px]
            md:px-24
            lg:h-[68px]
            lg:px-32
            xl:h-[70px]
          "
        >
          {/* =================================================
              MOBILE HAMBURGER
              ONLY MOBILE
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(true)
            }
            aria-label="Open menu"
            className="
              absolute
              left-3
              top-1/2
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              text-[#43231C]
              transition-all
              duration-300
              hover:bg-[#F2EBDD]
              sm:left-5
              md:hidden
            "
          >
            <HiOutlineBars3
              className="
                h-[20px]
                w-[20px]
                stroke-[1.35]
                sm:h-[21px]
                sm:w-[21px]
              "
            />
          </button>

          {/* =================================================
              CENTER SIRRAHA LOGO
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
            className="
              group
              flex
              min-w-0
              items-center
              justify-center
              border-none
              bg-transparent
              p-0
              outline-none
            "
          >
            <span
              className="
                font-['Cormorant_Garamond']
                text-[24px]
                font-medium
                leading-none
                tracking-[0.22em]
                text-[#5A3026]
                transition-colors
                duration-300
                group-hover:text-[#43231C]
                sm:text-[27px]
                sm:tracking-[0.26em]
                md:text-[29px]
                md:tracking-[0.28em]
                lg:text-[30px]
                lg:tracking-[0.30em]
              "
            >
              SIRRAHA
            </span>
          </button>

          {/* =================================================
              RIGHT ACTION ICONS
          ================================================= */}

          <div
            className="
              absolute
              right-2
              top-1/2
              flex
              -translate-y-1/2
              items-center
              gap-1
              sm:right-4
              sm:gap-1.5
              md:right-6
              md:gap-2
              lg:right-9
              lg:gap-3
              xl:right-12
            "
          >
            {/* =================================================
                SEARCH
            ================================================= */}

            <button
              type="button"
              aria-label="Open search"
              onClick={handleSearchClick}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#43231C]
                transition-all
                duration-300
                hover:bg-[#F2EBDD]
                hover:text-[#5A3026]
                sm:h-10
                sm:w-10
              "
            >
              <FiSearch
                className="
                  h-[17px]
                  w-[17px]
                  stroke-[1.45]
                  sm:h-[18px]
                  sm:w-[18px]
                  md:h-[19px]
                  md:w-[19px]
                "
              />
            </button>

            {/* =================================================
                ACCOUNT
            ================================================= */}

            <button
              type="button"
              aria-label="Account"
              onClick={handleAccountClick}
              className="
                hidden
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#43231C]
                transition-all
                duration-300
                hover:bg-[#F2EBDD]
                hover:text-[#5A3026]
                sm:flex
                sm:h-10
                sm:w-10
              "
            >
              <FiUser
                className="
                  h-[17px]
                  w-[17px]
                  stroke-[1.45]
                  sm:h-[18px]
                  sm:w-[18px]
                "
              />
            </button>

            {/* =================================================
                SHOPPING BAG
            ================================================= */}

            <button
              type="button"
              aria-label="Open shopping bag"
              onClick={handleCartClick}
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#43231C]
                transition-all
                duration-300
                hover:bg-[#F2EBDD]
                hover:text-[#5A3026]
                sm:h-10
                sm:w-10
              "
            >
              <FiShoppingBag
                className="
                  h-[18px]
                  w-[18px]
                  stroke-[1.45]
                  sm:h-[19px]
                  sm:w-[19px]
                "
              />

              {/* CART BADGE */}

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-[15px]
                    min-w-[15px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#C8A15A]
                    px-1
                    font-['Poppins']
                    text-[7px]
                    font-semibold
                    leading-none
                    text-[#3A2A20]
                    sm:right-0.5
                    sm:top-0.5
                    sm:h-[16px]
                    sm:min-w-[16px]
                    sm:text-[8px]
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            DESKTOP / TABLET NAVIGATION
            MOBILE HIDDEN
        ===================================================== */}

        <div
          className="
            hidden
            border-t
            border-[#DED4C4]
            md:block
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-[44px]
              w-full
              items-center
              justify-center
              gap-4
              overflow-visible
              px-4
              lg:gap-6
              xl:gap-8
            "
          >
            {/* =================================================
                MAIN NAV LINKS
            ================================================= */}

            {mainNavigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleNavigation(item.path)
                }
                className="
                  group
                  relative
                  shrink-0
                  py-3
                  font-['Poppins']
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[1.4px]
                  text-[#5A3026]
                  transition-colors
                  duration-300
                  hover:text-[#A98243]
                  lg:text-[9px]
                  lg:tracking-[1.8px]
                "
              >
                {item.label}

                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-[#C8A15A]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </button>
            ))}

            {/* =================================================
                CATEGORIES DROPDOWN
            ================================================= */}

            <div
              className="
                relative
                shrink-0
              "
              onMouseEnter={() =>
                setIsCategoryOpen(true)
              }
              onMouseLeave={() =>
                setIsCategoryOpen(false)
              }
            >
              <button
                type="button"
                onClick={() =>
                  setIsCategoryOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-1.5
                  py-3
                  font-['Poppins']
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[1.4px]
                  text-[#5A3026]
                  transition-colors
                  duration-300
                  hover:text-[#A98243]
                  lg:text-[9px]
                  lg:tracking-[1.8px]
                "
                aria-expanded={
                  isCategoryOpen
                }
                aria-haspopup="true"
              >
                <span>
                  Categories
                </span>

                <FiChevronDown
                  size={12}
                  strokeWidth={1.4}
                  className={`
                    transition-transform
                    duration-300
                    ${
                      isCategoryOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    bg-[#C8A15A]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </button>

              {/* =================================================
                  DROPDOWN PANEL
              ================================================= */}

              {isCategoryOpen && (
                <div
                  className="
                    absolute
                    left-1/2
                    top-full
                    z-[120]
                    w-[300px]
                    -translate-x-1/2
                    pt-2
                  "
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-b-2xl
                      border
                      border-[#DED4C4]/80
                      bg-[#FFFDF9]/85
                      shadow-[0_18px_50px_rgba(67,35,28,0.12)]
                      backdrop-blur-2xl
                    "
                  >
                    {/* DROPDOWN HEADER */}

                    <div
                      className="
                        border-b
                        border-[#DED4C4]
                        px-5
                        py-4
                      "
                    >
                      <p
                        className="
                          font-['Poppins']
                          text-[7px]
                          font-medium
                          uppercase
                          tracking-[2.5px]
                          text-[#A98243]
                        "
                      >
                        Explore Categories
                      </p>
                    </div>

                    {/* CATEGORY ITEMS */}

                    <div className="grid grid-cols-2">
                      {categories.map(
                        (category) => (
                          <button
                            key={
                              category.label
                            }
                            type="button"
                            onClick={() =>
                              handleCategorySearch(
                                category
                              )
                            }
                            className="
                              group
                              flex
                              items-center
                              justify-between
                              border-b
                              border-r
                              border-[#DED4C4]/70
                              px-4
                              py-4
                              text-left
                              transition-all
                              duration-300
                              hover:bg-[#F2EBDD]/80
                            "
                          >
                            <span
                              className="
                                font-['Cormorant_Garamond']
                                text-[16px]
                                leading-tight
                                text-[#5A3026]
                                transition-colors
                                duration-300
                                group-hover:text-[#A98243]
                              "
                            >
                              {
                                category.label
                              }
                            </span>

                            <span
                              className="
                                ml-2
                                text-[12px]
                                text-[#C8A15A]
                                opacity-0
                                transition-all
                                duration-300
                                group-hover:translate-x-0.5
                                group-hover:opacity-100
                              "
                            >
                              →
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* =======================================================
          MOBILE SIDEBAR
      ======================================================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() =>
          setIsSidebarOpen(false)
        }
        categories={categories}
        mainNavigation={mainNavigation}
        onNavigate={handleNavigation}
      />
    </>
  );
}

export default Navbar;