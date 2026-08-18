import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiUser,
  FiHeart,
  FiTag,
  FiShoppingBag,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Signup data:", formData);

    // Backend signup will be connected here later.
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2937]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar showCategoryNav={false} />


      {/* =====================================================
          SIGNUP SECTION
          This section gets enough height so footer stays below
          the main signup screen.
      ====================================================== */}

      <main className="min-h-[calc(100vh-82px)]">

        <section
          className="
            w-full
            border-b
            border-[#E5E0D6]
          "
        >

          <div
            className="
              mx-auto
              max-w-[1500px]
              px-6
              sm:px-10
              lg:px-16
              xl:px-20
              py-16
              sm:py-20
              lg:py-24
            "
          >

            {/* ================= TITLE ================= */}

            <div className="text-center mb-14 lg:mb-16">

              <p
                className="
                  text-[#0E5B3B]
                  text-[11px]
                  sm:text-xs
                  tracking-[0.4em]
                  uppercase
                  font-medium
                  mb-4
                "
              >
                New Customer
              </p>

              <h1
                className="
                  font-serif
                  text-[#0E5B3B]
                  text-4xl
                  sm:text-5xl
                  lg:text-6xl
                  font-normal
                  leading-tight
                "
              >
                Create an Account
              </h1>

              <p
                className="
                  mt-4
                  max-w-[600px]
                  mx-auto
                  text-[#475569]
                  text-sm
                  sm:text-base
                  leading-7
                "
              >
                Create your Sirraha account to enjoy a smoother
                shopping experience and keep track of your orders.
              </p>

            </div>


            {/* =================================================
                TWO COLUMN LAYOUT
            ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                max-w-[1180px]
                mx-auto
                border
                border-[#DED7C9]
                bg-[#F8F4EC]
              "
            >

              {/* =================================================
                  LEFT - SIGNUP FORM
              ================================================== */}

              <div
                className="
                  px-6
                  sm:px-10
                  lg:px-14
                  xl:px-16
                  py-10
                  sm:py-12
                  lg:py-14
                  lg:border-r
                  border-[#DED7C9]
                "
              >

                <div className="max-w-[520px] mx-auto">

                  <div className="mb-8">

                    <h2
                      className="
                        font-serif
                        text-3xl
                        sm:text-4xl
                        text-[#0E5B3B]
                        mb-3
                      "
                    >
                      Welcome to Sirraha
                    </h2>

                    <p
                      className="
                        text-[#475569]
                        text-sm
                        sm:text-base
                        leading-6
                      "
                    >
                      Register your account and discover
                      a more personal shopping experience.
                    </p>

                  </div>


                  {/* ================= FORM ================= */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >

                    {/* NAME */}

                    <div>

                      <label
                        htmlFor="name"
                        className="
                          block
                          text-[#1F2937]
                          text-[11px]
                          tracking-[0.2em]
                          uppercase
                          font-semibold
                          mb-2
                        "
                      >
                        Full Name
                      </label>

                      <div className="relative">

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="
                            w-full
                            h-14
                            bg-transparent
                            border
                            border-[#CFC7B8]
                            rounded-md
                            px-4
                            pr-12
                            text-[#1F2937]
                            placeholder:text-[#94A3B8]
                            outline-none
                            focus:border-[#0E5B3B]
                            transition-colors
                          "
                        />

                        <FiUser
                          className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[#64748B]
                            w-5
                            h-5
                          "
                        />

                      </div>

                    </div>


                    {/* EMAIL */}

                    <div>

                      <label
                        htmlFor="email"
                        className="
                          block
                          text-[#1F2937]
                          text-[11px]
                          tracking-[0.2em]
                          uppercase
                          font-semibold
                          mb-2
                        "
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="
                          w-full
                          h-14
                          bg-transparent
                          border
                          border-[#CFC7B8]
                          rounded-md
                          px-4
                          text-[#1F2937]
                          placeholder:text-[#94A3B8]
                          outline-none
                          focus:border-[#0E5B3B]
                          transition-colors
                        "
                      />

                    </div>


                    {/* PASSWORD */}

                    <div>

                      <label
                        htmlFor="password"
                        className="
                          block
                          text-[#1F2937]
                          text-[11px]
                          tracking-[0.2em]
                          uppercase
                          font-semibold
                          mb-2
                        "
                      >
                        Password
                      </label>

                      <div className="relative">

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          required
                          minLength={6}
                          className="
                            w-full
                            h-14
                            bg-transparent
                            border
                            border-[#CFC7B8]
                            rounded-md
                            px-4
                            pr-12
                            text-[#1F2937]
                            placeholder:text-[#94A3B8]
                            outline-none
                            focus:border-[#0E5B3B]
                            transition-colors
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          aria-label="Show or hide password"
                          className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[#64748B]
                            hover:text-[#0E5B3B]
                          "
                        >
                          {showPassword ? (
                            <FiEyeOff className="w-5 h-5" />
                          ) : (
                            <FiEye className="w-5 h-5" />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                      <label
                        htmlFor="confirmPassword"
                        className="
                          block
                          text-[#1F2937]
                          text-[11px]
                          tracking-[0.2em]
                          uppercase
                          font-semibold
                          mb-2
                        "
                      >
                        Confirm Password
                      </label>

                      <div className="relative">

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                          className="
                            w-full
                            h-14
                            bg-transparent
                            border
                            border-[#CFC7B8]
                            rounded-md
                            px-4
                            pr-12
                            text-[#1F2937]
                            placeholder:text-[#94A3B8]
                            outline-none
                            focus:border-[#0E5B3B]
                            transition-colors
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          aria-label="Show or hide password"
                          className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[#64748B]
                            hover:text-[#0E5B3B]
                          "
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="w-5 h-5" />
                          ) : (
                            <FiEye className="w-5 h-5" />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* CREATE ACCOUNT BUTTON */}

                    <button
                      type="submit"
                      className="
                        w-full
                        h-14
                        mt-2
                        bg-[#0E5B3B]
                        text-white
                        rounded-md
                        text-sm
                        tracking-[0.22em]
                        font-semibold
                        hover:bg-[#09472E]
                        transition-colors
                      "
                    >
                      CREATE ACCOUNT
                    </button>

                  </form>


                  {/* LOGIN LINK */}

                  <div className="text-center mt-7">

                    <span className="text-sm text-[#64748B]">
                      Already have an account?{" "}
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="
                        text-sm
                        text-[#0E5B3B]
                        font-medium
                        underline
                        underline-offset-4
                        hover:text-[#C9A24A]
                        transition-colors
                      "
                    >
                      Login
                    </button>

                  </div>

                </div>

              </div>


              {/* =================================================
                  RIGHT - BENEFITS
              ================================================== */}

              <div
                className="
                  px-6
                  sm:px-10
                  lg:px-14
                  xl:px-16
                  py-10
                  sm:py-12
                  lg:py-14
                  bg-[#F4EFE5]
                "
              >

                <div className="max-w-[520px] mx-auto">

                  <p
                    className="
                      text-[#0E5B3B]
                      text-[11px]
                      tracking-[0.4em]
                      uppercase
                      font-medium
                      mb-4
                    "
                  >
                    Your Sirraha Account
                  </p>

                  <h2
                    className="
                      font-serif
                      text-[#0E5B3B]
                      text-3xl
                      sm:text-4xl
                      lg:text-5xl
                      leading-tight
                      mb-5
                    "
                  >
                    A little more
                    <br />
                    personal.
                  </h2>

                  <p
                    className="
                      text-[#475569]
                      text-sm
                      sm:text-base
                      leading-7
                      mb-10
                    "
                  >
                    Create an account to access your order
                    status, save your favourite styles and
                    enjoy a faster checkout experience.
                  </p>


                  {/* ================= BENEFITS ================= */}

                  <div className="space-y-7">

                    {/* TRACK ORDERS */}

                    <div className="flex items-start gap-5">

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          w-12
                          h-12
                          rounded-full
                          bg-[#EAE3D6]
                          text-[#0E5B3B]
                        "
                      >
                        <FiShoppingBag className="w-5 h-5" />
                      </div>

                      <div>

                        <h3
                          className="
                            font-serif
                            text-xl
                            text-[#1F2937]
                            mb-1
                          "
                        >
                          Track your orders
                        </h3>

                        <p
                          className="
                            text-sm
                            text-[#64748B]
                            leading-6
                          "
                        >
                          Stay updated on your orders
                          and shipments.
                        </p>

                      </div>

                    </div>


                    {/* WISHLIST */}

                    <div className="flex items-start gap-5">

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          w-12
                          h-12
                          rounded-full
                          bg-[#EAE3D6]
                          text-[#0E5B3B]
                        "
                      >
                        <FiHeart className="w-5 h-5" />
                      </div>

                      <div>

                        <h3
                          className="
                            font-serif
                            text-xl
                            text-[#1F2937]
                            mb-1
                          "
                        >
                          Wishlist
                        </h3>

                        <p
                          className="
                            text-sm
                            text-[#64748B]
                            leading-6
                          "
                        >
                          Save your favourite styles
                          for later.
                        </p>

                      </div>

                    </div>


                    {/* EXCLUSIVE ACCESS */}

                    <div className="flex items-start gap-5">

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          w-12
                          h-12
                          rounded-full
                          bg-[#EAE3D6]
                          text-[#0E5B3B]
                        "
                      >
                        <FiTag className="w-5 h-5" />
                      </div>

                      <div>

                        <h3
                          className="
                            font-serif
                            text-xl
                            text-[#1F2937]
                            mb-1
                          "
                        >
                          Exclusive access
                        </h3>

                        <p
                          className="
                            text-sm
                            text-[#64748B]
                            leading-6
                          "
                        >
                          Be the first to know about
                          new arrivals and offers.
                        </p>

                      </div>

                    </div>


                    {/* FASTER CHECKOUT */}

                    <div className="flex items-start gap-5">

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-center
                          w-12
                          h-12
                          rounded-full
                          bg-[#EAE3D6]
                          text-[#0E5B3B]
                        "
                      >
                        <FiUser className="w-5 h-5" />
                      </div>

                      <div>

                        <h3
                          className="
                            font-serif
                            text-xl
                            text-[#1F2937]
                            mb-1
                          "
                        >
                          Faster checkout
                        </h3>

                        <p
                          className="
                            text-sm
                            text-[#64748B]
                            leading-6
                          "
                        >
                          Enjoy a seamless shopping
                          experience.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
          Footer comes AFTER the main signup page.
          It will not sit beside the signup section.
      ====================================================== */}

      <Footer />

    </div>
  );
}

export default Signup;

