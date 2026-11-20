
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

import { getProducts } from "../../constants/api";
import ProductCard from "../../components/product/ProductCard";

function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH BEST SELLERS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        if (!isMounted) return;

        const productList = Array.isArray(data) ? data : [];

        const featuredProducts = productList.filter(
          (product) =>
            product.isFeatured === true &&
            product.status !== "inactive"
        );

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);

        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // SORT PRODUCTS
  // =========================================================

  const sortedProducts = useMemo(() => {
    const result = [...products];

    const getPrice = (product) =>
      Number(product.salePrice ?? product.price ?? 0);

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "price-low") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [products, sortBy]);

  // =========================================================
  // SORT OPTIONS
  // =========================================================

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ];

  return (
    <main className="min-h-screen w-full bg-white text-[#351C19]">
      <div
        className="
          mx-auto w-full max-w-[1440px]
          px-4 py-8
          sm:px-6 sm:py-10
          md:px-8 md:py-12
          lg:px-10 lg:py-14
          xl:px-12
        "
      >
        {/* =====================================================
            HEADER AND SORTING
        ===================================================== */}

        <div
          className="
            mb-6 flex flex-col gap-4
            sm:mb-7
            md:flex-row md:items-end md:justify-between
          "
        >
          {/* SECTION TITLE */}

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-7 bg-[#C8A15A]" />

              <p
                className="
                  font-['Poppins',sans-serif]
                  text-[8px] font-medium uppercase
                  tracking-[2.5px] text-[#A98243]
                  sm:text-[9px]
                "
              >
                Most Loved
              </p>
            </div>

            <h1
              className="
                font-['Cormorant_Garamond',serif]
                text-[36px] font-medium leading-none
                tracking-[-0.4px] text-[#351411]
                sm:text-[43px]
                md:text-[48px]
                lg:text-[52px]
              "
            >
              Best Sellers
            </h1>

            <div className="mt-3 h-px w-9 bg-[#C8A15A]" />

            <p
              className="
                mt-2 max-w-[440px]
                font-['Cormorant_Garamond',serif]
                text-[14px] italic leading-5
                text-[#6B5651]
                sm:text-[15px]
              "
            >
              Timeless pieces, loved and chosen again and again.
            </p>
          </div>

          {/* PRODUCT COUNT AND SORT */}

          <div
            className="
              flex w-full items-center justify-between gap-3
              md:w-auto md:justify-end md:pb-0.5
            "
          >
            {/* PRODUCT COUNT */}

            <p
              className="
                shrink-0 whitespace-nowrap
                font-['Poppins',sans-serif]
                text-[9px] font-medium uppercase
                tracking-[1.2px] text-[#6B5651]
                sm:text-[10px]
              "
            >
              <span className="text-[#4B1F1B]">
                {loading ? "—" : sortedProducts.length}
              </span>{" "}
              {sortedProducts.length === 1 ? "Piece" : "Pieces"}
            </p>

            {/* SORT SELECT */}

            <div className="relative shrink-0">
              <label htmlFor="best-sellers-sort" className="sr-only">
                Sort best sellers
              </label>

              <select
                id="best-sellers-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="
                  h-9 w-[164px] appearance-none
                  rounded-none border border-[#E5DDD8]
                  bg-white py-0 pl-3 pr-8
                  font-['Poppins',sans-serif]
                  text-[9px] font-medium
                  text-[#4B1F1B]
                  outline-none transition-colors
                  hover:border-[#C8A15A]
                  focus:border-[#A98243]
                  sm:h-10 sm:w-[190px] sm:pl-4
                  sm:text-[10px]
                "
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  right-2.5 top-1/2 -translate-y-1/2
                  text-[#A98243]
                "
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            LOADING PLACEHOLDERS
        ===================================================== */}

        {loading && (
          <div
            className="
              grid grid-cols-2 gap-x-3 gap-y-6
              sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8
              lg:grid-cols-4 lg:gap-x-6 lg:gap-y-9
            "
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-full animate-pulse">
                <div className="aspect-[4/5] bg-[#F7F3EF]" />

                <div className="pt-3 sm:pt-4">
                  <div className="h-2 w-16 bg-[#E5DDD8]" />
                  <div className="mt-3 h-3 w-3/4 bg-[#F1ECE9]" />
                  <div className="mt-3 h-3 w-1/3 bg-[#E5DDD8]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        {!loading && sortedProducts.length > 0 && (
          <div
            className="
              grid grid-cols-2 justify-items-stretch
              gap-x-3 gap-y-7
              sm:gap-x-5 sm:gap-y-9
              lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10
            "
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id || product.id || product.productCode}
                product={product}
                badgeType="best"
              />
            ))}
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && sortedProducts.length === 0 && (
          <div
            className="
              border-y border-[#E5DDD8]
              px-4 py-9 text-center
              sm:px-6 sm:py-11
            "
          >
            <h2
              className="
                font-['Cormorant_Garamond',serif]
                text-[25px] leading-tight text-[#351411]
                sm:text-[29px]
              "
            >
              Our best sellers are coming soon.
            </h2>

            <p
              className="
                mx-auto mt-2 max-w-[400px]
                font-['Poppins',sans-serif]
                text-[10px] leading-5 text-[#6B5651]
                sm:text-[11px]
              "
            >
              Discover the Sirraha pieces our customers love.
              Our featured styles will appear here once available.
            </p>

            <Link
              to="/"
              className="
                group mt-5 inline-flex items-center gap-2
                border-b border-[#C8A15A] pb-1.5
                font-['Poppins',sans-serif]
                text-[9px] font-medium uppercase
                tracking-[1.8px] text-[#4B1F1B]
                transition-colors hover:text-[#69352D]
              "
            >
              Back To Home

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
                className="
                  text-[#A98243]
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}

        {/* =====================================================
            VIEW ALL
        ===================================================== */}

        {!loading && products.length > 0 && (
          <div className="mt-7 flex justify-center sm:mt-9">
            <Link
              to="/collection?type=best-sellers"
              className="
                group inline-flex items-center gap-2
                border-b border-[#C8A15A] pb-2
                font-['Poppins',sans-serif]
                text-[9px] font-medium uppercase
                tracking-[1.8px] text-[#4B1F1B]
                transition-colors duration-200
                hover:border-[#4B1F1B]
                hover:text-[#69352D]
                sm:gap-2.5 sm:text-[10px]
              "
            >
              <span>View All Best Sellers</span>

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                aria-hidden="true"
                className="
                  text-[#A98243]
                  transition-transform duration-200
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default BestSellersPage;