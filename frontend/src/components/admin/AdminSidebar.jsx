
import { NavLink } from "react-router-dom";
import {
  FiBell,
  FiBox,
  FiChevronRight,
  FiClipboard,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiMessageSquare,
  FiPercent,
  FiTag,
  FiTruck,
  FiUserCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: FiGrid,
        end: true,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        path: "/admin/products",
        icon: FiBox,
      },
      {
        label: "Categories",
        path: "/admin/categories",
        icon: FiLayers,
      },
      {
        label: "Inventory",
        path: "/admin/inventory",
        icon: FiClipboard,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        label: "Orders",
        path: "/admin/orders",
        icon: FiTruck,
      },
      {
        label: "Customers",
        path: "/admin/customers",
        icon: FiUsers,
      },
      {
        label: "Coupons",
        path: "/admin/coupons",
        icon: FiPercent,
      },
    ],
  },
  {
    title: "Customer",
    items: [
      {
        label: "Reviews",
        path: "/admin/reviews",
        icon: FiMessageSquare,
      },
      {
        label: "Exchange Requests",
        path: "/admin/exchanges",
        icon: FiUserCheck,
      },
    ],
  },
  {
    title: "Store",
    items: [
      {
        label: "Announcement Bar",
        path: "/admin/announcements",
        icon: FiBell,
      },
    ],
  },
];

function AdminSidebar({ isOpen, onClose, onLogout }) {
  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-[89] bg-[#21120F]/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex h-[100dvh] w-[260px] max-w-[85vw] flex-col overflow-hidden border-r border-[#C8A15A]/15 bg-[#43231C] text-[#FFFDF9] shadow-[10px_0_50px_rgba(67,35,28,0.16)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[92px] shrink-0 items-center justify-between border-b border-[#FFFDF9]/10 px-6">
          <div>
            <div className="font-['Cormorant_Garamond'] text-[31px] font-medium leading-none tracking-[0.08em] text-[#FFFDF9]">
              Sirraha
            </div>

            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.28em] text-[#D8BD83]">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#D8BD83] transition-colors hover:bg-[#5A3026] hover:text-[#FFFDF9] lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable navigation — scrollbar hidden */}
        <div
          className="admin-sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-6"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {navigationGroups.map((group) => (
            <div key={group.title} className="mb-7 last:mb-2">
              <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#D8BD83]/70">
                {group.title}
              </p>

              <nav className="space-y-1" aria-label={group.title}>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group relative flex min-h-[44px] items-center gap-3 rounded-md border px-3 py-2.5 text-[12px] font-medium transition-all duration-200 ${
                          isActive
                            ? "border-[#C8A15A]/35 bg-[#5A3026] text-[#FFFDF9] shadow-sm"
                            : "border-transparent text-[#F2EBDD]/80 hover:border-[#C8A15A]/20 hover:bg-[#5A3026]/70 hover:text-[#FFFDF9]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-r bg-[#D8BD83]" />
                          )}

                          <Icon
                            size={17}
                            strokeWidth={1.7}
                            className={`shrink-0 ${
                              isActive
                                ? "text-[#D8BD83]"
                                : "text-[#F2EBDD]/80 group-hover:text-[#D8BD83]"
                            }`}
                          />

                          <span className="min-w-0 flex-1 leading-5">
                            {item.label}
                          </span>

                          <FiChevronRight
                            size={14}
                            className={`shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${
                              isActive
                                ? "text-[#D8BD83]"
                                : "text-[#D8BD83]/0 group-hover:text-[#D8BD83]/70"
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom brand message and logout remain fixed */}
        <div className="shrink-0 border-t border-[#FFFDF9]/10 bg-[#43231C] px-5 py-4">
          <div className="mb-4 text-center">
            <FiTag
              size={17}
              className="mx-auto mb-2 text-[#C8A15A]"
            />

            <p className="font-['Cormorant_Garamond'] text-[16px] text-[#FFFDF9]/95">
              Timeless Styles
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#D8BD83]/75">
              For Modern Women
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-md border border-[#FFFDF9]/15 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#F2EBDD]/80 transition-all hover:border-[#C8A15A]/50 hover:bg-[#5A3026] hover:text-[#FFFDF9]"
          >
            <FiLogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
