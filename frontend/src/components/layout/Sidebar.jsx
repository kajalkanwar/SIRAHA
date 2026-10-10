import { useEffect, useState } from "react";

import {
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";

function Sidebar({
  isOpen,
  onClose,
  categories = [],
  mainNavigation = [],
  onNavigate,
}) {
  const [isCategoriesOpen, setIsCategoriesOpen] =
    useState(false);

  // =========================================================
  // SOCIAL LINKS
  // =========================================================

  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "";

  const contactEmail =
    import.meta.env.VITE_SIRRAHA_EMAIL || "";

  const instagramUrl =
    "https://www.instagram.com/sirrahafashion/";

  const facebookUrl =
    import.meta.env.VITE_FACEBOOK_URL || "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(
        /\D/g,
        ""
      )}`
    : "";

  // =========================================================
  // LOCK BODY SCROLL WHEN SIDEBAR IS OPEN
  // =========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  // =========================================================
  // CLOSE SIDEBAR
  // =========================================================

  const handleClose = () => {
    setIsCategoriesOpen(false);
    onClose();
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleItemClick = (path) => {
    setIsCategoriesOpen(false);

    if (onNavigate) {
      onNavigate(path);
    } else {
      onClose();
    }
  };

  // =========================================================
  // CATEGORY TOGGLE
  // =========================================================

  const handleCategoryToggle = () => {
    setIsCategoriesOpen(
      (previousState) => !previousState
    );
  };

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[200]
          bg-[#241A15]/20
          backdrop-blur-[5px]
          transition-all
          duration-300
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[210]
          flex
          h-full
          w-[88%]
          max-w-[390px]
          flex-col
          border-r
          border-[#FFFDF9]/30
          bg-[#FAF7F0]/85
          shadow-[10px_0_50px_rgba(67,35,28,0.14)]
          backdrop-blur-2xl
          transition-transform
          duration-500
          ease-out
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
        aria-hidden={!isOpen}
      >
        {/* ===================================================
            SIDEBAR HEADER
        =================================================== */}

        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#DED4C4]
            px-5
            sm:h-[74px]
            sm:px-7
          "
        >
          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              handleItemClick("/")
            }
            className="
              border-none
              bg-transparent
              p-0
              font-['Cormorant_Garamond']
              text-[25px]
              font-medium
              leading-none
              tracking-[0.24em]
              text-[#5A3026]
              sm:text-[28px]
              sm:tracking-[0.27em]
            "
          >
            SIRRAHA
          </button>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#DED4C4]
              bg-[#FFFDF9]/60
              text-[#43231C]
              transition-all
              duration-300
              hover:border-[#C8A15A]
              hover:bg-[#F2EBDD]
            "
          >
            <FiX
              size={18}
              strokeWidth={1.4}
            />
          </button>
        </div>

        {/* ===================================================
            SIDEBAR CONTENT
        =================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6
            sm:px-7
            sm:py-8
          "
        >
          {/* =================================================
              LABEL
          ================================================= */}

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-7
                bg-[#C8A15A]
              "
            />

            <p
              className="
                font-['Poppins']
                text-[8px]
                font-medium
                uppercase
                tracking-[2.8px]
                text-[#A98243]
              "
            >
              Explore Sirraha
            </p>
          </div>

          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <div className="space-y-1">
            {mainNavigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleItemClick(item.path)
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-[#DED4C4]/80
                  px-1
                  py-3.5
                  text-left
                  transition-all
                  duration-300
                  hover:px-2
                  sm:py-4
                "
              >
                <span
                  className="
                    font-['Cormorant_Garamond']
                    text-[20px]
                    leading-none
                    text-[#43231C]
                    transition-colors
                    duration-300
                    group-hover:text-[#A98243]
                    sm:text-[21px]
                  "
                >
                  {item.label}
                </span>

                <FiChevronRight
                  size={16}
                  strokeWidth={1.25}
                  className="
                    text-[#C8A15A]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            ))}
          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleCategoryToggle}
              className="
                flex
                w-full
                items-center
                justify-between
                border-b
                border-[#DED4C4]
                px-1
                py-3.5
                text-left
                sm:py-4
              "
              aria-expanded={isCategoriesOpen}
            >
              <span
                className="
                  font-['Cormorant_Garamond']
                  text-[20px]
                  leading-none
                  text-[#43231C]
                  sm:text-[21px]
                "
              >
                Categories
              </span>

              <FiChevronDown
                size={17}
                strokeWidth={1.25}
                className={`
                  text-[#A98243]
                  transition-transform
                  duration-300
                  ${
                    isCategoriesOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                CATEGORY DROPDOWN
            ================================================= */}

            <div
              className={`
                grid
                overflow-hidden
                transition-all
                duration-500
                ${
                  isCategoriesOpen
                    ? "mt-2 max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div
                className="
                  rounded-xl
                  border
                  border-[#DED4C4]/70
                  bg-[#FFFDF9]/55
                  p-2
                  backdrop-blur-xl
                "
              >
                {categories.map(
                  (category) => (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() =>
                        handleItemClick(
                          category.path
                        )
                      }
                      className="
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-[#DED4C4]/60
                        px-3
                        py-3
                        text-left
                        last:border-b-0
                        sm:py-3.5
                      "
                    >
                      <span
                        className="
                          font-['Poppins']
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[1.4px]
                          text-[#5A3026]
                          transition-colors
                          duration-300
                          group-hover:text-[#A98243]
                          sm:text-[9px]
                          sm:tracking-[1.5px]
                        "
                      >
                        {category.label}
                      </span>

                      <FiChevronRight
                        size={13}
                        strokeWidth={1.3}
                        className="
                          text-[#C8A15A]
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              DECORATIVE DIVIDER
          ================================================= */}

          <div
            className="
              my-7
              flex
              items-center
              gap-3
            "
          >
            <span className="h-px flex-1 bg-[#DED4C4]" />

            <span
              className="
                h-1.5
                w-1.5
                rotate-45
                bg-[#C8A15A]
              "
            />

            <span className="h-px flex-1 bg-[#DED4C4]" />
          </div>

          {/* =================================================
              SOCIAL MEDIA
          ================================================= */}

          <div className="pb-2">
            {/* SOCIAL LABEL */}

            <div
              className="
                mb-4
                text-center
              "
            >
              <p
                className="
                  font-['Poppins']
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[2.4px]
                  text-[#A98243]
                "
              >
                Connect with Sirraha
              </p>
            </div>

            {/* SOCIAL ICONS */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                sm:gap-4
              "
            >
              {/* WHATSAPP */}

              <a
                href={whatsappUrl || undefined}
                target="_blank"
                rel="noreferrer"
                aria-label="Sirraha WhatsApp"
                onClick={(event) => {
                  if (!whatsappUrl) {
                    event.preventDefault();
                  }
                }}
                className={`
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]/50
                  text-[#71655B]
                  shadow-[0_5px_20px_rgba(67,35,28,0.05)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A15A]
                  hover:bg-[#FFFDF9]/80
                  hover:text-[#5A3026]
                  sm:h-11
                  sm:w-11
                  ${
                    !whatsappUrl
                      ? "cursor-default opacity-60"
                      : ""
                  }
                `}
              >
                <FaWhatsapp
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </a>

              {/* INSTAGRAM */}

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Sirraha Instagram"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]/50
                  text-[#71655B]
                  shadow-[0_5px_20px_rgba(67,35,28,0.05)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A15A]
                  hover:bg-[#FFFDF9]/80
                  hover:text-[#5A3026]
                  sm:h-11
                  sm:w-11
                "
              >
                <FaInstagram
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </a>

              {/* EMAIL */}

              <a
                href={
                  contactEmail
                    ? `mailto:${contactEmail}`
                    : undefined
                }
                aria-label="Email Sirraha"
                onClick={(event) => {
                  if (!contactEmail) {
                    event.preventDefault();
                  }
                }}
                className={`
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]/50
                  text-[#71655B]
                  shadow-[0_5px_20px_rgba(67,35,28,0.05)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A15A]
                  hover:bg-[#FFFDF9]/80
                  hover:text-[#5A3026]
                  sm:h-11
                  sm:w-11
                  ${
                    !contactEmail
                      ? "cursor-default opacity-60"
                      : ""
                  }
                `}
              >
                <FaEnvelope
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </a>

              {/* FACEBOOK */}

              <a
                href={facebookUrl || undefined}
                target="_blank"
                rel="noreferrer"
                aria-label="Sirraha Facebook"
                onClick={(event) => {
                  if (!facebookUrl) {
                    event.preventDefault();
                  }
                }}
                className={`
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]/50
                  text-[#71655B]
                  shadow-[0_5px_20px_rgba(67,35,28,0.05)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A15A]
                  hover:bg-[#FFFDF9]/80
                  hover:text-[#5A3026]
                  sm:h-11
                  sm:w-11
                  ${
                    !facebookUrl
                      ? "cursor-default opacity-60"
                      : ""
                  }
                `}
              >
                <FaFacebookF
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================
            SIDEBAR FOOTER
        =================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[#DED4C4]
            px-5
            py-4
            sm:px-7
            sm:py-5
          "
        >
          <p
            className="
              text-center
              font-['Cormorant_Garamond']
              text-[13px]
              italic
              text-[#71655B]
              sm:text-[14px]
            "
          >
            Rooted in Indian craft.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;