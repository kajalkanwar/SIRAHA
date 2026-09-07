import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

function ProductCard({ product }) {
  return (
    <div className="w-full min-w-0 overflow-hidden">

      {/* Product Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#E8E1D5]">

        {product.image && product.image !== "null" ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-[#0E5B3B] text-xs sm:text-sm uppercase tracking-[3px]">
              Sirraha
            </span>

            <span className="mt-2 text-[9px] sm:text-xs text-gray-500 uppercase tracking-[2px]">
              Image Coming Soon
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="
            absolute top-3 right-3
            w-9 h-9
            rounded-full
            bg-white/90
            flex items-center justify-center
            hover:bg-white
            transition
          "
        >
          <FiHeart size={17} />
        </button>

        {/* Quick Add */}
        <button
          type="button"
          className="
            absolute
            bottom-3
            left-3
            right-3
            bg-white/95
            py-3
            text-xs
            uppercase
            tracking-[2px]
            opacity-0
            translate-y-2
            hover:opacity-100
            hover:translate-y-0
            transition-all
            duration-300
          "
        >
          <span className="flex items-center justify-center gap-2">
            <FiShoppingBag size={15} />
            Quick Add
          </span>
        </button>

      </div>

      {/* Product Information */}
      <div className="pt-4 w-full min-w-0">

        <p className="
          text-[10px]
          sm:text-xs
          uppercase
          tracking-[2px]
          text-gray-500
          mb-1
          truncate
        ">
          {product.category}
        </p>

        <Link to={`/product/${product._id}`} className="block">
          <h3 className="
            font-serif
            text-lg
            sm:text-xl
            text-[#222]
            hover:text-[#0E5B3B]
            transition
            leading-tight
          ">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm sm:text-base text-[#333]">
          ₹{product.price?.toLocaleString("en-IN")}
        </p>

      </div>

    </div>
  );
}

export default ProductCard;