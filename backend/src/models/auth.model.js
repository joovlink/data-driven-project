import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      required: function () {
        // password wajib hanya kalau bukan akun OAuth
        return !this.googleId && !this.linkedinId;
      },
      validate: {
        validator: function (value) {
          if (!value) return true; // skip validasi kalau OAuth
          const hasUpper = /[A-Z]/.test(value);
          const hasLower = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSymbol = /[\W_]/.test(value);
          return hasUpper && hasLower && hasNumber && hasSymbol;
        },
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },

    // 🌍 OAuth IDs
    googleId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },

    // 🖼 Foto profil
    picture: { type: String },

    // ✅ Email Verification
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    verifyTokenExpires: { type: Date, default: null },

    // 🔄 Reset Password
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // 📅 Tracking login
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// 🔐 Hash password sebelum save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🧩 Compare password login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ✅ Token verifikasi email
userSchema.methods.generateVerifyToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.verifyToken = crypto.createHash("sha256").update(token).digest("hex");
  this.verifyTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam
  return token;
};

//markVerified pas ada verifikasi
userSchema.methods.markVerified = function () {
  (this.isVerified = true),
    (this.verifyToken = undefined),
    (this.verifyTokenExpires = undefined);
};

// 🔁 Token reset password
userSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 jam
  return token;
};

// 🧹 Remove sensitive data pas return JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  delete obj.verifyToken;
  delete obj.verifyTokenExpires;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
