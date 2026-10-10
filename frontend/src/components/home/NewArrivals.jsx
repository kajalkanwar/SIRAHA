import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import { getProducts } from "../../constants/api";
import ProductCard from "../product/ProductCard";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All Collection");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  /*
   * FINAL SIRRAHA CATEGORIES
   */
  const categories = [
    "All Collection",
    "Short Kurtis",
    "Long Kurtis",
    "Co-ord Sets",
    "Tops",
    "Palazzos",
    "Farshi Salwar",
  ];

  /*
   * FETCH NEW ARRIVALS
   */
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const newProducts = data.filter(
          (product) =>
            product.isNew === true &&
            product.status !== "inactive"
        );

        setProducts(newProducts);
      } catch (error) {
        console.error(
          "Failed to fetch new arrivals:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  /*
   * CATEGORY FILTER + SORT
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All Collection") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.salePrice ?? a.price ?? 0) -
          Number(b.salePrice ?? b.price ?? 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.salePrice ?? b.price ?? 0) -
          Number(a.salePrice ?? a.price ?? 0)
      );
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <section className="w-full bg-[#FAF7F0] text-[#3A2A20]">
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-4
          py-10
          sm:px-6
          sm:py-14
          md:px-8
          md:py-16
          lg:px-10
          lg:py-18
          xl:px-12
          xl:py-20
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-7 sm:mb-9 md:mb-10">
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-3">
                <span className="h-px w-7 bg-[#C8A15A] sm:w-8" />

                <p
                  className="
                    font-['Poppins']
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[2.5px]
                    text-[#A98243]
                    sm:text-[9px]
                    sm:tracking-[3px]
                  "
                >
                  Curated For You
                </p>
              </div>

              <h2
                className="
                  font-['Cormorant_Garamond']
                  text-[38px]
                  font-normal
                  leading-[0.92]
                  tracking-[-0.5px]
                  text-[#43231C]
                  sm:text-[46px]
                  md:text-[50px]
                  lg:text-[54px]
                "
              >
                New Arrivals
              </h2>

              <div className="mt-3 h-px w-9 bg-[#C8A15A] sm:mt-4 sm:w-10" />

              <p
                className="
                  mt-2.5
                  max-w-[310px]
                  font-['Cormorant_Garamond']
                  text-[15px]
                  italic
                  leading-5
                  text-[#71655B]
                  sm:mt-3
                  sm:max-w-none
                  sm:text-[17px]
                  sm:leading-6
                "
              >
                Fresh styles, limited stock, just for you.
              </p>
            </div>

            {/* =================================================
                RIGHT CONTROLS
            ================================================== */}

            <div
              className="
                flex
                w-full
                items-center
                justify-between
                gap-2.5
                sm:justify-start
                sm:gap-3
                lg:w-auto
                lg:pb-1
              "
            >
              {/* Piece count */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  font-['Poppins']
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[1.5px]
                  text-[#795033]
                  sm:gap-2
                  sm:text-[8px]
                  sm:tracking-[2px]
                "
              >
                <SlidersHorizontal
                  size={12}
                  strokeWidth={1.4}
                  className="text-[#A98243]"
                />

                <span>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Piece"
                    : "Pieces"}
                </span>
              </div>

              {/* Sort */}

              <div className="relative min-w-0">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="
                    h-[40px]
                    w-[150px]
                    appearance-none
                    border
                    border-[#DED4C4]
                    bg-[#FFFDF9]
                    px-3
                    pr-9
                    font-['Poppins']
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[1.4px]
                    text-[#5A3026]
                    outline-none
                    transition-colors
                    duration-300
                    hover:border-[#C8A15A]
                    focus:border-[#A98243]
                    sm:h-[42px]
                    sm:w-[170px]
                    sm:px-4
                    sm:text-[8px]
                    sm:tracking-[1.8px]
                  "
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>
                </select>

                <ChevronDown
                  size={12}
                  strokeWidth={1.3}
                  className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-[#A98243]
                    sm:right-3
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CATEGORY FILTERS

            Hidden ONLY on mobile.
            Visible from sm/tablet upwards.
        ===================================================== */}

        <div
          className="
            mb-8
            hidden
            w-full
            gap-2.5
            overflow-x-auto
            border-b
            border-[#DED4C4]
            pb-5
            sm:flex
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`
                  shrink-0
                  border
                  px-5
                  py-3
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[1.8px]
                  transition-all
                  duration-300
                  ${
                    active
                      ? "border-[#5A3026] bg-[#5A3026] text-[#FFFDF9]"
                      : "border-[#DED4C4] bg-[#FFFDF9] text-[#5A3026] hover:border-[#C8A15A] hover:bg-[#F2EBDD]"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-7
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-9
              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-12
            "
          >
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    w-full
                    max-w-[260px]
                    animate-pulse
                  "
                >
                  <div className="aspect-[4/5] bg-[#F2EBDD]" />

                  <div className="border-x border-b border-[#DED4C4] bg-[#FFFDF9] p-3 sm:p-4">
                    <div className="h-2 w-16 bg-[#E5DCCF]" />

                    <div className="mt-3 h-5 w-28 bg-[#E5DCCF]" />

                    <div className="mt-4 h-px w-8 bg-[#E5DCCF]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        {!loading && filteredProducts.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              justify-items-start
              gap-x-3
              gap-y-8
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-10
              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-12
            "
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                badgeType="new"
              />
            ))}
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && filteredProducts.length === 0 && (
          <div
            className="
              border-y
              border-[#DED4C4]
              bg-[#FFFDF9]
              px-5
              py-12
              text-center
              sm:px-6
              sm:py-14
            "
          >
            <p
              className="
                font-['Cormorant_Garamond']
                text-[25px]
                leading-tight
                text-[#43231C]
                sm:text-[26px]
              "
            >
              New arrivals are coming soon.
            </p>

            <p
              className="
                mx-auto
                mt-2
                max-w-[390px]
                font-['Poppins']
                text-[10px]
                leading-5
                text-[#71655B]
                sm:text-[11px]
              "
            >
              Fresh Sirraha pieces will appear here as
              soon as they are added to the collection.
            </p>
          </div>
        )}

        {/* =====================================================
            VIEW ALL
        ===================================================== */}

        {!loading && products.length > 0 && (
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              to="/products?filter=new"
              className="
                group
                inline-flex
                items-center
                gap-2.5
                border-b
                border-[#C8A15A]
                pb-2
                font-['Poppins']
                text-[8px]
                font-medium
                uppercase
                tracking-[2.2px]
                text-[#5A3026]
                transition-all
                duration-300
                hover:border-[#5A3026]
                hover:text-[#795033]
                sm:gap-3
                sm:tracking-[2.5px]
              "
            >
              <span>View All New Arrivals</span>

              <ArrowRight
                size={13}
                strokeWidth={1.3}
                className="
                  text-[#A98243]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default NewArrivals;