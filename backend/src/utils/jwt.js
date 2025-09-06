import jwt from "jsonwebtoken"

export const generateAccessToken = (userId, remember = false) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: remember ? "7d" : "1h", // ⬅️ Ganti ke 3d kalau mau
  })
}