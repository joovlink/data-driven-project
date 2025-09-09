import nodemailer from "nodemailer"
import dotenv from "dotenv"

// Pastikan .env diload, hanya jika belum diload di tempat lain
dotenv.config()

// Fungsi pembuat transporter dinamis (panggil saat kirim email)
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true if 465 (SSL)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

// ✅ Kirim email verifikasi
export const sendVerificationEmail = async (email, token) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"
  const link = `${frontendURL}/verify?token=${token}`

  const html = `
   <html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email - Joovlink</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0; padding:0; font-family:'Montserrat', Arial, sans-serif; background-color:#f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:30px 0; font-family:'Montserrat', Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:'Montserrat', Arial, sans-serif;">

            <!-- HEADER -->
            <tr>
              <td align="center" style="padding:0; margin:0;">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                  style="width:600px; max-width:600px; border-top-left-radius:8px; border-top-right-radius:8px; overflow:hidden;">
                  <tr>
                    <td
                      style="
                        background: url('https://img.freepik.com/free-photo/group-asia-young-creative-people-smart-casual-wear-discussing-business-celebrate-giving-five-after-dealing-feeling-happy-signing-contract-agreement-office-coworker-teamwork-concept_7861-2523.jpg') no-repeat center / cover;
                        width:600px; height:180px;
                        border-top-left-radius:8px; border-top-right-radius:8px;
                      "
                    >
                      <!-- overlay putih semi-transparan -->
                      <div style="width:100%; height:180px; background-color:rgba(255,255,255,0.55);">
                        <table width="100%" height="180" role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td valign="bottom" align="left" style="padding:0 0 16px 20px;">
                              <img
                                src="https://i.imgur.com/ig845hY.png"
                                alt="Joovlink"
                                height="40"
                                style="display:block; border:0; outline:none; text-decoration:none;"
                              />
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333; font-size:16px; line-height:1.5; font-family:'Montserrat', Arial, sans-serif;">
                <p>Hi there,</p>
                <p>
                  Thanks for signing up to <strong> Joovlink</strong>. We’re building a smarter way to connect people with the right opportunities, and we’re excited to have you onboard.
                </p>
                <p>
                  Before we get started, please verify your email address:
                </p>
                <p style="margin:30px 0;">
                  <a href="${link}" style="padding:8px 30px; background:#004466; color:#fff; text-decoration:none; font-weight:600; border-radius:6px; font-family:'Montserrat', Arial, sans-serif;">
                    Verify
                  </a>
                </p>
                <p>Or open this link manually :<br /> ${link}</p>
                <p>
                  Once that’s done, your account will be active and ready to use.
                </p>
                <p>
                  Cheers,<br />
                  <b>
                  Joovlink Team
                  </b>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px; font-size:12px; color:#888; text-align:center; border-top:1px solid #eee; font-family:'Montserrat', Arial, sans-serif;">
                This email was sent to you because you registered on <strong>Joovlink</strong>.<br />
                If this wasn’t you, please ignore this email.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

  `

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"Joovlink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html,
  })

  console.log(`📬 Verification email sent to ${email}`)
  console.log(`🔑 Verification token: ${token}`)
}

export const sendResetPasswordEmail = async (email, token) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"
  const link = `${frontendURL}/reset-password?token=${token}`

  const html = `
   <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset your password - Joovlink</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0; padding:0; font-family:'Montserrat', Arial, sans-serif; background-color:#f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:30px 0; font-family:'Montserrat', Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:'Montserrat', Arial, sans-serif;">
            
            <!-- HEADER -->
            <tr>
              <td align="center" style="padding:0; margin:0;">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                  style="width:600px; max-width:600px; border-top-left-radius:8px; border-top-right-radius:8px; overflow:hidden;">
                  <tr>
                    <td
                      style="
                        background: url('https://img.freepik.com/free-photo/group-asia-young-creative-people-smart-casual-wear-discussing-business-celebrate-giving-five-after-dealing-feeling-happy-signing-contract-agreement-office-coworker-teamwork-concept_7861-2523.jpg') no-repeat center / cover;
                        width:600px; height:180px;
                        border-top-left-radius:8px; border-top-right-radius:8px;
                      "
                    >
                      <div style="width:100%; height:180px; background-color:rgba(255,255,255,0.55);">
                        <table width="100%" height="180" role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td valign="bottom" align="left" style="padding:0 0 16px 20px;">
                              <img
                                src="https://i.imgur.com/ig845hY.png"
                                alt="Joovlink"
                                height="40"
                                style="display:block; border:0; outline:none; text-decoration:none;"
                              />
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333; font-size:16px; line-height:1.5; font-family:'Montserrat', Arial, sans-serif;">
                <p>Hi there,</p>
                <p>
                  We received a request to reset the password for your <strong>Joovlink</strong> account.
                </p>
                <p>If you made this request, please reset your password by clicking the button below:</p>
                <p style="margin:30px 0;">
                  <a href="${link}" style="padding:10px 28px; background:#009688; color:#fff; text-decoration:none; font-weight:600; border-radius:6px; font-family:'Montserrat', Arial, sans-serif;">
                    Reset Password
                  </a>
                </p>
                <p>If the button doesn’t work, copy and paste this link into your browser:<br /> ${link}</p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
                <p>
                  Cheers,<br />
                  <b>Joovlink Team</b>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px; font-size:12px; color:#888; text-align:center; border-top:1px solid #eee; font-family:'Montserrat', Arial, sans-serif;">
                This email was sent to you because you requested a password reset on <strong>Joovlink</strong>.<br />
                If this wasn’t you, please ignore this email.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"Joovlink" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html,
  })

  console.log(`📬 Reset password email sent to ${email}`)
  console.log(`🔑 Reset token: ${token}`)
}