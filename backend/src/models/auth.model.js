import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
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

    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    verifyTokenExpires: { type: Date, default: null },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
)

userSchema.index({ email: 1 }, { unique: true })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateVerifyToken = function () {
  const raw = crypto.randomBytes(32).toString("hex")
  const hash = crypto.createHash("sha256").update(raw).digest("hex")

  this.verifyToken = hash
  this.verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 jam default
  return raw
}

userSchema.methods.generateResetPasswordToken = function () {
  const raw = crypto.randomBytes(32).toString("hex")
  const hash = crypto.createHash("sha256").update(raw).digest("hex")

  this.resetPasswordToken = hash
  this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 menit default
  return raw
}

userSchema.methods.markVerified = function () {
  this.isVerified = true
  this.verifyToken = null
  this.verifyTokenExpires = null
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

const User = mongoose.model("User", userSchema)
export default User
