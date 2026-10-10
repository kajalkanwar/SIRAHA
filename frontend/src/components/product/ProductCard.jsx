import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function ProductCard({ product, badgeType = "new" }) {
  const location = useLocation();
  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const productId = product?._id || product?.id;
  const productName = product?.name || product?.description || "Sirraha Product";
  const productCategory = product?.category || "Collection";
  const productImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : product?.image ? [product.image] : [];

  const originalPrice = Number(product?.price || 0);
  const salePrice = product?.salePrice !== null && product?.salePrice !== undefined
    ? Number(product.salePrice) : null;
  const hasSale = Boolean(product?.isOnSale) && salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasSale ? salePrice : originalPrice;
  const discountPercentage = hasSale && originalPrice > 0
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  const badgeText = badgeType === "best" ? "BEST SELLER" : "NEW IN";
  const productLink = `/product/${productId}`;

  const startImageSlider = () => {
    if (productImages.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
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

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const currentImage = productImages[imageIndex] || productImages[0] || null;

  return (
    <article className="group w-full min-w-0">
      <div
        className="relative w-full overflow-hidden border border-[#DED4C4] bg-[#F2EBDD] transition-all duration-300 ease-out group-hover:border-[#C8A15A]/60"
        onMouseEnter={startImageSlider}
        onMouseLeave={stopImageSlider}
        onTouchStart={startImageSlider}
        onTouchEnd={stopImageSlider}
        onTouchCancel={stopImageSlider}
      >
        <Link
          to={productLink}
          state={{ backgroundLocation: location }}
          className="block aspect-[4/5] w-full overflow-hidden"
          aria-label={`View ${productName}`}
        >
          {currentImage ? (
            <img src={currentImage} alt={productName} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#F2EBDD] text-center">
              <span className="font-['Cormorant_Garamond'] text-[22px] tracking-[3px] text-[#5A3026]">SIRRAHA</span>
              <span className="mt-1 font-['Poppins'] text-[7px] uppercase tracking-[2px] text-[#918477]">Image Coming Soon</span>
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-full border border-[#FFFDF9]/65 bg-white/[0.08] px-2.5 py-1.5 shadow-[0_2px_12px_rgba(67,35,28,0.08)] backdrop-blur-md sm:left-3 sm:top-3 sm:px-3">
          <span className="font-['Poppins'] text-[6px] font-medium uppercase tracking-[1.8px] text-[#FFFDF9] drop-shadow-[0_1px_2px_rgba(67,35,28,0.35)] sm:text-[7px]">{badgeText}</span>
        </div>

        {hasSale && discountPercentage > 0 && (
          <div className="pointer-events-none absolute right-2.5 top-2.5 z-10 flex h-[40px] w-[40px] flex-col items-center justify-center rounded-full border border-[#FFFDF9]/20 bg-[#5A3026]/90 text-[#FFFDF9] shadow-[0_3px_12px_rgba(67,35,28,0.12)] sm:right-3 sm:top-3 sm:h-[46px] sm:w-[46px]">
            <span className="font-['Cormorant_Garamond'] text-[14px] font-semibold leading-none sm:text-[15px]">{discountPercentage}%</span>
            <span className="mt-0.5 font-['Poppins'] text-[5px] uppercase tracking-[1.4px] text-[#F2EBDD]">OFF</span>
          </div>
        )}

        <Link
          to={productLink}
          state={{ backgroundLocation: location }}
          className="absolute bottom-2 left-2 right-2 z-20 flex h-[38px] translate-y-2 items-center justify-center gap-2 border border-[#5A3026] bg-[#5A3026] px-3 font-['Poppins'] text-[7px] font-medium uppercase tracking-[2px] !text-[#FFFDF9] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:border-[#43231C] hover:bg-[#43231C] hover:!text-[#FFFDF9] sm:bottom-3 sm:left-3 sm:right-3 sm:h-[40px] sm:text-[8px]"
        >
          <FiArrowRight size={13} strokeWidth={1.5} />
          <span>View Details</span>
        </Link>
      </div>

      <div className="w-full border-x border-b border-[#DED4C4] bg-[#FFFDF9] px-3 py-3 transition-colors duration-300 group-hover:border-[#C8A15A]/60 sm:px-3.5 sm:py-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-['Poppins'] text-[6px] font-medium uppercase tracking-[1.8px] text-[#A98243] sm:text-[7px]">{productCategory}</p>
            <Link to={productLink} state={{ backgroundLocation: location }}>
              <h3 className="mt-1 truncate font-['Cormorant_Garamond'] text-[17px] font-normal leading-tight text-[#43231C] transition-colors duration-300 hover:text-[#795033] sm:text-[18px]">{productName}</h3>
            </Link>
          </div>

          <div className="shrink-0 text-right">
            {hasSale && <p className="whitespace-nowrap font-['Poppins'] text-[8px] font-medium text-[#7A5A4A] line-through decoration-[#5A3026] sm:text-[9px]">₹{originalPrice.toLocaleString("en-IN")}</p>}
            <p className="mt-0.5 whitespace-nowrap font-['Cormorant_Garamond'] text-[16px] font-medium leading-none text-[#43231C] sm:text-[17px]">₹{finalPrice.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="mt-3 h-px w-8 bg-[#C8A15A] transition-all duration-300 group-hover:w-12" />
      </div>
    </article>
  );
}

export default ProductCard;
