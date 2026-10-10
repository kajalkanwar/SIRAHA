import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Sirraha Backend API"
    });
});

export default app;