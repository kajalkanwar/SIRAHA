import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

  FiArrowLeft,

  FiArrowRight,

  FiLock,

  FiMapPin,

  FiMinus,

  FiPlus,

  FiTag,

  FiTrash2,

  FiCreditCard,

} from "react-icons/fi";

import {

  createOrder,

  validateCoupon,

  createRazorpayOrder,

  verifyRazorpayPayment,

} from "../../constants/api";

import { states } from "../../constants/locations";

import { useCart } from "../../hooks/useCart";

const FREE_SHIPPING_THRESHOLD = 1999;

const STANDARD_SHIPPING = 99;

const Checkout = () => {

  const navigate = useNavigate();


  const {

    cartItems,

    clearCart,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

    openCart,

  } = useCart();
// ============================================================// FORM// ============================================================
  const [formData, setFormData] = useState({

    customerName: "",

    email: "",

    phone: "",

    address: "",

    city: "",

    state: "",

    pincode: "",

  });
// ============================================================// CHECKOUT STATE// ============================================================
  const [paymentMethod, setPaymentMethod] =

    useState("COD");

  const [loading, setLoading] =

    useState(false);

  const [error, setError] =

    useState("");

  const [couponCode, setCouponCode] =

    useState("");

  const [appliedCoupon, setAppliedCoupon] =

    useState(null);

  const [couponLoading, setCouponLoading] =

    useState(false);

  const [couponError, setCouponError] =

    useState("");

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const currentStep = 2;
// ============================================================// LOAD RAZORPAY SCRIPT// ============================================================
  useEffect(() => {

    const existingScript =

      document.querySelector(

        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'

      );

    if (existingScript) {

      return;

    }

    const script =

      document.createElement("script");

    script.src =

      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

  }, []);
// ============================================================// ITEM PRICE// ============================================================
  const getItemPrice = (item) => {

    if (

      item.isOnSale &&

      item.salePrice !== null &&

      item.salePrice !== undefined

    ) {

      return Number(item.salePrice);

    }

    return Number(item.price || 0);

  };
// ============================================================// SUBTOTAL// ============================================================
  const subtotal = useMemo(() => {

    return cartItems.reduce(

      (total, item) =>

        total +

        getItemPrice(item) *

          (item.quantity || 0),

      0

    );

  }, [cartItems]);
// ============================================================// SHIPPING// ============================================================
  const shipping = useMemo(() => {

    if (

      subtotal >= FREE_SHIPPING_THRESHOLD

    ) {

      return 0;

    }

    return STANDARD_SHIPPING;

  }, [subtotal]);
// ============================================================// COUPON DISCOUNT// ============================================================
  const couponDiscount = Number(

    appliedCoupon?.discountAmount || 0

  );
// ============================================================// TOTAL// ============================================================
  const total = Math.max(

    0,

    subtotal +

      shipping -

      couponDiscount

  );
// ============================================================// FORM CHANGE// ============================================================
const handleChange = (event) => {

  const { name, value } = event.target;

  setFormData((previousData) => ({

    ...previousData,

    [name]: value,

  }));
// Only reset the applied coupon when the email changes.
  if (

    name === "email" &&

    value.trim().toLowerCase() !==

      formData.email.trim().toLowerCase()

  ) {

    setAppliedCoupon(null);

    setCouponError(

      "Your email changed. Please apply the coupon again."

    );

  }

};
// ============================================================// APPLY COUPON// ============================================================
const handleApplyCoupon = async () => {

  const code = couponCode.trim().toUpperCase();

  if (!code) {

    setCouponError("Please enter a coupon code.");

    return;

  }

  if (subtotal <= 0) {

    setCouponError("Add products to your cart first.");

    return;

  }

  try {

    setCouponLoading(true);

    setCouponError("");

    const result = await validateCoupon({

      code,

      subtotal,

      email: formData.email,

    });

    setAppliedCoupon(result);

    setCouponCode(result.code);

    setCouponError("");

  } catch (error) {

    setAppliedCoupon(null);

    setCouponError(

      error.message || "Unable to apply coupon."

    );

  } finally {

    setCouponLoading(false);

  }

};
// ============================================================// REMOVE COUPON// ============================================================
  const handleRemoveCoupon = () => {

    setAppliedCoupon(null);

    setCouponCode("");

    setCouponError("");

  };
// ============================================================// VALIDATE FORM// ============================================================
  const validateForm = () => {

    if (!formData.customerName.trim()) {

      setError("Please enter your full name.");

      return false;

    }

    if (!formData.email.trim()) {

      setError(

        "Please enter your email address."

      );

      return false;

    }

    if (

      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

        formData.email

      )

    ) {

      setError(

        "Please enter a valid email address."

      );

      return false;

    }

    if (

      !/^[0-9]{10}$/.test(

        formData.phone

      )

    ) {

      setError(

        "Please enter a valid 10-digit mobile number."

      );

      return false;

    }

    if (!formData.address.trim()) {

      setError(

        "Please enter your complete address."

      );

      return false;

    }

    if (!formData.city.trim()) {

      setError("Please enter your city.");

      return false;

    }

    if (!formData.state) {

      setError("Please select your state.");

      return false;

    }

    if (

      !/^[0-9]{6}$/.test(

        formData.pincode

      )

    ) {

      setError(

        "Please enter a valid 6-digit pincode."

      );

      return false;

    }

    setError("");

    return true;

  };
