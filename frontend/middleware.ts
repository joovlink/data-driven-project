// middleware.ts
import { NextRequest, NextResponse } from "next/server"

// ✅ Match path sesuai struktur lo: admin & customer-admin
export const config = {
    matcher: [
        "/admin/:path*",
        "/customer-admin/:path*",
    ],
}

// ✅ Middleware gak cek token, biarin client handle via refresh
export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const token = req.cookies.get("access_token")?.value

    console.log("🛡️ Middleware triggered on:", path)

    if (token) {
        console.log("🔑 access_token found (not verified here)")
    } else {
        console.log("⛔ No access_token (client will try refresh)")
    }

    return NextResponse.next()
}
