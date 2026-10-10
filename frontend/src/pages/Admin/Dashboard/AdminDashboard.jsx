import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiPercent,
  FiPlus,
  FiShoppingBag,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";

import { getProducts } from "../../../constants/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Dashboard products error:", err);
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ============================================================
  // DASHBOARD DATA
  // ============================================================

  const dashboardData = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0
    );

    const newArrivals = products.filter(
      (product) => product.isNew === true
    ).length;

    const bestSellers = products.filter(
      (product) => product.isFeatured === true
    ).length;

    const outOfStock = products.filter(
      (product) => Number(product.stock || 0) === 0
    );

    const lowStock = products.filter((product) => {
      const stock = Number(product.stock || 0);

      return stock > 0 && stock <= 5;
    });

    const onSale = products.filter(
      (product) =>
        product.isOnSale === true ||
        Number(product.salePrice || 0) > 0
    ).length;

    const recentProducts = [...products]
      .sort((a, b) => {
        const firstDate = new Date(a.createdAt || 0);
        const secondDate = new Date(b.createdAt || 0);

        return secondDate - firstDate;
      })
      .slice(0, 5);

    return {
      totalProducts,
      totalStock,
      newArrivals,
      bestSellers,
      outOfStock,
      lowStock,
      onSale,
      recentProducts,
    };
  }, [products]);

  // ============================================================
  // HELPERS
  // ============================================================

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const getProductName = (product) => {
    return (
      product.name ||
      product.productCode ||
      product.description ||
      "Untitled Product"
    );
  };

  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return "";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] px-6 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1500px]">

          <div className="mb-10">
            <div className="h-3 w-24 animate-pulse rounded bg-[#EAE2D5]" />

            <div className="mt-4 h-12 w-80 animate-pulse rounded bg-[#EAE2D5]" />

            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[#EAE2D5]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]"
              />
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="h-[420px] animate-pulse rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]" />

            <div className="h-[420px] animate-pulse rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]" />
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] px-6 py-12">
        <div className="mx-auto max-w-[1500px]">

          <div className="rounded-2xl border border-[#E6D1CC] bg-[#FFF8F6] p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E2DE] text-[#8C4A3C]">
                <FiAlertCircle size={20} />
              </div>

              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                  Unable to load dashboard
                </h2>

                <p className="mt-1 text-sm text-[#71655B]">
                  {error}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FAF7F0]">

      <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 xl:px-12">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="mb-9 flex flex-col gap-6 border-b border-[#EAE2D5] pb-8 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#A98243]">
              Store Overview
            </p>

            <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl font-medium leading-none text-[#43231C] sm:text-5xl">
              Good to see you.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#71655B]">
              Here&apos;s a quiet overview of what&apos;s happening across
              your Sirraha store today.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex h-11 items-center justify-center gap-3 self-start rounded-md bg-[#5A3026] px-6 text-[10px] font-medium uppercase tracking-[0.18em] text-[#FFFDF9] transition hover:bg-[#43231C] lg:self-auto"
          >
            <FiPlus size={15} />
            Manage Products
          </Link>

        </section>


        {/* ======================================================
            PRIMARY STATS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* PRODUCTS */}

          <div className="rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(67,35,28,0.06)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918477]">
                  Products
                </p>

                <p className="mt-4 font-['Cormorant_Garamond'] text-4xl text-[#43231C]">
                  {dashboardData.totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2EBDD] text-[#5A3026]">
                <FiBox size={18} />
              </div>

            </div>

            <div className="mt-5 border-t border-[#EAE2D5] pt-4">
              <p className="text-xs text-[#71655B]">
                Products currently in your catalogue.
              </p>
            </div>

          </div>


          {/* STOCK */}

          <div className="rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(67,35,28,0.06)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918477]">
                  Total Stock
                </p>

                <p className="mt-4 font-['Cormorant_Garamond'] text-4xl text-[#43231C]">
                  {dashboardData.totalStock}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2EBDD] text-[#A98243]">
                <FiPackage size={18} />
              </div>

            </div>

            <div className="mt-5 border-t border-[#EAE2D5] pt-4">
              <p className="text-xs text-[#71655B]">
                Total units currently available.
              </p>
            </div>

          </div>


          {/* NEW ARRIVALS */}

          <div className="rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(67,35,28,0.06)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918477]">
                  New Arrivals
                </p>

                <p className="mt-4 font-['Cormorant_Garamond'] text-4xl text-[#43231C]">
                  {dashboardData.newArrivals}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2EBDD] text-[#5A3026]">
                <FiClock size={18} />
              </div>

            </div>

            <div className="mt-5 border-t border-[#EAE2D5] pt-4">
              <p className="text-xs text-[#71655B]">
                Products marked as new arrivals.
              </p>
            </div>

          </div>


          {/* BEST SELLERS */}

          <div className="rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(67,35,28,0.06)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#918477]">
                  Best Sellers
                </p>

                <p className="mt-4 font-['Cormorant_Garamond'] text-4xl text-[#43231C]">
                  {dashboardData.bestSellers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2EBDD] text-[#A98243]">
                <FiCheckCircle size={18} />
              </div>

            </div>

            <div className="mt-5 border-t border-[#EAE2D5] pt-4">
              <p className="text-xs text-[#71655B]">
                Products currently highlighted as best sellers.
              </p>
            </div>

          </div>

        </section>


        {/* ======================================================
            STORE HEALTH
        ====================================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="flex items-center justify-between rounded-xl border border-[#EAE2D5] bg-[#F7F2E9] px-5 py-4">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF9] text-[#8C4A3C]">
                <FiXCircle size={16} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#918477]">
                  Out of Stock
                </p>

                <p className="mt-0.5 text-sm font-medium text-[#43231C]">
                  {dashboardData.outOfStock.length} products
                </p>
              </div>
            </div>

            <span className="text-xs text-[#918477]">
              Needs attention
            </span>

          </div>


          <div className="flex items-center justify-between rounded-xl border border-[#EAE2D5] bg-[#F7F2E9] px-5 py-4">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF9] text-[#A98243]">
                <FiAlertCircle size={16} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#918477]">
                  Low Stock
                </p>

                <p className="mt-0.5 text-sm font-medium text-[#43231C]">
                  {dashboardData.lowStock.length} products
                </p>
              </div>
            </div>

            <span className="text-xs text-[#918477]">
              1–5 units
            </span>

          </div>


          <div className="flex items-center justify-between rounded-xl border border-[#EAE2D5] bg-[#F7F2E9] px-5 py-4 sm:col-span-2 lg:col-span-1">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF9] text-[#A98243]">
                <FiPercent size={16} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#918477]">
                  On Sale
                </p>

                <p className="mt-0.5 text-sm font-medium text-[#43231C]">
                  {dashboardData.onSale} products
                </p>
              </div>
            </div>

            <span className="text-xs text-[#918477]">
              Active offers
            </span>

          </div>

        </section>


        {/* ======================================================
            RECENT PRODUCTS + INVENTORY
        ====================================================== */}

        <section className="mt-7 grid gap-6 xl:grid-cols-[1.65fr_1fr]">

          {/* ====================================================
              RECENT PRODUCTS
          ==================================================== */}

          <div className="overflow-hidden rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]">

            <div className="flex items-center justify-between border-b border-[#EAE2D5] px-6 py-5">

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A98243]">
                  Catalogue
                </p>

                <h2 className="mt-1 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                  Recent Products
                </h2>
              </div>

              <Link
                to="/admin/products"
                className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5A3026] transition hover:text-[#A98243] sm:flex"
              >
                View all
                <FiArrowRight size={14} />
              </Link>

            </div>


            {dashboardData.recentProducts.length === 0 ? (
              <div className="px-6 py-14 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EBDD] text-[#5A3026]">
                  <FiShoppingBag size={18} />
                </div>

                <p className="mt-4 font-['Cormorant_Garamond'] text-xl text-[#43231C]">
                  No products yet
                </p>

                <p className="mt-1 text-xs text-[#918477]">
                  Add your first Sirraha product to get started.
                </p>

                <Link
                  to="/admin/products"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#5A3026] px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-[#FFFDF9] hover:bg-[#43231C]"
                >
                  Add Product
                </Link>

              </div>
            ) : (
              <div className="divide-y divide-[#EAE2D5]">

                {dashboardData.recentProducts.map((product) => {
                  const image = getProductImage(product);
                  const stock = Number(product.stock || 0);
                  const salePrice = Number(product.salePrice || 0);

                  return (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 px-6 py-4 transition hover:bg-[#FCF9F3]"
                    >

                      {/* IMAGE */}

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#EAE2D5] bg-[#F2EBDD]">

                        {image ? (
                          <img
                            src={image}
                            alt={getProductName(product)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#A98243]">
                            <FiBox size={18} />
                          </div>
                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-[#43231C]">
                          {getProductName(product)}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#918477]">
                          {product.category || "Uncategorized"}
                        </p>

                      </div>


                      {/* PRICE */}

                      <div className="hidden min-w-[90px] sm:block">

                        <p className="text-sm font-medium text-[#43231C]">
                          {formatPrice(
                            salePrice > 0
                              ? salePrice
                              : product.price
                          )}
                        </p>

                        {salePrice > 0 && (
                          <p className="mt-0.5 text-[10px] text-[#918477] line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}

                      </div>


                      {/* STOCK */}

                      <div className="w-[72px] text-right">

                        {stock === 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[#8C4A3C]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8C4A3C]" />
                            Out
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[#A98243]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A98243]" />
                            {stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[#6F806F]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6F806F]" />
                            {stock}
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>


          {/* ====================================================
              INVENTORY ALERTS
          ==================================================== */}

          <div className="overflow-hidden rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]">

            <div className="border-b border-[#EAE2D5] px-6 py-5">

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A98243]">
                Attention
              </p>

              <h2 className="mt-1 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                Inventory
              </h2>

            </div>


            <div className="p-5">

              {dashboardData.outOfStock.length === 0 &&
              dashboardData.lowStock.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EBDD] text-[#6F806F]">
                    <FiCheckCircle size={20} />
                  </div>

                  <p className="mt-4 font-['Cormorant_Garamond'] text-xl text-[#43231C]">
                    Inventory looks good
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-[#918477]">
                    There are currently no products that need immediate
                    stock attention.
                  </p>

                </div>
              ) : (
                <div className="space-y-3">

                  {[
                    ...dashboardData.outOfStock,
                    ...dashboardData.lowStock,
                  ]
                    .slice(0, 6)
                    .map((product) => {
                      const stock = Number(product.stock || 0);

                      const isOutOfStock = stock === 0;

                      return (
                        <Link
                          key={product._id}
                          to="/admin/products"
                          className="group flex items-center gap-3 rounded-xl border border-[#EAE2D5] bg-[#FCF9F3] p-3 transition hover:border-[#C8A15A]/50 hover:bg-[#F7F2E9]"
                        >

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              isOutOfStock
                                ? "bg-[#F3E2DE] text-[#8C4A3C]"
                                : "bg-[#F2EBDD] text-[#A98243]"
                            }`}
                          >
                            {isOutOfStock ? (
                              <FiXCircle size={17} />
                            ) : (
                              <FiAlertCircle size={17} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-medium text-[#43231C]">
                              {getProductName(product)}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[#918477]">
                              {isOutOfStock
                                ? "Out of stock"
                                : `${stock} units remaining`}
                            </p>

                          </div>

                          <FiArrowRight
                            size={15}
                            className="shrink-0 text-[#918477] transition group-hover:translate-x-1 group-hover:text-[#A98243]"
                          />

                        </Link>
                      );
                    })}

                  {(dashboardData.outOfStock.length +
                    dashboardData.lowStock.length) > 6 && (
                    <Link
                      to="/admin/products"
                      className="flex items-center justify-center gap-2 pt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5A3026] hover:text-[#A98243]"
                    >
                      View all inventory
                      <FiArrowRight size={14} />
                    </Link>
                  )}

                </div>
              )}

            </div>

          </div>

        </section>


        {/* ======================================================
            QUICK ACTIONS
        ====================================================== */}

        <section className="mt-7 rounded-2xl border border-[#EAE2D5] bg-[#F7F2E9] p-6 sm:p-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A98243]">
                Quick Management
              </p>

              <h2 className="mt-1 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                Keep your store fresh.
              </h2>

              <p className="mt-1 text-xs text-[#71655B]">
                Manage your catalogue and keep your inventory up to date.
              </p>
            </div>


            <div className="flex flex-wrap gap-3">

              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 rounded-md border border-[#D8BD83] bg-[#FFFDF9] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#5A3026] transition hover:border-[#C8A15A] hover:bg-[#F2EBDD]"
              >
                <FiPackage size={14} />
                Products
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 rounded-md bg-[#5A3026] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#FFFDF9] transition hover:bg-[#43231C]"
              >
                <FiShoppingBag size={14} />
                Orders
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;