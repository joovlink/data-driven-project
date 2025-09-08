import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"

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
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          const hasUpper = /[A-Z]/.test(value)
          const hasLower = /[a-z]/.test(value)
          const hasNumber = /\d/.test(value)
          const hasSymbol = /[\W_]/.test(value)
          return hasUpper && hasLower && hasNumber && hasSymbol
        },
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verifyTokenExpires: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// 🛠 Index untuk email unik (opsional, redundant jika sudah pakai unique: true di schema field)
userSchema.index({ email: 1 }, { unique: true })

// 🔒 Pre-save: hash password jika berubah
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// ✅ Method: cocokkan password login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// ✅ Method: generate verification token
userSchema.methods.generateVerifyToken = function () {
  const token = crypto.randomBytes(32).toString("hex")
  this.verifyToken = token
  this.verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 jam
  return token
}

// ✅ Method: generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString("hex")
  this.resetPasswordToken = token
  this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 menit
  return token
}

// ✅ Method: tandai email sudah diverifikasi
userSchema.methods.markVerified = function () {
  this.isVerified = true
}


userSchema.methods.toJSON = function () {
  const obj = this.toObject({ versionKey: false })
  delete obj.password
  delete obj.verifyToken
  delete obj.verifyTokenExpires
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpires
  return obj
}

// ⛓ Export model
const User = mongoose.model("User", userSchema)
export default User
