
import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

// ========================================
// SERVER CONFIGURATION
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// CONNECT DATABASE AND START SERVER
// ========================================

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
