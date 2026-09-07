import express from "express";

import {
  signupUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// Signup API
router.post("/signup", signupUser);

// Login API
router.post("/login", loginUser);

export default router;