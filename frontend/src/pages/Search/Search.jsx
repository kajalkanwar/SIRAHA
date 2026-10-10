import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FiArrowRight,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { getProducts } from "../../constants/api";
import ProductCard from "../../components/product/ProductCard";

const searchCategories = [
  "Short Kurtis",
  "Long Kurtis",
  "Co-ord Sets",
  "Tops",
  "Palazzos",
  "Farshi Salwar Suit",
];

const categoryAliases = {
  "short kurtis": [
    "short kurtis",
    "short kurti",
  ],

  "long kurtis": [
    "long kurtis",
    "long kurti",
  ],

  "co-ord sets": [
    "co-ord sets",
    "co ord sets",
    "coord sets",
  ],

  tops: [
    "tops",
    "top",
  ],

  palazzos: [
    "palazzos",
    "palazzo",
    "trousers",
    "trouser",
  ],

  "farshi salwar suit": [
    "farshi salwar suit",
    "farshi salwar",
    "farshi",
  ],
};

function Search({
  isOpen,
  onClose,
  initialQuery = "",
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [searchText, setSearchText] =
    useState(() => initialQuery || "");

  const [query, setQuery] =
    useState(() => initialQuery || "");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const inputRef = useRef(null);

  const productsLoadedRef = useRef(false);

  // =========================================================
  // CLOSE SEARCH
  // IMPORTANT:
  // Declared BEFORE the Escape-key effect.
  // =========================================================

  const handleClose = useCallback(() => {
    setSearchText("");
    setQuery("");
    onClose();
  }, [onClose]);

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  useEffect(() => {
    if (!isOpen || productsLoadedRef.current) {
      return;
    }

    productsLoadedRef.current = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const activeProducts = Array.isArray(data)
          ? data.filter(
              (product) =>
                product.status !== "inactive"
            )
          : [];

        setProducts(activeProducts);
      } catch (error) {
        console.error(
          "Sirraha search error:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  // =========================================================
  // AUTO FOCUS SEARCH
  // =========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // =========================================================
  // LOCK HOMEPAGE SCROLL WHILE SEARCH IS OPEN
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

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, handleClose]);

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery =
      query.toLowerCase().trim();

    const aliases =
      categoryAliases[normalizedQuery] || [
        normalizedQuery,
      ];

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const description =
        product.description?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const productCode =
        product.productCode?.toLowerCase() || "";

      return aliases.some((alias) => {
        const value =
          alias.toLowerCase();

        return (
          name.includes(value) ||
          description.includes(value) ||
          category.includes(value) ||
          productCode.includes(value)
        );
      });
    });
  }, [products, query]);

  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      setQuery("");
      return;
    }

    setQuery(value);
  };

  // =========================================================
  // POPULAR SEARCH
  // =========================================================

  const handleCategorySearch = (category) => {
    setSearchText(category);
    setQuery(category);
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClear = () => {
    setSearchText("");
    setQuery("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // =========================================================
  // CLOSED STATE
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section
      className="
        relative
        w-full

        max-h-[calc(100vh-92px)]
        md:max-h-[calc(100vh-153px)]

        overflow-x-hidden
        overflow-y-auto

        overscroll-contain

        border-b
        border-[#DED4C4]

        bg-[#F8F4EC]/95

        shadow-[0_12px_35px_rgba(67,35,28,0.08)]

        backdrop-blur-2xl

        animate-[sirrahaSearchOpen_0.35s_ease-out]

        [scrollbar-width:thin]
        [scrollbar-color:#C8A15A_transparent]
      "
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
      }}
    >
      {/* =====================================================
          SOFT DECORATIVE BLUR
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-28
          h-60
          w-60
          rounded-full
          bg-[#C8A15A]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-20
          h-60
          w-60
          rounded-full
          bg-[#5A3026]/5
          blur-3xl
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1400px]
          px-5
          py-6
          sm:px-8
          sm:py-7
          lg:px-12
          lg:py-8
          xl:px-16
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-center justify-between">
          <div>
            <div
              className="
                mb-2
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

              <span
                className="
                  font-['Poppins']
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[3px]
                  text-[#A98243]
                  sm:text-[8px]
                "
              >
                Discover Sirraha
              </span>
            </div>

            <h2
              className="
                font-['Cormorant_Garamond']
                text-[29px]
                font-medium
                leading-none
                text-[#43231C]
                sm:text-[35px]
                lg:text-[40px]
              "
            >
              Search Sirraha
            </h2>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#DED4C4]
              bg-[#FFFDF9]/60
              text-[#5A3026]
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-[#C8A15A]
              hover:bg-[#F2EBDD]
              sm:h-10
              sm:w-10
            "
          >
            <FiX
              size={17}
              strokeWidth={1.4}
            />
          </button>
        </div>

        {/* ===================================================
            SEARCH BAR
        =================================================== */}

        <form
          onSubmit={handleSearch}
          className="mt-5"
        >
          <div
            className="
              flex
              h-[54px]
              w-full
              items-center
              overflow-hidden
              rounded-full
              border
              border-[#DED4C4]
              bg-[#FFFDF9]/55
              shadow-[0_8px_25px_rgba(67,35,28,0.06)]
              backdrop-blur-xl
              transition-all
              duration-300
              focus-within:border-[#C8A15A]
              focus-within:bg-[#FFFDF9]/75
              focus-within:shadow-[0_10px_30px_rgba(67,35,28,0.08)]
              sm:h-[58px]
            "
          >
            <FiSearch
              size={19}
              strokeWidth={1.3}
              className="
                ml-5
                shrink-0
                text-[#71655B]
                sm:ml-6
              "
            />

            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search kurtis, co-ord sets, suits..."
              aria-label="Search Sirraha"
              className="
                min-w-0
                flex-1
                bg-transparent
                px-4
                font-['Poppins']
                text-[13px]
                text-[#43231C]
                outline-none
                placeholder:text-[#918477]
                sm:px-5
                sm:text-[14px]
              "
            />

            {/* CLEAR */}

            {searchText && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="
                  mr-1
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[#71655B]
                  transition-all
                  hover:bg-[#F2EBDD]
                  hover:text-[#5A3026]
                "
              >
                <FiX size={15} />
              </button>
            )}

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              aria-label="Search"
              className="
                mr-1.5
                flex
                h-[43px]
                w-[43px]
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#5A3026]
                bg-[#5A3026]
                text-[#FFFDF9]
                transition-all
                duration-300
                hover:bg-[#43231C]
                sm:mr-2
                sm:h-[46px]
                sm:w-[46px]
              "
            >
              <FiSearch
                size={17}
                strokeWidth={1.35}
              />
            </button>
          </div>
        </form>

        {/* ===================================================
            POPULAR SEARCHES
        =================================================== */}

        <div className="mt-5">
          <div
            className="
              mb-3
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

            <span
              className="
                font-['Poppins']
                text-[7px]
                font-medium
                uppercase
                tracking-[2.8px]
                text-[#71655B]
                sm:text-[8px]
              "
            >
              Popular Searches
            </span>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {searchCategories.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategorySearch(
                      category
                    )
                  }
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-[#DED4C4]
                    bg-[#FFFDF9]/45
                    px-3
                    py-2
                    font-['Poppins']
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[1px]
                    text-[#5A3026]
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:border-[#C8A15A]
                    hover:bg-[#FFFDF9]
                    hover:text-[#43231C]
                    sm:px-3.5
                    sm:py-2.5
                    sm:text-[8px]
                  "
                >
                  {category}

                  <FiArrowRight
                    size={10}
                    strokeWidth={1.4}
                    className="
                      text-[#A98243]
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </button>
              )
            )}
          </div>
        </div>

        {/* ===================================================
            SEARCH RESULTS
        =================================================== */}

        {query && (
          <div
            className="
              mt-6
              border-t
              border-[#DED4C4]
              pt-6
              animate-[sirrahaSearchResults_0.3s_ease-out]
            "
          >
            {/* RESULT HEADER */}

            <div
              className="
                mb-5
                flex
                items-end
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    mb-1
                    font-['Poppins']
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[2.5px]
                    text-[#A98243]
                  "
                >
                  Search results
                </p>

                <h3
                  className="
                    font-['Cormorant_Garamond']
                    text-[27px]
                    font-medium
                    leading-none
                    text-[#43231C]
                    sm:text-[30px]
                  "
                >
                  “{query}”
                </h3>
              </div>

              {!loading && (
                <span
                  className="
                    font-['Poppins']
                    text-[8px]
                    uppercase
                    tracking-[1.3px]
                    text-[#918477]
                  "
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "piece"
                    : "pieces"}
                </span>
              )}
            </div>

            {/* LOADING */}

            {loading && (
              <div className="py-10 text-center">
                <div
                  className="
                    mx-auto
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-[#DED4C4]
                    border-t-[#C8A15A]
                  "
                />

                <p
                  className="
                    mt-3
                    font-['Poppins']
                    text-[7px]
                    uppercase
                    tracking-[2px]
                    text-[#918477]
                  "
                >
                  Finding your pieces...
                </p>
              </div>
            )}

            {/* PRODUCTS */}

            {!loading &&
              filteredProducts.length > 0 && (
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    sm:gap-4
                    lg:grid-cols-4
                    lg:gap-5
                  "
                >
                  {filteredProducts
                    .slice(0, 8)
                    .map((product) => (
                      <ProductCard
                        key={
                          product._id ||
                          product.productCode
                        }
                        product={product}
                        badgeType={
                          product.isFeatured
                            ? "best"
                            : product.isNew
                            ? "new"
                            : "none"
                        }
                      />
                    ))}
                </div>
              )}

            {/* NO RESULTS */}

            {!loading &&
              filteredProducts.length === 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-[#DED4C4]
                    bg-[#FFFDF9]/55
                    px-5
                    py-9
                    text-center
                    backdrop-blur-md
                  "
                >
                  <FiSearch
                    size={20}
                    strokeWidth={1.2}
                    className="
                      mx-auto
                      text-[#A98243]
                    "
                  />

                  <h3
                    className="
                      mt-4
                      font-['Cormorant_Garamond']
                      text-[26px]
                      font-medium
                      text-[#43231C]
                    "
                  >
                    No pieces found
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[400px]
                      font-['Poppins']
                      text-[9px]
                      leading-5
                      text-[#918477]
                    "
                  >
                    Try another search or
                    explore one of the popular
                    categories above.
                  </p>
                </div>
              )}

            {/* RESULT LIMIT */}

            {!loading &&
              filteredProducts.length > 8 && (
                <p
                  className="
                    mt-5
                    text-center
                    font-['Poppins']
                    text-[8px]
                    uppercase
                    tracking-[1.5px]
                    text-[#918477]
                  "
                >
                  Showing the first 8 results
                </p>
              )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Search;