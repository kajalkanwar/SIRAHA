import { NavLink } from "react-router-dom";
import {
  FiBell,
  FiBox,
  FiChevronRight,
  FiClipboard,
  FiGrid,
  FiLogOut,
  FiMessageSquare,
  FiPercent,
  FiTag,
  FiTruck,
  FiUserCheck,
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
        className={`fixed inset-0 z-[89] bg-[#17110F]/55 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex h-[100dvh] w-[260px] max-w-[85vw] flex-col overflow-hidden border-r border-[#D5C4A5]/15 bg-[#30211D] text-[#FFFFFF] shadow-[12px_0_45px_rgba(35,23,19,0.18)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[92px] shrink-0 items-center justify-between border-b border-[#FFFFFF]/10 px-6">
          <div>
            <div className="font-['Cormorant_Garamond'] text-[32px] font-medium leading-none tracking-[0.09em] text-[#FFFFFF]">
              Sirraha
            </div>

            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.25em] text-[#CBB58B]">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#CBB58B] transition-colors duration-200 hover:bg-[#45302A] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CBB58B] lg:hidden"
          >
            <FiX size={20} strokeWidth={1.6} />
          </button>
        </div>

        {/* Scrollable navigation */}
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
              <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.23em] text-[#CBB58B]/75">
                {group.title}
              </p>

              <nav
                className="space-y-1"
                aria-label={group.title}
              >
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group relative flex min-h-[44px] items-center gap-3 rounded-lg border px-3 py-2.5 text-[12px] font-medium transition-all duration-200 ${
                          isActive
                            ? "border-[#CBB58B]/25 bg-[#49332C] text-[#FFFFFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
                            : "border-transparent text-[#E8DED2]/80 hover:border-[#CBB58B]/15 hover:bg-[#3D2B25] hover:text-[#FFFFFF]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-r bg-[#CBB58B]" />
                          )}

                          <Icon
                            size={17}
                            strokeWidth={1.6}
                            className={`shrink-0 transition-colors duration-200 ${
                              isActive
                                ? "text-[#D8C39C]"
                                : "text-[#CBBBAA]/80 group-hover:text-[#D8C39C]"
                            }`}
                          />

                          <span className="min-w-0 flex-1 leading-5">
                            {item.label}
                          </span>

                          <FiChevronRight
                            size={14}
                            strokeWidth={1.5}
                            className={`shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${
                              isActive
                                ? "text-[#D8C39C]"
                                : "text-transparent group-hover:text-[#CBB58B]/80"
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

        {/* Brand message and logout */}
        <div className="shrink-0 border-t border-[#FFFFFF]/10 bg-[#30211D] px-5 py-4">
          <div className="mb-4 text-center">
            <FiTag
              size={17}
              strokeWidth={1.5}
              className="mx-auto mb-2 text-[#CBB58B]"
            />

            <p className="font-['Cormorant_Garamond'] text-[17px] font-medium text-[#FFFFFF]">
              Timeless Styles
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#CBB58B]/75">
              For Modern Women
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-[41px] w-full items-center justify-center gap-2 rounded-lg border border-[#FFFFFF]/15 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.13em] text-[#E8DED2]/85 transition-all duration-200 hover:border-[#CBB58B]/40 hover:bg-[#49332C] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CBB58B]"
          >
            <FiLogOut size={14} strokeWidth={1.6} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
