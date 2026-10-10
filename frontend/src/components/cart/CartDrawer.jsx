import { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../hooks/useCart";

const FREE_SHIPPING_THRESHOLD = 1999;

const SHIPPING_CHARGE = 99;

function CartDrawer() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [isCouponOpen, setIsCouponOpen] =
    useState(false);

  const [couponCode, setCouponCode] =
    useState("");

  // ============================================================
  // LOCK PAGE SCROLL WHEN CART IS OPEN
  // ============================================================

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isCartOpen]);

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isCartOpen, closeCart]);

  // ============================================================
  // SHIPPING
  // ============================================================

  const shippingAmount = useMemo(() => {
    if (cartTotal <= 0) {
      return 0;
    }

    return cartTotal >=
      FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_CHARGE;
  }, [cartTotal]);

  const amountRemaining =
    Math.max(
      FREE_SHIPPING_THRESHOLD -
        cartTotal,
      0
    );

  const shippingProgress = Math.min(
    (cartTotal /
      FREE_SHIPPING_THRESHOLD) *
      100,
    100
  );

  const finalTotal =
    cartTotal + shippingAmount;

  // ============================================================
  // IMAGE HELPER
  // ============================================================

  const getProductImage = (item) => {
    if (
      Array.isArray(item.images) &&
      item.images.length > 0
    ) {
      return item.images[0];
    }

    if (item.image) {
      return item.image;
    }

    return "";
  };

  // ============================================================
  // CLOSE + CONTINUE SHOPPING
  // ============================================================

  const handleContinueShopping = () => {
    closeCart();
    navigate("/collection");
  };

  // ============================================================
  // CHECKOUT
  // ============================================================

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    closeCart();
    navigate("/checkout");
  };

  // ============================================================
  // BACKDROP CLICK
  // ============================================================

  const handleBackdropClick = () => {
    closeCart();
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!isCartOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[500]
        flex
        justify-end
      "
    >
      {/* ======================================================
          BACKDROP
          ====================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-[#2B1A15]/45
          backdrop-blur-[5px]
        "
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* ======================================================
          CART DRAWER
          ====================================================== */}

      <aside
        className="
          relative
          z-[510]
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          border-l
          border-[#DED4C4]
          bg-[#FAF7F0]
          shadow-[-15px_0_55px_rgba(67,35,28,0.16)]
          sm:w-[470px]
          lg:w-[500px]
        "
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* ====================================================
            HEADER
            ==================================================== */}

        <header
          className="
            relative
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-[#DED4C4]
            bg-[#FAF7F0]
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
        >
          <div>
            <div
              className="
                mb-1
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-px
                  w-6
                  bg-[#C8A15A]
                "
              />

              <p
                className="
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[3px]
                  text-[#A98243]
                "
              >
                Shopping Bag
              </p>
            </div>

            <h2
              className="
                font-['Cormorant_Garamond']
                text-[38px]
                font-normal
                leading-none
                text-[#43231C]
                sm:text-[42px]
              "
            >
              My Bag
            </h2>

            <p
              className="
                mt-1
                font-['Poppins']
                text-[8px]
                uppercase
                tracking-[2px]
                text-[#918477]
              "
            >
              {cartCount}{" "}
              {cartCount === 1
                ? "Item"
                : "Items"}
            </p>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#DED4C4]
              bg-[#FFFDF9]
              text-[#5A3026]
              transition-all
              duration-300
              hover:border-[#C8A15A]
              hover:bg-[#F2EBDD]
            "
          >
            <FiX
              size={19}
              strokeWidth={1.3}
            />
          </button>
        </header>

        {/* ====================================================
            CONTENT
            ==================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >
          {/* ==================================================
              EMPTY CART
              ================================================== */}

          {cartItems.length === 0 ? (
            <div
              className="
                flex
                min-h-full
                flex-col
                items-center
                justify-center
                px-7
                py-14
                text-center
              "
            >
              <div
                className="
                  relative
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DED4C4]
                  bg-[#F2EBDD]
                "
              >
                <FiShoppingBag
                  size={34}
                  strokeWidth={1.1}
                  className="text-[#A98243]"
                />

                <span
                  className="
                    absolute
                    right-1
                    top-2
                    h-2
                    w-2
                    rotate-45
                    bg-[#C8A15A]
                  "
                />
              </div>

              <p
                className="
                  mt-7
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[3px]
                  text-[#A98243]
                "
              >
                Your Bag Is Waiting
              </p>

              <h3
                className="
                  mt-2
                  font-['Cormorant_Garamond']
                  text-[31px]
                  font-normal
                  text-[#43231C]
                "
              >
                Nothing here yet.
              </h3>

              <p
                className="
                  mt-2
                  max-w-[310px]
                  font-['Poppins']
                  text-[10px]
                  leading-6
                  text-[#71655B]
                "
              >
                Discover thoughtfully crafted
                pieces and add something beautiful
                to your bag.
              </p>

              <button
                type="button"
                onClick={
                  handleContinueShopping
                }
                className="
                  mt-7
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-3
                  bg-[#5A3026]
                  px-7
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[2px]
                  text-[#FFFDF9]
                  transition
                  duration-300
                  hover:bg-[#43231C]
                "
              >
                Explore Collection

                <FiArrowRight
                  size={14}
                  strokeWidth={1.3}
                />
              </button>
            </div>
          ) : (
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              {/* ================================================
                  SHIPPING PROGRESS
                  ================================================ */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F2EBDD]
                    "
                  >
                    <FiPackage
                      size={17}
                      strokeWidth={1.25}
                      className="text-[#A98243]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        font-['Poppins']
                        text-[9px]
                        leading-5
                        text-[#5A3026]
                      "
                    >
                      {amountRemaining > 0 ? (
                        <>
                          Add{" "}
                          <span className="font-semibold">
                            ₹
                            {amountRemaining.toLocaleString(
                              "en-IN"
                            )}
                          </span>{" "}
                          more for free
                          shipping
                        </>
                      ) : (
                        <span className="font-semibold">
                          You've unlocked free
                          shipping.
                        </span>
                      )}
                    </p>

                    <div
                      className="
                        mt-3
                        h-1.5
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-[#EAE2D5]
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#C8A15A]
                          transition-all
                          duration-500
                        "
                        style={{
                          width: `${shippingProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ==============================================
                  PRODUCTS
                  ============================================== */}

              <div className="mt-6">
                {cartItems.map(
                  (item, index) => {
                    const itemPrice =
                      item.isOnSale &&
                      item.salePrice !==
                        null &&
                      item.salePrice !==
                        undefined
                        ? Number(
                            item.salePrice
                          )
                        : Number(
                            item.price || 0
                          );

                    const image =
                      getProductImage(
                        item
                      );

                    return (
                      <div
                        key={`${item._id}-${item.size}-${index}`}
                        className="
                          border-b
                          border-[#DED4C4]
                          pb-5
                          pt-1
                          first:pt-0
                        "
                      >
                        <div
                          className="
                            flex
                            gap-4
                          "
                        >
                          {/* PRODUCT IMAGE */}

                          <div
                            className="
                              h-[118px]
                              w-[91px]
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-[#F2EBDD]
                              sm:h-[125px]
                              sm:w-[96px]
                            "
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  item.name ||
                                  "Product"
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
                                "
                              >
                                <FiShoppingBag
                                  size={24}
                                  strokeWidth={
                                    1.1
                                  }
                                  className="text-[#A98243]"
                                />
                              </div>
                            )}
                          </div>

                          {/* PRODUCT DETAILS */}

                          <div className="min-w-0 flex-1">
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <div>
                                <p
                                  className="
                                    font-['Poppins']
                                    text-[7px]
                                    font-medium
                                    uppercase
                                    tracking-[2px]
                                    text-[#A98243]
                                  "
                                >
                                  {item.category ||
                                    "Sirraha"}
                                </p>

                                <h3
                                  className="
                                    mt-1
                                    font-['Cormorant_Garamond']
                                    text-[20px]
                                    font-medium
                                    leading-tight
                                    text-[#43231C]
                                  "
                                >
                                  {item.name}
                                </h3>

                                <p
                                  className="
                                    mt-1
                                    font-['Poppins']
                                    text-[9px]
                                    text-[#71655B]
                                  "
                                >
                                  Size:{" "}
                                  <span className="font-medium text-[#5A3026]">
                                    {item.size ||
                                      "—"}
                                  </span>
                                </p>
                              </div>

                              {/* REMOVE */}

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item._id,
                                    item.size
                                  )
                                }
                                aria-label={`Remove ${item.name}`}
                                className="
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-[#918477]
                                  transition
                                  duration-300
                                  hover:bg-[#F2EBDD]
                                  hover:text-[#5A3026]
                                "
                              >
                                <FiTrash2
                                  size={15}
                                  strokeWidth={
                                    1.25
                                  }
                                />
                              </button>
                            </div>

                            {/* PRICE */}

                            <p
                              className="
                                mt-3
                                font-['Cormorant_Garamond']
                                text-[20px]
                                font-medium
                                text-[#5A3026]
                              "
                            >
                              ₹
                              {itemPrice.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {/* QUANTITY */}

                            <div
                              className="
                                mt-3
                                inline-flex
                                h-9
                                items-center
                                overflow-hidden
                                rounded-full
                                border
                                border-[#DED4C4]
                                bg-[#FFFDF9]
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item._id,
                                    item.size
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="
                                  flex
                                  h-full
                                  w-9
                                  items-center
                                  justify-center
                                  text-[#5A3026]
                                  transition
                                  hover:bg-[#F2EBDD]
                                "
                              >
                                <FiMinus
                                  size={12}
                                  strokeWidth={
                                    1.4
                                  }
                                />
                              </button>

                              <span
                                className="
                                  flex
                                  min-w-[28px]
                                  items-center
                                  justify-center
                                  font-['Poppins']
                                  text-[10px]
                                  font-medium
                                  text-[#43231C]
                                "
                              >
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item._id,
                                    item.size
                                  )
                                }
                                aria-label="Increase quantity"
                                className="
                                  flex
                                  h-full
                                  w-9
                                  items-center
                                  justify-center
                                  text-[#5A3026]
                                  transition
                                  hover:bg-[#F2EBDD]
                                "
                              >
                                <FiPlus
                                  size={12}
                                  strokeWidth={
                                    1.4
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* ==============================================
                  COUPON
                  ============================================== */}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setIsCouponOpen(
                      (previous) =>
                        !previous
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[#DED4C4]
                    bg-[#F2EBDD]/60
                    px-4
                    py-3.5
                    text-left
                    transition
                    hover:border-[#C8A15A]
                  "
                >
                  <div>
                    <p
                      className="
                        font-['Poppins']
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[1.8px]
                        text-[#5A3026]
                      "
                    >
                      Have a coupon code?
                    </p>

                    {couponCode && (
                      <p
                        className="
                          mt-1
                          font-['Poppins']
                          text-[8px]
                          text-[#A98243]
                        "
                      >
                        {couponCode}
                      </p>
                    )}
                  </div>

                  {isCouponOpen ? (
                    <FiChevronUp
                      size={16}
                      strokeWidth={1.3}
                      className="text-[#A98243]"
                    />
                  ) : (
                    <FiChevronDown
                      size={16}
                      strokeWidth={1.3}
                      className="text-[#A98243]"
                    />
                  )}
                </button>

                {isCouponOpen && (
                  <div
                    className="
                      mt-2
                      flex
                      gap-2
                    "
                  >
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(event) =>
                        setCouponCode(
                          event.target.value.toUpperCase()
                        )
                      }
                      placeholder="ENTER COUPON CODE"
                      className="
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-[#DED4C4]
                        bg-[#FFFDF9]
                        px-4
                        py-3
                        font-['Poppins']
                        text-[9px]
                        uppercase
                        tracking-[1px]
                        text-[#43231C]
                        outline-none
                        placeholder:text-[#918477]
                        focus:border-[#C8A15A]
                      "
                    />

                    <button
                      type="button"
                      className="
                        rounded-lg
                        bg-[#5A3026]
                        px-4
                        font-['Poppins']
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[1.5px]
                        text-[#FFFDF9]
                        transition
                        hover:bg-[#43231C]
                      "
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* ==============================================
                  ORDER SUMMARY
                  ============================================== */}

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-[#DED4C4]
                  bg-[#F2EBDD]/65
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      font-['Poppins']
                      text-[10px]
                      text-[#71655B]
                    "
                  >
                    Subtotal (
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "item"
                      : "items"}
                    )
                  </span>

                  <span
                    className="
                      font-['Poppins']
                      text-[11px]
                      font-medium
                      text-[#5A3026]
                    "
                  >
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      font-['Poppins']
                      text-[10px]
                      text-[#71655B]
                    "
                  >
                    Shipping
                  </span>

                  <span
                    className={`
                      font-['Poppins']
                      text-[10px]
                      font-medium
                      ${
                        shippingAmount === 0
                          ? "text-[#A98243]"
                          : "text-[#5A3026]"
                      }
                    `}
                  >
                    {shippingAmount ===
                    0
                      ? "Free"
                      : `₹${shippingAmount}`}
                  </span>
                </div>

                <div
                  className="
                    my-4
                    h-px
                    bg-[#DED4C4]
                  "
                />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      font-['Cormorant_Garamond']
                      text-[21px]
                      font-medium
                      text-[#43231C]
                    "
                  >
                    Total
                  </span>

                  <span
                    className="
                      font-['Cormorant_Garamond']
                      text-[23px]
                      font-medium
                      text-[#5A3026]
                    "
                  >
                    ₹
                    {finalTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              {/* ==============================================
                  CHECKOUT
                  ============================================== */}

              <button
                type="button"
                onClick={handleCheckout}
                className="
                  mt-5
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  gap-4
                  bg-[#5A3026]
                  px-5
                  font-['Poppins']
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[2.5px]
                  text-[#FFFDF9]
                  transition
                  duration-300
                  hover:bg-[#43231C]
                "
              >
                <span>
                  Proceed to Checkout
                </span>

                <FiArrowRight
                  size={16}
                  strokeWidth={1.3}
                />
              </button>

              {/* ==============================================
                  CONTINUE SHOPPING
                  ============================================== */}

              <button
                type="button"
                onClick={
                  handleContinueShopping
                }
                className="
                  mt-3
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[#DED4C4]
                  bg-[#FFFDF9]
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[2px]
                  text-[#5A3026]
                  transition
                  duration-300
                  hover:border-[#C8A15A]
                  hover:bg-[#F2EBDD]
                "
              >
                <FiArrowLeft
                  size={14}
                  strokeWidth={1.3}
                />

                Continue Shopping
              </button>

              {/* ==============================================
                  FOOT NOTE
                  ============================================== */}

              <p
                className="
                  pb-3
                  pt-5
                  text-center
                  font-['Cormorant_Garamond']
                  text-[14px]
                  italic
                  text-[#918477]
                "
              >
                Rooted in Indian craft.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;