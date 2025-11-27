import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleCallback,
  googleLogin,
  linkedinLogin,
  linkedinCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

// 🧩 Auth basics
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyEmail);

// 🔁 Password recovery
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); // pakai token dari body (bukan param)

// 🌐 OAuth Google
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// 🌐 OAuth LinkedIn
router.get("/linkedin", linkedinLogin);
router.get("/linkedin/callback", linkedinCallback);

export default router;
