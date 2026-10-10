import { Link, useNavigate } from "react-router-dom";

import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaPhoneAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();

  // =========================================================
  // ENVIRONMENT VARIABLES
  // =========================================================

  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "";

  const sirrahaEmail =
    import.meta.env.VITE_SIRRAHA_EMAIL || "";

  const facebookUrl =
    import.meta.env.VITE_FACEBOOK_URL || "#";

  // =========================================================
  // CONTACT DETAILS
  // =========================================================

  const contactPhone = "917734931418";

  const displayPhone = "+91 7734931418";

  const businessHours =
    "Mon - Fri · 9:00 AM to 6:00 PM (IST)";

  const address =
    "34A - Ram Nagar-A, Toll Tax, Goverdhan Nagar, Jaipur";

  // =========================================================
  // SHOP LINKS
  // =========================================================

  const shopLinks = [
    {
      name: "All Collection",
      path: "/collection",
    },
    {
      name: "New Arrivals",
      path: "/collection?type=new-arrivals",
    },
    {
      name: "Best Sellers",
      path: "/collection?type=best-sellers",
    },
  ];

  // =========================================================
  // CURRENT SIRRAHA CATEGORIES
  // =========================================================

  const categoryLinks = [
    {
      name: "Short Kurtis",
      path: "/search?q=Short%20Kurtis",
    },
    {
      name: "Long Kurtis",
      path: "/search?q=Long%20Kurtis",
    },
    {
      name: "Co-ord Sets",
      path: "/search?q=Co-ord%20Sets",
    },
    {
      name: "Tops",
      path: "/search?q=Tops",
    },
    {
      name: "Palazzos",
      path: "/search?q=Palazzos",
    },
    {
      name: "Farshi Salwar Suit",
      path: "/search?q=Farshi%20Salwar%20Suit",
    },
  ];

  // =========================================================
  // ACCOUNT
  // =========================================================

  const handleAccountClick = (event) => {
    event.preventDefault();

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  // =========================================================
  // CONTACT URLS
  // =========================================================

  const activeWhatsappNumber =
    whatsappNumber || contactPhone;

  const whatsappUrl = `https://wa.me/${activeWhatsappNumber.replace(
    /\D/g,
    ""
  )}`;

  const phoneUrl = `tel:${contactPhone}`;

  const emailUrl = sirrahaEmail
    ? `mailto:${sirrahaEmail}`
    : "#";

  const instagramUrl =
    "https://www.instagram.com/sirrahafashion/";

  return (
    <footer
      className="
        w-full
        overflow-hidden
        bg-[#F4EBDD]
        text-[#59483D]
      "
    >
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          pb-9
          pt-10

          sm:px-8
          sm:pb-10
          sm:pt-11

          md:px-10

          lg:px-14
          lg:pb-11
          lg:pt-12

          xl:px-[74px]
        "
      >
        <div
          className="
            grid
            grid-cols-1

            sm:grid-cols-2

            lg:grid-cols-[1.3fr_0.72fr_0.98fr_0.9fr_1.3fr]
          "
        >
          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              border-[#D6C4A6]
              pb-8
              text-center

              sm:col-span-2

              lg:col-span-1
              lg:border-r
              lg:pb-0
              lg:pr-8
              lg:text-left

              xl:pr-10
            "
          >
            {/* LOGO */}

            <Link
              to="/"
              className="
                inline-block
                font-serif
                text-[29px]
                font-medium
                leading-none
                tracking-[0.28em]
                text-[#5A3026]
                transition-colors
                duration-300
                hover:text-[#43231C]

                sm:text-[31px]

                lg:text-[32px]

                xl:text-[34px]
              "
            >
              SIRRAHA
            </Link>

            {/* LOGO ORNAMENT */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-3

                lg:justify-start
              "
            >
              <span
                className="
                  h-px
                  w-[50px]
                  bg-[#B89559]
                "
              />

              <span
                className="
                  text-[10px]
                  text-[#A98243]
                "
              >
                ✦
              </span>

              <span
                className="
                  h-px
                  w-[50px]
                  bg-[#B89559]
                "
              />
            </div>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-4
                max-w-[310px]
                font-['Poppins']
                text-[11px]
                font-normal
                leading-[1.8]
                tracking-[0.01em]
                text-[#71655B]

                lg:mx-0
                lg:max-w-[300px]
                lg:text-[11px]
              "
            >
              Thoughtfully crafted ethnic wear rooted
              in Indian artistry, timeless silhouettes
              and considered details.
            </p>

            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}

            <div className="mt-6">
              <p
                className="
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.26em]
                  text-[#8F6B37]
                "
              >
                Follow the Sirraha Edit
              </p>

              {/* SOCIAL ICONS */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  gap-3

                  lg:justify-start
                "
              >
                {/* INSTAGRAM */}

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sirraha Instagram"
                  className="
                    group
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B89559]
                    bg-transparent
                    text-[#5A3026]
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#C8A15A]
                    hover:bg-[#C8A15A]
                    hover:text-[#FFFDF9]
                  "
                >
                  <FaInstagram
                    size={16}
                    className="
                      text-current
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </a>

                {/* WHATSAPP */}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sirraha WhatsApp"
                  className="
                    group
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B89559]
                    bg-transparent
                    text-[#5A3026]
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#C8A15A]
                    hover:bg-[#C8A15A]
                    hover:text-[#FFFDF9]
                  "
                >
                  <FaWhatsapp
                    size={17}
                    className="
                      text-current
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </a>

                {/* EMAIL */}

                <a
                  href={emailUrl}
                  aria-label="Email Sirraha"
                  className="
                    group
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B89559]
                    bg-transparent
                    text-[#5A3026]
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#C8A15A]
                    hover:bg-[#C8A15A]
                    hover:text-[#FFFDF9]
                  "
                >
                  <FaEnvelope
                    size={15}
                    className="
                      text-current
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </a>

                {/* FACEBOOK */}

                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sirraha Facebook"
                  onClick={(event) => {
                    if (facebookUrl === "#") {
                      event.preventDefault();
                    }
                  }}
                  className={`
                    group
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B89559]
                    bg-transparent
                    text-[#5A3026]
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#C8A15A]
                    hover:bg-[#C8A15A]
                    hover:text-[#FFFDF9]

                    ${
                      facebookUrl === "#"
                        ? "cursor-default opacity-70"
                        : ""
                    }
                  `}
                >
                  <FaFacebookF
                    size={14}
                    className="
                      text-current
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </a>
              </div>
            </div>
          </div>

          {/* =================================================
              SHOP
          ================================================= */}

          <div
            className="
              border-t
              border-[#D6C4A6]
              px-5
              py-7
              text-center

              sm:border-t-0
              sm:px-6

              lg:border-r
              lg:px-6
              lg:py-0
              lg:text-left
            "
          >
            <FooterHeading>
              Shop
            </FooterHeading>

            <FooterLinks
              items={shopLinks}
            />
          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div
            className="
              border-t
              border-[#D6C4A6]
              px-5
              py-7
              text-center

              sm:border-t-0
              sm:px-6

              lg:border-r
              lg:px-6
              lg:py-0
              lg:text-left
            "
          >
            <FooterHeading>
              Categories
            </FooterHeading>

            <FooterLinks
              items={categoryLinks}
            />
          </div>

          {/* =================================================
              HELP
          ================================================= */}

          <div
            className="
              border-t
              border-[#D6C4A6]
              px-5
              py-7
              text-center

              sm:border-t-0
              sm:px-6

              lg:border-r
              lg:px-6
              lg:py-0
              lg:text-left
            "
          >
            <FooterHeading>
              Help
            </FooterHeading>

            <div
              className="
                flex
                flex-col
                gap-3.5
              "
            >
              <FooterTextLink to="/track-order">
                Track Order
              </FooterTextLink>

              <Link
                to="/account"
                onClick={handleAccountClick}
                className="
                  text-[11px]
                  text-[#59483D]
                  transition-colors
                  duration-300
                  hover:text-[#8F6B37]
                "
              >
                My Account
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-[11px]
                  text-[#59483D]
                  transition-colors
                  duration-300
                  hover:text-[#8F6B37]
                "
              >
                WhatsApp Support
              </a>

              <a
                href={phoneUrl}
                className="
                  text-[11px]
                  text-[#59483D]
                  transition-colors
                  duration-300
                  hover:text-[#8F6B37]
                "
              >
                Call Us
              </a>

              <a
                href={emailUrl}
                className="
                  text-[11px]
                  text-[#59483D]
                  transition-colors
                  duration-300
                  hover:text-[#8F6B37]
                "
              >
                Email Us
              </a>
            </div>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div
            className="
              border-t
              border-[#D6C4A6]
              px-5
              pt-7
              text-center

              sm:col-span-2
              sm:px-8

              lg:col-span-1
              lg:border-t-0
              lg:px-7
              lg:pt-0
              lg:text-left

              xl:pl-8
            "
          >
            <FooterHeading>
              Contact
            </FooterHeading>

            <div
              className="
                flex
                flex-col
                gap-4
              "
            >
              {/* PHONE */}

              <a
                href={phoneUrl}
                className="
                  group
                  flex
                  items-start
                  gap-3
                  text-left
                "
              >
                <span
                  className="
                    flex
                    h-[36px]
                    w-[36px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C8A15A]
                    bg-[#FFFDF9]/30
                    text-[#5A3026]
                    transition-all
                    duration-300

                    group-hover:bg-[#C8A15A]
                    group-hover:text-[#FFFDF9]
                  "
                >
                  <FaPhoneAlt
                    size={12}
                  />
                </span>

                <span
                  className="
                    pt-1
                    text-[11px]
                    leading-5
                    text-[#59483D]
                    transition-colors
                    duration-300

                    group-hover:text-[#8F6B37]
                  "
                >
                  {displayPhone}
                </span>
              </a>

              {/* TIMING */}

              <div
                className="
                  flex
                  items-start
                  gap-3
                  text-left
                "
              >
                <span
                  className="
                    flex
                    h-[36px]
                    w-[36px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C8A15A]
                    bg-[#FFFDF9]/30
                    text-[#5A3026]
                  "
                >
                  <FaClock
                    size={13}
                  />
                </span>

                <span
                  className="
                    pt-1
                    text-[11px]
                    leading-5
                    text-[#59483D]
                  "
                >
                  {businessHours}
                </span>
              </div>

              {/* ADDRESS */}

              <div
                className="
                  flex
                  items-start
                  gap-3
                  text-left
                "
              >
                <span
                  className="
                    flex
                    h-[36px]
                    w-[36px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C8A15A]
                    bg-[#FFFDF9]/30
                    text-[#5A3026]
                  "
                >
                  <FaMapMarkerAlt
                    size={13}
                  />
                </span>

                <span
                  className="
                    pt-1
                    text-[11px]
                    leading-5
                    text-[#59483D]
                  "
                >
                  {address}
                </span>
              </div>

              {/* EMAIL */}

              {sirrahaEmail && (
                <a
                  href={emailUrl}
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    text-left
                  "
                >
                  <span
                    className="
                      flex
                      h-[36px]
                      w-[36px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#C8A15A]
                      bg-[#FFFDF9]/30
                      text-[#5A3026]
                      transition-all
                      duration-300

                      group-hover:bg-[#C8A15A]
                      group-hover:text-[#FFFDF9]
                    "
                  >
                    <FaEnvelope
                      size={13}
                    />
                  </span>

                  <span
                    className="
                      break-all
                      pt-1
                      text-[11px]
                      leading-5
                      text-[#59483D]
                      transition-colors
                      duration-300

                      group-hover:text-[#8F6B37]
                    "
                  >
                    {sirrahaEmail}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BROWN STRIP
      ===================================================== */}

      <div
        className="
          w-full
          bg-[#43231C]
        "
      >
        <div
          className="
            mx-auto
            grid
            min-h-[68px]
            w-full
            max-w-[1500px]
            grid-cols-1
            items-center
            gap-3
            px-5
            py-3

            sm:px-8

            md:px-10

            lg:grid-cols-3
            lg:px-14
            lg:py-2

            xl:px-[74px]
          "
        >
          {/* COPYRIGHT */}

          <p
            className="
              text-center
              text-[9px]
              font-normal
              leading-5
              !text-[#F4EBDD]

              lg:text-left
            "
          >
            © 2026 Sirraha. All rights reserved.
          </p>

          {/* CENTER BRAND LINE */}

          <div
            className="
              flex
              flex-col
              items-center
            "
          >
            <div
              className="
                flex
                w-[120px]
                items-center
                gap-2.5
              "
            >
              <span
                className="
                  h-px
                  flex-1
                  bg-[#B89559]
                "
              />

              <span
                className="
                  text-[10px]
                  leading-none
                  !text-[#D8BD83]
                "
              >
                ✦
              </span>

              <span
                className="
                  h-px
                  flex-1
                  bg-[#B89559]
                "
              />
            </div>

            <p
              className="
                mt-1
                text-[7px]
                font-medium
                uppercase
                tracking-[0.30em]
                !text-[#D8BD83]
              "
            >
              Rooted in Indian Craft
            </p>
          </div>

          {/* POLICY LINKS */}

          <nav
            aria-label="Footer policies"
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-3
              gap-y-1.5

              lg:justify-end
            "
          >
            <Link
              to="/privacy-policy"
              className="
                !text-[#F4EBDD]
                text-[9px]
                font-medium
                leading-5
                no-underline
                transition-colors
                duration-300
                hover:!text-[#D8BD83]
              "
            >
              Privacy Policy
            </Link>

            <span
              aria-hidden="true"
              className="
                !text-[#C8A15A]
                text-[9px]
              "
            >
              |
            </span>

            {/* EXCHANGE POLICY */}

            <Link
              to="/exchange-policy"
              className="
                !text-[#F4EBDD]
                text-[9px]
                font-medium
                leading-5
                no-underline
                transition-colors
                duration-300
                hover:!text-[#D8BD83]
              "
            >
              Exchange Policy
            </Link>

            <span
              aria-hidden="true"
              className="
                !text-[#C8A15A]
                text-[9px]
              "
            >
              |
            </span>

            {/* TERMS */}

            <Link
              to="/terms-and-conditions"
              className="
                !text-[#F4EBDD]
                text-[9px]
                font-medium
                leading-5
                no-underline
                transition-colors
                duration-300
                hover:!text-[#D8BD83]
              "
            >
              Terms & Conditions
            </Link>

            <span
              aria-hidden="true"
              className="
                !text-[#C8A15A]
                text-[9px]
              "
            >
              |
            </span>

            {/* SHIPPING */}

            <Link
              to="/shipping-policy"
              className="
                !text-[#F4EBDD]
                text-[9px]
                font-medium
                leading-5
                no-underline
                transition-colors
                duration-300
                hover:!text-[#D8BD83]
              "
            >
              Shipping Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({ children }) {
  return (
    <div className="mb-5">
      <h4
        className="
          font-serif
          text-[14px]
          font-semibold
          uppercase
          tracking-[0.20em]
          !text-[#5A3026]
        "
      >
        {children}
      </h4>

      <div
        className="
          mt-2.5
          flex
          justify-center

          lg:justify-start
        "
      >
        <span
          className="
            h-[2px]
            w-[26px]
            bg-[#A98243]
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER LINKS
========================================================= */

function FooterLinks({ items }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3.5
      "
    >
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="
            text-[11px]
            !text-[#59483D]
            no-underline
            transition-all
            duration-300

            hover:translate-x-[2px]
            hover:!text-[#8F6B37]
          "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

/* =========================================================
   FOOTER TEXT LINK
========================================================= */

function FooterTextLink({
  to,
  children,
}) {
  return (
    <Link
      to={to}
      className="
        text-[11px]
        !text-[#59483D]
        no-underline
        transition-colors
        duration-300

        hover:!text-[#8F6B37]
      "
    >
      {children}
    </Link>
  );
}

export default Footer;