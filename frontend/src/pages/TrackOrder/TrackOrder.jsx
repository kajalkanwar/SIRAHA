

import { useCallback, useEffect, useState } from "react";

import {

  FiArrowLeft,

  FiArrowRight,

  FiCheck,

  FiChevronRight,

  FiCreditCard,

  FiMapPin,

  FiPackage,

  FiRefreshCw,

  FiShoppingBag,

  FiTruck,

  FiXCircle,

} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const API_URL = (

  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

).replace(/\/+$/, "");

const STATUS_STEPS = [

  { key: "PENDING", label: "Order Placed", icon: FiShoppingBag },

  { key: "CONFIRMED", label: "Confirmed", icon: FiCheck },

  { key: "PROCESSING", label: "Processing", icon: FiPackage },

  { key: "SHIPPED", label: "Shipped", icon: FiTruck },

  { key: "DELIVERED", label: "Delivered", icon: FiCheck },

];

const normalizeStatus = (status) => {

  const value = String(status || "PENDING")

    .trim()

    .toUpperCase()

    .replace(/[\s-]+/g, "_");

  const aliases = {

    PLACED: "PENDING",

    ORDER_PLACED: "PENDING",

    CONFIRM: "CONFIRMED",

    PACKED: "PROCESSING",

    PACKING: "PROCESSING",

    SHIPPING: "SHIPPED",

    COMPLETE: "DELIVERED",

    COMPLETED: "DELIVERED",

    CANCELED: "CANCELLED",

  };

  return aliases[value] || value;

};

const getOrderStatus = (order) =>

  normalizeStatus(order?.orderStatus ?? order?.status);

const formatDate = (value, long = false) => {

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {

    day: "numeric",

    month: long ? "long" : "short",

    year: "numeric",

  });

};

const formatPrice = (value) =>

  Number(value || 0).toLocaleString("en-IN", {

    maximumFractionDigits: 2,

  });

const getPaymentMethod = (method) => {

  const value = String(method || "").toUpperCase();

  if (value === "COD") return "Cash on Delivery";

  if (value === "RAZORPAY") return "Online Payment";

  return method || "Not specified";

};

const getProductName = (item) =>

  item?.name || item?.productName || item?.product?.name || "Sirraha Product";

const getProductImage = (item) =>

  item?.image ||

  item?.imageUrl ||

  (Array.isArray(item?.images) ? item.images[0] : "") ||

  (Array.isArray(item?.product?.images) ? item.product.images[0] : "") ||

  "";

async function requestTrackedOrder(details, signal) {

  const url = new URL(`${API_URL}/orders/track`, window.location.origin);

  url.searchParams.set("orderId", details.orderId);

  url.searchParams.set("email", details.email);

  // Use a relative URL for same-origin APIs and the configured absolute*

  // API URL for a separate backend.*

  const endpoint = /^https?:\/\//i.test(API_URL)

    ? url.toString()

    : `${API_URL}/orders/track?${url.searchParams.toString()}`;

  const response = await fetch(endpoint, {

    method: "GET",

    headers: { Accept: "application/json" },

    cache: "no-store",

    signal,

  });

  let data;

  try {

    data = await response.json();

  } catch {

    throw new Error("The server returned an invalid response.");

  }

  if (!response.ok) {

    throw new Error(

      data?.message || "We could not find an order matching those details."

    );

  }

  const foundOrder = data?.order ?? data;

  if (!foundOrder || !(foundOrder._id || foundOrder.orderNumber)) {

    throw new Error("We could not find an order matching those details.");

  }

  return foundOrder;

}

