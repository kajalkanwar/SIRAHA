import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HiOutlineBars3 } from "react-icons/hi2";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
} from "react-icons/fi";

import Sidebar from "./Sidebar";

function Navbar({ showCategoryNav = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* ================= MAIN NAVBAR ================= */}

      <nav className="relative z-50 w-full bg-[#F8F4EC] border-b border-[#E8E1D5]">

        <div
          className="
            relative
            h-[64px]
            sm:h-[72px]
            lg:h-[82px]
          "
        >

          {/* ================= LEFT - MENU ================= */}

          <div
            className="
              absolute
              left-4
              sm:left-6
              lg:left-12
              top-1/2
              -translate-y-1/2
            "
          >
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="
                flex
                items-center
                justify-center
                text-[#1F2937]
                hover:text-[#0E5B3B]
                transition-colors
              "
            >
              <HiOutlineBars3
                className="
                  w-6 h-6
                  sm:w-7 sm:h-7
                "
              />
            </button>
          </div>


          {/* ================= CENTER - LOGO ================= */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              className="
                whitespace-nowrap
                font-serif
                font-normal
                text-[#0E5B3B]
                text-[28px]
                sm:text-[32px]
                lg:text-[38px]
                tracking-[6px]
                sm:tracking-[8px]
                lg:tracking-[10px]
                leading-none
              "
            >
              SIRRAHA
            </button>
          </div>


          {/* ================= RIGHT - ICONS ================= */}

          <div
            className="
              absolute
              right-4
              sm:right-6
              lg:right-12
              top-1/2
              -translate-y-1/2
              flex
              items-center
              gap-3
              sm:gap-4
              lg:gap-5
            "
          >

            {/* SEARCH */}

            <button
              type="button"
              aria-label="Search"
              className="
                flex
                items-center
                justify-center
                text-[#1F2937]
                hover:text-[#0E5B3B]
                transition-colors
              "
            >
              <FiSearch
                className="
                  w-5 h-5
                  sm:w-[22px] sm:h-[22px]
                "
              />
            </button>


            {/* ACCOUNT */}

            <button
              type="button"
              aria-label="Account"
              onClick={() => navigate("/login")}
              className="
                flex
                items-center
                justify-center
                w-9
                h-9
                sm:w-10
                sm:h-10
                border
                border-[#C9A24A]
                rounded-[4px]
                text-[#1F2937]
                hover:text-[#0E5B3B]
                transition-colors
              "
            >
              <FiUser
                className="
                  w-[19px] h-[19px]
                  sm:w-[21px] sm:h-[21px]
                "
              />
            </button>


            {/* SHOPPING BAG */}

            <button
              type="button"
              aria-label="Shopping bag"
              className="
                flex
                items-center
                justify-center
                text-[#1F2937]
                hover:text-[#0E5B3B]
                transition-colors
              "
            >
              <FiShoppingBag
                className="
                  w-5 h-5
                  sm:w-[22px] sm:h-[22px]
                "
              />
            </button>

          </div>

        </div>


        {/* ================= CATEGORY NAVIGATION ================= */}

        {showCategoryNav && (
          <div
            className="
              hidden
              lg:flex
              w-full
              h-[64px]
              items-center
              justify-center
              border-t
              border-[#E8E1D5]
            "
          >
            {/* Category navigation can remain here for HOME only */}
          </div>
        )}

      </nav>


      {/* ================= SIDEBAR ================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default Navbar;

