import { products } from "../../constants/products.js";
import ProductCard from "../product/ProductCard";

function BestSellers() {
  const bestSellers = products.slice(0, 4);

  return (
    <section className="w-full bg-[#F8F4EC] py-16 sm:py-20 lg:py-24">

      {/* ================= MAIN CENTERED CONTAINER ================= */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1316px] px-5 sm:px-6">

          {/* ================= SECTION HEADER ================= */}
          <div className="mb-10 sm:mb-12">

            {/* Heading + View All */}
            <div className="flex items-end justify-between">

              <h2 className="
                font-serif
                font-normal
                text-[#222]
                text-3xl
                sm:text-4xl
                lg:text-[42px]
                leading-[1.05]
              ">
                Best Sellers
              </h2>

              <button
                type="button"
                className="
                  text-[#0E5B3B]
                  uppercase
                  tracking-[3px]
                  text-[9px]
                  sm:text-[10px]
                  pb-1
                  hover:opacity-70
                  transition
                "
              >
                View All
              </button>

            </div>

            {/* Description */}
            <p className="
              mt-3
              max-w-[620px]
              text-xs
              sm:text-sm
              lg:text-base
              text-[#334155]
              leading-6
            ">
              Timeless pieces that have become favourites in the Sirraha collection.
            </p>

          </div>


          {/* ================= PRODUCT GRID ================= */}
          <div
            className="
              w-full
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-x-4
              sm:gap-x-5
              lg:gap-x-6
              gap-y-10
              sm:gap-y-12
            "
          >

            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </div>
      </div>

    </section>
  );
}

export default BestSellers;