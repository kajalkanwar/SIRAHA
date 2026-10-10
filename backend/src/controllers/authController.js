import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email || "",
    phone: user.phone || "",
    role: user.role,
  };
};

// ======================================================
// SIGNUP API
// ======================================================
// Kept for compatibility with any old Signup.jsx.
// Customer signup is now passwordless.
// OTP login can also create a customer automatically.
// ======================================================

export const signupUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "Name and email or mobile number are required.",
      });
    }

    const cleanEmail = email
      ? email.toLowerCase().trim()
      : undefined;

    const cleanPhone = phone
      ? phone.replace(/\D/g, "")
      : undefined;

    // Check if account already exists
    let existingUser = null;

    if (cleanEmail) {
      existingUser = await User.findOne({
        email: cleanEmail,
      });
    }

    if (!existingUser && cleanPhone) {
      existingUser = await User.findOne({
        phone: cleanPhone,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with these details already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail || undefined,
      phone: cleanPhone || undefined,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
};

// ======================================================
// SEND OTP API
// ======================================================

export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // User must send either email OR phone
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number is required.",
      });
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or mobile number.",
      });
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    // OTP valid for 5 minutes
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    let user;

    // ==================================================
    // EMAIL OTP
    // ==================================================

    if (email) {
      const cleanEmail = email.toLowerCase().trim();

      user = await User.findOne({
        email: cleanEmail,
      });

      // Create customer automatically if account doesn't exist
      if (!user) {
        user = await User.create({
          name: "Sirraha Customer",
          email: cleanEmail,
          role: "user",
        });
      }

      user.otpHash = hashedOtp;
      user.otpExpires = otpExpires;

      await user.save();

      // Send OTP through Sirraha email
      await sendEmail({
        to: cleanEmail,
        subject: "Your Sirraha Login OTP",
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 35px;
              color: #1F2937;
              background: #F8F4EC;
            "
          >

            <h2
              style="
                color: #0E5B3B;
                text-align: center;
                letter-spacing: 6px;
                margin-bottom: 30px;
              "
            >
              SIRRAHA
            </h2>

            <p style="font-size: 16px;">
              Hello,
            </p>

            <p style="font-size: 15px; line-height: 1.6;">
              Use the following one-time verification code to
              continue to your Sirraha account:
            </p>

            <div
              style="
                text-align: center;
                margin: 30px 0;
              "
            >
              <span
                style="
                  display: inline-block;
                  background: #0E5B3B;
                  color: white;
                  padding: 16px 30px;
                  font-size: 28px;
                  letter-spacing: 8px;
                  border-radius: 6px;
                  font-weight: bold;
                "
              >
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">
              This OTP is valid for 5 minutes.
            </p>

            <p style="font-size: 14px; line-height: 1.6;">
              If you did not request this code, you can safely
              ignore this email.
            </p>

            <p
              style="
                margin-top: 35px;
                font-size: 14px;
              "
            >
              Regards,<br />
              <strong>Sirraha Team</strong>
            </p>

          </div>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email.",
        method: "email",
      });
    }

    // ==================================================
    // MOBILE OTP
    // ==================================================

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");

      if (cleanPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid 10-digit mobile number.",
        });
      }

      user = await User.findOne({
        phone: cleanPhone,
      });

      // Create customer automatically if account doesn't exist
      if (!user) {
        user = await User.create({
          name: "Sirraha Customer",
          phone: cleanPhone,
          role: "user",
        });
      }

      user.otpHash = hashedOtp;
      user.otpExpires = otpExpires;

      await user.save();

      // ==================================================
      // DEVELOPMENT MODE
      // ==================================================
      //
      // Until you connect an SMS provider such as
      // Twilio / MSG91 / 2Factor, the OTP will appear
      // in your backend terminal.
      //
      // DO NOT use this fallback in production.
      // ==================================================

      console.log("-----------------------------------------");
      console.log("SIRRAHA MOBILE OTP");
      console.log("Mobile:", cleanPhone);
      console.log("OTP:", otp);
      console.log("Valid for: 5 minutes");
      console.log("-----------------------------------------");

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your mobile number.",
        method: "mobile",
      });
    }
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
};

// ======================================================
// VERIFY OTP API
// ======================================================

export const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required.",
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number is required.",
      });
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or mobile number.",
      });
    }

    let user;

    // ==================================================
    // FIND USER
    // ==================================================

    if (email) {
      const cleanEmail = email.toLowerCase().trim();

      user = await User.findOne({
        email: cleanEmail,
      });
    } else {
      const cleanPhone = phone.replace(/\D/g, "");

      user = await User.findOne({
        phone: cleanPhone,
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // ==================================================
    // CHECK OTP EXPIRY
    // ==================================================

    if (!user.otpHash || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid or has expired.",
      });
    }

    if (new Date() > user.otpExpires) {
      user.otpHash = null;
      user.otpExpires = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // ==================================================
    // COMPARE OTP
    // ==================================================

    const hashedEnteredOtp = hashOtp(otp);

    if (hashedEnteredOtp !== user.otpHash) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // ==================================================
    // CLEAR OTP AFTER SUCCESS
    // ==================================================

    user.otpHash = null;
    user.otpExpires = null;

    await user.save();

    // ==================================================
    // CREATE JWT
    // ==================================================

    const token = generateToken(user);

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP. Please try again.",
    });
  }
};