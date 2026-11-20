
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
  FiShoppingBag,
  FiTruck,
  FiX,
} from "react-icons/fi";

import { getProductById } from "../../constants/api";
import { useCart } from "../../hooks/useCart";
import {
  getSizeInventory,
  getTotalStock,
} from "../../utils/inventory";

const DEFAULT_SIZE_GUIDE = {
  description:
    "Finding your perfect fit is easy. All measurements are in inches and taken on the body — not the garment. When in doubt, size up.",
  sizes: [
    { size: "XS", bust: '32"', waist: '32"', hip: '34"' },
    { size: "S", bust: '34"', waist: '34"', hip: '36"' },
    { size: "M", bust: '36"', waist: '36"', hip: '38"' },
    { size: "L", bust: '38"', waist: '38"', hip: '40"' },
    { size: "XL", bust: '40"', waist: '40"', hip: '42"' },
  ],
};

const DEFAULT_SHIPPING_INFO =
  "We carefully pack every order and ship across India. Orders are usually dispatched within 3–5 business days.";

const DEFAULT_RETURN_POLICY =
  "We offer easy exchanges on eligible products. Please make sure the product is unused, unwashed and returned with its original tags and packaging.";

const MEASUREMENT_GUIDE = [
  {
    title: "Bust",
    description:
      "Measure around the fullest part of your chest, keeping the tape parallel to the floor.",
  },
  {
    title: "Waist",
    description:
      "Measure around your natural waistline, the narrowest part of your torso.",
  },
  {
    title: "Hip",
    description:
      "Measure around the fullest part of your hips, about 8 inches below your waist.",
  },
  {
    title: "Kurti Length",
    description:
      "Measured from the shoulder seam down to the hem.",
  },
];

