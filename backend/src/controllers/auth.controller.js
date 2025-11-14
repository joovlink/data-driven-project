import crypto from "crypto";
import { User } from "../models/index.js";
import { validatePassword } from "../utils/validatePassword.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/email.service.js";
import { generateAccessToken } from "../utils/jwt.js";
import { oauthLogin } from "../services/auth.service.js";
import { google } from "googleapis";
import axios from "axios";
import Profile from "../models/profile.model.js";

//client oauth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL // redirect URI sesuai .env
);

/// LinkedIn Login → redirect user ke LinkedIn
export const linkedinLogin = (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
    scope: "openid profile email", // OpenID standar, bisa tambahin r_liteprofile r_emailaddress kalau perlu
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  return res.redirect(authUrl);
};

// LinkedIn Callback → tukar code jadi access_token & ambil profile
// LinkedIn Callback → tukar code jadi access_token & ambil profile
export const linkedinCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ message: "Missing LinkedIn auth code" });
    }

    // 🔹 1. Tukar code jadi access token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("Failed to get LinkedIn access token");

    // 🔹 2. Ambil data user (pakai endpoint OpenID terbaru)
    const { data: profile } = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("📌 LinkedIn profile (raw):", profile);

    // 🔹 3. Handle kasus sub vs id (LinkedIn API baru kadang cuma ngirim sub)
    const profileId = profile.id || profile.sub;
    if (!profileId) throw new Error("Missing LinkedIn profile ID");

    // 🔹 4. Samain format datanya sebelum kirim ke oauthLogin
    const normalizedProfile = {
      id: profileId,
      email: profile.email,
      name:
        profile.name ||
        `${profile.given_name || ""} ${profile.family_name || ""}`.trim(),
      picture: profile.picture,
    };

    console.log("✅ Normalized LinkedIn profile:", normalizedProfile);

    // 🔹 5. Simpan / login ke DB
    const result = await oauthLogin("linkedin", normalizedProfile);

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error("❌ LinkedIn OAuth Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//login oauth
export const googleLogin = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  res.redirect(authUrl); // langsung lempar user ke Google
};

//endpoint buat redirect user ke google
export const googleAuth = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  return res.redirect(url);
};

//callback dari google untuk tukar code jadi token (ambil profile)
export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ message: "Missing Google auth code" });
    }

    console.log("📌 Google auth code:", code);

    // Tuker code ke token
    const r = await oauth2Client.getToken(code);
    const tokens = r.tokens; // jangan langsung destructure biar ga undefined
    oauth2Client.setCredentials(tokens);

    console.log("📌 Google tokens:", tokens);

    // Ambil profile user dari Google API
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    console.log("📌 Google profile:", profile);

    // Simpan user ke DB
    const result = await oauthLogin("google", profile);

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    console.error("❌ Google OAuth Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const result = validatePassword(password, email);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const user = new User({ email, password });
    const rawToken = user.generateVerifyToken();
    await user.save();

    await sendVerificationEmail(email, rawToken);

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify.",
    });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const rawToken = req.query.token;
    if (!rawToken) {
      return res.status(400).json({ message: "Missing token" });
    }

    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await User.findOne({
      verifyToken: hashed,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.markVerified();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("❌ Verify Email Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const token = generateAccessToken(user._id, rememberMe === true);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });
    }

    //Guard blok request buat akun yang pake auth
    if (user.googleId || user.linkedinId) {
      return res.status(400).json({
        success: false,
        message:
          "Social accounts (Google/LinkedIn) cannot change passwords manually.",
      });
    }

    const rawToken = user.generateResetPasswordToken();
    await user.save();

    await sendResetPasswordEmail(user.email, rawToken);

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password?token=abc123
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //Guard blok request buat akun yang pake auth
    if (user.googleId || user.linkedinId) {
      return res.status(400).json({
        success: false,
        message:
          "Social accounts (Google/LinkedIn) cannot change passwords manually.",
      });
    }

    const result = validatePassword(newPassword, user.email);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error("❌ Reset Password Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
