import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiChevronLeft, FiChevronRight, FiRotateCcw, FiShoppingBag, FiTruck, FiX } from "react-icons/fi";
import { getProductById } from "../../constants/api";
import { useCart } from "../../hooks/useCart";
import { getSizeInventory, getTotalStock } from "../../utils/inventory";

const DEFAULT_SIZE_GUIDE = {
  description: "Finding your perfect fit is easy. All measurements are in inches and taken on the body — not the garment. When in doubt, size up.",
  sizes: [
    { size: "XS", bust: '32"', waist: '32"', hip: '34"' },
    { size: "S", bust: '34"', waist: '34"', hip: '36"' },
    { size: "M", bust: '36"', waist: '36"', hip: '38"' },
    { size: "L", bust: '38"', waist: '38"', hip: '40"' },
    { size: "XL", bust: '40"', waist: '40"', hip: '42"' },
  ],
};

const DEFAULT_SHIPPING_INFO = "We carefully pack every order and ship across India. Orders are usually dispatched within 3–5 business days.";
const DEFAULT_RETURN_POLICY = "We offer easy exchanges on eligible products. Please make sure the product is unused, unwashed and returned with its original tags and packaging.";

const MEASUREMENT_GUIDE = [
  { title: "Bust", description: "Measure around the fullest part of your chest, keeping the tape parallel to the floor." },
  { title: "Waist", description: "Measure around your natural waistline, the narrowest part of your torso." },
  { title: "Hip", description: "Measure around the fullest part of your hips, about 8 inches below your waist." },
  { title: "Kurti Length", description: "Measured from the shoulder seam down to the hem." },
];

