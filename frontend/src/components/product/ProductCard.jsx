
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function ProductCard({ product, badgeType = "new" }) {
  const location = useLocation();
  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const productId = product?._id || product?.id;

  const productName =
    product?.name || product?.description || "Sirraha Product";

  const productCategory = product?.category || "Collection";

  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product?.image
        ? [product.image]
        : [];

  const originalPrice = Number(product?.price || 0);

  const salePrice =
    product?.salePrice !== null && product?.salePrice !== undefined
      ? Number(product.salePrice)
      : null;

  const hasSale =
    Boolean(product?.isOnSale) &&
    salePrice !== null &&
    salePrice > 0 &&
    salePrice < originalPrice;

  const finalPrice = hasSale ? salePrice : originalPrice;

  const discountPercentage =
    hasSale && originalPrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  const badgeText = badgeType === "best" ? "BEST SELLER" : "NEW IN";

  const productLink = `/product/${productId}`;

  const startImageSlider = () => {
    if (productImages.length <= 1 || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setImageIndex((previousIndex) => (previousIndex + 1) % productImages.length);
    }, 1200);
  };

  const stopImageSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setImageIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentImage =
    productImages[imageIndex] || productImages[0] || null;

  return (
    <article
      className="group w-full min-w-0"
      onMouseEnter={startImageSlider}
      onMouseLeave={stopImageSlider}
      onTouchStart={startImageSlider}
      onTouchEnd={stopImageSlider}
      onTouchCancel={stopImageSlider}
    >
      {/* ENTIRE PRODUCT CARD IS CLICKABLE */}
      <Link
        to={productLink}
        state={{ backgroundLocation: location }}
        aria-label={`View ${productName} details`}
        className="
          relative
          isolate
          block
          aspect-[3/4.2]
          w-full
          overflow-hidden
          rounded-[10px]
          bg-[#EDE8DF]
          shadow-none
          transition-shadow
          duration-500
          hover:shadow-[0_10px_28px_rgba(53,20,17,0.12)]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#C8A15A]
          sm:rounded-[12px]
        "
      >
        {/* PRODUCT IMAGE */}
        {currentImage ? (
          <img
            src={currentImage}
            alt={productName}
            loading="lazy"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.025]
            "
          />
        ) : (
          <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-[#F5F0E8] text-center">
            <span className="font-['Cormorant_Garamond'] text-2xl tracking-[3px] text-[#4B1F1B]">
              SIRRAHA
            </span>

            <span className="mt-1 font-['Poppins'] text-[8px] uppercase tracking-[2px] text-[#918477]">
              Image Coming Soon
            </span>
          </div>
        )}

        {/* SOFT IMAGE GRADIENT */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t from-[#24130F]/85 via-[#24130F]/35 to-transparent" />

        {/* NEW IN / BEST SELLER FROSTED BADGE */}
        <div
          className="
            pointer-events-none
            absolute
            left-2
            top-2
            z-10
            inline-flex
            items-center
            rounded-full
            border
            border-white/45
            bg-[#F7F4EE]/65
            px-2
            py-[4px]
            shadow-sm
            backdrop-blur-md
            sm:left-2.5
            sm:top-2.5
            sm:px-2.5
            sm:py-1
          "
        >
          <span
            className="
              whitespace-nowrap
              font-['Poppins']
              text-[7px]
              font-medium
              uppercase
              leading-none
              tracking-[0.45px]
              text-[#4B1F1B]
              sm:text-[8px]
              sm:tracking-[0.6px]
            "
          >
            {badgeText}
          </span>
        </div>

        {/* SMALL FROSTED DISCOUNT BADGE */}
        {hasSale && discountPercentage > 0 && (
          <div
            className="
              pointer-events-none
              absolute
              right-2
              top-2
              z-10
              flex
              h-[35px]
              w-[35px]
              flex-col
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-[#4B1F1B]/55
              text-white
              shadow-sm
              backdrop-blur-md
              sm:right-2.5
              sm:top-2.5
              sm:h-[39px]
              sm:w-[39px]
            "
          >
            <span className="font-['Cormorant_Garamond'] text-[12px] font-semibold leading-none sm:text-[13px]">
              {discountPercentage}%
            </span>

            <span className="mt-[2px] font-['Poppins'] text-[5px] font-medium uppercase leading-none tracking-[0.8px] text-white/90">
              OFF
            </span>
          </div>
        )}

        {/* PRODUCT NAME AND PRICES — CLICKABLE WITH THE CARD */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[2]
            flex
            items-end
            justify-between
            gap-2
            px-2.5
            pb-2.5
            pt-12
            text-white
            sm:px-3
            sm:pb-3
            sm:pt-14
            md:px-3.5
            md:pb-3.5
          "
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-['Poppins'] text-[6px] font-medium uppercase tracking-[1.5px] text-white/75 sm:text-[7px] sm:tracking-[1.8px]">
              {productCategory}
            </p>

            <h3 className="mt-1 line-clamp-2 font-['Cormorant_Garamond'] text-[16px] font-medium leading-[1.05] text-white sm:text-[19px] md:text-[21px]">
              {productName}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 sm:mt-2 sm:gap-x-2.5">
              <span className="whitespace-nowrap font-['Poppins'] text-[11px] font-semibold leading-none text-white sm:text-[13px] md:text-[14px]">
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>

              {hasSale && (
                <span className="whitespace-nowrap font-['Poppins'] text-[8px] leading-none text-white/65 line-through decoration-white/60 sm:text-[9px] md:text-[10px]">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
