import api from "@/lib/axios"
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
} from "@/types/auth"

// POST /api/auth/login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post("/auth/login", payload)
    return response.data
}

// // POST /api/auth/register
// export async function register(payload: RegisterPayload): Promise<any> {
//     const response = await api.post("/auth/register", payload)
//     return response.data
// }

// POST /api/auth/forgot-password
export async function forgotPassword(
    payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
    try {
        const response = await api.post("/auth/forgot-password", payload)
        return response.data
    } catch (err: any) {
        return err?.response?.data || {
            status: "error",
            message: "Unexpected error",
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


