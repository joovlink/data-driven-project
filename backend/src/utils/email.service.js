import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // set to true if using TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ✅ Send verification email
export const sendVerificationEmail = async (email, token) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"
  const link = `${frontendURL}/verify?token=${token}`

  const html = `
    <h2>Welcome to Joovlink 👋</h2>
    <p>Please click the button below to verify your account:</p>
    <a href="${link}" style="padding:10px 20px;background:#007bff;color:#fff;border-radius:5px;text-decoration:none;">Verify Email</a>
    <p>Or open this link manually:<br /> ${link}</p>
  `

  await transporter.sendMail({
    from: `"Joovlink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html,
  })

  console.log(`📬 Verification email sent to ${email}`)
}

// ✅ Send reset password email
export const sendResetPasswordEmail = async (email, token) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"
  const link = `${frontendURL}/reset-password?token=${token}`

  const html = `
    <h2>Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${link}" style="padding:10px 20px;background:#dc3545;color:#fff;border-radius:5px;text-decoration:none;">Reset Password</a>
    <p>Or open this link manually:<br /> ${link}</p>
  `

  await transporter.sendMail({
    from: `"Joovlink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html,
  })

  console.log(`📬 Reset password email sent to ${email}`)
}
