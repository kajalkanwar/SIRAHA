import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "kajalkanwar0208@gmail.com";
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      throw new Error(
        "ADMIN_PASSWORD is missing from your .env file"
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";

      await existingUser.save();

      console.log("Existing user is now an admin.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "Kajal",
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();