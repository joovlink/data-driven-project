import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// 🧩 Register User Baru (manual)
export async function registerUser(email, password) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered!");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  return user;
}

// 🔐 Login Manual
export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found!");

  if (!user.password)
    throw new Error("This account was created using Google/LinkedIn login.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  return { token, user };
}

// 🌐 Login via OAuth (Google / LinkedIn)
export async function oauthLogin(provider, profile) {
  if (!["google", "linkedin"].includes(provider)) {
    throw new Error("Unsupported OAuth provider");
  }

  const providerField = provider === "google" ? "googleId" : "linkedinId";

  // 🧠 Pastikan ID dari provider itu ada
  if (!profile.id) {
    console.error(`[OAuth Error] Missing profile ID from ${provider}`);
    throw new Error("Invalid OAuth profile data (missing ID)");
  }

  // 🕵️‍♂️ Cari dulu user berdasarkan providerId
  let user = await User.findOne({ [providerField]: profile.id });

  // Kalau gak ada, cari berdasarkan email
  if (!user && profile.email) {
    user = await User.findOne({ email: profile.email });
  }

  if (!user) {
    // 🆕 Buat user baru
    user = await User.create({
      email: profile.email,
      [providerField]: profile.id,
      picture: profile.picture,
      isVerified: true,
      lastLogin: new Date(),
    });
  } else {
    // 🔄 Update user existing
    user[providerField] = profile.id;
    if (profile.picture) user.picture = profile.picture;
    user.lastLogin = new Date();
    await user.save();
  }

  // 🔐 Token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  // 🎯 Return data bersih
  const safeUser = {
    id: user._id,
    email: user.email,
    picture: user.picture,
    googleId: user.googleId || null,
    linkedinId: user.linkedinId || null,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { token, user: safeUser };
}
