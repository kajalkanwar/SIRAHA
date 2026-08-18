import { products } from "../../constants/products";
import ProductCard from "../product/ProductCard";

function NewArrivals() {
  return (
    <section className="w-full bg-[#F8F4EC] py-16 sm:py-20">

    {/* ================= SECTION HEADER ================= */}
<div className="w-full flex justify-center">
  <div className="w-full max-w-[1316px] px-5 sm:px-6">

    <div className="pt-16 sm:pt-20 lg:pt-24 mb-10 sm:mb-12">

      {/* Just In */}
      <p className="
        text-[#0E5B3B]
        uppercase
        tracking-[4px]
        text-[9px]
        sm:text-[10px]
        mb-2
      ">
        Just In
      </p>

      {/* New Arrivals */}
      <h2 className="
        font-serif
        font-normal
        text-[#222]
        text-3xl
        sm:text-4xl
        lg:text-5xl
        leading-[1.05]
      ">
        New Arrivals
      </h2>

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
        Discover our latest pieces, thoughtfully crafted for modern Indian
        elegance.
      </p>

    </div>

  </div>
</div>


      {/* ================= PRODUCT GRID ================= */}
      <div className="w-full flex justify-center">

        <div
          className="
            w-full
            max-w-[1316px]
            px-5
            sm:px-6
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-x-5
            gap-y-12
          "
        >

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default NewArrivals;