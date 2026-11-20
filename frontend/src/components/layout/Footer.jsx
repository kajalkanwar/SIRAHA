
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaPhoneAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";

// ============================================================
// SIRRAHA PREMIUM FOOTER
// White background | Burgundy text | Minimal gold accents
// ============================================================

const shopLinks = [
  { name: "All Collection", path: "/collection" },
  { name: "New Arrivals", path: "/collection?type=new-arrivals" },
  { name: "Best Sellers", path: "/collection?type=best-sellers" },
];

const policyLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Exchange Policy", path: "/exchange-policy" },
  { name: "Terms & Conditions", path: "/terms-and-conditions" },
  { name: "Shipping Policy", path: "/shipping-policy" },
];

const helpLinks = [
  { name: "Track Order", path: "/track-order" },
];

const CONTACT_PHONE = "917734931418";
const DISPLAY_PHONE = "+91 7734931418";

const BUSINESS_HOURS = "Mon - Fri · 9:00 AM to 6:00 PM (IST)";

const ADDRESS =
  "34A - Ram Nagar-A, Toll Tax, Goverdhan Nagar, Jaipur";

const INSTAGRAM_URL =
  "https://www.instagram.com/sirrahafashion/";

function Footer() {
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState(null);

  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || CONTACT_PHONE;

  const sirrahaEmail =
    import.meta.env.VITE_SIRRAHA_EMAIL || "sirrahafashion@gmail.com";

  const facebookUrl =
    import.meta.env.VITE_FACEBOOK_URL || "";

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    /\D/g,
    ""
  )}`;

  const phoneUrl = `tel:${CONTACT_PHONE}`;

  const emailUrl = `mailto:${sirrahaEmail}`;

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  const handleAccountClick = (event) => {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");

    navigate(storedUser ? "/account" : "/login");
  };

  const renderLinks = (items) => (
    <div className="flex flex-col items-start gap-3">
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="
            text-left font-['Poppins',sans-serif]
            text-[12px] leading-[1.65]
            text-[#59483D] no-underline
            transition-all duration-200
            hover:translate-x-0.5 hover:text-[#A98243]
            focus-visible:outline focus-visible:outline-1
            focus-visible:outline-[#C8A15A]
          "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );

  const renderHelpLinks = () => (
    <div className="flex flex-col items-start gap-3">
      {helpLinks.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="
            text-left font-['Poppins',sans-serif]
            text-[12px] leading-[1.65]
            text-[#59483D] no-underline
            transition-colors duration-200
            hover:text-[#A98243]
          "
        >
          {item.name}
        </Link>
      ))}

      <Link
        to="/account"
        onClick={handleAccountClick}
        className="
          text-left font-['Poppins',sans-serif]
          text-[12px] leading-[1.65]
          text-[#59483D] no-underline
          transition-colors duration-200
          hover:text-[#A98243]
        "
      >
        My Account
      </Link>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          font-['Poppins',sans-serif]
          text-[12px] leading-[1.65]
          text-[#59483D] no-underline
          transition-colors duration-200
          hover:text-[#A98243]
        "
      >
        WhatsApp Support
      </a>

      <a
        href={phoneUrl}
        className="
          font-['Poppins',sans-serif]
          text-[12px] leading-[1.65]
          text-[#59483D] no-underline
          transition-colors duration-200
          hover:text-[#A98243]
        "
      >
        Call Us
      </a>

      <a
        href={emailUrl}
        className="
          font-['Poppins',sans-serif]
          text-[12px] leading-[1.65]
          text-[#59483D] no-underline
          transition-colors duration-200
          hover:text-[#A98243]
        "
      >
        Email Us
      </a>
    </div>
  );

  // ==========================================================
  // SOCIAL ICON
  // ==========================================================

const socialClass = `
  group
  flex h-8 w-8 shrink-0
  items-center justify-center
  bg-transparent
  border-0
  rounded-none
  text-[#59483D]
  shadow-none
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:bg-transparent
  hover:text-[#A98243]
  hover:shadow-none
  focus-visible:outline
  focus-visible:outline-2
  focus-visible:outline-offset-2
  focus-visible:outline-[#C8A15A]
  active:translate-y-0
`;


  // ==========================================================
  // DESKTOP COLUMN HEADING
  // ==========================================================

  const renderHeading = (title) => (
    <div className="mb-7">
      <h3
        className="
          font-['Cormorant_Garamond',serif]
          text-[18px] font-semibold uppercase
          tracking-[0.18em] text-[#351411]
        "
      >
        {title}
      </h3>

      <span className="mt-3 block h-[2px] w-[31px] bg-[#B89559]" />
    </div>
  );

  // ==========================================================
  // MOBILE ACCORDION SECTION
  // ==========================================================

  const renderMobileSection = (title, sectionKey, children) => {
    const isOpen = openSection === sectionKey;

    return (
      <div className="border-b border-[#EEE8E2] last:border-b-0">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          aria-expanded={isOpen}
          className="
            flex min-h-[54px] w-full
            items-center justify-between gap-4
            py-3 text-left
          "
        >
          <span
            className="
              font-['Cormorant_Garamond',serif]
              text-[16px] font-semibold uppercase
              tracking-[0.16em] text-[#351411]
            "
          >
            {title}
          </span>

          <FaChevronDown
            size={12}
            aria-hidden="true"
            className={`
              shrink-0 text-[#A98243]
              transition-transform duration-300
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        <div
          className={`
            grid transition-[grid-template-rows,opacity]
            duration-300 ease-in-out
            ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div className="pb-5 pt-1">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================
  // CONTACT ITEM
  // ==========================================================

  const contactIconClass = `
    flex h-[38px] w-[38px] shrink-0
    items-center justify-center rounded-full
    border border-[#C8A15A] bg-white
    text-[#4B1F1B]
  `;

  const contactTextClass = `
    min-w-0 break-words
    font-['Poppins',sans-serif]
    text-[11px] leading-[1.8]
    text-[#59483D]
  `;

  const renderContactDetails = () => (
    <div className="flex flex-col gap-5">
      <a
        href={phoneUrl}
        className="group flex items-start gap-3 no-underline"
      >
        <span className={contactIconClass}>
          <FaPhoneAlt size={13} />
        </span>

        <span
          className={`
            ${contactTextClass}
            pt-2 transition-colors
            group-hover:text-[#A98243]
          `}
        >
          {DISPLAY_PHONE}
        </span>
      </a>

      <div className="flex items-start gap-3">
        <span className={contactIconClass}>
          <FaClock size={14} />
        </span>

        <span className={`${contactTextClass} pt-1.5`}>
         {BUSINESS_HOURS}
        </span>
      </div>

      <a
        href="https://www.google.com/maps/search/?api=1&query=34A+Ram+Nagar-A+Toll+Tax+Goverdhan+Nagar+Jaipur"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 no-underline"
      >
        <span className={contactIconClass}>
          <FaMapMarkerAlt size={14} />
        </span>

        <span
          className={`
            ${contactTextClass}
            pt-1.5 transition-colors
            group-hover:text-[#A98243]
          `}
        >
          {ADDRESS}
        </span>
      </a>

      <a
        href={emailUrl}
        className="group flex items-start gap-3 no-underline"
      >
        <span className={contactIconClass}>
          <FaEnvelope size={14} />
        </span>

        <span
          className={`
            ${contactTextClass}
            break-all pt-1.5
            transition-colors
            group-hover:text-[#A98243]
          `}
        >
          {sirrahaEmail}
        </span>
      </a>
    </div>
  );

  // ==========================================================
  // FOOTER
  // ==========================================================

  return (
    <footer className="w-full overflow-hidden bg-white text-[#59483D]">

      {/* ======================================================
          MAIN FOOTER
      ====================================================== */}

      <div
        className="
          mx-auto w-full max-w-[1500px]
          px-5 pb-7 pt-10
          sm:px-8 sm:pb-9 sm:pt-12
          lg:px-10 lg:pb-10 lg:pt-14
          xl:px-[5.5%]
        "
      >
        {/* ====================================================
            DESKTOP LAYOUT
        ==================================================== */}

        <div
          className="
            hidden lg:grid
            grid-cols-[1.55fr_0.8fr_1.05fr_0.95fr_1.25fr]
            gap-x-8 xl:gap-x-12
          "
        >
          {/* BRAND */}

          <div className="pr-2">
            <Link
              to="/"
              className="
                inline-block font-['Cormorant_Garamond',serif]
                text-[40px] font-medium leading-none
                tracking-[0.24em] text-[#351411]
                no-underline transition-colors
                hover:text-[#7B4940]
                xl:text-[43px]
              "
            >
              SIRRAHA
            </Link>

            <GoldOrnament />

            <p
              className="
                mt-4 max-w-[310px]
                font-['Cormorant_Garamond',serif]
                text-[15px] leading-[1.65]
                text-[#59483D]
              "
            >
              Thoughtfully crafted ethnic wear rooted in
              Indian artistry, timeless silhouettes and
              considered details.
            </p>
<br></br>
            <p
              className="
                mb-4 mt-8
                font-['Poppins',sans-serif]
                text-[9px] font-medium uppercase
                tracking-[0.22em] text-[#A98243]
              "
            >
              Follow the Sirraha Edit
            </p>

            <div className="flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sirraha on Instagram"
                className={socialClass}
              >
                <FaInstagram size={17} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sirraha on WhatsApp"
                className={socialClass}
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href={emailUrl}
                aria-label="Email Sirraha"
                className={socialClass}
              >
                <FaEnvelope size={15} />
              </a>

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sirraha on Facebook"
                  className={socialClass}
                >
                  <FaFacebookF size={15} />
                </a>
              )}
            </div>
          </div>

          {/* SHOP */}

          <div>
            {renderHeading("Shop")}
            {renderLinks(shopLinks)}
          </div>

          {/* POLICIES */}

          <div>
            {renderHeading("Policies")}
            {renderLinks(policyLinks)}
          </div>

          {/* HELP */}

          <div>
            {renderHeading("Help")}
            {renderHelpLinks()}
          </div>

          {/* CONTACT */}

          <div>
            {renderHeading("Contact")}
            {renderContactDetails()}
          </div>
        </div>

        {/* ====================================================
            MOBILE AND TABLET LAYOUT
        ==================================================== */}

        <div className="lg:hidden">
          {/* BRAND */}

          <div className="pb-8 text-center">
            <Link
              to="/"
              className="
                inline-block font-['Cormorant_Garamond',serif]
                text-[34px] font-medium leading-none
                tracking-[0.25em] text-[#351411]
                no-underline
              "
            >
              SIRRAHA
            </Link>

            <GoldOrnament centered />

            <p
              className="
                mx-auto mt-4 max-w-[330px]
                font-['Cormorant_Garamond',serif]
                text-[15px] leading-[1.7]
                text-[#59483D]
              "
            >
              Thoughtfully crafted ethnic wear rooted in
              Indian artistry, timeless silhouettes and
              considered details.
            </p>

            <p
              className="
                mb-4 mt-7
                font-['Poppins',sans-serif]
                text-[9px] font-medium uppercase
                tracking-[0.22em] text-[#A98243]
              "
            >
              Follow the Sirraha Edit
            </p>

            <div className="flex items-center justify-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sirraha on Instagram"
                className={socialClass}
              >
                <FaInstagram size={17} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sirraha on WhatsApp"
                className={socialClass}
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href={emailUrl}
                aria-label="Email Sirraha"
                className={socialClass}
              >
                <FaEnvelope size={15} />
              </a>

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sirraha on Facebook"
                  className={socialClass}
                >
                  <FaFacebookF size={15} />
                </a>
              )}
            </div>
          </div>

          {/* ACCORDIONS */}

          <div>
            {renderMobileSection(
              "Shop",
              "shop",
              renderLinks(shopLinks)
            )}

            {renderMobileSection(
              "Policies",
              "policies",
              renderLinks(policyLinks)
            )}

            {renderMobileSection(
              "Help",
              "help",
              renderHelpLinks()
            )}

            {renderMobileSection(
              "Contact",
              "contact",
              renderContactDetails()
            )}
          </div>
        </div>

        {/* ====================================================
            MINIMAL COPYRIGHT AREA
            No brown strip. No made-with-love text.
        ==================================================== */}

        <div className="mt-9 sm:mt-11">
          <div className="mx-auto h-px w-full max-w-[1100px] bg-[#EEE8E2]" />

          <div className="flex justify-center pt-5">
            <p
              className="
                text-center
                font-['Poppins',sans-serif]
                text-[9px] tracking-[0.12em]
                text-[#6B5651]
                sm:text-[10px]
              "
            >
              © {new Date().getFullYear()} Sirraha. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// GOLD ORNAMENT
// ============================================================

function GoldOrnament({ centered = false }) {
  return (
    <div
      aria-hidden="true"
      className={`
        mt-3 flex items-center gap-2.5
        ${centered ? "justify-center" : "justify-start"}
      `}
    >
      <span className="h-px w-[44px] bg-[#B89559]" />
      <span className="text-[11px] leading-none text-[#A98243]">
        ✦
      </span>
      <span className="h-px w-[44px] bg-[#B89559]" />
    </div>
  );
}

export default Footer;