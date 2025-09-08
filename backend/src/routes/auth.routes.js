import express from "express"
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
  resendVerificationByToken
} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/verify", verifyEmail)
router.post("/forgot-password", forgotPassword) 
router.post("/reset-password", resetPassword) 
router.post("/resend-verification", resendVerification);
router.post("/resend-verification-by-token", resendVerificationByToken);


export default router