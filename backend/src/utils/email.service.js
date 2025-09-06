import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
  const link = `${frontendURL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <h2>Welcome to Hireo 👋</h2>
    <p>Please click the button below to verify your account:</p>
    <a href="${link}" style="padding:10px 20px;background:#007bff;color:#fff;border-radius:5px;text-decoration:none;">Verify Email</a>
    <p>Or open this link manually: <br /> ${link}</p>
  `;

  await transporter.sendMail({
    from: `"Hireo" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html,
  });

  console.log(`📬 Verification email sent to ${email}`);
};


