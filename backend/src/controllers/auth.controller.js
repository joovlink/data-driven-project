import crypto from "crypto"
import { User } from "../models/index.js"
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
    const {email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const result = validatePassword(password, email)
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    const user = new User({ email, password })
    const token = user.generateVerifyToken()
    await user.save()

    await sendVerificationEmail(email, token)

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
// @desc    Verify email
// @route   GET /api/auth/verify
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const token = (req.query.token ?? "").toString().trim();
    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    // Cari user berdasarkan token plain saja
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Kalau sudah verified, tetap return 200 (idempotent)
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Account already verified.",
      });
    }

    // Cek apakah token sudah expired
    if (!user.verifyTokenExpires || user.verifyTokenExpires < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Tandai user sebagai verified (token tetap disimpan)
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("❌ Verify Email Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



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

    const token = user.generateResetPasswordToken()
    await user.save()

    await sendResetPasswordEmail(user.email, token)

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
   
    const { token, newPassword } = req.body

    if (!token) {
      return res.status(400).json({ message: "Missing token" })
    }

    if (!newPassword) {
      return res.status(400).json({ message: "Password is required" })
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    const result = validatePassword(newPassword, user.email)
    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    user.password = newPassword
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


// @desc    Resend verification email by email
// @route   POST /api/auth/resend-verification
// @access  Public

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Anti user-enumeration → tetap balas 200 meskipun email tidak ada
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a new verification link has been sent.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Account is already verified.",
      });
    }

    // Generate verify token baru
    const token = user.generateVerifyToken();
    await user.save();

    // Kirim email
    await sendVerificationEmail(user.email, token);

    return res.status(200).json({
      success: true,
      message: "Verification email has been resent.",
    });
  } catch (err) {
    console.error("❌ Resend Verification Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification-by-token
// @access  Public
export const resendVerificationByToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    // Cari user berdasarkan verifyToken (abaikan expiry)
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Account is already verified.",
      });
    }

    // Generate token baru dan simpan
    const newToken = user.generateVerifyToken();
    await user.save();

    // Kirim email verifikasi baru
    await sendVerificationEmail(user.email, newToken);

    return res.status(200).json({
      success: true,
      message: "Verification email has been resent.",
    });
  } catch (err) {
    console.error("❌ Resend Verification Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};