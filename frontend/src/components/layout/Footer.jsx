function Footer() {
  const shopLinks = [
    "All Collection",
    "New Arrivals",
    "Best Sellers",
  ];

  const categoryLinks = [
    "Short Kurtis",
    "Long Kurtis",
    "Co-ord Sets",
    "Three Piece Suit",
    "Trousers",
    "Farshi Salwar Suit",
  ];

  const helpLinks = [
    "Track Order",
    "My Account",
    "WhatsApp Support",
  ];

  return (
    <footer className="
      w-full
      bg-[#F8F4EC]
      border-t
      border-[#E5E0D6]
    ">

      {/* ================= MAIN FOOTER ================= */}

      <div className="
        w-full
        max-w-[1440px]
        mx-auto
        px-6
        sm:px-8
        md:px-12
        lg:px-16
        xl:px-20
        py-16
        sm:py-20
        lg:py-24
      ">

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-x-10
          md:gap-x-14
          lg:gap-x-16
          xl:gap-x-24
          gap-y-12
          lg:gap-y-0
        ">

          {/* ================= BRAND ================= */}

          <div className="text-left">

            <h3 className="
              text-[#0E5B3B]
              text-[26px]
              sm:text-[28px]
              tracking-[0.38em]
              font-normal
              leading-none
              mb-7
              font-serif
            ">
              SIRRAHA
            </h3>

            <p className="
              text-[#475569]
              text-[13px]
              sm:text-[14px]
              leading-7
              max-w-[280px]
            ">
              Ethnic wear made in small batches
              with handloom fabric, chikankari and
              zari craftsmanship from across India.
            </p>

          </div>


          {/* ================= SHOP ================= */}

          <div className="text-left">

            <h4 className="
              text-[#0E5B3B]
              text-[11px]
              tracking-[0.38em]
              uppercase
              font-medium
              leading-none
              mb-7
            ">
              Shop
            </h4>

            <div className="flex flex-col gap-4">

              {shopLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    text-[#111827]
                    text-[13px]
                    sm:text-[14px]
                    leading-5
                    hover:text-[#0E5B3B]
                    transition-colors
                  "
                >
                  {item}
                </a>
              ))}

            </div>

          </div>


          {/* ================= CATEGORIES ================= */}

          <div className="text-left">

            <h4 className="
              text-[#0E5B3B]
              text-[11px]
              tracking-[0.38em]
              uppercase
              font-medium
              leading-none
              mb-7
            ">
              Categories
            </h4>

            <div className="flex flex-col gap-4">

              {categoryLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    text-[#111827]
                    text-[13px]
                    sm:text-[14px]
                    leading-5
                    hover:text-[#0E5B3B]
                    transition-colors
                  "
                >
                  {item}
                </a>
              ))}

            </div>

          </div>


          {/* ================= HELP ================= */}

          <div className="text-left">

            <h4 className="
              text-[#0E5B3B]
              text-[11px]
              tracking-[0.38em]
              uppercase
              font-medium
              leading-none
              mb-7
            ">
              Help
            </h4>

            <div className="flex flex-col gap-4">

              {helpLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    text-[#111827]
                    text-[13px]
                    sm:text-[14px]
                    leading-5
                    hover:text-[#0E5B3B]
                    transition-colors
                  "
                >
                  {item}
                </a>
              ))}

            </div>

          </div>

        </div>

      </div>


      {/* ================= COPYRIGHT ================= */}

      <div className="
        border-t
        border-[#E5E0D6]
      ">

        <div className="
          w-full
          max-w-[1440px]
          mx-auto
          px-6
          sm:px-8
          md:px-12
          lg:px-16
          xl:px-20
          py-6
          sm:py-7
        ">

          <p className="
            text-center
            text-[#64748B]
            text-[11px]
            sm:text-[12px]
            leading-5
          ">
            © 2026 Sirraha. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;