const getAvailableSizes = (product) => {
  const inventory = getSizeInventory(product);

  if (!inventory.length) return [];

  if (
    Array.isArray(product?.sizeInventory) &&
    product.sizeInventory.length > 0
  ) {
    return inventory.filter(
      (item) => Number(item.stock || 0) > 0
    );
  }

  return inventory;
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addingToBag, setAddingToBag] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const data = await getProductById(id);

        if (!mounted) return;

        setProduct(data);
        setSelectedImageIndex(0);

        const available = getAvailableSizes(data);
        setSelectedSize(available[0]?.size || "");
      } catch (error) {
        if (!mounted) return;

        console.error("Failed to fetch product:", error);

        setProduct(null);
        setFetchError(
          error?.message ||
            "We could not load this product right now."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (!showSizeGuide) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSizeGuide(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSizeGuide]);

  const availableSizes = useMemo(
    () => getAvailableSizes(product),
    [product]
  );

  const totalStock = getTotalStock(product);
  const isOutOfStock = totalStock <= 0;

  const selectedSizeAvailable = availableSizes.some(
    (item) => item.size === selectedSize
  );

  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : ["/images/product-placeholder.jpg"];

  const currentImage =
    productImages[selectedImageIndex] || productImages[0];

  const originalPrice = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);

  const hasSale =
    product?.isOnSale === true &&
    salePrice > 0 &&
    salePrice < originalPrice;

  const displayPrice = hasSale ? salePrice : originalPrice;

  const discountPercentage =
    hasSale && originalPrice > 0
      ? Math.round(
          ((originalPrice - salePrice) / originalPrice) * 100
        )
      : 0;

  const shippingInfo =
    product?.shippingInfo?.trim() || DEFAULT_SHIPPING_INFO;

  const returnPolicy =
    product?.returnPolicy?.trim() || DEFAULT_RETURN_POLICY;

  const sizeGuide =
    product?.sizeGuide &&
    Array.isArray(product.sizeGuide.sizes) &&
    product.sizeGuide.sizes.length > 0
      ? product.sizeGuide
      : DEFAULT_SIZE_GUIDE;

  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "9198XXXXXXXX";

  const whatsappMessage = product
    ? `Hi Sirraha, I would like to know more about ${product.name}.`
    : "Hi Sirraha, I need help with a product.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handlePreviousImage = () => {
    setSelectedImageIndex((index) =>
      index === 0 ? productImages.length - 1 : index - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((index) =>
      index === productImages.length - 1 ? 0 : index + 1
    );
  };

  const handleAddToBag = () => {
    if (
      !product ||
      isOutOfStock ||
      !selectedSizeAvailable ||
      addingToBag
    ) {
      return;
    }

    try {
      setAddingToBag(true);
      addToCart(product, selectedSize);

      window.setTimeout(() => {
        setAddingToBag(false);
      }, 500);
    } catch (error) {
      console.error("Failed to add product to bag:", error);
      setAddingToBag(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-4 sm:pt-5">
        <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid animate-pulse gap-6 lg:grid-cols-2">
            <div className="aspect-[4/5] bg-[#EDE5D8] lg:aspect-auto lg:h-[calc(100vh-220px)]" />

            <div className="space-y-4 py-5">
              <div className="h-3 w-24 bg-[#E5DCCF]" />
              <div className="h-10 w-3/4 bg-[#E5DCCF]" />
              <div className="h-5 w-28 bg-[#E5DCCF]" />
              <div className="h-px w-full bg-[#F1ECE9]" />
              <div className="h-12 w-full bg-[#E5DCCF]" />
              <div className="h-10 w-full bg-[#E5DCCF]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white pt-6">
        <div className="mx-auto flex min-h-[65vh] max-w-[650px] items-center justify-center px-5 text-center">
          <div>
            <p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[3px] text-[#A98243]">
              Sirraha
            </p>

            <h1 className="mt-4 font-['Cormorant_Garamond'] text-[42px] font-normal text-[#351411]">
              Product not found
            </h1>

            <p className="mx-auto mt-3 max-w-[420px] font-['Poppins'] text-[11px] leading-6 text-[#6B5651]">
              {fetchError ||
                "We could not find the product you were looking for."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-7 inline-flex items-center gap-2 bg-[#4B1F1B] px-7 py-3 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-white transition hover:bg-[#351411]"
            >
              <FiArrowLeft size={13} />
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
     <main className="min-h-screen bg-[#FFFFFF] pt-2 sm:pt-3 lg:pt-4">
  <div className="mx-auto max-w-[1500px] bg-[#FFFFFF] px-3 pb-8 sm:px-5 lg:px-8 lg:pb-5">
          {/* BACK NAVIGATION */}
          <div className="py-3 sm:py-4 lg:py-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.6px] text-[#765348] transition hover:text-[#351411]"
            >
              <FiArrowLeft
                size={12}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Back to Collection
            </button>
          </div>

          {/* PRODUCT DETAILS CARD */}
          <div className="grid overflow-hidden border border-[#E5DDD8] bg-white shadow-[0_12px_45px_rgba(67,35,28,0.045)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)]">
            {/* PRODUCT IMAGE GALLERY */}
            <section className="min-w-0 bg-[#FFFFFF]">
  <div className="relative flex h-[clamp(380px,68vh,760px)] items-center justify-center overflow-hidden bg-[#FFFFFF] sm:h-[clamp(440px,70vh,780px)] lg:h-[calc(100vh-205px)] lg:min-h-[480px] lg:max-h-[760px]">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />

                {/* DISCOUNT BADGE */}
                {hasSale && (
                  <div className="absolute left-3 top-3 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-white/20 bg-[#4B1F1B]/90 text-white shadow-sm sm:left-4 sm:top-4">
                    <span className="font-['Poppins'] text-[6px] font-medium uppercase">
                      Save
                    </span>
                    <span className="font-['Poppins'] text-[9px] font-semibold">
                      {discountPercentage}%
                    </span>
                  </div>
                )}

                {/* OUT OF STOCK */}
                {isOutOfStock && (
                  <div className="absolute bottom-3 left-3 rounded-full border border-white/40 bg-[#351411]/90 px-3 py-2 backdrop-blur-sm">
                    <span className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-white">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* IMAGE NAVIGATION */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousImage}
                      aria-label="Previous image"
                      className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#E5DDD8] bg-white/90 text-[#4B1F1B] backdrop-blur-sm transition hover:border-[#C8A15A] sm:left-3"
                    >
                      <FiChevronLeft size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#E5DDD8] bg-white/90 text-[#4B1F1B] backdrop-blur-sm transition hover:border-[#C8A15A] sm:right-3"
                    >
                      <FiChevronRight size={17} />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-[#351411]/80 px-2.5 py-1.5 font-['Poppins'] text-[8px] tracking-[1.3px] text-white">
                      {selectedImageIndex + 1} / {productImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* IMAGE THUMBNAILS */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-[#E5DDD8] bg-white p-2.5 scrollbar-hide lg:p-2">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View product image ${index + 1}`}
                      className={`h-[58px] w-[46px] shrink-0 overflow-hidden border transition sm:h-[64px] sm:w-[50px] ${
                        selectedImageIndex === index
                          ? "border-[#C8A15A]"
                          : "border-[#E5DDD8] opacity-75 hover:border-[#A98243] hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* PRODUCT INFORMATION */}
            <section className="min-w-0 bg-white">
              <div className="px-4 py-5 sm:px-6 sm:py-6 lg:flex lg:h-full lg:flex-col lg:justify-center lg:px-7 lg:py-5 xl:px-9">
                {/* CATEGORY */}
                <div className="flex items-center gap-2.5">
                  <span className="h-px w-7 bg-[#C8A15A]" />

                  <p className="font-['Poppins'] text-[7px] font-medium uppercase tracking-[2px] text-[#A98243] sm:text-[8px]">
                    {product.category || "Sirraha Collection"}
                  </p>
                </div>

                {/* NAME */}
                <h1 className="mt-2.5 max-w-[620px] font-['Cormorant_Garamond'] text-[32px] font-normal leading-[1] tracking-[-0.3px] text-[#351411] sm:text-[40px] lg:mt-2 lg:text-[clamp(34px,3vw,48px)]">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <span className="font-['Poppins'] text-[16px] font-medium text-[#4B1F1B] sm:text-[18px]">
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </span>

                  {hasSale && (
                    <>
                      <span className="font-['Poppins'] text-[10px] text-[#7A5A4A] line-through sm:text-[11px]">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>

                      <span className="font-['Poppins'] text-[7px] font-medium uppercase tracking-[1.2px] text-[#A98243]">
                        {discountPercentage}% Off
                      </span>
                    </>
                  )}
                </div>

                <div className="my-4 h-px w-full bg-[#F1ECE9] lg:my-4" />

                {/* DESCRIPTION */}
                {product.description && (
                  <p className="whitespace-pre-line font-['Poppins'] text-[10px] leading-5 text-[#6B5651] sm:text-[11px]">
                    {product.description}
                  </p>
                )}

                {/* SIZE SELECTOR */}
                <div className="mt-5 lg:mt-4">
                  {isOutOfStock ? (
                    <div className="border border-[#E3D6D0] bg-[#FAF2EF] px-4 py-3">
                      <p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.6px] text-[#8A5A51]">
                        Currently unavailable
                      </p>

                      <p className="mt-1.5 font-['Poppins'] text-[9px] leading-4 text-[#8A5A51]">
                        This product is currently out of stock. You can
                        contact us on WhatsApp for availability updates.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.7px] text-[#A98243]">
                          Select Size
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowSizeGuide(true)}
                          className="group inline-flex items-center gap-1.5 border-b border-[#C8A15A] pb-1 font-['Poppins'] text-[7px] font-medium uppercase tracking-[1.3px] text-[#4B1F1B] sm:text-[8px]"
                        >
                          Size Guide
                          <FiArrowRight
                            size={11}
                            className="text-[#A98243] transition group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>

                      {availableSizes.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {availableSizes.map((item) => (
                            <button
                              key={item.size}
                              type="button"
                              onClick={() => setSelectedSize(item.size)}
                              className={`min-w-[48px] border px-3 py-2.5 font-['Poppins'] text-[9px] font-medium uppercase tracking-[1px] transition sm:min-w-[54px] ${
                                selectedSize === item.size
                                  ? "border-[#4B1F1B] bg-[#4B1F1B] text-white"
                                  : "border-[#E5DDD8] bg-white text-[#4B1F1B] hover:border-[#C8A15A]"
                              }`}
                            >
                              {item.size}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 border border-[#E5DDD8] bg-white px-3 py-3 font-['Poppins'] text-[9px] leading-4 text-[#6B5651]">
                          No sizes are currently available.
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-5 space-y-2 lg:mt-4">
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={
                      addingToBag ||
                      isOutOfStock ||
                      availableSizes.length === 0 ||
                      !selectedSizeAvailable
                    }
                    className="flex h-10 w-full items-center justify-center gap-2 bg-[#4B1F1B] px-4 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-white transition hover:bg-[#351411] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11"
                  >
                    <FiShoppingBag size={14} />

                    {addingToBag
                      ? "Adding..."
                      : isOutOfStock
                        ? "Out of Stock"
                        : "Add to Bag"}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-full items-center justify-center gap-2 border border-[#E5DDD8] bg-white px-4 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#4B1F1B] transition hover:border-[#C8A15A] sm:h-10"
                  >
                    Ask on WhatsApp
                    <FiArrowRight size={13} />
                  </a>
                </div>

                {/* SHIPPING AND EXCHANGE INFORMATION */}
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-4">
                  <InfoCard
                    icon={<FiTruck size={15} />}
                    title="Shipping"
                    text={shippingInfo}
                  />

                  <InfoCard
                    icon={<FiRotateCcw size={15} />}
                    title="Easy Exchanges"
                    text={returnPolicy}
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="mt-5 border-t border-[#F1ECE9] pt-4 lg:mt-4 lg:pt-3">
                  <p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#A98243]">
                    Product Details
                  </p>

                  <div className="mt-3 space-y-2.5">
                    <DetailRow
                      label="Category"
                      value={product.category}
                    />

                    {product.isNew && (
                      <DetailRow
                        label="Collection"
                        value="New Arrival"
                      />
                    )}

                    {product.isFeatured && (
                      <DetailRow
                        label="Selection"
                        value="Featured"
                      />
                    )}
                  </div>
                </div>

                {/* BRAND SIGNATURE */}
                <div className="mt-4 border-t border-[#F1ECE9] pt-3 text-center">
                  <p className="font-['Cormorant_Garamond'] text-[15px] italic text-[#918477]">
                    Made for your everyday elegance.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#241611]/55 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSizeGuide(false);
            }
          }}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto bg-white shadow-[0_30px_100px_rgba(67,35,28,0.22)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              aria-label="Close size guide"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#E5DDD8] bg-white text-[#4B1F1B] hover:border-[#C8A15A]"
            >
              <FiX size={16} />
            </button>

            <div className="px-5 py-7 sm:px-9 sm:py-9">
              <p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[2.5px] text-[#A98243]">
                Sirraha
              </p>

              <h2 className="mt-3 font-['Cormorant_Garamond'] text-[36px] font-normal leading-none text-[#351411] sm:text-[38px]">
                Size Guide
              </h2>

              <p className="mt-3 font-['Poppins'] text-[10px] leading-6 text-[#6B5651]">
                {sizeGuide.description}
              </p>

              <div className="mt-6 overflow-x-auto border border-[#E5DDD8]">
                <table className="w-full min-w-[440px] border-collapse">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      {["Size", "Bust", "Waist", "Hip"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="border-b border-[#E5DDD8] px-4 py-3 text-center font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-[#4B1F1B]"
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {sizeGuide.sizes.map((item) => (
                      <tr
                        key={item.size}
                        className="border-b border-[#F1ECE9] last:border-b-0"
                      >
                        <td className="px-4 py-3 text-center font-['Poppins'] text-[9px] font-medium uppercase tracking-[1px] text-[#4B1F1B]">
                          {item.size}
                        </td>

                        <td className="px-4 py-3 text-center font-['Poppins'] text-[10px] text-[#6B5651]">
                          {item.bust}
                        </td>

                        <td className="px-4 py-3 text-center font-['Poppins'] text-[10px] text-[#6B5651]">
                          {item.waist}
                        </td>

                        <td className="px-4 py-3 text-center font-['Poppins'] text-[10px] text-[#6B5651]">
                          {item.hip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-7">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[#C8A15A]" />

                  <h3 className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#A98243]">
                    How to Measure
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  {MEASUREMENT_GUIDE.map((item) => (
                    <div
                      key={item.title}
                      className="border-b border-[#F1ECE9] pb-4 last:border-b-0 last:pb-0"
                    >
                      <p className="font-['Poppins'] text-[10px] font-medium uppercase tracking-[1.2px] text-[#4B1F1B]">
                        {item.title}
                      </p>

                      <p className="mt-1 font-['Poppins'] text-[10px] leading-5 text-[#6B5651]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 border border-[#E5DDD8] bg-[#FAF8F5] px-4 py-4 sm:px-5 sm:py-5">
                <p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[1.5px] text-[#A98243]">
                  Still unsure?
                </p>

                <p className="mt-2 font-['Poppins'] text-[10px] leading-5 text-[#6B5651]">
                  WhatsApp us before placing your order — we'll help
                  you pick the right size.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 border-b border-[#C8A15A] pb-1 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#4B1F1B]"
                >
                  Ask on WhatsApp
                  <FiArrowRight size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const InfoCard = ({ icon, title, text }) => (
  <div className="min-w-0 border border-[#E5DDD8] bg-white p-3">
    <div className="flex items-center gap-2 text-[#4B1F1B]">
      {icon}

      <p className="font-['Poppins'] text-[7px] font-medium uppercase tracking-[1.3px] sm:text-[8px]">
        {title}
      </p>
    </div>

    <p className="mt-1.5 font-['Poppins'] text-[8px] leading-[1.6] text-[#6B5651] sm:text-[9px]">
      {text}
    </p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 border-b border-[#F0E9E1] pb-2">
    <span className="font-['Poppins'] text-[8px] uppercase tracking-[1px] text-[#918477]">
      {label}
    </span>

    <span className="text-right font-['Poppins'] text-[8px] font-medium uppercase tracking-[0.5px] text-[#4B1F1B]">
      {value || "—"}
    </span>
  </div>
);

export default ProductDetails;
