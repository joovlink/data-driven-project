import crypto from "crypto"
import { User } from "../models"
import { validatePassword } from "../utils/validatePassword.js"
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/email.service.js"
import { generateAccessToken } from "../utils/jwt.js"

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const result = validatePassword(password, email)
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    const user = new User({ name, email, password })
    const rawToken = user.generateVerifyToken()
    await user.save()

    await sendVerificationEmail(email, rawToken)

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify.",
    })
  } catch (err) {
    console.error("❌ Register Error:", err.message)
    return res.status(500).json({ message: "Server error" })
  }
}

// @desc    Verify email
// @route   GET /api/auth/verify
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const rawToken = req.query.token
    if (!rawToken) {
      return res.status(400).json({ message: "Missing token" })
    }

    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex")

    const user = await User.findOne({
      verifyToken: hashed,
      verifyTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    user.markVerified()
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (err) {
    console.error("❌ Verify Email Error:", err.message)
    return res.status(500).json({ message: "Server error" })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" })
    }

    const token = generateAccessToken(user._id, rememberMe === true)

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error("❌ Login Error:", err.message)
    return res.status(500).json({ message: "Server error" })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." })
    }

    const rawToken = user.generateResetPasswordToken()
    await user.save()

    await sendResetPasswordEmail(user.email, rawToken)

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    })
  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message)
    return res.status(500).json({ message: "Server error" })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password?token=abc123
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    const rawToken = req.query.token

    if (!rawToken) {
      return res.status(400).json({ message: "Missing token" })
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" })
    }

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    const result = validatePassword(password, user.email)
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (err) {
    console.error("❌ Reset Password Error:", err.message)
    return res.status(500).json({ message: "Server error" })
  }
}
