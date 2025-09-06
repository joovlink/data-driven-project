import User from "./auth.model.js";
import { validatePassword } from "../utils/validatePassword.js";
import { generateVerifyToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/email.service.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Cek jika user sudah terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Validasi password (regex + tidak mengandung username email)
    const result = validatePassword(password, email);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    // 3. Generate token verifikasi (berlaku 24 jam)
    const verifyToken = generateVerifyToken();
    const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    // 4. Simpan user (password akan di-hash di pre-save)
    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verifyToken,
      verifyTokenExpires,
    });

    // 5. Kirim email verifikasi ke user
    await sendVerificationEmail(email, verifyToken);

    // 6. Respon sukses
    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify.",
    });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};