import { LoginResponse } from "@/types/auth"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PURGE } from "redux-persist"

interface AccountState {
    profile: LoginResponse | null
}

const initialState: AccountState = {
    profile: null,
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccountProfile: (state, action: PayloadAction<LoginResponse>) => {
            state.profile = action.payload
        },
        clearAccountProfile: (state) => {
            state.profile = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, (state) => {
            state.profile = null
        })
    },
})

export const { setAccountProfile, clearAccountProfile } = accountSlice.actions
export default accountSlice.reducer
