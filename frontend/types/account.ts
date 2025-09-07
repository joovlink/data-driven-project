export interface AccountQueryParams {
    search?: string
    sort_by?: "created_at" | "last_login" | "updated_at"
    sort_order?: "asc" | "desc"
    page: number
    limit: number
}

export interface AccountItem {
    account_id: string
    username: string
    name: string
    email: string
    role: string
    is_active: boolean
    is_temp: boolean
    customer_name: string
    parent_id: string
    created_by: {
        id: string
        username: string
    }
    updated_by: {
        id: string
        username: string
    }
    created_at: string
    updated_at: string
    last_login: string | null
}

export interface AllAccountResponse {
    success: boolean
    data: AccountItem[]
    total: number
    meta: {
        page: number
        limit: number
        sort_by: string
        sort_order: string
    }
}

export interface AccountDetail {
    account_id: string
    username: string
    name: string
    email: string
    role: string
    is_active: boolean
    is_temp: boolean
    division: string
    customer_name: string
    created_at: string
    updated_at: string
    last_login: string | null
    customer_id: string
    parent_id: string
    parent_data?: {
        username: string
        email: string
        role: string
        is_active: boolean
        is_temp: boolean
    }
    children?: {
        id: string
        username: string
        email: string
        role: string
        division: string
        is_active: boolean
        is_temp: boolean
    }[]
    created_by: {
        id: string
        username: string
    }
    updated_by: {
        id: string
        username: string
    }
}

export interface ChildAccountDetail {
    account_id: string
    username: string
    name: string
    email: string
    role: string
    division: string
    is_active: boolean
    is_temp: boolean
    customer_name: string
    created_at: string
    last_login: string | null
    customer_id: string
    created_by: {
        id: string
        username: string
    }
    parent_data?: {
        username: string
        email: string
        role: string
        is_active: boolean
        is_temp: boolean
    }
}

export interface AccountDetailResponse {
    success: boolean
    data: AccountDetail
}

export interface ChildAccountDetailResponse {
    success: boolean
    data: ChildAccountDetail
}

export interface RegisterAccountPayload {
    username: string
    name: string
    email: string
    password: string
    role_id: string
    is_active: boolean
    is_temp: boolean
    division?: string
}

export interface RegisterChildAccountPayload {
    username: string
    name: string
    email: string
    password: string
    division?: string
    is_temp: boolean
}

export interface RegisterAccountResponse {
    success: boolean
    account_id: string
}

export interface RegisterChildAccountResponse {
    success: boolean
    account_id: string
}

export interface UpdateAccountPayload {
    username: string
    name: string
    email: string
    password?: string
    role_id: string
    division?: string
    is_active: boolean
    customer_id?: string
    parent_id?: string
}

export interface UpdateChildAccountPayload {
    username: string
    name: string
    email: string
    division?: string
    is_temp: boolean
}

export interface UpdateAccountResponse {
    success: boolean
    message: string
}

export interface ParentAccountSelectItem {
    id: string
    username: string
    name: string
    email: string
    division: string
    customer_id: string
    customer_name: string
}

export type ParentAccountSelectResponse = ParentAccountSelectItem[]

export interface AccountSelectItem {
    id: string
    username: string
    name: string
    email: string
    role_code?: string
    division?: string
}

export interface CustomerNameResponse {
    customer_id: string
    customer_name: string
}

export interface BearerAccountSelectItem {
    id: string
    username: string
    name: string
    email: string
    role: string
    division: string
}

export type BearerAccountSelectResponse = BearerAccountSelectItem[]