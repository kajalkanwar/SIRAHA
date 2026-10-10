import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

import { getProducts } from "../../constants/api";
import ProductCard from "../product/ProductCard";

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

function BestSellers() {
  const [products, setProducts] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL COLLECTION");

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  // ============================================================
  // FETCH
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
          const category =
            product.category
              ?.trim()
              .toLowerCase();

          return allowedCategories.includes(
            category
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
    <section
      className="
        w-full
        bg-[#FAF7F0]
        text-[#3A2A20]
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

          lg:px-14
          lg:py-14

          xl:px-16
        "
      >
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
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
                  w-8
                  bg-[#C8A15A]
                "
              />

              <p
                className="
                  font-['Poppins']
                  text-[8px]
                  uppercase
                  tracking-[3px]
                  text-[#A98243]
                "
              >
                Most Loved
              </p>
            </div>

            <h2
              className="
                font-['Cormorant_Garamond']
                text-[38px]
                font-normal
                leading-none
                text-[#43231C]

                sm:text-[44px]

                lg:text-[50px]
              "
            >
              Best Sellers
            </h2>

            <div
              className="
                mt-3
                h-px
                w-9
                bg-[#C8A15A]
              "
            />

            <p
              className="
                mt-2
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

          {/* COUNT + SORT */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3

              sm:justify-end
            "
          >
            <div
              className="
                flex
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
                  uppercase
                  tracking-[1.5px]
                  text-[#5A3026]

                  outline-none

                  focus:border-[#C8A15A]
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
            mt-6
            w-full
            overflow-hidden

            border-b
            border-[#DED4C4]

            pb-4
          "
        >
          <div
            className="
              flex
              w-full
              gap-2

              overflow-x-auto

              pb-1

              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map(
              (category) => {
                const active =
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

                      ${
                        active
                          ? "border-[#5A3026] bg-[#5A3026] text-[#FFFDF9]"
                          : "border-[#DED4C4] bg-[#FFFDF9] text-[#5A3026] hover:border-[#C8A15A]"
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

        <div className="mt-7">
          {loading && (
            <div
              className="
                grid
                grid-cols-2
                gap-3

                md:grid-cols-3

                lg:grid-cols-4
                lg:gap-5
              "
            >
              {Array.from({
                length: 4,
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading &&
            filteredProducts.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3

                  md:grid-cols-3

                  lg:grid-cols-4
                  lg:gap-5
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

          {!loading &&
            filteredProducts.length ===
              0 && (
              <div
                className="
                  border-y
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  px-5
                  py-14
                  text-center
                "
              >
                <p
                  className="
                    font-['Cormorant_Garamond']
                    text-[25px]
                    text-[#43231C]
                  "
                >
                  Our best sellers are
                  coming soon.
                </p>
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
                mt-8
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
    </section>
  );
}

export default BestSellers;