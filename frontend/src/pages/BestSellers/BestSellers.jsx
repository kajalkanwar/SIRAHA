import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

import { getProducts } from "../../constants/api";
import ProductCard from "../../components/product/ProductCard";

const categories = [
  "ALL COLLECTION",
  "SHORT KURTIS",
  "LONG KURTIS",
  "CO-ORD SETS",
  "TOPS",
  "PALAZZOS",
  "FARSHI SALWAR",
];

const categoryAliases = {
  "SHORT KURTIS": [
    "short kurtis",
    "short kurti",
  ],

  "LONG KURTIS": [
    "long kurtis",
    "long kurti",
  ],

  "CO-ORD SETS": [
    "co-ord sets",
    "co ord sets",
    "coord sets",
  ],

  TOPS: [
    "tops",
    "top",
  ],

  PALAZZOS: [
    "palazzos",
    "palazzo",
    "trousers",
    "trouser",
  ],

  "FARSHI SALWAR": [
    "farshi salwar",
    "farshi salwar suit",
    "farshi",
  ],
};

function BestSellersPage() {
  const [products, setProducts] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL COLLECTION");

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  // ============================================================
  // FETCH BEST SELLERS
  // ============================================================

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        const featuredProducts =
          data.filter(
            (product) =>
              product.isFeatured === true &&
              product.status !== "inactive"
          );

        setProducts(featuredProducts);
      } catch (error) {
        console.error(
          "Failed to fetch best sellers:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // ============================================================
  // FILTER + SORT
  // ============================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (
      selectedCategory !==
      "ALL COLLECTION"
    ) {
      const allowedCategories =
        categoryAliases[
          selectedCategory
        ] || [];

      result = result.filter(
        (product) => {
          const productCategory =
            product.category
              ?.trim()
              .toLowerCase();

          return allowedCategories.includes(
            productCategory
          );
        }
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(
            a.salePrice ??
              a.price ??
              0
          ) -
          Number(
            b.salePrice ??
              b.price ??
              0
          )
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(
            b.salePrice ??
              b.price ??
              0
          ) -
          Number(
            a.salePrice ??
              a.price ??
              0
          )
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    sortBy,
  ]);

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#FAF7F0]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]

          px-5
          py-10

          sm:px-8
          sm:py-12

          md:px-10
          md:py-14

          lg:px-14
          lg:py-16

          xl:px-16
          2xl:px-20
        "
      >
        {/* ====================================================
            HEADER
        ===================================================== */}

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
          <div>
            {/* LABEL */}

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
                  w-8
                  bg-[#C8A15A]
                "
              />

              <p
                className="
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[3px]
                  text-[#A98243]

                  sm:text-[9px]
                "
              >
                Most Loved
              </p>
            </div>

            {/* TITLE */}

            <h1
              className="
                font-['Cormorant_Garamond']
                text-[40px]
                font-normal
                leading-none
                tracking-[-0.4px]
                text-[#43231C]

                sm:text-[48px]

                md:text-[52px]

                lg:text-[56px]
              "
            >
              Best Sellers
            </h1>

            {/* GOLD LINE */}

            <div
              className="
                mt-3
                h-px
                w-9
                bg-[#C8A15A]
              "
            />

            {/* DESCRIPTION */}

            <p
              className="
                mt-2
                max-w-[520px]

                font-['Cormorant_Garamond']
                text-[14px]
                italic
                leading-5
                text-[#71655B]

                sm:text-[15px]
              "
            >
              Timeless pieces, loved and chosen
              again and again.
            </p>
          </div>

          {/* ==================================================
              COUNT + SORT
          ================================================== */}

          <div
            className="
              flex
              w-full
              items-center
              justify-between
              gap-3

              sm:w-auto
              sm:justify-end
            "
          >
            <div
              className="
                flex
                shrink-0
                items-center
                gap-2

                font-['Poppins']
                text-[8px]
                uppercase
                tracking-[1.8px]
                text-[#A98243]
              "
            >
              <SlidersHorizontal
                size={12}
                strokeWidth={1.3}
              />

              <span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "Piece"
                  : "Pieces"}
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
                className="
                  h-[40px]
                  min-w-[125px]

                  appearance-none

                  border
                  border-[#DED4C4]

                  bg-[#FFFDF9]

                  px-3
                  pr-8

                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[1.5px]
                  text-[#5A3026]

                  outline-none

                  focus:border-[#C8A15A]

                  sm:h-[42px]
                  sm:min-w-[145px]
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

              <span
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#A98243]
                "
              >
                ↓
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            CATEGORIES
        ===================================================== */}

        <div
          className="
            mt-7
            w-full
            overflow-hidden

            border-b
            border-[#DED4C4]

            pb-5
          "
        >
          <div
            className="
              flex
              w-full
              gap-2

              overflow-x-auto
              overscroll-x-contain

              pb-1

              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map(
              (category) => {
                const isActive =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`
                      shrink-0
                      whitespace-nowrap

                      border

                      px-4
                      py-2.5

                      font-['Poppins']
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[1.5px]

                      transition-all
                      duration-300

                      sm:px-5
                      sm:py-3
                      sm:text-[8px]

                      ${
                        isActive
                          ? "border-[#5A3026] bg-[#5A3026] text-[#FFFDF9]"
                          : "border-[#DED4C4] bg-[#FFFDF9] text-[#5A3026] hover:border-[#C8A15A] hover:text-[#795033]"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* ====================================================
            PRODUCTS
        ===================================================== */}

        <div className="mt-8">
          {/* LOADING */}

          {loading && (
            <div
              className="
                grid
                grid-cols-2
                gap-3

                sm:gap-4

                md:grid-cols-3

                lg:grid-cols-4
                lg:gap-5
              "
            >
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse"
                >
                  <div
                    className="
                      aspect-[4/5]
                      w-full
                      bg-[#EDE5D8]
                    "
                  />

                  <div
                    className="
                      border-x
                      border-b
                      border-[#DED4C4]
                      bg-[#FFFDF9]
                      p-3
                    "
                  >
                    <div className="h-2 w-16 bg-[#E5DCCF]" />

                    <div className="mt-2 h-4 w-24 bg-[#E5DCCF]" />

                    <div className="mt-3 h-3 w-14 bg-[#E5DCCF]" />
                  </div>
                </div>
              ))}
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

                  sm:gap-4

                  md:grid-cols-3

                  lg:grid-cols-4
                  lg:gap-5

                  xl:gap-x-6
                "
              >
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product._id ||
                        product.id
                      }
                      product={product}
                      badgeType="best"
                    />
                  )
                )}
              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            filteredProducts.length ===
              0 && (
              <div
                className="
                  border-y
                  border-[#DED4C4]
                  bg-[#FFFDF9]

                  px-5
                  py-16

                  text-center
                "
              >
                <h2
                  className="
                    font-['Cormorant_Garamond']
                    text-[26px]
                    font-normal
                    text-[#43231C]
                  "
                >
                  Our best sellers are
                  coming soon.
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-[400px]

                    font-['Poppins']
                    text-[10px]
                    leading-5
                    text-[#71655B]
                  "
                >
                  Discover the pieces our
                  customers will love.
                </p>

                <Link
                  to="/"
                  className="
                    group
                    mt-6
                    inline-flex
                    items-center
                    gap-2

                    border-b
                    border-[#C8A15A]

                    pb-1.5

                    font-['Poppins']
                    text-[8px]
                    uppercase
                    tracking-[2px]
                    text-[#5A3026]
                  "
                >
                  Back To Home

                  <ArrowRight
                    size={13}
                    strokeWidth={1.3}
                    className="
                      text-[#A98243]
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            )}
        </div>

        {/* ====================================================
            VIEW ALL
        ===================================================== */}

        {!loading &&
          products.length > 0 && (
            <div
              className="
                mt-10
                flex
                justify-center
              "
            >
              <Link
                to="/collection?type=best-sellers"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2

                  border-b
                  border-[#C8A15A]

                  pb-1.5

                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[2.2px]
                  text-[#5A3026]

                  transition-all

                  hover:border-[#5A3026]
                "
              >
                View All Best Sellers

                <ArrowRight
                  size={13}
                  strokeWidth={1.3}
                  className="
                    text-[#A98243]
                    transition-transform
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