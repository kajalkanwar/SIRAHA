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

// ============================================================
// POPULAR SEARCHES
// ============================================================

const searchCategories = [
  "Short Kurtis",
  "Long Kurtis",
  "Co-ord Sets",
  "Tops",
  "Palazzos",
  "Farshi Salwar Suit",
];

// ============================================================
// CATEGORY SEARCH ALIASES
// ============================================================

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
  // ==========================================================
  // STATE
  // ==========================================================

  const [searchText, setSearchText] = useState(
    initialQuery || ""
  );

  const [query, setQuery] = useState(
    initialQuery || ""
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const inputRef = useRef(null);
  const requestRef = useRef(false);

  // ==========================================================
  // CLOSE SEARCH
  // ==========================================================

  const handleClose = useCallback(() => {
    setSearchText("");
    setQuery("");
    onClose?.();
  }, [onClose]);

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {
    if (!isOpen || requestRef.current) {
      return;
    }

    let cancelled = false;

    requestRef.current = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getProducts();

        if (cancelled) {
          return;
        }

        const activeProducts = Array.isArray(data)
          ? data.filter(
              (product) =>
                product.status !== "inactive"
            )
          : [];

        setProducts(activeProducts);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Sirraha search error:",
            error
          );

          setProducts([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          requestRef.current = false;
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // ==========================================================
  // AUTO-FOCUS SEARCH INPUT
  // ==========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  // ==========================================================
  // LOCK PAGE SCROLL WHILE SEARCH IS OPEN
  // ==========================================================

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

  // ==========================================================
  // ESCAPE KEY
  // ==========================================================

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

  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query
      .toLowerCase()
      .trim();

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
        const value = alias.toLowerCase();

        return (
          name.includes(value) ||
          description.includes(value) ||
          category.includes(value) ||
          productCode.includes(value)
        );
      });
    });
  }, [products, query]);

  // ==========================================================
  // SUBMIT SEARCH
  // ==========================================================

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      setQuery("");
      return;
    }

    setQuery(value);
  };

  // ==========================================================
  // POPULAR SEARCH CLICK
  // ==========================================================

  const handleCategorySearch = (category) => {
    setSearchText(category);
    setQuery(category);
  };

  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  const handleClear = () => {
    setSearchText("");
    setQuery("");

    inputRef.current?.focus();
  };

  // ==========================================================
  // CLOSED STATE
  // ==========================================================

  if (!isOpen) {
    return null;
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section
      role="dialog"
      aria-label="Search Sirraha"
      aria-modal="true"
      className="
  relative
  w-full
  max-h-[calc(100vh-100px)]
  overflow-x-hidden
  overflow-y-auto
  overscroll-contain
  border-b
  border-white/40
  bg-[#F8F4F0]/75
  shadow-[0_8px_30px_rgba(53,20,17,0.08)]
  backdrop-blur-2xl
  animate-[sirrahaSearchOpen_0.25s_ease-out]
  [scrollbar-width:thin]
  [scrollbar-color:#C8A15A_transparent]
  sm:max-h-[calc(100vh-110px)]
  md:max-h-[calc(100vh-145px)]
      "
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      {/* ======================================================
          FROSTED GLASS BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -right-20
            -top-24
            h-56
            w-56
            rounded-full
            bg-[#C8A15A]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -left-16
            h-52
            w-52
            rounded-full
            bg-[#4B1F1B]/[0.06]
            blur-3xl
          "
        />
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1600px]
          px-4
          py-4
          sm:px-7
          sm:py-5
          lg:px-10
          lg:py-5
          xl:px-12
        "
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#E5DDD8]/80
              bg-white/65
              text-[#4B1F1B]
              backdrop-blur-md
              transition-all
              duration-200
              hover:border-[#C8A15A]
              hover:bg-white
              sm:h-9
              sm:w-9
            "
          >
            <FiX
              size={17}
              strokeWidth={1.4}
            />
          </button>
        </div>

        {/* ====================================================
            SEARCH INPUT
        ==================================================== */}

        <form onSubmit={handleSearch}>
          <div
            className="
  flex
  h-[50px]
  w-full
  items-center
  overflow-hidden
  rounded-full
  border
  border-[#C8A15A]/80
  bg-white/55
  shadow-[0_5px_20px_rgba(53,20,17,0.05)]
  backdrop-blur-xl
  transition-all
  duration-200
  focus-within:border-[#A98243]
  focus-within:bg-white/70
  sm:h-[54px]

            "
          >
            {/* SEARCH ICON */}

            <FiSearch
              size={20}
              strokeWidth={1.35}
              className="
                ml-4
                shrink-0
                text-[#6B5651]
                sm:ml-6
              "
            />

            {/* INPUT */}

            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
              placeholder="Search kurtis, co-ord sets, suits..."
              aria-label="Search Sirraha"
              className="
                min-w-0
                flex-1
                bg-transparent
                px-3
                font-['Poppins',sans-serif]
                text-[12px]
                text-[#351411]
                outline-none
                placeholder:text-[#918477]
                sm:px-4
                sm:text-[14px]
              "
            />

            {/* CLEAR BUTTON */}

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
                  text-[#6B5651]
                  transition-colors
                  hover:bg-white
                  hover:text-[#4B1F1B]
                "
              >
                <FiX size={15} />
              </button>
            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              aria-label="Search products"
              className="
                mr-1
                flex
                h-[40px]
                w-[40px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#4B1F1B]
                text-white
                transition-colors
                duration-200
                hover:bg-[#351411]
                sm:mr-1.5
                sm:h-[44px]
                sm:w-[44px]
              "
            >
              <FiSearch
                size={17}
                strokeWidth={1.4}
              />
            </button>
          </div>
        </form>

        {/* ====================================================
            POPULAR SEARCHES
        ==================================================== */}

        <div className="mt-4">
          {/* LABEL */}

          <div className="mb-2.5 flex items-center gap-2.5">
            <span
              className="
                h-px
                w-6
                shrink-0
                bg-[#C8A15A]
              "
            />

            <span
              className="
                font-['Poppins',sans-serif]
                text-[8px]
                font-medium
                uppercase
                tracking-[2px]
                text-[#6B5651]
              "
            >
              Popular Searches
            </span>
          </div>

          {/* CATEGORY CHIPS */}

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {searchCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategorySearch(category)
                }
                className="
                  group
                  inline-flex
                  min-h-[30px]
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#E5DDD8]/90
                  bg-white/45
                  px-3
                  py-1.5
                  font-['Poppins',sans-serif]
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.65px]
                  text-[#4B1F1B]
                  backdrop-blur-md
                  transition-all
                  duration-200
                  hover:border-[#C8A15A]
                  hover:bg-white/75
                  hover:text-[#A98243]
                  sm:min-h-[34px]
                  sm:px-3.5
                  sm:text-[9px]
                  sm:tracking-[0.8px]
                "
              >
                {category}

                <FiArrowRight
                  size={11}
                  strokeWidth={1.4}
                  className="
                    shrink-0
                    text-[#A98243]
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================
            SEARCH RESULTS
        ==================================================== */}

        {query && (
          <div
            className="
              mt-5
              border-t
              border-[#4B1F1B]/10
              pt-5
              animate-[sirrahaSearchResults_0.25s_ease-out]
            "
          >
            {/* RESULT HEADER */}

            <div
              className="
                mb-4
                flex
                items-end
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    mb-1
                    font-['Poppins',sans-serif]
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[2px]
                    text-[#A98243]
                  "
                >
                  Search Results
                </p>

                <h3
                  className="
                    font-['Cormorant_Garamond',serif]
                    text-[25px]
                    font-medium
                    leading-tight
                    text-[#351411]
                    sm:text-[29px]
                  "
                >
                  &ldquo;{query}&rdquo;
                </h3>
              </div>

              {!loading && !loadError && (
                <span
                  className="
                    shrink-0
                    pb-1
                    font-['Poppins',sans-serif]
                    text-[8px]
                    uppercase
                    tracking-[1px]
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
              <div className="py-7 text-center">
                <div
                  className="
                    mx-auto
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-[#E5DDD8]
                    border-t-[#C8A15A]
                  "
                />

                <p
                  className="
                    mt-3
                    font-['Poppins',sans-serif]
                    text-[9px]
                    text-[#918477]
                  "
                >
                  Finding your pieces...
                </p>
              </div>
            )}

            {/* API ERROR */}

            {!loading && loadError && (
              <div
                className="
                  rounded-xl
                  border
                  border-[#E5DDD8]
                  bg-white/50
                  px-4
                  py-6
                  text-center
                "
              >
                <p
                  className="
                    font-['Poppins',sans-serif]
                    text-[12px]
                    text-[#4B1F1B]
                  "
                >
                  We couldn&apos;t load products right now.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    requestRef.current = false;
                    setLoadError(false);
                  }}
                  className="
                    mt-3
                    font-['Poppins',sans-serif]
                    text-[10px]
                    font-medium
                    text-[#A98243]
                    underline
                    underline-offset-4
                  "
                >
                  Please reopen search to try again
                </button>
              </div>
            )}

            {/* PRODUCTS */}

            {!loading &&
              !loadError &&
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
              !loadError &&
              filteredProducts.length === 0 && (
                <div
                  className="
                    rounded-xl
                    border
                    border-[#E5DDD8]/80
                    bg-white/45
                    px-4
                    py-7
                    text-center
                    backdrop-blur-md
                  "
                >
                  <FiSearch
                    size={21}
                    strokeWidth={1.3}
                    className="mx-auto text-[#A98243]"
                  />

                  <h3
                    className="
                      mt-3
                      font-['Cormorant_Garamond',serif]
                      text-[25px]
                      font-medium
                      text-[#351411]
                    "
                  >
                    No pieces found
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-1.5
                      max-w-[350px]
                      font-['Poppins',sans-serif]
                      text-[10px]
                      leading-5
                      text-[#918477]
                    "
                  >
                    Try another search or choose one
                    of the popular categories above.
                  </p>
                </div>
              )}

            {/* RESULT LIMIT */}

            {!loading &&
              !loadError &&
              filteredProducts.length > 8 && (
                <p
                  className="
                    mt-4
                    text-center
                    font-['Poppins',sans-serif]
                    text-[9px]
                    uppercase
                    tracking-[1px]
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