function TrackOrder() {

  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");

  const [email, setEmail] = useState("");

  const [order, setOrder] = useState(null);

  const [trackedDetails, setTrackedDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  const [exchangeItem, setExchangeItem] = useState(null);

  const [exchangeExpired, setExchangeExpired] = useState(false);

  const currentStatus = getOrderStatus(order);

  const currentStatusIndex = STATUS_STEPS.findIndex(

    (step) => step.key === currentStatus

  );

  const isCancelled = currentStatus === "CANCELLED";

  const isDelivered = currentStatus === "DELIVERED";

  // Exchange is available for 7 calendar days after delivery.*

  const isExchangeEligible = (() => {

    if (!isDelivered || !order?.deliveredAt) return false;

    const deliveredDate = new Date(order.deliveredAt);

    if (Number.isNaN(deliveredDate.getTime())) return false;

    const deadline = new Date(deliveredDate);

    deadline.setDate(deadline.getDate() + 7);

    return new Date() <= deadline;

  })();

  const deliveryAddress = order

    ? [order.address, order.city, order.state, order.pincode]

        .filter(Boolean)

        .join(", ")

    : "";

  const courierName =

    order?.courierPartner || order?.courier || order?.shippingPartner || "";

  const trackingNumber =

    order?.trackingNumber || order?.trackingId || order?.awbNumber || "";

  const trackingUrl = order?.trackingUrl || order?.trackingLink || "";

  const expectedDelivery =

    order?.expectedDelivery ||

    order?.expectedDeliveryDate ||

    order?.deliveryDate ||

    "";

  const fetchOrder = useCallback(async (details, background = false) => {

    if (!details?.orderId || !details?.email) return false;

    if (background) {

      setRefreshing(true);

    } else {

      setLoading(true);

      setError("");

    }

    try {

      const controller = new AbortController();

      const foundOrder = await requestTrackedOrder(details, controller.signal);

      setOrder(foundOrder);

      setLastUpdated(new Date());

      setError("");

      return true;

    } catch (err) {

      if (err.name !== "AbortError") {

        console.error("Track order error:", err);

        // Preserve the displayed order if a background refresh fails.*

        if (!background) {

          setError(err.message || "Unable to track your order.");

          setOrder(null);

        }

      }

      return false;

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }, []);

  const handleTrackOrder = async (event) => {

    event.preventDefault();

    const details = {

      orderId: orderId.trim(),

      email: email.trim().toLowerCase(),

    };

    if (!details.orderId) {

      setError("Please enter your order ID.");

      return;

    }

    if (!details.email) {

      setError("Please enter the email address used for your order.");

      return;

    }

    setError("");

    setOrder(null);

    setTrackedDetails(null);

    setLoading(true);

    try {

      const foundOrder = await requestTrackedOrder(details);

      setOrder(foundOrder);

      setTrackedDetails(details);

      setLastUpdated(new Date());

    } catch (err) {

      console.error("Track order error:", err);

      setError(err.message || "Unable to track your order.");

    } finally {

      setLoading(false);

    }

  };

  // Poll for status changes while an order is being displayed.*

useEffect(() => {

  if (!trackedDetails) return undefined;

  let active = true;

  let inFlight = false;

  let controller = null;

  const refreshOrder = async () => {

    if (inFlight || !active) return;

    inFlight = true;

    controller = new AbortController();

    try {

      const latestOrder = await requestTrackedOrder(

        trackedDetails,

        controller.signal

      );

      if (active) {

        setOrder(latestOrder);

        setLastUpdated(new Date());

      }

    } catch (err) {

      if (err.name !== "AbortError") {

        console.error("Background order refresh failed:", err);

      }

    } finally {

      inFlight = false;

    }

  };

  const intervalId = window.setInterval(refreshOrder, 15000);

  return () => {

    active = false;

    window.clearInterval(intervalId);

    controller?.abort();

  };

}, [trackedDetails]);

  const handleRefresh = () => {

    if (trackedDetails) {

      fetchOrder(trackedDetails, true);

    }

  };

  const handleTrackAnother = () => {

    setOrder(null);

    setTrackedDetails(null);

    setOrderId("");

    setEmail("");

    setError("");

    setLastUpdated(null);

  };

  return (

    <main className="min-h-screen bg-[#FFFFFF] text-[#432D24]">

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-7 sm:px-7 sm:pt-10 lg:px-10">

        <nav className="mb-8 flex items-center gap-2 text-xs text-[#928477]">

          <button

            type="button"

            onClick={() => navigate("/")}

            className="transition hover:text-[#4B1F1B]"

          >

            Home

          </button>

          <FiChevronRight size={13} />

          <span className="text-[#4B1F1B]">Track Order</span>

        </nav>

        <section className="mx-auto max-w-2xl text-center">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#A98243]">

            SIRRAHA

          </p>

          <h1 className="font-serif text-4xl font-normal leading-tight text-[#351411] sm:text-5xl">

            Track Your Order

          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">

            <span className="h-px w-10 bg-[#D8BD83]" />

            <span className="h-2 w-2 rotate-45 border border-[#C8A15A]" />

            <span className="h-px w-10 bg-[#D8BD83]" />

          </div>

{!order && (

  <div className="flex w-full justify-center">

    <p className="mt-5 w-full max-w-2xl px-4 text-center text-sm leading-6 text-[#817267]">

      Enter your order details to view the latest delivery status.

    </p>

  </div>

)}

        </section>

        {/* Search form is hidden once an order is found. */}

        {!order && (

          <section className="mx-auto mt-9 max-w-4xl rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 shadow-[0_12px_36px_rgba(67,35,28,0.05)] sm:p-7">

            <form onSubmit={handleTrackOrder} className="grid gap-4 md:grid-cols-2">

              <div>

                <label

                  htmlFor="orderId"

                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78685B]"

                >

                  Order ID or order number

                </label>

                <div className="relative">

                  <FiPackage

                    size={17}

                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98243]"

                  />

                  <input

                    id="orderId"

                    type="text"

                    value={orderId}

                    onChange={(event) => setOrderId(event.target.value)}

                    placeholder="Enter your order ID"

                    autoComplete="off"

                    required

                    className="h-12 w-full rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A99C8D] focus:border-[#A98243] focus:bg-white"

                  />

                </div>

              </div>

              <div>

                <label

                  htmlFor="email"

                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78685B]"

                >

                  Email address

                </label>

                <div className="relative">

                  <FiCreditCard

                    size={17}

                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98243]"

                  />

                  <input

                    id="email"

                    type="email"

                    value={email}

                    onChange={(event) => setEmail(event.target.value)}

                    placeholder="Email used at checkout"

                    autoComplete="email"

                    required

                    className="h-12 w-full rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A99C8D] focus:border-[#A98243] focus:bg-white"

                  />

                </div>

              </div>

              <div className="md:col-span-2">

                <button

                  type="submit"

                  disabled={loading}

className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#8E6738] bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#69352D] transition hover:bg-[#8E6738] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {loading ? (

                    <>

                      <FiRefreshCw className="animate-spin" size={15} />

                      Finding Order

                    </>

                  ) : (

                    <>

                      Track Order <FiArrowRight size={16} />

                    </>

                  )}

                </button>

              </div>

            </form>

            {error && (

              <div

                role="alert"

                className="mt-4 flex items-start gap-3 rounded-lg border border-[#E7C8C3] bg-[#FFF5F3] p-4 text-sm text-[#8F3B32]"

              >

                <FiXCircle className="mt-0.5 shrink-0" size={17} />

                <p>{error}</p>

              </div>

            )}

          </section>

        )}

        {order && (

          <section className="mx-auto mt-9 max-w-4xl space-y-5">

            {/* Order summary */}

            <div className="rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(67,35,28,0.04)] sm:p-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A98243]">

                    Order Summary

                  </p>

                  <h2 className="mt-2 break-all font-serif text-2xl text-[#351411] sm:text-3xl">

                    #{order.orderNumber || order._id}

                  </h2>

                  {order.createdAt && (

                    <p className="mt-2 text-xs text-[#928477]">

                      Placed on {formatDate(order.createdAt, true)}

                    </p>

                  )}

                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <span

                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] ${

                      isCancelled

                        ? "bg-[#FFF0EE] text-[#A94438]"

                        : isDelivered

                          ? "bg-[#E8F2E7] text-[#386641]"

                          : "bg-[#F5E8CE] text-[#69352D]"

                    }`}

                  >

                    {isCancelled ? (

                      <FiXCircle size={14} />

                    ) : isDelivered ? (

                      <FiCheck size={14} />

                    ) : (

                      <FiTruck size={14} />

                    )}

                    {currentStatus === "PENDING"

                      ? "Order Placed"

                      : currentStatus.replace(/_/g, " ")}

                  </span>

                  <button

                    type="button"

                    onClick={handleRefresh}

                    disabled={refreshing}

                    title="Refresh order status"

                    aria-label="Refresh order status"

                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DDD8] text-[#8E6738] transition hover:bg-[#F5EFE4] disabled:opacity-60"

                  >

                    <FiRefreshCw

                      size={15}

                      className={refreshing ? "animate-spin" : ""}

                    />

                  </button>

                </div>

              </div>

              {expectedDelivery && (

                <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#F7F1E7] p-4">

                  <FiTruck className="shrink-0 text-[#A98243]" size={19} />

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#928477]">

                      Expected delivery

                    </p>

                    <p className="mt-1 text-sm font-medium text-[#351411]">

                      {formatDate(expectedDelivery, true)}

                    </p>

                  </div>

                </div>

              )}

              <p className="mt-4 text-[11px] text-[#928477]">

                {refreshing

                  ? "Checking for updates…"

                  : lastUpdated

                    ? `Last checked at ${lastUpdated.toLocaleTimeString("en-IN", {

                        hour: "2-digit",

                        minute: "2-digit",

                      })}. Updates are checked every 15 seconds.`

                    : "Order status updates automatically."}

              </p>

            </div>

            {/* Order progress */}

            {isCancelled ? (

              <div className="rounded-2xl border border-[#E7C8C3] bg-[#FFF8F6] p-6 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBE7E3] text-[#A94438]">

                    <FiXCircle size={21} />

                  </div>

                  <div>

                    <h3 className="font-serif text-xl text-[#6F2E27]">

                      Order cancelled

                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#8F625A]">

                      This order has been cancelled. Please contact Sirraha

                      support if you need help.

                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <div className="rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(67,35,28,0.04)] sm:p-7">

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A98243]">

                  Order Progress

                </p>

                <h3 className="mt-2 font-serif text-2xl text-[#351411]">

                  {isDelivered ? "Your order has arrived" : "Your order journey"}

                </h3>

                <div className="relative mt-8 hidden sm:block">

                  <div className="absolute left-[10%] right-[10%] top-5 h-px bg-[#E5DCCE]" />

                  <div

                    className="absolute left-[10%] top-5 h-px bg-[#A98243] transition-all duration-500"

                    style={{

                      width:

                        currentStatusIndex > 0

                          ? `${(currentStatusIndex / 4) * 80}%`

                          : "0%",

                    }}

                  />

                  <div className="relative grid grid-cols-5 gap-2">

                    {STATUS_STEPS.map((step, index) => {

                      const StepIcon = step.icon;

                      const completed =

                        currentStatusIndex >= 0 && index <= currentStatusIndex;

                      const active = index === currentStatusIndex;

                      return (

                        <div

                          key={step.key}

                          className="flex min-w-0 flex-col items-center text-center"

                        >

                          <div

                            className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border ${

                              completed

                                ? "border-[#8E6738] bg-[#8E6738] text-white"

                                : "border-[#E1D8CA] bg-[#FFFFFF] text-[#B8AA97]"

                            } ${active ? "ring-4 ring-[#F3E8D6]" : ""}`}

                          >

                            <StepIcon size={16} />

                          </div>

                          <p

                            className={`mt-3 text-[11px] font-medium ${

                              completed ? "text-[#351411]" : "text-[#A99C8D]"

                            }`}

                          >

                            {step.label}

                          </p>

                          {active && (

                            <span className="mt-1 text-[9px] uppercase tracking-wider text-[#A98243]">

                              Current

                            </span>

                          )}

                        </div>

                      );

                    })}

                  </div>

                </div>

                <div className="mt-7 space-y-0 sm:hidden">

                  {STATUS_STEPS.map((step, index) => {

                    const StepIcon = step.icon;

                    const completed =

                      currentStatusIndex >= 0 && index <= currentStatusIndex;

                    const active = index === currentStatusIndex;

                    const last = index === STATUS_STEPS.length - 1;

                    return (

                      <div key={step.key} className="flex gap-3">

                        <div className="flex w-9 shrink-0 flex-col items-center">

                          <div

                            className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border ${

                              completed

                                ? "border-[#8E6738] bg-[#8E6738] text-white"

                                : "border-[#E1D8CA] bg-[#FFFFFF] text-[#B8AA97]"

                            } ${active ? "ring-4 ring-[#F3E8D6]" : ""}`}

                          >

                            <StepIcon size={15} />

                          </div>

                          {!last && (

                            <div

                              className={`my-1 min-h-7 w-px ${

                                index < currentStatusIndex

                                  ? "bg-[#A98243]"

                                  : "bg-[#E5DCCE]"

                              }`}

                            />

                          )}

                        </div>

                        <div className={last ? "pb-0 pt-1" : "pb-5 pt-1"}>

                          <p

                            className={`text-sm font-medium ${

                              completed ? "text-[#351411]" : "text-[#A99C8D]"

                            }`}

                          >

                            {step.label}

                          </p>

                          {active && (

                            <p className="mt-1 text-xs text-[#A98243]">

                              Current status

                            </p>

                          )}

                        </div>

                      </div>

                    );

                  })}

                </div>

                <p className="mt-7 rounded-lg bg-[#F7F1E7] p-3 text-xs leading-5 text-[#817267]">

                  Your progress changes when the Sirraha team updates your

                  order status.

                </p>

              </div>

            )}

            {/* Order items */}

            <div className="rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(67,35,28,0.04)] sm:p-7">

              <div className="mb-5 flex items-center justify-between border-b border-[#EEE6DA] pb-4">

                <h3 className="font-serif text-xl text-[#351411]">Order Items</h3>

                <span className="text-xs text-[#928477]">

                  {order.items?.length || 0}{" "}

                  {(order.items?.length || 0) === 1 ? "item" : "items"}

                </span>

              </div>

              <div className="divide-y divide-[#EEE6DA]">

                {(order.items || []).map((item, index) => {

                  const name = getProductName(item);

                  const image = getProductImage(item);

                  const quantity = Number(item.quantity || 1);

                  const price = Number(

                    item.salePrice ??

                      item.price ??

                      item.product?.salePrice ??

                      item.product?.price ??

                      0

                  );

                  const size = item.size || item.selectedSize;

                  return (

                    <div

                      key={item._id || item.product?._id || `${name}-${index}`}

                      className="flex gap-4 py-4 first:pt-0 last:pb-0"

                    >

                      <div className="flex h-24 w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3EDE3] sm:h-28 sm:w-[88px]">

                        {image ? (

                          <img

                            src={image}

                            alt={name}

                            loading="lazy"

                            className="h-full w-full object-cover"

                          />

                        ) : (

                          <FiShoppingBag size={22} className="text-[#B8A58C]" />

                        )}

                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center">

                        <h4 className="text-sm font-medium text-[#351411]">{name}</h4>

                        {size && (

                          <p className="mt-1 text-xs text-[#928477]">

                            Size: {size}

                          </p>

                        )}

                        <p className="mt-1 text-xs text-[#928477]">

                          Qty: {quantity}

                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#69352D]">

                          ₹{formatPrice(price * quantity)}

                        </p>

                        {isDelivered && (

                          <button

                            type="button"

                            onClick={() => {
                              if (isExchangeEligible) {
                                setExchangeExpired(false);
                                setExchangeItem(item);
                              } else {
                                setExchangeItem(null);
                                setExchangeExpired(true);
                              }
                            }}

                            className="mt-3 w-fit rounded-md border border-[#8E6738] px-3 py-2 text-xs font-medium text-[#69352D] transition hover:bg-[#F7F1E7]"

                          >

                            Request Exchange

                          </button>

                        )}

                      </div>

                    </div>

                  );

                })}

                {!order.items?.length && (

                  <p className="py-3 text-sm text-[#928477]">

                    Item details are not available.

                  </p>

                )}

              </div>

            </div>

            {exchangeItem && (

              <div className="rounded-xl border border-[#E2D8C9] bg-[#F7F1E7] p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-semibold text-[#351411]">

                      Exchange selected: {getProductName(exchangeItem)}

                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#817267]">

                      Your item is selected. We will add the exchange request form here next.

                    </p>

                  </div>

                  <button

                    type="button"

                    onClick={() => setExchangeItem(null)}

                    className="text-xs font-medium text-[#69352D] underline"

                  >

                    Close

                  </button>

                </div>

              </div>

            )}

{exchangeExpired && (
              <div
                role="alert"
                className="rounded-xl border border-[#D8B8A8] bg-[#FDF5F1] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[#69352D]">
                      Exchange Window Expired
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#6B5147]">
                      Sorry, we're unable to exchange this item because the
                      7-day exchange period has expired.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExchangeExpired(false)}
                    className="shrink-0 text-xs font-medium text-[#69352D] underline"
                    aria-label="Close exchange window expired message"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Delivery and payment */}

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE4] text-[#8E6738]">

                    <FiMapPin size={18} />

                  </div>

                  <h3 className="font-serif text-xl text-[#351411]">

                    Delivery Details

                  </h3>

                </div>

                <div className="space-y-4 text-sm">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#928477]">

                      Deliver to

                    </p>

                    <p className="mt-1 font-medium text-[#351411]">

                      {order.customerName || "Customer"}

                    </p>

                    {deliveryAddress && (

                      <p className="mt-1 leading-6 text-[#817267]">

                        {deliveryAddress}

                      </p>

                    )}

                    {order.phone && (

                      <p className="mt-2 text-[#817267]">{order.phone}</p>

                    )}

                  </div>

                  <div className="border-t border-[#EEE6DA] pt-4">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#928477]">

                      Courier Partner

                    </p>

                    <p className="mt-1 text-[#351411]">

                      {courierName || "Not assigned yet"}

                    </p>

                  </div>

                  {trackingNumber && (

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#928477]">

                        Tracking Number

                      </p>

                      <p className="mt-1 break-all font-medium text-[#351411]">

                        {trackingNumber}

                      </p>

                      {trackingUrl && (

                        <a

                          href={trackingUrl}

                          target="_blank"

                          rel="noreferrer"

                          className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-[#8E6738] underline underline-offset-4"

                        >

                          Track shipment <FiTruck size={13} />

                        </a>

                      )}

                    </div>

                  )}

                </div>

              </div>

              <div className="rounded-2xl border border-[#E2D8C9] bg-[#FFFFFF] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE4] text-[#8E6738]">

                    <FiCreditCard size={18} />

                  </div>

                  <h3 className="font-serif text-xl text-[#351411]">

                    Payment Summary

                  </h3>

                </div>

                <div className="space-y-4 text-sm">

                  <div className="flex items-start justify-between gap-3">

                    <span className="text-[#928477]">Payment method</span>

                    <span className="text-right font-medium text-[#351411]">

                      {getPaymentMethod(order.paymentMethod)}

                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#928477]">Payment status</span>

                    <span className="rounded-full bg-[#F5E8CE] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#69352D]">

                      {String(order.paymentStatus || "PENDING").toUpperCase()}

                    </span>

                  </div>

                  <div className="border-t border-dashed border-[#E5DCCE]" />

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#928477]">Subtotal</span>

                    <span className="text-[#351411]">

                      ₹{formatPrice(order.subtotal ?? order.total ?? 0)}

                    </span>

                  </div>

                  {Number(order.discount || 0) > 0 && (

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-[#928477]">Discount</span>

                      <span className="text-[#386641]">

                        −₹{formatPrice(order.discount)}

                      </span>

                    </div>

                  )}

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[#928477]">Shipping</span>

                    <span className="text-[#351411]">

                      {Number(order.shipping || 0) === 0

                        ? "Free"

                        : `₹${formatPrice(order.shipping)}`}

                    </span>

                  </div>

                  <div className="border-t border-[#E5DDD8]" />

                  <div className="flex items-center justify-between gap-3">

                    <span className="font-semibold text-[#351411]">Total</span>

                    <span className="font-serif text-2xl text-[#69352D]">

                      ₹{formatPrice(order.total ?? order.totalAmount ?? 0)}

                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer actions */}

            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E2D8C9] bg-[#F5EFE4] p-5 sm:flex-row sm:items-center sm:p-6">

              <div>

                <h3 className="font-serif text-xl text-[#351411]">Need help?</h3>

                <p className="mt-1 text-sm leading-6 text-[#817267]">

                  Contact Sirraha support if you have a question about your order.

                </p>

              </div>

              <button

                type="button"

                onClick={handleTrackAnother}

                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#8E6738] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#69352D] transition hover:bg-[#8E6738] hover:text-white sm:w-auto"

              >

                <FiArrowLeft size={15} />

                Track Another Order

              </button>

            </div>

          </section>

        )}

        <footer className="mt-12 border-t border-[#E5DCCE] pt-6 text-center">

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A99C8D]">

            SIRRAHA · Made with care

          </p>

        </footer>

      </div>

    </main>

  );

}

export default TrackOrder;
