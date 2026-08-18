import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  shopLinks,
  categoryLinks,
} from "../../constants/sidebarLinks";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[390px] max-w-[90%] bg-[#F8F4EC] z-50 overflow-y-auto transition-transform duration-500 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end pt-6 pr-6">
          <button
            onClick={onClose}
            className="w-10 h-10 border border-[#D4B768] flex items-center justify-center text-[#5A5A5A] hover:bg-[#D4B768] hover:text-white transition duration-300"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="px-6 pb-16">

          {/* SHOP */}
          <h5 className="uppercase tracking-[5px] text-[13px] text-gray-500 mb-10">
            Shop
          </h5>

          <div>

            {shopLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={onClose}
                className="block py-5 border-b border-[#E8DDC9] text-[25px] font-serif text-[#1F1F1F] hover:text-[#0E5B3B] transition duration-300"
              >
                {link.name}
              </Link>
            ))}

          </div>

          {/* Categories */}

          <div className="mt-16">

            <h5 className="uppercase tracking-[5px] text-[13px] text-gray-500 mb-8">
              Categories
            </h5>

            <div className="space-y-5">

              {categoryLinks.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  onClick={onClose}
                  className="block text-[19px] text-[#555555] hover:text-[#0E5B3B] transition duration-300"
                >
                  {category.name}
                </Link>
              ))}

            </div>

          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;