import { useState } from "react";

import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiExternalLink,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function TrackOrder() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // TRACK ORDER
  // ============================================================

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    setError("");
    setOrder(null);

    const cleanOrderId = orderId.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOrderId) {
      setError("Please enter your order ID.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter the email address used for your order.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/orders/track?orderId=${encodeURIComponent(
          cleanOrderId
        )}&email=${encodeURIComponent(cleanEmail)}`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from the server.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to find your order."
        );
      }

      if (!data.order) {
        throw new Error(
          "We could not find an order matching those details."
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Track order error:", err);

      setError(
        err.message ||
          "We could not find an order matching those details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TRACK ANOTHER ORDER
  // ============================================================

  const handleTrackAnother = () => {
    setOrder(null);
    setError("");
    setOrderId("");
    setEmail("");
  };

  // ============================================================
  // DATE FORMATTER
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // LONG DATE FORMATTER
  // ============================================================

  const formatLongDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================================
  // MONEY FORMATTER
  // ============================================================

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // ============================================================
  // NORMALIZE STATUS
  // ============================================================

  const normalizeStatus = (status) => {
    if (!status) return "Pending";

    const value = String(status)
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, " ");

    if (
      value === "pending" ||
      value === "placed" ||
      value === "order placed" ||
      value === "processing"
    ) {
      return "Pending";
    }

    if (
      value === "confirmed" ||
      value === "confirm"
    ) {
      return "Confirmed";
    }

    if (
      value === "packed" ||
      value === "packing"
    ) {
      return "Packed";
    }

    if (
      value === "shipped" ||
      value === "shipping"
    ) {
      return "Shipped";
    }

    if (
      value === "out for delivery" ||
      value === "outfordelivery" ||
      value === "out_for_delivery"
    ) {
      return "Out for Delivery";
    }

    if (
      value === "delivered" ||
      value === "complete" ||
      value === "completed"
    ) {
      return "Delivered";
    }

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "Cancelled";
    }

    return "Pending";
  };

  // ============================================================
  // STATUS STEPS
  // ============================================================

  const statusSteps = [
    {
      key: "Pending",
      label: "Order Placed",
      icon: FiShoppingBag,
      dateField: "createdAt",
    },
    {
      key: "Confirmed",
      label: "Confirmed",
      icon: FiCheck,
      dateField: "confirmedAt",
    },
    {
      key: "Packed",
      label: "Packed",
      icon: FiPackage,
      dateField: "packedAt",
    },
    {
      key: "Shipped",
      label: "Shipped",
      icon: FiTruck,
      dateField: "shippedAt",
    },
    {
      key: "Out for Delivery",
      label: "Out for Delivery",
      icon: FiTruck,
      dateField: "outForDeliveryAt",
    },
    {
      key: "Delivered",
      label: "Delivered",
      icon: FiCheck,
      dateField: "deliveredAt",
    },
  ];

  // ============================================================
  // STATUS INDEX
  // ============================================================

  const getStatusIndex = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "Cancelled") {
      return -1;
    }

    const index = statusSteps.findIndex(
      (step) => step.key === normalizedStatus
    );

    return index === -1 ? 0 : index;
  };

  // ============================================================
  // GET STATUS DATE
  // ============================================================

  const getStepDate = (step, currentOrder) => {
    if (!currentOrder) return "";

    const possibleDate =
      currentOrder[step.dateField];

    if (possibleDate) {
      return formatDate(possibleDate);
    }

    /*
      For now, your existing backend mainly gives us
      createdAt and status.

      So the first step can safely use createdAt.
      Other steps remain blank until your backend
      stores separate status timestamps.
    */

    if (
      step.key === "Pending" &&
      currentOrder.createdAt
    ) {
      return formatDate(currentOrder.createdAt);
    }

    return "";
  };

  // ============================================================
  // EXPECTED DELIVERY
  // ============================================================

  const getExpectedDelivery = () => {
    if (!order) return "";

    if (order.expectedDelivery) {
      return formatLongDate(order.expectedDelivery);
    }

    if (order.expectedDeliveryDate) {
      return formatLongDate(order.expectedDeliveryDate);
    }

    if (order.deliveryDate) {
      return formatLongDate(order.deliveryDate);
    }

    return "";
  };

  // ============================================================
  // DELIVERY ADDRESS
  // ============================================================

  const getDeliveryAddress = () => {
    if (!order) return [];

    const addressParts = [
      order.address,
      order.city,
      order.state,
      order.pincode,
    ].filter(Boolean);

    return addressParts;
  };

  // ============================================================
  // COURIER
  // ============================================================

  const courierName =
    order?.courierPartner ||
    order?.courier ||
    order?.shippingPartner ||
    "";

  const trackingNumber =
    order?.trackingNumber ||
    order?.trackingId ||
    order?.awbNumber ||
    "";

  const trackingUrl =
    order?.trackingUrl ||
    order?.trackingLink ||
    "";

  // ============================================================
  // CURRENT STATUS
  // ============================================================

  const currentStatus = normalizeStatus(
    order?.status
  );

  const currentStatusIndex =
    getStatusIndex(currentStatus);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F0] px-5 py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div
            className="
              mb-6
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-[#C8A15A]
              bg-[#FFFDF9]
            "
          >
            <FiPackage
              size={22}
              className="animate-pulse text-[#5A3026]"
            />
          </div>

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#A98243]
            "
          >
            Finding Your Order
          </p>

          <p className="mt-3 text-sm text-[#71655B]">
            Please wait while we find your order.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-5
          pb-16
          pt-8
          sm:px-8
          sm:pt-10
          lg:px-12
          lg:pt-12
          xl:px-16
        "
      >
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mb-8 flex items-center gap-2 text-xs text-[#918477]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="transition hover:text-[#5A3026]"
          >
            Home
          </button>

          <FiChevronRight size={13} />

          <span className="text-[#5A3026]">
            Track Order
          </span>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden">
          {/* Decorative left branch */}
          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-4
              hidden
              opacity-40
              lg:block
            "
          >
            <div className="h-28 w-20 rotate-[-20deg] border-l border-[#C8A15A]" />
          </div>

          {/* Decorative right branch */}
          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-4
              hidden
              opacity-40
              lg:block
            "
          >
            <div className="h-28 w-20 rotate-[20deg] border-r border-[#C8A15A]" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <p
              className="
                mb-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-[#A98243]
              "
            >
              Sirraha
            </p>

            <h1
              className="
                font-serif
                text-[38px]
                font-normal
                leading-none
                text-[#43231C]
                sm:text-[48px]
                lg:text-[56px]
              "
            >
              Track Your Order
            </h1>

            {/* Decorative divider */}
            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[#D8BD83]" />

              <span className="h-2 w-2 rotate-45 border border-[#C8A15A] bg-[#FAF7F0]" />

              <span className="h-px w-12 bg-[#D8BD83]" />
            </div>

            <div className="mt-5 flex w-full justify-center">
      <p
        className="
          text-center
          text-[13px]
          leading-6
          text-[#71655B]
          sm:text-sm
        "
      >
        Enter your order details to see the latest update.
      </p>
    </div>
  </div>
        </section>

        {/* =====================================================
            TRACKING SEARCH CARD
        ===================================================== */}

        <section className="mx-auto mt-10 max-w-[1100px]">
          <div
            className="
              rounded-[18px]
              border
              border-[#DED4C4]
              bg-[#FFFDF9]
              p-4
              shadow-[0_12px_40px_rgba(67,35,28,0.06)]
              sm:p-5
              lg:p-6
            "
          >
            <form
              onSubmit={handleTrackOrder}
              className="
                grid
                gap-4
                lg:grid-cols-[1fr_1fr_auto]
                lg:items-end
              "
            >
              {/* Order ID */}

              <div>
                <label
                  htmlFor="orderId"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-[#71655B]
                  "
                >
                  Order ID
                </label>

                <div className="relative">
                  <FiPackage
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#A98243]
                    "
                  />

                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={(event) =>
                      setOrderId(event.target.value)
                    }
                    placeholder="Enter Order ID"
                    autoComplete="off"
                    className="
                      h-14
                      w-full
                      rounded-[10px]
                      border
                      border-[#DED4C4]
                      bg-[#FAF7F0]
                      pl-12
                      pr-4
                      text-sm
                      text-[#3A2A20]
                      outline-none
                      transition
                      placeholder:text-[#918477]
                      focus:border-[#C8A15A]
                      focus:bg-[#FFFDF9]
                    "
                  />
                </div>

                <p className="mt-2 text-[10px] text-[#918477]">
                  Example: SIR12345678
                </p>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-[#71655B]
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <FiCreditCard
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#A98243]
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="
                      h-14
                      w-full
                      rounded-[10px]
                      border
                      border-[#DED4C4]
                      bg-[#FAF7F0]
                      pl-12
                      pr-4
                      text-sm
                      text-[#3A2A20]
                      outline-none
                      transition
                      placeholder:text-[#918477]
                      focus:border-[#C8A15A]
                      focus:bg-[#FFFDF9]
                    "
                  />
                </div>

                <p className="mt-2 text-[10px] text-[#918477]">
                  Use the email used while placing your order.
                </p>
              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-14
                  items-center
                  justify-center
                  gap-3
                  rounded-[10px]
                  bg-[#5A3026]
                  px-7
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#FFFDF9]
                  transition
                  hover:bg-[#43231C]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  lg:min-w-[190px]
                "
              >
                Track Order

                <FiArrowRight size={16} />
              </button>
            </form>

            {/* Error */}

            {error && (
              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-[10px]
                  border
                  border-[#E7C8C3]
                  bg-[#FFF5F3]
                  px-4
                  py-4
                  text-sm
                  text-[#8F3B32]
                "
              >
                <FiXCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            ORDER RESULT
        ===================================================== */}

        {order && (
          <section className="mx-auto mt-8 max-w-[1100px]">
            {/* =================================================
                ORDER TOP CARD
            ================================================= */}

            <div
              className="
                rounded-[18px]
                border
                border-[#DED4C4]
                bg-[#FFFDF9]
                p-5
                shadow-[0_12px_40px_rgba(67,35,28,0.05)]
                sm:p-7
                lg:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {/* Order number */}

                <div>
                  <p
                    className="
                      mb-2
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-[#A98243]
                    "
                  >
                    Order Details
                  </p>

                  <h2
                    className="
                      break-all
                      font-serif
                      text-[26px]
                      font-normal
                      text-[#43231C]
                      sm:text-[32px]
                    "
                  >
                    #{order._id}
                  </h2>

                  {order.createdAt && (
                    <p className="mt-2 text-xs text-[#918477]">
                      Placed on{" "}
                      {formatLongDate(
                        order.createdAt
                      )}
                    </p>
                  )}
                </div>

                {/* Expected delivery */}

                <div className="flex flex-wrap items-center gap-5">
                  {getExpectedDelivery() && (
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F2EBDD]
                          text-[#A98243]
                        "
                      >
                        <FiCalendar size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#918477]">
                          Expected Delivery
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#3A2A20]">
                          {getExpectedDelivery()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status badge */}

                  <div
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      px-4
                      py-2.5
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      ${
                        currentStatus === "Cancelled"
                          ? "bg-[#FFF0EE] text-[#A94438]"
                          : "bg-[#F5E8CE] text-[#795033]"
                      }
                    `}
                  >
                    {currentStatus ===
                    "Cancelled" ? (
                      <FiXCircle size={14} />
                    ) : (
                      <FiTruck size={14} />
                    )}

                    {currentStatus === "Pending"
                      ? "Order Placed"
                      : currentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                CANCELLED
            ================================================= */}

            {currentStatus === "Cancelled" ? (
              <div
                className="
                  mt-5
                  rounded-[18px]
                  border
                  border-[#E7C8C3]
                  bg-[#FFF5F3]
                  p-6
                  sm:p-8
                "
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FFFDF9]
                      text-[#A94438]
                    "
                  >
                    <FiXCircle size={20} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-serif
                        text-xl
                        text-[#6F2E27]
                      "
                    >
                      This order has been cancelled
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#8F3B32]">
                      If you believe this cancellation
                      was unexpected, please contact
                      Sirraha support.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* =================================================
                  STATUS TRACKER
              ================================================= */

              <div
                className="
                  mt-5
                  rounded-[18px]
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  p-5
                  shadow-[0_12px_40px_rgba(67,35,28,0.05)]
                  sm:p-7
                  lg:p-8
                "
              >
                <div className="mb-8">
                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-[#A98243]
                    "
                  >
                    Order Progress
                  </p>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-2xl
                      text-[#43231C]
                    "
                  >
                    Your order journey
                  </h3>
                </div>

                {/* DESKTOP TIMELINE */}

                <div className="hidden lg:block">
                  <div className="relative grid grid-cols-6">
                    {statusSteps.map(
                      (step, index) => {
                        const Icon = step.icon;

                        const completed =
                          index <=
                          currentStatusIndex;

                        const active =
                          index ===
                          currentStatusIndex;

                        return (
                          <div
                            key={step.key}
                            className="
                              relative
                              flex
                              flex-col
                              items-center
                              text-center
                            "
                          >
                            {/* Connector */}

                            {index <
                              statusSteps.length -
                                1 && (
                              <div
                                className={`
                                  absolute
                                  left-1/2
                                  top-6
                                  h-px
                                  w-full
                                  ${
                                    index <
                                    currentStatusIndex
                                      ? "bg-[#C8A15A]"
                                      : "border-t border-dashed border-[#D8D0C3]"
                                  }
                                `}
                              />
                            )}

                            {/* Icon */}

                            <div
                              className={`
                                relative
                                z-10
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  completed
                                    ? "border-[#C8A15A] bg-[#C8A15A] text-[#FFFDF9]"
                                    : "border-[#D8D0C3] bg-[#FAF7F0] text-[#AFA59A]"
                                }
                                ${
                                  active
                                    ? "ring-4 ring-[#F2EBDD]"
                                    : ""
                                }
                              `}
                            >
                              <Icon size={18} />
                            </div>

                            {/* Label */}

                            <p
                              className={`
                                mt-4
                                max-w-[120px]
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.08em]
                                sm:text-[11px]
                                ${
                                  completed
                                    ? "text-[#5A3026]"
                                    : "text-[#AFA59A]"
                                }
                              `}
                            >
                              {step.label}
                            </p>

                            {/* Date */}

                            <p className="mt-1 text-[10px] text-[#918477]">
                              {getStepDate(
                                step,
                                order
                              )}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* MOBILE TIMELINE */}

                <div className="lg:hidden">
                  <div className="space-y-0">
                    {statusSteps.map(
                      (step, index) => {
                        const Icon = step.icon;

                        const completed =
                          index <=
                          currentStatusIndex;

                        const active =
                          index ===
                          currentStatusIndex;

                        const isLast =
                          index ===
                          statusSteps.length - 1;

                        return (
                          <div
                            key={step.key}
                            className="relative flex gap-4"
                          >
                            {/* Vertical connector */}

                            {!isLast && (
                              <div
                                className={`
                                  absolute
                                  left-[19px]
                                  top-10
                                  h-[calc(100%-16px)]
                                  w-px
                                  ${
                                    index <
                                    currentStatusIndex
                                      ? "bg-[#C8A15A]"
                                      : "border-l border-dashed border-[#D8D0C3]"
                                  }
                                `}
                              />
                            )}

                            {/* Icon */}

                            <div
                              className={`
                                relative
                                z-10
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  completed
                                    ? "border-[#C8A15A] bg-[#C8A15A] text-[#FFFDF9]"
                                    : "border-[#D8D0C3] bg-[#FAF7F0] text-[#AFA59A]"
                                }
                                ${
                                  active
                                    ? "ring-4 ring-[#F2EBDD]"
                                    : ""
                                }
                              `}
                            >
                              <Icon size={16} />
                            </div>

                            {/* Content */}

                            <div
                              className={`
                                min-w-0
                                flex-1
                                ${
                                  isLast
                                    ? "pb-0"
                                    : "pb-7"
                                }
                              `}
                            >
                              <p
                                className={`
                                  text-sm
                                  font-medium
                                  ${
                                    completed
                                      ? "text-[#5A3026]"
                                      : "text-[#AFA59A]"
                                  }
                                `}
                              >
                                {step.label}
                              </p>

                              <p className="mt-1 text-xs text-[#918477]">
                                {getStepDate(
                                  step,
                                  order
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                INFORMATION GRID
            ================================================= */}

            <div
              className="
                mt-5
                grid
                gap-5
                lg:grid-cols-[1.05fr_0.95fr]
              "
            >
              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <div
                className="
                  rounded-[18px]
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  p-5
                  shadow-[0_12px_40px_rgba(67,35,28,0.04)]
                  sm:p-7
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#EAE2D5]
                    pb-5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F2EBDD]
                        text-[#A98243]
                      "
                    >
                      <FiShoppingBag size={16} />
                    </div>

                    <h3
                      className="
                        font-serif
                        text-xl
                        text-[#43231C]
                      "
                    >
                      Order Items
                    </h3>
                  </div>

                  <span className="text-xs text-[#918477]">
                    {order.items?.length || 0}{" "}
                    {(order.items?.length || 0) === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <div className="divide-y divide-[#EAE2D5]">
                  {order.items?.map(
                    (item, index) => (
                      <div
                        key={`${item.productCode || item.product || "item"}-${index}`}
                        className="
                          flex
                          gap-4
                          py-5
                          first:pt-0
                          last:pb-0
                        "
                      >
                        {/* Image */}

                        <div
                          className="
                            h-24
                            w-20
                            shrink-0
                            overflow-hidden
                            rounded-[8px]
                            bg-[#F2EBDD]
                            sm:h-28
                            sm:w-24
                          "
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Sirraha product"
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                text-[#A98243]
                              "
                            >
                              <FiPackage
                                size={22}
                              />
                            </div>
                          )}
                        </div>

                        {/* Information */}

                        <div className="min-w-0 flex-1">
                          <div
                            className="
                              flex
                              flex-col
                              gap-2
                              sm:flex-row
                              sm:items-start
                              sm:justify-between
                            "
                          >
                            <div>
                              <h4
                                className="
                                  text-sm
                                  font-medium
                                  text-[#3A2A20]
                                "
                              >
                                {item.name ||
                                  "Sirraha Product"}
                              </h4>

                              {item.productCode && (
                                <p className="mt-1 text-[10px] text-[#AFA59A]">
                                  Product Code:{" "}
                                  {item.productCode}
                                </p>
                              )}
                            </div>

                            <p
                              className="
                                shrink-0
                                font-serif
                                text-lg
                                text-[#5A3026]
                              "
                            >
                              ₹
                              {formatPrice(
                                item.price
                              )}
                            </p>
                          </div>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-x-5
                              gap-y-1
                              text-[11px]
                              text-[#918477]
                            "
                          >
                            <span>
                              Size:{" "}
                              {item.size || "—"}
                            </span>

                            <span>
                              Qty:{" "}
                              {item.quantity || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* =================================================
                  DELIVERY DETAILS
              ================================================= */}

              <div
                className="
                  rounded-[18px]
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  p-5
                  shadow-[0_12px_40px_rgba(67,35,28,0.04)]
                  sm:p-7
                "
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F2EBDD]
                      text-[#A98243]
                    "
                  >
                    <FiMapPin size={17} />
                  </div>

                  <h3
                    className="
                      font-serif
                      text-xl
                      text-[#43231C]
                    "
                  >
                    Delivery Details
                  </h3>
                </div>

                {/* Address */}

                <div className="flex items-start gap-4">
                  <FiMapPin
                    size={18}
                    className="mt-1 shrink-0 text-[#A98243]"
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-[#918477]
                      "
                    >
                      Delivery Address
                    </p>

                    <div className="mt-2 space-y-1 text-sm leading-6 text-[#3A2A20]">
                      {order.customerName && (
                        <p className="font-medium">
                          {order.customerName}
                        </p>
                      )}

                      {getDeliveryAddress().map(
                        (part, index) => (
                          <p key={`${part}-${index}`}>
                            {part}
                          </p>
                        )
                      )}

                      {order.phone && (
                        <p className="pt-1 text-[#71655B]">
                          {order.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-6 border-t border-[#EAE2D5]" />

                {/* Courier */}

                <div className="flex items-start gap-4">
                  <FiTruck
                    size={18}
                    className="mt-1 shrink-0 text-[#A98243]"
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-[#918477]
                      "
                    >
                      Courier Partner
                    </p>

                    <p className="mt-2 text-sm text-[#3A2A20]">
                      {courierName || "Not assigned yet"}
                    </p>

                    {trackingNumber && (
                      <>
                        <p
                          className="
                            mt-5
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-[#918477]
                          "
                        >
                          Tracking Number
                        </p>

                        <p className="mt-2 break-all text-sm font-medium text-[#5A3026]">
                          {trackingNumber}
                        </p>
                      </>
                    )}

                    {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-2
                          text-xs
                          font-medium
                          text-[#A98243]
                          underline-offset-4
                          hover:underline
                        "
                      >
                        Track Shipment
                        <FiExternalLink
                          size={13}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PAYMENT DETAILS
            ================================================= */}

            <div
              className="
                mt-5
                rounded-[18px]
                border
                border-[#DED4C4]
                bg-[#FFFDF9]
                p-5
                shadow-[0_12px_40px_rgba(67,35,28,0.04)]
                sm:p-7
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F2EBDD]
                    text-[#A98243]
                  "
                >
                  <FiCreditCard size={17} />
                </div>

                <h3
                  className="
                    font-serif
                    text-xl
                    text-[#43231C]
                  "
                >
                  Payment Details
                </h3>
              </div>

              <div
                className="
                  grid
                  gap-6
                  md:grid-cols-[1fr_1fr]
                "
              >
                {/* Payment method */}

                <div className="md:border-r md:border-[#EAE2D5] md:pr-8">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.12em]
                      text-[#918477]
                    "
                  >
                    Payment Method
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#3A2A20]">
                    {order.paymentMethod ||
                      "Cash on Delivery"}
                  </p>

                  <p
                    className={`
                      mt-3
                      inline-flex
                      rounded-full
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.1em]
                      ${
                        String(
                          order.paymentStatus || ""
                        ).toLowerCase() === "paid"
                          ? "bg-[#F5E8CE] text-[#795033]"
                          : "bg-[#F2EBDD] text-[#71655B]"
                      }
                    `}
                  >
                    {order.paymentStatus ||
                      "Pending"}
                  </p>
                </div>

                {/* Price summary */}

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-[#71655B]">
                    <span>Subtotal</span>

                    <span>
                      ₹
                      {formatPrice(
                        order.subtotal
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#71655B]">
                    <span>Shipping Charges</span>

                    <span>
                      {Number(
                        order.shipping || 0
                      ) === 0
                        ? "Free"
                        : `₹${formatPrice(
                            order.shipping
                          )}`}
                    </span>
                  </div>

                  {Number(
                    order.discount || 0
                  ) > 0 && (
                    <div className="flex items-center justify-between text-sm text-[#795033]">
                      <span>Discount</span>

                      <span>
                        -₹
                        {formatPrice(
                          order.discount
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#EAE2D5] pt-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-[0.12em]
                          text-[#3A2A20]
                        "
                      >
                        Total Paid
                      </span>

                      <span
                        className="
                          font-serif
                          text-2xl
                          text-[#5A3026]
                        "
                      >
                        ₹
                        {formatPrice(
                          order.total
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            {(order.email ||
              order.phone ||
              order.customerName) && (
              <div
                className="
                  mt-5
                  rounded-[18px]
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  p-5
                  shadow-[0_12px_40px_rgba(67,35,28,0.04)]
                  sm:p-7
                "
              >
                <p
                  className="
                    mb-5
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-[#A98243]
                  "
                >
                  Customer Information
                </p>

                <div className="grid gap-5 sm:grid-cols-3">
                  {order.customerName && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#918477]">
                        Name
                      </p>

                      <p className="mt-2 text-sm text-[#3A2A20]">
                        {order.customerName}
                      </p>
                    </div>
                  )}

                  {order.email && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#918477]">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm text-[#3A2A20]">
                        {order.email}
                      </p>
                    </div>
                  )}

                  {order.phone && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#918477]">
                        Phone
                      </p>

                      <p className="mt-2 text-sm text-[#3A2A20]">
                        {order.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-stretch
                justify-center
                gap-3
                pb-8
                pt-7
                sm:flex-row
                sm:items-center
              "
            >
              <button
                type="button"
                onClick={handleTrackAnother}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-[10px]
                  border
                  border-[#5A3026]
                  px-6
                  py-3.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#5A3026]
                  transition
                  hover:bg-[#5A3026]
                  hover:text-[#FFFDF9]
                "
              >
                Track Another Order
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/collection")
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-[10px]
                  bg-[#5A3026]
                  px-6
                  py-3.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#FFFDF9]
                  transition
                  hover:bg-[#43231C]
                "
              >
                Continue Shopping
                <FiArrowRight size={15} />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;