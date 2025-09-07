// src/lib/api/axios.ts
import axios from "axios"
import { store } from "@/store" 
import { clearAccountProfile } from "@/store/slices/accountSlice"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JOOVLINK_API_URL || "/api",
})

// Request interceptor
api.interceptors.request.use((config) => {
  const state: any = store.getState()
  const token: string | undefined = state.account?.profile?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(clearAccountProfile())
    }
    return Promise.reject(err)
  }
)

export default api
