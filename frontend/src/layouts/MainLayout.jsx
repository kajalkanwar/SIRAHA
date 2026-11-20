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
  <div className="min-h-screen w-full bg-white">
    {/* Fixed announcement bar and navbar */}
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-[300]
        w-full
      "
    >
      <AnnouncementBar />

      <Navbar
        isSearchOpen={isSearchOpen}
        onSearchOpen={openSearch}
        onSearchClose={closeSearch}
        onSearchCategory={openSearchWithQuery}
      />

      <Search
        key={`${isSearchOpen}-${searchQuery}`}
        isOpen={isSearchOpen}
        onClose={closeSearch}
        initialQuery={searchQuery}
      />
    </header>

    {/* Keep page content below the fixed header */}
    <main
      className="
        w-full
        min-w-0
        bg-white
        pt-[92px]
        sm:pt-[96px]
        md:pt-[153px]
        lg:pt-[153px]
      "
    >
      <Outlet />
    </main>

    <CartDrawer />
  </div>
);
}

export default MainLayout;