const getAvailableSizes = (product) => {
  const inventory = getSizeInventory(product);
  if (!inventory.length) return [];
  if (Array.isArray(product?.sizeInventory) && product.sizeInventory.length > 0) {
    return inventory.filter((item) => Number(item.stock || 0) > 0);
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
        setFetchError(error?.message || "We could not load this product right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (!showSizeGuide) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowSizeGuide(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSizeGuide]);

  const availableSizes = useMemo(() => getAvailableSizes(product), [product]);
  const totalStock = getTotalStock(product);
  const isOutOfStock = totalStock <= 0;
  const selectedSizeAvailable = availableSizes.some((item) => item.size === selectedSize);

  const productImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : ["/images/product-placeholder.jpg"];
  const currentImage = productImages[selectedImageIndex] || productImages[0];

  const originalPrice = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);
  const hasSale = product?.isOnSale === true && salePrice > 0 && salePrice < originalPrice;
  const displayPrice = hasSale ? salePrice : originalPrice;
  const discountPercentage = hasSale && originalPrice > 0
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  const shippingInfo = product?.shippingInfo?.trim() || DEFAULT_SHIPPING_INFO;
  const returnPolicy = product?.returnPolicy?.trim() || DEFAULT_RETURN_POLICY;
  const sizeGuide = product?.sizeGuide && Array.isArray(product.sizeGuide.sizes) && product.sizeGuide.sizes.length > 0 ? product.sizeGuide : DEFAULT_SIZE_GUIDE;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "9198XXXXXXXX";
  const whatsappMessage = product ? `Hi Sirraha, I would like to know more about ${product.name}.` : "Hi Sirraha, I need help with a product.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handlePreviousImage = () => setSelectedImageIndex((index) => index === 0 ? productImages.length - 1 : index - 1);
  const handleNextImage = () => setSelectedImageIndex((index) => index === productImages.length - 1 ? 0 : index + 1);

  const handleAddToBag = () => {
    if (!product || isOutOfStock || !selectedSizeAvailable) return;
    try {
      setAddingToBag(true);
      addToCart(product, selectedSize);
      window.setTimeout(() => setAddingToBag(false), 500);
    } catch (error) {
      console.error("Failed to add product to bag:", error);
      setAddingToBag(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] pt-[112px] md:pt-[158px] lg:pt-[176px]">
        <div className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
            <div className="aspect-[4/5] bg-[#EDE5D8]" />
            <div className="space-y-5 py-6"><div className="h-3 w-24 bg-[#E5DCCF]" /><div className="h-12 w-3/4 bg-[#E5DCCF]" /><div className="h-6 w-28 bg-[#E5DCCF]" /><div className="h-px w-full bg-[#EAE2D5]" /><div className="h-16 w-full bg-[#E5DCCF]" /><div className="h-12 w-full bg-[#E5DCCF]" /></div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] pt-[112px] md:pt-[158px] lg:pt-[176px]">
        <div className="mx-auto flex min-h-[65vh] max-w-[650px] items-center justify-center px-5 text-center">
          <div><p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[3px] text-[#A98243]">Sirraha</p><h1 className="mt-4 font-['Cormorant_Garamond'] text-[42px] font-normal text-[#43231C]">Product not found</h1><p className="mx-auto mt-3 max-w-[420px] font-['Poppins'] text-[11px] leading-6 text-[#71655B]">{fetchError || "We could not find the product you were looking for."}</p><button type="button" onClick={() => navigate(-1)} className="mt-7 inline-flex items-center gap-2 bg-[#5A3026] px-7 py-3 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#FFFDF9] transition hover:bg-[#43231C]"><FiArrowLeft size={13} />Continue Shopping</button></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#FAF7F0] pt-[112px] md:pt-[158px] lg:pt-[176px]">
        <div className="mx-auto max-w-[1380px] px-4 pb-16 sm:px-6 lg:px-10">
          <div className="py-5 sm:py-7"><button type="button" onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#765348] transition hover:text-[#43231C]"><FiArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />Back to Collection</button></div>

          <div className="grid overflow-hidden border border-[#DED4C4] bg-[#FFFDF9] shadow-[0_18px_70px_rgba(67,35,28,0.06)] lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)]">
            <section className="bg-[#F2EBDD]">
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6] lg:aspect-auto lg:min-h-[760px]">
                <img src={currentImage} alt={product.name} className="h-full w-full object-cover" />
                {hasSale && <div className="absolute left-4 top-4 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#5A3026] text-[#FFFDF9] shadow-lg sm:left-5 sm:top-5"><span className="font-['Poppins'] text-[7px] font-medium uppercase">Save</span><span className="font-['Poppins'] text-[9px] font-semibold">{discountPercentage}%</span></div>}
                {isOutOfStock && <div className="absolute bottom-4 left-4 rounded-full border border-[#FFFDF9]/40 bg-[#43231C]/90 px-4 py-2 backdrop-blur-sm"><span className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#FFFDF9]">Out of Stock</span></div>}
                {productImages.length > 1 && <><button type="button" onClick={handlePreviousImage} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#DED4C4] bg-[#FFFDF9]/90 text-[#5A3026] backdrop-blur-sm hover:border-[#C8A15A]"><FiChevronLeft size={17} /></button><button type="button" onClick={handleNextImage} aria-label="Next image" className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#DED4C4] bg-[#FFFDF9]/90 text-[#5A3026] backdrop-blur-sm hover:border-[#C8A15A]"><FiChevronRight size={17} /></button><div className="absolute bottom-4 right-4 bg-[#43231C]/80 px-3 py-1.5 font-['Poppins'] text-[8px] tracking-[1.5px] text-[#FFFDF9]">{selectedImageIndex + 1} / {productImages.length}</div></>}
              </div>
              {productImages.length > 1 && <div className="flex gap-2 overflow-x-auto border-t border-[#DED4C4] p-3 scrollbar-hide">{productImages.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)} className={`h-20 w-16 shrink-0 overflow-hidden border transition ${selectedImageIndex === index ? "border-[#C8A15A]" : "border-[#DED4C4] opacity-70 hover:border-[#A98243] hover:opacity-100"}`}><img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
            </section>

            <section className="bg-[#FFFDF9]"><div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#C8A15A]" /><p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[2.5px] text-[#A98243]">{product.category || "Sirraha Collection"}</p></div>
              <h1 className="mt-4 max-w-[620px] font-['Cormorant_Garamond'] text-[38px] font-normal leading-[0.95] tracking-[-0.4px] text-[#43231C] sm:text-[48px] lg:text-[54px]">{product.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3"><span className="font-['Poppins'] text-[18px] font-medium text-[#5A3026]">₹{displayPrice.toLocaleString("en-IN")}</span>{hasSale && <><span className="font-['Poppins'] text-[12px] text-[#7A5A4A] line-through">₹{originalPrice.toLocaleString("en-IN")}</span><span className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-[#A98243]">{discountPercentage}% Off</span></>}</div>
              <div className="my-7 h-px w-full bg-[#EAE2D5]" />
              <p className="whitespace-pre-line font-['Poppins'] text-[11px] leading-7 text-[#71655B]">{product.description}</p>

              <div className="mt-8">
                {isOutOfStock ? <div className="border border-[#E3D6D0] bg-[#FAF2EF] px-5 py-5"><p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#8A5A51]">Currently unavailable</p><p className="mt-2 font-['Poppins'] text-[10px] leading-5 text-[#8A5A51]">This product is currently out of stock. You can still view the complete details and contact us on WhatsApp for availability updates.</p></div> : <><div className="flex items-center justify-between gap-4"><p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#A98243]">Select Size</p><button type="button" onClick={() => setShowSizeGuide(true)} className="group inline-flex items-center gap-1.5 border-b border-[#C8A15A] pb-1 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.6px] text-[#5A3026]">Size Guide<FiArrowRight size={11} className="text-[#A98243] transition group-hover:translate-x-0.5" /></button></div>{availableSizes.length > 0 ? <div className="mt-4 flex flex-wrap gap-2.5">{availableSizes.map((item) => <button key={item.size} type="button" onClick={() => setSelectedSize(item.size)} className={`min-w-[58px] border px-4 py-3 font-['Poppins'] text-[10px] font-medium uppercase tracking-[1.5px] transition ${selectedSize === item.size ? "border-[#5A3026] bg-[#5A3026] text-[#FFFDF9]" : "border-[#DED4C4] bg-[#FFFDF9] text-[#5A3026] hover:border-[#C8A15A]"}`}>{item.size}</button>)}</div> : <div className="mt-4 border border-[#DED4C4] bg-[#F2EBDD] px-4 py-4 font-['Poppins'] text-[9px] leading-5 text-[#71655B]">No sizes are currently available.</div>}</>}
              </div>

              <div className="mt-7 space-y-2.5"><button type="button" onClick={handleAddToBag} disabled={addingToBag || isOutOfStock || availableSizes.length === 0 || !selectedSizeAvailable} className="flex h-12 w-full items-center justify-center gap-2.5 bg-[#5A3026] px-5 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#FFFDF9] transition hover:bg-[#43231C] disabled:cursor-not-allowed disabled:opacity-50"><FiShoppingBag size={15} />{addingToBag ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Bag"}</button><a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex h-12 w-full items-center justify-center gap-2.5 border border-[#DED4C4] bg-[#FFFDF9] px-5 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#5A3026] transition hover:border-[#C8A15A] hover:bg-[#F2EBDD]">Ask on WhatsApp<FiArrowRight size={14} /></a></div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2"><InfoCard icon={<FiTruck size={17} />} title="Shipping" text={shippingInfo} /><InfoCard icon={<FiRotateCcw size={17} />} title="Easy Exchanges" text={returnPolicy} /></div>
              <div className="mt-9 border-t border-[#EAE2D5] pt-7"><p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#A98243]">Product Details</p><div className="mt-5 space-y-4"><DetailRow label="Category" value={product.category} />{product.isNew && <DetailRow label="Collection" value="New Arrival" />}{product.isFeatured && <DetailRow label="Selection" value="Featured" />}</div></div>
              <div className="mt-9 border-t border-[#EAE2D5] pt-7 text-center"><p className="font-['Cormorant_Garamond'] text-[17px] italic text-[#918477]">Made for your everyday elegance.</p></div>
            </div></section>
          </div>
        </div>
      </main>

      {showSizeGuide && <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#241611]/55 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSizeGuide(false); }}><div className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto bg-[#FFFDF9] shadow-[0_30px_100px_rgba(67,35,28,0.22)]" onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => setShowSizeGuide(false)} aria-label="Close size guide" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#DED4C4] bg-[#FFFDF9] text-[#5A3026] hover:border-[#C8A15A]"><FiX size={16} /></button><div className="px-6 py-8 sm:px-9 sm:py-10"><p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[2.5px] text-[#A98243]">Sirraha</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-[38px] font-normal leading-none text-[#43231C]">Size Guide</h2><p className="mt-3 font-['Poppins'] text-[10px] leading-6 text-[#71655B]">{sizeGuide.description}</p><div className="mt-7 overflow-x-auto border border-[#DED4C4]"><table className="w-full min-w-[440px] border-collapse"><thead className="bg-[#F2EBDD]"><tr>{["Size", "Bust", "Waist", "Hip"].map((heading) => <th key={heading} className="border-b border-[#DED4C4] px-4 py-3 text-center font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-[#5A3026]">{heading}</th>)}</tr></thead><tbody>{sizeGuide.sizes.map((item) => <tr key={item.size} className="border-b border-[#EAE2D5] last:border-b-0"><td className="px-4 py-3.5 text-center font-['Poppins'] text-[9px] font-medium uppercase tracking-[1px] text-[#5A3026]">{item.size}</td><td className="px-4 py-3.5 text-center font-['Poppins'] text-[10px] text-[#71655B]">{item.bust}</td><td className="px-4 py-3.5 text-center font-['Poppins'] text-[10px] text-[#71655B]">{item.waist}</td><td className="px-4 py-3.5 text-center font-['Poppins'] text-[10px] text-[#71655B]">{item.hip}</td></tr>)}</tbody></table></div><div className="mt-8"><div className="flex items-center gap-3"><span className="h-px w-7 bg-[#C8A15A]" /><h3 className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#A98243]">How to Measure</h3></div><div className="mt-5 space-y-4">{MEASUREMENT_GUIDE.map((item) => <div key={item.title} className="border-b border-[#EAE2D5] pb-4 last:border-b-0 last:pb-0"><p className="font-['Poppins'] text-[10px] font-medium uppercase tracking-[1.2px] text-[#5A3026]">{item.title}</p><p className="mt-1 font-['Poppins'] text-[10px] leading-5 text-[#71655B]">{item.description}</p></div>)}</div></div><div className="mt-8 border border-[#DED4C4] bg-[#F2EBDD] px-5 py-5"><p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[1.5px] text-[#A98243]">Still unsure?</p><p className="mt-2 font-['Poppins'] text-[10px] leading-5 text-[#71655B]">WhatsApp us before placing your order — we'll help you pick the right size.</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 border-b border-[#C8A15A] pb-1 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.8px] text-[#5A3026]">Ask on WhatsApp<FiArrowRight size={11} /></a></div></div></div></div>}
    </>
  );
}

const InfoCard = ({ icon, title, text }) => <div className="border border-[#DED4C4] bg-[#F2EBDD] p-4"><div className="flex items-center gap-2.5 text-[#5A3026]">{icon}<p className="font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px]">{title}</p></div><p className="mt-2 font-['Poppins'] text-[9px] leading-5 text-[#71655B]">{text}</p></div>;
const DetailRow = ({ label, value }) => <div className="flex items-center justify-between gap-4 border-b border-[#F0E9E1] pb-3"><span className="font-['Poppins'] text-[9px] uppercase tracking-[1.2px] text-[#918477]">{label}</span><span className="text-right font-['Poppins'] text-[9px] font-medium uppercase tracking-[0.8px] text-[#5A3026]">{value || "—"}</span></div>;

export default ProductDetails;
