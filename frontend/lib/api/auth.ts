import api from "@/lib/axios"
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    VerifyResponse,
    ResendVerificationPayload,
    ResendVerificationResponse,
    ResendVerificationByTokenPayload,
} from "@/types/auth"

// POST /api/auth/login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post("/auth/login", payload)
    return response.data
}

// POST /api/auth/register
export async function register(payload: RegisterPayload): Promise<any> {
    const response = await api.post("/auth/register", payload)
    return response.data
}

// POST /api/auth/forgot-password

export async function forgotPassword(
    payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
    try {
        const response = await api.post("/auth/forgot-password", payload)
        const data = response.data

        return {
            status: data.status ?? "success",
            message: data.message ?? "If that email exists, a reset link has been sent.",
        }
    } catch (err: any) {
        const data = err?.response?.data
        return {
            status: data?.status ?? "error",
            message: data?.message ?? "Unexpected error",
        }
    }
}


// POST /api/auth/reset-password
export async function resetPassword(
    payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
    try {
        const response = await api.post("/auth/reset-password", payload)
        return response.data
    } catch (error: any) {
        return {
            status: error?.response?.data?.status || "error",
            message: error?.response?.data?.message || "Something went wrong",
        }
    }
}

// POST /api/auth/logout
export async function logout() {
    const response = await api.post("/auth/logout")
    return response.data
}



export async function verifyEmail(token: string): Promise<VerifyResponse> {
    try {
        const res = await api.get("/auth/verify", { params: { token } });
        console.log("✅ VERIFY RESPONSE:", res.data);

        const isSuccess =
            res.data?.success === true ||
            res.data?.message?.toLowerCase().includes("already verified");

        return {
            status: isSuccess ? "success" : "error",
            message: res.data?.message ?? "Unknown response",
        };
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        return {
            status: "error",
            message: e.response?.data?.message ?? "Verification failed",
        };
    }
}

// POST /api/auth/resend-verification { email }
export async function resendVerification(
    payload: ResendVerificationPayload
): Promise<ResendVerificationResponse> {
    try {
        const res = await api.post("/auth/resend-verification", payload)
        return {
            status: res.data?.success ? "success" : "error",
            message: res.data?.message ?? "Unknown response",
        }
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        return {
            status: "error",
            message: e.response?.data?.message ?? "Something went wrong",
        }
    }
}

// POST /api/auth/resend-verification-by-token  { token }
export async function resendVerificationByToken(
    payload: ResendVerificationByTokenPayload
): Promise<ResendVerificationResponse> {
    try {
        const res = await api.post("/auth/resend-verification-by-token", payload);
        // BE: { success: true, message: "..." }
        return {
            status: res.data?.success ? "success" : "error",
            message: res.data?.message ?? "Unknown response",
        };
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        return {
            status: "error",
            message: e.response?.data?.message ?? "Something went wrong",
        };
    }
}