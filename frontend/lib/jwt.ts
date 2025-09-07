import { jwtVerify } from "jose"

export async function verifyJwt(token: string) {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET not defined")

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret)
        )
        return payload
    } catch (err) {
        console.warn("🔐 JWT verify error:", err)
        throw new Error("Invalid token")
    }
}

