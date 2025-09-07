export interface LoginPayload {
    username: string
    password: string
    remember: boolean
}

export interface LoginResponse {
    account_id: string
    username: string
    role: string
}

export interface RegisterPayload {
    username: string
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
    status: "success" | "error" | "not_found" | "expired" 
    message: string
}