// ============================================================// CREATE ORDER DATA// ============================================================
  const buildOrderData = () => {

    return {

      ...formData,
      customerName: formData.customerName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),

      items: cartItems.map((item) => ({

  product: item._id,

  name:

    item.name ||

    item.description ||

    "Sirraha Product",

  image:

    item.images?.[0] ||

    item.image ||

    "",

  size: item.size,

  quantity: item.quantity,

  price: item.price,

})),

      subtotal,

      shipping,

      discount: couponDiscount,

      couponCode:

        appliedCoupon?.code || null,

      total,

      paymentMethod,

    };

  };
// ============================================================// COD ORDER// ============================================================
  const handleCodOrder = async () => {

    const orderData =

      buildOrderData();

    await createOrder(orderData);

    clearCart();

    alert(

      "Your order has been placed successfully!"

    );

    navigate("/");

  };
// ============================================================// RAZORPAY PAYMENT// ============================================================
  const handleRazorpayPayment =

    async () => {

      if (

        !window.Razorpay

      ) {

        throw new Error(

          "Payment system is still loading. Please try again."

        );

      }

      const razorpayData =

        await createRazorpayOrder(

          total

        );

      if (!razorpayData?.key || !razorpayData?.order?.id) {
        throw new Error("Unable to initialize online payment. Please try again.");
      }

      const options = {

        key: razorpayData.key,

        amount:

          razorpayData.order.amount,

        currency:

          razorpayData.order.currency,

        name: "Sirraha",

        description:

          "Sirraha Fashion Order",

        order_id:

          razorpayData.order.id,

        prefill: {

          name:

            formData.customerName,

          email:

            formData.email,

          contact:

            `+91${formData.phone}`,

        },

        theme: {

          color: "#4B1F1B",

        },

        handler:

          async (response) => {

            if (paymentCompleted) return;

            try {

              setLoading(true);

              await verifyRazorpayPayment(response);

              const orderData =

                buildOrderData();

              orderData.paymentStatus =

                "PAID";

              orderData.razorpayPaymentId =

                response.razorpay_payment_id;

              orderData.razorpayOrderId =

                response.razorpay_order_id;

              orderData.razorpaySignature =

                response.razorpay_signature;

              await createOrder(orderData);

              setPaymentCompleted(true);

              clearCart();

              alert(

                "Payment successful! Your order has been placed."

              );

              navigate("/");

            } catch (error) {

              console.error(

                "Payment verification error:",

                error

              );

              setError(

                error.message ||

                  "Payment verification failed."

              );

            } finally {

              setLoading(false);

            }

          },

        modal: {

          ondismiss: () => {

            setLoading(false);

          },

        },

      };

      const razorpay =

        new window.Razorpay(

          options

        );

      razorpay.on(

        "payment.failed",

        (response) => {

          console.error(

            "Razorpay payment failed:",

            response

          );

          setError(

            "Payment failed. Please try again."

          );

          setLoading(false);

        }

      );

      razorpay.open();

    };
// ============================================================// PLACE ORDER// ============================================================
  const handleSubmit = async (

    event

  ) => {

    event.preventDefault();

    if (

      cartItems.length === 0

    ) {

      navigate("/collection");

      return;

    }

    if (!validateForm()) {

      return;

    }

    try {

      setLoading(true);

      setError("");

      if (

        paymentMethod ===

        "COD"

      ) {

        await handleCodOrder();

      } else {

        await handleRazorpayPayment();

      }

    } catch (error) {

      console.error(

        "Checkout error:",

        error

      );

      setError(

        error.message ||

          "Unable to complete checkout."

      );

      setLoading(false);

    }

  };
