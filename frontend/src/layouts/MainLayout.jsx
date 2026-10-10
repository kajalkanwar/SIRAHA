import { Outlet } from "react-router-dom";
import { useCallback, useState } from "react";

import AnnouncementBar from "../components/home/AnnouncementBar";
import Navbar from "../components/layout/Navbar";
import CartDrawer from "../components/cart/CartDrawer";
import Search from "../pages/Search/Search";

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  // =========================================================
  // OPEN SEARCH
  // =========================================================

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  // =========================================================
  // CLOSE SEARCH
  // =========================================================

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  // =========================================================
  // OPEN SEARCH WITH CATEGORY / QUERY
  // =========================================================

  const openSearchWithQuery = useCallback(
    (query) => {
      setSearchQuery(query);
      setIsSearchOpen(true);
    },
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0]">

      {/* =====================================================
          FIXED GLOBAL HEADER
          
          Announcement + Navbar remain fixed while scrolling.
          
          WE ARE KEEPING YOUR EXISTING HEADER ARCHITECTURE.
      ===================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-[300]
          w-full
        "
      >

        {/* ===================================================
            ANNOUNCEMENT BAR
        =================================================== */}

        <AnnouncementBar />

        {/* ===================================================
            NAVBAR
        =================================================== */}

        <Navbar
          isSearchOpen={isSearchOpen}
          onSearchOpen={openSearch}
          onSearchClose={closeSearch}
          onSearchCategory={openSearchWithQuery}
        />

        {/* ===================================================
            SEARCH PANEL

            Search is INSIDE the fixed header.

            This means it appears directly below Navbar
            instead of sitting behind / underneath it.
        =================================================== */}

        <Search
  key={`${isSearchOpen}-${searchQuery}`}
  isOpen={isSearchOpen}
  onClose={closeSearch}
  initialQuery={searchQuery}
/>

      </header>

      {/* =====================================================
          PAGE CONTENT

          Your existing header spacing is preserved.

          Mobile:
          Announcement ≈ 34px
          Navbar ≈ 58px
          Total ≈ 92px

          Desktop:
          Announcement ≈ 39px
          Navbar ≈ 70px
          Desktop navigation ≈ 44px
          Total ≈ 153px
      ===================================================== */}

      <main
        className="
          w-full
          min-w-0
          pt-[92px]
          sm:pt-[96px]
          md:pt-[153px]
          lg:pt-[153px]
        "
      >
        <Outlet />
      </main>

      {/* =====================================================
          CART DRAWER

          Remains outside page content so it can appear above
          the entire website.
      ===================================================== */}

      <CartDrawer />

    </div>
  );
}

export default MainLayout;