import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../constants/api";

import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiPackage,
  FiHeart,
  FiTag,
  FiUser,
} from "react-icons/fi";

import { FaGoogle, FaApple } from "react-icons/fa";

import AnnouncementBar from "../../components/home/AnnouncementBar";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update input values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Email and password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      // Save login token
      localStorage.setItem("token", data.token);

      // Save user details
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect after successful login
      navigate("/account");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login button
  const handleGoogleLogin = () => {
    alert("Google login will be connected soon.");
  };

  // Apple login button
  const handleAppleLogin = () => {
    alert("Apple login will be connected soon.");
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2937] flex flex-col">
      {/* ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* NAVBAR */}
      <Navbar showCategoryNav={true} />

      {/* LOGIN / CREATE ACCOUNT */}
      <main className="flex-1">
        <section
          className="
            w-full
            border-b
            border-[#E5E0D6]
            min-h-[calc(100vh-210px)]
          "
        >
          <div
            className="
              w-full
              max-w-[1440px]
              mx-auto
              grid
              grid-cols-1
              lg:grid-cols-2
              min-h-[calc(100vh-210px)]
            "
          >
            {/* =================================================
                LOGIN COLUMN
            ================================================= */}
            <div
              className="
                flex
                justify-center
                border-b
                lg:border-b-0
                lg:border-r
                border-[#E5E0D6]
                px-6
                sm:px-10
                md:px-14
                lg:px-16
                xl:px-20
                py-16
                sm:py-20
                lg:py-24
              "
            >
              <div className="w-full max-w-[560px]">
                <form onSubmit={handleSubmit}>
                  {/* LABEL */}
                  <p
                    className="
                      text-[#0E5B3B]
                      text-[10px]
                      sm:text-[11px]
                      uppercase
                      tracking-[0.35em]
                      mb-4
                    "
                  >
                    Sirraha Account
                  </p>

                  {/* HEADING */}
                  <h1
                    className="
                      text-[#123E30]
                      text-[40px]
                      sm:text-[46px]
                      lg:text-[50px]
                      leading-none
                      font-normal
                      mb-5
                      font-serif
                    "
                  >
                    Welcome Back
                  </h1>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      text-[#111827]
                      text-[15px]
                      sm:text-[16px]
                      leading-7
                      mb-10
                    "
                  >
                    Login to continue shopping with Sirraha.
                  </p>

                  {/* ERROR MESSAGE */}
                  {error && (
                    <p className="mb-6 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  {/* EMAIL */}
                  <div className="mb-7">
                    <label
                      className="
                        block
                        text-[#111827]
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        mb-3
                      "
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="
                          w-full
                          h-[56px]
                          rounded-[7px]
                          border
                          border-[#CFC8BC]
                          bg-transparent
                          px-4
                          pr-12
                          text-[15px]
                          text-[#111827]
                          placeholder:text-[#6B7280]
                          outline-none
                          focus:border-[#0E5B3B]
                          transition-colors
                        "
                      />

                      <FiMail
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          w-5
                          h-5
                          text-[#111827]
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-5">
                    <label
                      className="
                        block
                        text-[#111827]
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        mb-3
                      "
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="
                          w-full
                          h-[56px]
                          rounded-[7px]
                          border
                          border-[#CFC8BC]
                          bg-transparent
                          px-4
                          pr-12
                          text-[15px]
                          text-[#111827]
                          placeholder:text-[#6B7280]
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
                        aria-label="Toggle password visibility"
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#111827]
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

                  {/* FORGOT PASSWORD */}
                  <div className="mb-7">
                    <button
                      type="button"
                      onClick={() =>
                        alert("Forgot password feature will be added soon.")
                      }
                      className="
                        text-[#123E30]
                        text-[14px]
                        underline
                        underline-offset-4
                        hover:text-[#0E5B3B]
                      "
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-[64px]
                      rounded-[7px]
                      bg-[#00563F]
                      text-white
                      text-[15px]
                      font-semibold
                      tracking-[0.18em]
                      hover:bg-[#064A38]
                      transition-colors
                      disabled:opacity-70
                      disabled:cursor-not-allowed
                    "
                  >
                    {loading ? "LOGGING IN..." : "LOGIN"}
                  </button>

                  {/* OR CONTINUE WITH */}
                  <div
                    className="
                      flex
                      items-center
                      gap-5
                      my-8
                    "
                  >
                    <div className="flex-1 h-px bg-[#DDD5C9]" />

                    <span
                      className="
                        text-[12px]
                        font-semibold
                        tracking-[0.2em]
                        uppercase
                        whitespace-nowrap
                      "
                    >
                      OR CONTINUE WITH
                    </span>

                    <div className="flex-1 h-px bg-[#DDD5C9]" />
                  </div>

                  {/* SOCIAL BUTTONS */}
                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-4
                    "
                  >
                    {/* GOOGLE BUTTON */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="
                        h-[54px]
                        rounded-[7px]
                        border
                        border-[#D5CEC2]
                        bg-transparent
                        flex
                        items-center
                        justify-center
                        gap-3
                        text-[14px]
                        text-[#111827]
                        hover:bg-white
                        transition-colors
                      "
                    >
                      <FaGoogle className="w-[17px] h-[17px]" />

                      <span>Continue with Google</span>
                    </button>

                    {/* APPLE BUTTON */}
                    <button
                      type="button"
                      onClick={handleAppleLogin}
                      className="
                        h-[54px]
                        rounded-[7px]
                        border
                        border-[#D5CEC2]
                        bg-transparent
                        flex
                        items-center
                        justify-center
                        gap-3
                        text-[14px]
                        text-[#111827]
                        hover:bg-white
                        transition-colors
                      "
                    >
                      <FaApple className="w-[19px] h-[19px]" />

                      <span>Continue with Apple</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* =================================================
                CREATE ACCOUNT COLUMN
            ================================================= */}
            <div
              className="
                flex
                justify-center
                px-6
                sm:px-10
                md:px-14
                lg:px-16
                xl:px-20
                py-16
                sm:py-20
                lg:py-24
              "
            >
              <div className="w-full max-w-[560px]">
                {/* LABEL */}
                <p
                  className="
                    text-[#0E5B3B]
                    text-[10px]
                    sm:text-[11px]
                    uppercase
                    tracking-[0.35em]
                    mb-4
                  "
                >
                  New Customer
                </p>

                {/* HEADING */}
                <h2
                  className="
                    text-[#123E30]
                    text-[40px]
                    sm:text-[46px]
                    lg:text-[50px]
                    leading-none
                    font-normal
                    mb-5
                    font-serif
                  "
                >
                  Create Account
                </h2>

                {/* DESCRIPTION */}
                <p
                  className="
                    text-[#111827]
                    text-[15px]
                    sm:text-[16px]
                    leading-7
                    max-w-[530px]
                    mb-10
                  "
                >
                  Create an account to access your order status,
                  track orders and enjoy a faster checkout
                  experience.
                </p>

                {/* BENEFITS */}
                <div className="space-y-7">
                  {/* TRACK ORDERS */}
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-full
                        bg-[#F0ECE3]
                      "
                    >
                      <FiPackage className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-[17px] font-medium mb-1">
                        Track your orders
                      </h3>

                      <p className="text-[#5B5B5B] text-[14px] sm:text-[15px]">
                        Stay updated on your orders and shipments
                      </p>
                    </div>
                  </div>

                  {/* WISHLIST */}
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-full
                        bg-[#F0ECE3]
                      "
                    >
                      <FiHeart className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-[17px] font-medium mb-1">
                        Wishlist
                      </h3>

                      <p className="text-[#5B5B5B] text-[14px] sm:text-[15px]">
                        Save your favorite styles for later
                      </p>
                    </div>
                  </div>

                  {/* EXCLUSIVE ACCESS */}
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-full
                        bg-[#F0ECE3]
                      "
                    >
                      <FiTag className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-[17px] font-medium mb-1">
                        Exclusive access
                      </h3>

                      <p className="text-[#5B5B5B] text-[14px] sm:text-[15px]">
                        Be the first to know about new arrivals and offers
                      </p>
                    </div>
                  </div>

                  {/* FASTER CHECKOUT */}
                  <div className="flex items-center gap-5">
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-full
                        bg-[#F0ECE3]
                      "
                    >
                      <FiUser className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-[17px] font-medium mb-1">
                        Faster checkout
                      </h3>

                      <p className="text-[#5B5B5B] text-[14px] sm:text-[15px]">
                        Enjoy a seamless shopping experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* CREATE ACCOUNT BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="
                    w-full
                    h-[64px]
                    mt-10
                    rounded-[7px]
                    border
                    border-[#0E5B3B]
                    bg-transparent
                    text-[#0E5B3B]
                    text-[15px]
                    font-semibold
                    tracking-[0.15em]
                    hover:bg-[#0E5B3B]
                    hover:text-white
                    transition-colors
                  "
                >
                  CREATE ACCOUNT
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Login;