// ============================================================// EMPTY BAG// ============================================================
  if (

    cartItems.length === 0

  ) {

    return (

      <main className="min-h-screen bg-[#FFFFFF] px-5 py-24 text-center">

        <p className="font-['Poppins'] text-[9px] uppercase tracking-[3px] text-[#A98243]">

          Sirraha Checkout

        </p>

        <h1 className="mt-3 font-['Cormorant_Garamond'] text-4xl text-[#351411] sm:text-5xl">

          Your bag is empty

        </h1>

        <p className="mx-auto mt-3 max-w-md font-['Poppins'] text-sm leading-6 text-[#6B5651]">

          Add something beautiful to your bag

          before continuing to checkout.

        </p>

        <button

          type="button"

          onClick={() =>

            navigate("/")

          }

          className="mt-8 bg-[#4B1F1B] px-8 py-3 font-['Poppins'] text-[9px] uppercase tracking-[2px] text-[#FFFFFF] transition hover:bg-[#351411]"

        >

          Continue Shopping

        </button>

      </main>

    );

  }
// ============================================================// CHECKOUT UI// ============================================================
  return (

    <main className="min-h-screen w-full bg-[#FFFFFF] text-[#351C19]">

      <header className="border-b border-[#E5DDD8] bg-[#FFFFFF]">

        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

          <button

            type="button"

            onClick={() =>

              navigate("/")

            }

            className="font-['Cormorant_Garamond'] text-[27px] font-medium tracking-[0.27em] text-[#4B1F1B]"

          >

            SIRRAHA

          </button>

          <div className="flex items-center gap-2 font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

            <FiLock size={12} />

            Secure Checkout

          </div>

        </div>

      </header>

      <div className="border-b border-[#E5DDD8] bg-[#FFFFFF]">

        <div className="mx-auto flex max-w-[1000px] items-center justify-center gap-3 px-4 py-4 sm:gap-8">

          {[

            "Cart",

            "Address",

            "Payment",

            "Confirmation",

          ].map(

            (

              step,

              index

            ) => {

              const stepNumber =

                index + 1;

              const active =

                stepNumber ===

                currentStep;

              return (

                <div

                  key={step}

                  className="flex items-center gap-2"

                >

                  <span

                    className={`

                      flex h-6 w-6 items-center justify-center rounded-full border text-[9px]

                      ${

                        active

                          ? "border-[#4B1F1B] bg-[#4B1F1B] text-[#FFFFFF]"

                          : "border-[#E5DDD8] bg-[#FFFFFF] text-[#6B5651]"

                      }

                    `}

                  >

                    {stepNumber}

                  </span>

                  <span

                    className={`

                      hidden font-['Poppins'] text-[8px] uppercase tracking-[1px] sm:block

                      ${

                        active

                          ? "text-[#4B1F1B]"

                          : "text-[#918477]"

                      }

                    `}

                  >

                    {step}

                  </span>

                </div>

              );

            }

          )}

        </div>

      </div>

      <div className="mx-auto w-full max-w-[1450px] px-4 py-7 sm:px-7 sm:py-10 lg:px-12 lg:py-12">

        {error && (

          <div className="mb-7 border border-[#C9A3A0] bg-[#F8EDEC] px-4 py-3 text-sm text-[#7B2E28]">

            {error}

          </div>

        )}

        <form

          onSubmit={

            handleSubmit

          }

          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_390px]"

        >

          <section>

            <div className="border-b border-[#E5DDD8] pb-8">

              <div className="mb-6">

                <p className="font-['Poppins'] text-[8px] uppercase tracking-[3px] text-[#A98243]">

                  Step 02

                </p>

                <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl text-[#351411] sm:text-5xl">

                  Delivery Address

                </h1>

                <p className="mt-1 font-['Poppins'] text-xs text-[#6B5651]">

                  Where should we deliver your order?

                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    Full Name

                  </label>

                  <input

                    type="text"

                    name="customerName"

                    value={

                      formData.customerName

                    }

                    onChange={

                      handleChange

                    }

                    placeholder="Enter your full name"

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

                <div>

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    Email Address

                  </label>

                  <input

                    type="email"

                    name="email"

                    value={

                      formData.email

                    }

                    onChange={

                      handleChange

                    }

                    placeholder="you\@example.com"

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

                <div>

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    Mobile Number

                  </label>

                  <input

                    type="tel"

                    name="phone"

                    value={

                      formData.phone

                    }

                    onChange={

                      handleChange

                    }

                    maxLength="10"

                    placeholder="10-digit mobile number"

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    Complete Address

                  </label>

                  <textarea

                    name="address"

                    value={

                      formData.address

                    }

                    onChange={

                      handleChange

                    }

                    rows="3"

                    placeholder="House number, street, area, landmark"

                    className="w-full resize-none rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

                <div>

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    City

                  </label>

                  <input

                    type="text"

                    name="city"

                    value={

                      formData.city

                    }

                    onChange={

                      handleChange

                    }

                    placeholder="Enter city"

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

                <div>

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    State

                  </label>

                  <select

                    name="state"

                    value={

                      formData.state

                    }

                    onChange={

                      handleChange

                    }

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  >

                    <option value="">

                      Select State

                    </option>

                    {states.map(

                      (

                        stateName

                      ) => (

                        <option

                          key={

                            stateName

                          }

                          value={

                            stateName

                          }

                        >

                          {

                            stateName

                          }

                        </option>

                      )

                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-1.5 block font-['Poppins'] text-[8px] uppercase tracking-[1.5px] text-[#6B5651]">

                    Pincode

                  </label>

                  <input

                    type="text"

                    name="pincode"

                    value={

                      formData.pincode

                    }

                    onChange={

                      handleChange

                    }

                    maxLength="6"

                    placeholder="6-digit pincode"

                    className="w-full rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#C8A15A]"

                  />

                </div>

              </div>

            </div>

            <div className="pt-8">

              <div className="mb-5">

                <p className="font-['Poppins'] text-[8px] uppercase tracking-[3px] text-[#A98243]">

                  Step 03

                </p>

                <h2 className="mt-2 font-['Cormorant_Garamond'] text-3xl text-[#351411]">

                  Payment Method

                </h2>

                <p className="mt-1 font-['Poppins'] text-xs text-[#6B5651]">

                  Choose your preferred payment method.

                </p>

              </div>

              <div className="space-y-3">

                <label

                  className={`

                    block cursor-pointer rounded-sm border p-4 transition

                    ${

                      paymentMethod ===

                      "COD"

                        ? "border-[#4B1F1B] bg-[#FFFFFF]"

                        : "border-[#E5DDD8] bg-[#FFFFFF]"

                    }

                  `}

                >

                  <div className="flex items-center gap-3">

                    <input

                      type="radio"

                      name="paymentMethod"

                      value="COD"

                      checked={

                        paymentMethod ===

                        "COD"

                      }

                      onChange={(

                        event

                      ) =>

                        setPaymentMethod(

                          event.target.value

                        )

                      }

                      className="accent-[#4B1F1B]"

                    />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF] text-[#A98243]">

                      <FiMapPin

                        size={15}

                      />

                    </div>

                    <div>

                      <p className="font-['Poppins'] text-sm font-medium text-[#351C19]">

                        Cash on Delivery

                      </p>

                      <p className="mt-0.5 font-['Poppins'] text-[10px] text-[#918477]">

                        Pay when your order is delivered.

                      </p>

                    </div>

                  </div>

                </label>

                <label

                  className={`

                    block cursor-pointer rounded-sm border p-4 transition

                    ${

                      paymentMethod ===

                      "RAZORPAY"

                        ? "border-[#4B1F1B] bg-[#FFFFFF]"

                        : "border-[#E5DDD8] bg-[#FFFFFF]"

                    }

                  `}

                >

                  <div className="flex items-center gap-3">

                    <input

                      type="radio"

                      name="paymentMethod"

                      value="RAZORPAY"

                      checked={

                        paymentMethod ===

                        "RAZORPAY"

                      }

                      onChange={(

                        event

                      ) =>

                        setPaymentMethod(

                          event.target.value

                        )

                      }

                      className="accent-[#4B1F1B]"

                    />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF] text-[#A98243]">

                      <FiCreditCard

                        size={15}

                      />

                    </div>

                    <div>

                      <p className="font-['Poppins'] text-sm font-medium text-[#351C19]">

                        Razorpay

                      </p>

                      <p className="mt-0.5 font-['Poppins'] text-[10px] text-[#918477]">

                        Pay securely using UPI, cards or net banking.

                      </p>

                    </div>

                  </div>

                </label>

              </div>

              <p className="mt-4 flex items-center gap-2 font-['Poppins'] text-[9px] text-[#918477]">

                <FiLock size={11} />

                Your payment information is securely processed.

              </p>

            </div>

          </section>

          <aside className="h-fit rounded-sm border border-[#E5DDD8] bg-[#FFFFFF] p-5 sm:p-7 lg:sticky lg:top-28">

            <div className="mb-6">

              <p className="font-['Poppins'] text-[8px] uppercase tracking-[3px] text-[#A98243]">

                Your Order

              </p>

              <h2 className="mt-2 font-['Cormorant_Garamond'] text-3xl text-[#351411]">

                Order Summary

              </h2>

            </div>

            <div className="space-y-4">

              {cartItems.map(

                (item) => {

                  const price =

                    getItemPrice(

                      item

                    );

                  return (

                    <div

                      key={`${item._id}-${item.size}`}

                      className="flex gap-3 border-b border-[#E5DDD8] pb-4"

                    >

                      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#F1ECE9]">

                        {item.images?.[0] ||

                        item.image ? (

                          <img

                            src={

                              item.images?.[0] ||

                              item.image

                            }

                            alt={

                              item.name ||

                              item.description

                            }

                            className="h-full w-full object-cover"

                          />

                        ) : (

                          <div className="flex h-full items-center justify-center font-['Cormorant_Garamond'] text-xs text-[#4B1F1B]">

                            SIRRAHA

                          </div>

                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <h3 className="line-clamp-2 font-['Poppins'] text-xs font-medium text-[#351C19]">

                              {

                                item.name ||

                                item.description

                              }

                            </h3>

                            <p className="mt-1 font-['Poppins'] text-[9px] text-[#918477]">

                              Size:{" "}

                              {item.size ||

                                "—"}

                            </p>

                          </div>

                          <button

                            type="button"

                            onClick={() =>

                              removeFromCart(

                                item._id,

                                item.size

                              )

                            }

                            className="shrink-0 text-[#918477] transition hover:text-[#4B1F1B]"

                            aria-label="Remove item"

                          >

                            <FiTrash2

                              size={13}

                            />

                          </button>

                        </div>

                        <div className="mt-2 flex items-center justify-between">

                          <div className="flex items-center border border-[#E5DDD8] bg-[#FFFFFF]">

                            <button

                              type="button"

                              onClick={() =>

                                decreaseQuantity(

                                  item._id,

                                  item.size

                                )

                              }

                              className="flex h-6 w-6 items-center justify-center text-[#4B1F1B]"

                            >

                              <FiMinus

                                size={10}

                              />

                            </button>

                            <span className="w-6 text-center font-['Poppins'] text-[9px]">

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

                              className="flex h-6 w-6 items-center justify-center text-[#4B1F1B]"

                            >

                              <FiPlus

                                size={10}

                              />

                            </button>

                          </div>

                          <p className="font-['Poppins'] text-xs font-medium text-[#351C19]">

                            ₹

                            {(

                              price *

                              item.quantity

                            ).toLocaleString(

                              "en-IN"

                            )}

                          </p>

                        </div>

                      </div>

                    </div>

                  );

                }

              )}

            </div>

            <div className="mt-6 border-b border-[#E5DDD8] pb-6">

              <div className="mb-2 flex items-center gap-2">

                <FiTag

                  size={14}

                  className="text-[#A98243]"

                />

                <p className="font-['Poppins'] text-[9px] uppercase tracking-[1.5px] text-[#4B1F1B]">

                  Have a coupon code?

                </p>

              </div>

              {appliedCoupon ? (

                <div className="flex items-center justify-between border border-[#B9C9B6] bg-[#EDF4EA] px-3 py-2">

                  <div>

                    <p className="font-['Poppins'] text-[10px] font-medium text-[#476044]">

                      Coupon applied

                    </p>

                    <p className="mt-0.5 font-['Poppins'] text-[9px] text-[#476044]">

                      {

                        appliedCoupon.code

                      }

                    </p>

                  </div>

                  <button

                    type="button"

                    onClick={

                      handleRemoveCoupon

                    }

                    className="text-[#476044]"

                  >

                    ×

                  </button>

                </div>

              ) : (

                <>

                  <div className="flex">

                    <input

                      type="text"

                      value={

                        couponCode

                      }

                      onChange={(

                        event

                      ) =>

                        setCouponCode(

                          event.target.value.toUpperCase()

                        )

                      }

                      placeholder="Enter coupon"

                      className="min-w-0 flex-1 border border-[#E5DDD8] bg-[#FFFFFF] px-3 py-2.5 font-['Poppins'] text-[10px] uppercase outline-none focus:border-[#C8A15A]"

                    />

                    <button

                      type="button"

                      onClick={

                        handleApplyCoupon

                      }

                      disabled={

                        couponLoading

                      }

                      className="bg-[#4B1F1B] px-4 font-['Poppins'] text-[9px] uppercase tracking-[1px] text-[#FFFFFF] transition hover:bg-[#351411] disabled:opacity-60"

                    >

                      {couponLoading

                        ? "..."

                        : "Apply"}

                    </button>

                  </div>

                  {couponError && (

                    <p className="mt-2 font-['Poppins'] text-[9px] text-[#8A3B32]">

                      {couponError}

                    </p>

                  )}

                </>

              )}

            </div>

            <div className="mt-6 space-y-3">

              <div className="flex justify-between font-['Poppins'] text-xs text-[#6B5651]">

                <span>

                  Subtotal

                </span>

                <span>

                  ₹

                  {subtotal.toLocaleString(

                    "en-IN"

                  )}

                </span>

              </div>

              {couponDiscount >

                0 && (

                <div className="flex justify-between font-['Poppins'] text-xs text-[#52704D]">

                  <span>

                    Coupon

                  </span>

                  <span>

                    -₹

                    {couponDiscount.toLocaleString(

                      "en-IN"

                    )}

                  </span>

                </div>

              )}

              <div className="flex justify-between font-['Poppins'] text-xs text-[#6B5651]">

                <span>

                  Shipping

                </span>

                <span>

                  {shipping ===

                  0

                    ? "Free"

                    : `₹${shipping}`}

                </span>

              </div>

              <div className="mt-4 flex justify-between border-t border-[#E5DDD8] pt-5">

                <div>

                  <p className="font-['Poppins'] text-[8px] uppercase tracking-[2px] text-[#6B5651]">

                    Total

                  </p>

                  <p className="mt-1 font-['Cormorant_Garamond'] text-3xl text-[#351411]">

                    ₹

                    {total.toLocaleString(

                      "en-IN"

                    )}

                  </p>

                </div>

                <div className="text-right">

                  <p className="font-['Poppins'] text-[8px] text-[#918477]">

                    Inclusive of applicable taxes

                  </p>

                </div>

              </div>

            </div>

            <button

              type="submit"

              disabled={

                loading

              }

              className="mt-7 flex w-full items-center justify-center gap-3 bg-[#4B1F1B] px-5 py-4 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2px] text-[#FFFFFF] transition hover:bg-[#351411] disabled:cursor-not-allowed disabled:opacity-60"

            >

              {loading

                ? "Processing..."

                : paymentMethod ===

                  "COD"

                ? "Place Order"

                : "Pay Securely"}

              {!loading && (

                <FiArrowRight

                  size={14}

                />

              )}

            </button>

            <button

              type="button"

              onClick={() => {

                openCart();

              }}

              className="mt-4 flex w-full items-center justify-center gap-2 font-['Poppins'] text-[9px] uppercase tracking-[1.5px] text-[#4B1F1B] transition hover:text-[#A98243]"

            >

              <FiArrowLeft

                size={13}

              />

              Back to Bag

            </button>

          </aside>

        </form>

        <div className="mt-10 border-t border-[#E5DDD8] pt-6">

          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-8">

            <div className="flex items-center gap-2 font-['Poppins'] text-[8px] uppercase tracking-[1px] text-[#918477]">

              <FiLock size={11} />

              Secure Checkout

            </div>

            <span className="hidden h-3 w-px bg-[#E5DDD8] sm:block" />

            <p className="font-['Poppins'] text-[8px] uppercase tracking-[1px] text-[#918477]">

              COD Available

            </p>

            <span className="hidden h-3 w-px bg-[#E5DDD8] sm:block" />

            <p className="font-['Poppins'] text-[8px] uppercase tracking-[1px] text-[#918477]">

              Razorpay Payments

            </p>

          </div>

        </div>

      </div>

    </main>

  );

};

export default Checkout;
