import nodemailer from "nodemailer";

// ========================================
// SIRRAHA EMAIL TRANSPORTER
// ========================================

console.log(
  "EMAIL_USER loaded:",
  Boolean(process.env.EMAIL_USER)
);

console.log(
  "EMAIL_PASSWORD loaded:",
  Boolean(process.env.EMAIL_PASSWORD)
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ========================================
// SEND EMAIL
// ========================================

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "EMAIL_USER or EMAIL_PASSWORD is missing from environment variables."
      );
    }

    const mailOptions = {
      from: `"Sirraha" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending error:", error);

    throw new Error("Unable to send email.");
  }
};