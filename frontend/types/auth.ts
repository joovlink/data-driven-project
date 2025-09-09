export interface LoginPayload {
    email: string
    password: string
    remember: boolean
}

export interface LoginResponse {
    id: string
    email: string
    token: string
}

export interface RegisterPayload {

    email: string
    password: string
}


export interface ForgotPasswordResponse {
    status: "success" | "error" | "not_found" | "too_soon"
    message: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    password: string
}

export interface ResetPasswordResponse {
    status: "idle" | "success" | "invalid" | "expired" | "error" | "not_found" | "unverified"
    message: string
}

export interface VerifyResponse {
    status: "success" | "error"
    message: string
}


export interface ResendVerificationPayload {
    email: string
}

export interface ResendVerificationByTokenPayload {
    token: string
}

export interface ResendVerificationResponse {
    status: "success" | "error"
    message: string
}