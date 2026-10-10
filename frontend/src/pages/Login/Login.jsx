import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMail,
  FiPhone,
  FiLock,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

import { BASE_URL } from "../../constants/api";

import Home from "../Home/Home";
import Navbar from "../../components/layout/Navbar";

import loginImage from "../../assets/images/loginimage.jpg";

function Login() {
  const navigate = useNavigate();

  // ==================================================
  // LOGIN METHOD
  // ==================================================

  const [loginMethod, setLoginMethod] = useState("mobile");

  // ==================================================
  // FORM VALUES
  // ==================================================

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // ==================================================
  // OTP STATE
  // ==================================================

  const [otpSent, setOtpSent] = useState(false);

  // ==================================================
  // LOADING
  // ==================================================

  const [loading, setLoading] = useState(false);

  // ==================================================
  // ERROR / SUCCESS
  // ==================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // MOBILE INPUT
  // ==================================================

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }

    setError("");
    setSuccess("");
  };

  // ==================================================
  // EMAIL INPUT
  // ==================================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setError("");
    setSuccess("");
  };

  // ==================================================
  // OTP INPUT
  // ==================================================

  const handleOtpChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }

    setError("");
    setSuccess("");
  };

  // ==================================================
  // CHANGE LOGIN METHOD
  // ==================================================

  const handleMethodChange = (method) => {
    setLoginMethod(method);

    setOtp("");
    setOtpSent(false);
    setError("");
    setSuccess("");
  };

  // ==================================================
  // SEND OTP
  // ==================================================

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    // ------------------------------------------
    // MOBILE VALIDATION
    // ------------------------------------------

    if (loginMethod === "mobile") {
      if (!phone) {
        setError("Please enter your mobile number.");
        return;
      }

      if (phone.length !== 10) {
        setError(
          "Please enter a valid 10-digit mobile number."
        );
        return;
      }
    }

    // ------------------------------------------
    // EMAIL VALIDATION
    // ------------------------------------------

    if (loginMethod === "email") {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setError("Please enter your email address.");
        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(trimmedEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    try {
      setLoading(true);

      const requestBody =
        loginMethod === "mobile"
          ? {
              phone,
            }
          : {
              email: email.trim(),
            };

      const response = await fetch(
        `${BASE_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send OTP."
        );
      }

      setOtpSent(true);

      setSuccess(
        loginMethod === "mobile"
          ? "A one-time verification code has been sent to your mobile number."
          : "A one-time verification code has been sent to your email address."
      );
    } catch (error) {
      console.error("Send OTP error:", error);

      setError(
        error.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // VERIFY OTP
  // ==================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // CONTACT VALIDATION
    // ------------------------------------------

    if (loginMethod === "mobile") {
      if (!phone) {
        setError("Please enter your mobile number.");
        return;
      }

      if (phone.length !== 10) {
        setError(
          "Please enter a valid 10-digit mobile number."
        );
        return;
      }
    }

    if (loginMethod === "email") {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
    }

    // ------------------------------------------
    // OTP VALIDATION
    // ------------------------------------------

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const requestBody =
        loginMethod === "mobile"
          ? {
              phone,
              otp,
            }
          : {
              email: email.trim(),
              otp,
            };

      const response = await fetch(
        `${BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid OTP."
        );
      }

      // ------------------------------------------
      // SAVE TOKEN
      // ------------------------------------------

      localStorage.setItem("token", data.token);

      // ------------------------------------------
      // SAVE USER
      // ------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ------------------------------------------
      // REDIRECT
      // ------------------------------------------

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        error.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // CHANGE MOBILE / EMAIL
  // ==================================================

  const handleChangeContact = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setSuccess("");
  };

  // ==================================================
  // CLOSE LOGIN
  // ==================================================

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto">

      {/* ==================================================
          HOMEPAGE BACKGROUND
          --------------------------------------------------
          We intentionally render the homepage here so the
          login screen has the same blurred homepage behind it.
      ================================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          overflow-hidden
          bg-[#FAF7F0]
        "
      >
        <div className="h-full w-full overflow-hidden">
          <Home />
        </div>
      </div>

      {/* ==================================================
          ANNOUNCEMENT + NAVBAR
          --------------------------------------------------
          These are rendered inside the login background so
          they remain visible behind the blur/dim overlay.
      ================================================== */}

      <div
        className="
          fixed
          inset-x-0
          top-0
          z-[2]
          pointer-events-none
        "
      >
        <div className="announcement-bar">
          Free shipping on orders above ₹1999
        </div>

        <Navbar />
      </div>

      {/* ==================================================
          HOMEPAGE BLUR + OVERLAY
      ================================================== */}

      <div
        className="
          fixed
          inset-0
          z-10
          bg-[#2E1B15]/42
          backdrop-blur-[3px]
        "
      />

      {/* ==================================================
          LOGIN MODAL WRAPPER
      ================================================== */}

      <div
        className="
          relative
          z-20
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          px-4
          py-6
          sm:px-6
          sm:py-8
          md:px-8
        "
      >

        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <div
          className="
            relative
            flex
            w-full
            max-w-[360px]
            overflow-hidden
            rounded-[14px]
            border
            border-[#D8C8B5]
            bg-[#FAF7F0]
            shadow-[0_25px_80px_rgba(45,25,18,0.30)]

            sm:max-w-[390px]

            md:max-w-[700px]

            lg:max-w-[790px]
            lg:flex-row
          "
        >

          {/* ==================================================
              LEFT IMAGE
              --------------------------------------------------
              Hidden completely on mobile/tablet.
              Visible from lg screens.
          ================================================== */}

          <div
            className="
              relative
              hidden
              overflow-hidden
              bg-[#43231C]

              lg:block
              lg:w-[38%]
              lg:shrink-0
            "
          >

            {/* IMAGE */}

            <img
              src={loginImage}
              alt="Sirraha ethnic wear"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover

                object-[28%_center]
              "
            />

            {/* IMAGE OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#43231C]/75
                via-[#43231C]/10
                to-[#43231C]/10
              "
            />

            {/* ==================================================
                IMAGE TEXT
            ================================================== */}

            <div
              className="
                absolute
                bottom-6
                left-6
                right-5
                z-10
                text-[#FFFDF9]
              "
            >
              <p
                className="
                  font-['Poppins']
                  text-[6px]
                  font-medium
                  uppercase
                  tracking-[2.8px]
                  text-[#D8BD83]
                "
              >
                SIRRAHA
              </p>

              <h3
                className="
                  mt-1.5
                  font-['Cormorant_Garamond']
                  text-[25px]
                  font-normal
                  leading-tight
                "
              >
                Timeless Ethnic Wear
              </h3>

              <p
                className="
                  mt-1.5
                  font-['Poppins']
                  text-[8px]
                  leading-4
                  text-[#F2EBDD]/90
                "
              >
                Wear your story.
              </p>

              <p
                className="
                  font-['Poppins']
                  text-[8px]
                  leading-4
                  text-[#F2EBDD]/90
                "
              >
                Premium looks. Real comfort.
              </p>
            </div>
          </div>

          {/* ==================================================
              RIGHT LOGIN SECTION
          ================================================== */}

          <div
            className="
              relative
              w-full
              bg-[#FAF7F0]

              lg:w-[62%]
            "
          >

            {/* ==================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close login"
              className="
                absolute
                right-3
                top-3
                z-20
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#DED4C4]
                bg-[#FFFDF9]/85
                text-[#5A3026]
                transition-all
                duration-300
                hover:border-[#C8A15A]
                hover:bg-[#F2EBDD]
              "
            >
              <FiX
                className="h-[15px] w-[15px]"
                strokeWidth={1.3}
              />
            </button>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div
              className="
                mx-auto
                w-full
                max-w-[480px]
                px-6
                pb-6
                pt-7

                sm:px-8
                sm:pb-7
                sm:pt-8

                lg:px-9
                lg:pb-8
                lg:pt-9
              "
            >

              {/* ==================================================
                  SIRRAHA BRAND
              ================================================== */}

              <div className="flex flex-col items-center text-center">

                <h1
                  className="
                    font-['Cormorant_Garamond']
                    text-[25px]
                    font-medium
                    leading-none
                    tracking-[0.30em]
                    text-[#5A3026]

                    sm:text-[27px]
                  "
                >
                  SIRRAHA
                </h1>

                <p
                  className="
                    mt-2
                    text-center
                    font-['Poppins']
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[3px]
                    text-[#A98243]
                  "
                >
                  TIMELESS ETHNIC WEAR
                </p>
              </div>

              {/* ==================================================
                  GOLD DIVIDER
              ================================================== */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span className="h-px w-7 bg-[#C8A15A]" />

                <span
                  className="
                    h-1.5
                    w-1.5
                    rotate-45
                    border
                    border-[#C8A15A]
                  "
                />

                <span className="h-px w-7 bg-[#C8A15A]" />
              </div>

              {/* ==================================================
                  WELCOME BACK
              ================================================== */}

              <div className="text-center">

                <h2
                  className="
                    mt-3
                    text-center
                    font-['Cormorant_Garamond']
                    text-[30px]
                    font-normal
                    leading-none
                    text-[#43231C]

                    sm:text-[33px]
                  "
                >
                  Welcome Back
                </h2>

                <p
                  className="
    mt-3
    w-full
    text-center
    font-['Poppins']
    text-[12px]
    leading-5
    text-[#76665B]

                    sm:text-[10px]
                  "
                >
                  Sign in to continue your journey
                  with Sirraha.
                </p>

              </div>

              {/* ==================================================
                  LOGIN METHOD TABS
              ================================================== */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  rounded-[6px]
                  border
                  border-[#DED4C4]
                  bg-[#F2EBDD]/45
                  p-1
                "
              >

                {/* MOBILE */}

                <button
                  type="button"
                  onClick={() =>
                    handleMethodChange("mobile")
                  }
                  className={`
                    h-[38px]
                    rounded-[4px]
                    font-['Poppins']
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[1.4px]
                    transition-all
                    duration-300

                    ${
                      loginMethod === "mobile"
                        ? "bg-[#5A3026] text-[#FFFDF9] shadow-sm"
                        : "text-[#5A3026] hover:bg-[#F2EBDD]"
                    }
                  `}
                >
                  Mobile Number
                </button>

                {/* EMAIL */}

                <button
                  type="button"
                  onClick={() =>
                    handleMethodChange("email")
                  }
                  className={`
                    h-[38px]
                    rounded-[4px]
                    font-['Poppins']
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[1.4px]
                    transition-all
                    duration-300

                    ${
                      loginMethod === "email"
                        ? "bg-[#5A3026] text-[#FFFDF9] shadow-sm"
                        : "text-[#5A3026] hover:bg-[#F2EBDD]"
                    }
                  `}
                >
                  Email Address
                </button>

              </div>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <div
                  className="
                    mt-3
                    rounded-[5px]
                    border
                    border-red-200
                    bg-red-50
                    px-3
                    py-2
                    text-center
                    font-['Poppins']
                    text-[9px]
                    leading-4
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* ==================================================
                  SUCCESS
              ================================================== */}

              {success && (
                <div
                  className="
                    mt-3
                    rounded-[5px]
                    border
                    border-[#D8C8B5]
                    bg-[#F2EBDD]
                    px-3
                    py-2
                    text-center
                    font-['Poppins']
                    text-[9px]
                    leading-4
                    text-[#5A3026]
                  "
                >
                  {success}
                </div>
              )}

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleVerifyOtp}
                className="mt-4"
              >

                {/* ==================================================
                    MOBILE NUMBER
                ================================================== */}

                {loginMethod === "mobile" && (
                  <div>

                    <label
                      htmlFor="phone"
                      className="
                        mb-1.5
                        block
                        font-['Poppins']
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[1.7px]
                        text-[#5A3026]
                      "
                    >
                      Mobile Number
                    </label>

                    <div
                      className="
                        flex
                        h-[45px]
                        overflow-hidden
                        rounded-[6px]
                        border
                        border-[#D8C8B5]
                        bg-[#FFFDF9]
                        transition-all
                        focus-within:border-[#C8A15A]
                        focus-within:ring-1
                        focus-within:ring-[#C8A15A]/20
                      "
                    >

                      {/* COUNTRY CODE */}

                      <div
                        className="
                          flex
                          w-[58px]
                          shrink-0
                          items-center
                          justify-center
                          border-r
                          border-[#DED4C4]
                          font-['Poppins']
                          text-[11px]
                          text-[#5A3026]
                        "
                      >
                        +91
                      </div>

                      {/* PHONE */}

                      <div className="relative flex-1">

                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="Enter your mobile number"
                          autoComplete="tel"
                          inputMode="numeric"
                          maxLength={10}
                          disabled={otpSent}
                          className="
                            h-full
                            w-full
                            bg-transparent
                            px-3
                            pr-9
                            font-['Poppins']
                            text-[11px]
                            text-[#3A2A20]
                            outline-none
                            placeholder:text-[#918477]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        />

                        <FiPhone
                          className="
                            absolute
                            right-3
                            top-1/2
                            h-[15px]
                            w-[15px]
                            -translate-y-1/2
                            text-[#A98243]
                          "
                          strokeWidth={1.3}
                        />

                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    EMAIL
                ================================================== */}

                {loginMethod === "email" && (
                  <div>

                    <label
                      htmlFor="email"
                      className="
                        mb-1.5
                        block
                        font-['Poppins']
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[1.7px]
                        text-[#5A3026]
                      "
                    >
                      Email Address
                    </label>

                    <div
                      className="
                        relative
                        h-[45px]
                        overflow-hidden
                        rounded-[6px]
                        border
                        border-[#D8C8B5]
                        bg-[#FFFDF9]
                        transition-all
                        focus-within:border-[#C8A15A]
                        focus-within:ring-1
                        focus-within:ring-[#C8A15A]/20
                      "
                    >

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        disabled={otpSent}
                        className="
                          h-full
                          w-full
                          bg-transparent
                          px-3
                          pr-9
                          font-['Poppins']
                          text-[11px]
                          text-[#3A2A20]
                          outline-none
                          placeholder:text-[#918477]
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      />

                      <FiMail
                        className="
                          absolute
                          right-3
                          top-1/2
                          h-[15px]
                          w-[15px]
                          -translate-y-1/2
                          text-[#A98243]
                        "
                        strokeWidth={1.3}
                      />

                    </div>
                  </div>
                )}

                {/* ==================================================
                    SEND OTP
                ================================================== */}

                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="
                      mt-4
                      flex
                      h-[46px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[6px]
                      bg-[#5A3026]
                      font-['Poppins']
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[1.8px]
                      text-[#FFFDF9]
                      transition-all
                      duration-300
                      hover:bg-[#43231C]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <span>
                      {loading
                        ? "Sending OTP..."
                        : "Send OTP"}
                    </span>

                    {!loading && (
                      <FiArrowRight
                        size={14}
                        strokeWidth={1.4}
                      />
                    )}
                  </button>
                )}

                {/* ==================================================
                    OTP SECTION
                ================================================== */}

                {otpSent && (
                  <div className="mt-4">

                    <label
                      htmlFor="otp"
                      className="
                        mb-1.5
                        block
                        font-['Poppins']
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[1.7px]
                        text-[#5A3026]
                      "
                    >
                      Verification Code
                    </label>

                    <div
                      className="
                        relative
                        h-[45px]
                        overflow-hidden
                        rounded-[6px]
                        border
                        border-[#D8C8B5]
                        bg-[#FFFDF9]
                        transition-all
                        focus-within:border-[#C8A15A]
                        focus-within:ring-1
                        focus-within:ring-[#C8A15A]/20
                      "
                    >

                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter 6-digit OTP"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        autoFocus
                        className="
                          h-full
                          w-full
                          bg-transparent
                          px-3
                          pr-9
                          font-['Poppins']
                          text-[11px]
                          tracking-[0.2em]
                          text-[#3A2A20]
                          outline-none
                          placeholder:text-[#918477]
                          placeholder:tracking-normal
                        "
                      />

                      <FiLock
                        className="
                          absolute
                          right-3
                          top-1/2
                          h-[15px]
                          w-[15px]
                          -translate-y-1/2
                          text-[#A98243]
                        "
                        strokeWidth={1.3}
                      />

                    </div>

                    {/* VERIFY */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        mt-3
                        flex
                        h-[46px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-[6px]
                        bg-[#5A3026]
                        font-['Poppins']
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[1.8px]
                        text-[#FFFDF9]
                        transition-all
                        duration-300
                        hover:bg-[#43231C]
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading
                        ? "Verifying..."
                        : "Verify & Continue"}
                    </button>

                    {/* CHANGE CONTACT */}

                    <button
                      type="button"
                      onClick={handleChangeContact}
                      className="
                        mt-2
                        w-full
                        font-['Poppins']
                        text-[9px]
                        text-[#71655B]
                        underline
                        underline-offset-4
                        transition-colors
                        hover:text-[#5A3026]
                      "
                    >
                      Change{" "}
                      {loginMethod === "mobile"
                        ? "mobile number"
                        : "email address"}
                    </button>

                    {/* RESEND */}

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="
                        mt-1.5
                        w-full
                        font-['Poppins']
                        text-[9px]
                        font-medium
                        text-[#A98243]
                        transition-colors
                        hover:text-[#5A3026]
                        hover:underline
                        disabled:opacity-50
                      "
                    >
                      Resend OTP
                    </button>

                  </div>
                )}

              </form>

              {/* ==================================================
                  TERMS + PRIVACY
              ================================================== */}

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-[350px]
                  text-center
                  font-['Poppins']
                  text-[8px]
                  leading-4
                  text-[#918477]
                "
              >
                By continuing, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => navigate("/terms")}
                  className="
                    text-[#5A3026]
                    underline
                    underline-offset-2
                    transition-colors
                    hover:text-[#A98243]
                  "
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/privacy-policy")
                  }
                  className="
                    text-[#5A3026]
                    underline
                    underline-offset-2
                    transition-colors
                    hover:text-[#A98243]
                  "
                >
                  Privacy Policy
                </button>
                .
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;