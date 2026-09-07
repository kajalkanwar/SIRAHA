import { useState } from "react";

import { FiHeart, FiShoppingBag } from "react-icons/fi";

function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState("");

  const product = {
    productCode: "SRH001",
    category: "Kurtis",
    price: 1299,
    description:
      "Beautiful Rajasthani printed kurti, thoughtfully crafted for modern Indian elegance.",
    sizes: ["S", "M", "L", "XL"],
  };

  return (
    <section className="w-full bg-[#F8F4EC] py-12 sm:py-16">
      <div className="w-full max-w-[1316px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image */}
          <div className="w-full aspect-[3/4] bg-[#E8E1D5] flex flex-col items-center justify-center">
            <span className="text-[#0E5B3B] text-sm sm:text-base uppercase tracking-[4px]">
              Sirraha
            </span>

            <span className="mt-3 text-xs text-gray-500 uppercase tracking-[2px]">
              Image Coming Soon
            </span>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-3">
              {product.category}
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl text-[#222]">
              Coming Soon
            </h1>

            <p className="mt-4 text-xl text-[#333]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="mt-8 border-t border-[#D8D0C3] pt-6">
              <p className="text-sm leading-7 text-[#334155]">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <p className="text-sm uppercase tracking-[2px] text-[#222] mb-4">
                Select Size
              </p>

              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`
                      w-12 h-12 border
                      flex items-center justify-center
                      text-sm
                      transition
                      ${
                        selectedSize === size
                          ? "bg-[#0E5B3B] text-white border-[#0E5B3B]"
                          : "border-[#BDB5A8] text-[#222] hover:border-[#0E5B3B]"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              className="
                mt-8
                w-full
                bg-[#0E5B3B]
                text-white
                py-4
                flex items-center justify-center gap-3
                text-xs
                uppercase
                tracking-[2px]
                hover:bg-[#09452D]
                transition
              "
            >
              <FiShoppingBag size={17} />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button
              type="button"
              className="
                mt-4
                w-full
                border
                border-[#BDB5A8]
                text-[#222]
                py-4
                flex items-center justify-center gap-3
                text-xs
                uppercase
                tracking-[2px]
                hover:border-[#0E5B3B]
                transition
              "
            >
              <FiHeart size={17} />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;