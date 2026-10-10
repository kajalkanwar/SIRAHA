import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getProducts } from "../../constants/api";
import ProductCard from "../../components/product/ProductCard";

function Collection() {
  const [searchParams] = useSearchParams();

  const collectionType =
    searchParams.get("type") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        let filteredProducts = data.filter(
          (product) =>
            product.status !== "inactive"
        );

        if (collectionType === "new-arrivals") {
          filteredProducts =
            filteredProducts.filter(
              (product) =>
                product.isNew === true
            );
        }

        if (collectionType === "best-sellers") {
          filteredProducts =
            filteredProducts.filter(
              (product) =>
                product.isFeatured === true
            );
        }

        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error(
          "Failed to load collection:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionType]);

  const pageTitle = useMemo(() => {
    if (collectionType === "new-arrivals") {
      return "New Arrivals";
    }

    if (collectionType === "best-sellers") {
      return "Best Sellers";
    }

    return "All Collection";
  }, [collectionType]);

  const pageDescription = useMemo(() => {
    if (collectionType === "new-arrivals") {
      return "Fresh styles, thoughtfully selected for the season.";
    }

    if (collectionType === "best-sellers") {
      return "The pieces our customers keep coming back to.";
    }

    return "Discover the complete Sirraha collection.";
  }, [collectionType]);

  const badgeType =
    collectionType === "best-sellers"
      ? "best"
      : "new";

  return (
    <main
      className="
        min-h-screen
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
          py-16
          sm:px-8
          sm:py-20
          lg:px-14
          lg:py-24
          xl:px-16
        "
      >
        {/* HEADER */}

        <div className="mb-12">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              font-['Poppins']
              text-[9px]
              uppercase
              tracking-[2px]
              text-[#A98243]
              transition-colors
              hover:text-[#5A3026]
            "
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.3}
            />

            Back Home
          </Link>

          <div
            className="
              mt-8
              flex
              items-end
              justify-between
              gap-6
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-9
                    bg-[#C8A15A]
                  "
                />

                <p
                  className="
                    font-['Poppins']
                    text-[9px]
                    uppercase
                    tracking-[3.5px]
                    text-[#A98243]
                  "
                >
                  Sirraha Collection
                </p>
              </div>

              <h1
                className="
                  mt-3
                  font-['Cormorant_Garamond']
                  text-[50px]
                  font-normal
                  leading-none
                  text-[#43231C]
                  sm:text-[62px]
                "
              >
                {pageTitle}
              </h1>

              <div
                className="
                  mt-4
                  h-px
                  w-11
                  bg-[#C8A15A]
                "
              />

              <p
                className="
                  mt-4
                  max-w-[520px]
                  font-['Cormorant_Garamond']
                  text-[17px]
                  italic
                  text-[#71655B]
                "
              >
                {pageDescription}
              </p>
            </div>

            <p
              className="
                hidden
                font-['Poppins']
                text-[9px]
                uppercase
                tracking-[2px]
                text-[#A98243]
                sm:block
              "
            >
              {products.length}{" "}
              {products.length === 1
                ? "Piece"
                : "Pieces"}
            </p>
          </div>
        </div>

        {/* PRODUCTS */}

        {loading && (
          <div
            className="
              grid
              grid-cols-2
              gap-x-4
              gap-y-9
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-12
            "
          >
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse"
                >
                  <div
                    className="
                      aspect-[4/5]
                      bg-[#EDE5D8]
                    "
                  />

                  <div
                    className="
                      border-x
                      border-b
                      border-[#DED4C4]
                      bg-[#FFFDF9]
                      p-5
                    "
                  >
                    <div className="h-2 w-20 bg-[#E5DCCF]" />
                    <div className="mt-3 h-5 w-32 bg-[#E5DCCF]" />
                    <div className="mt-4 h-3 w-16 bg-[#E5DCCF]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-x-4
              gap-y-9
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-12
            "
          >
            {products.map((product) => (
              <ProductCard
                key={
                  product._id ||
                  product.id
                }
                product={product}
                badgeType={badgeType}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div
            className="
              border-y
              border-[#DED4C4]
              bg-[#FFFDF9]
              px-6
              py-20
              text-center
            "
          >
            <h2
              className="
                font-['Cormorant_Garamond']
                text-[30px]
                text-[#43231C]
              "
            >
              Nothing here yet.
            </h2>

            <p
              className="
                mt-3
                font-['Poppins']
                text-[11px]
                text-[#71655B]
              "
            >
              New pieces will be added soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Collection;