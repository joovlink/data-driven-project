"use client"

import { Provider } from "react-redux"
import { store, persistor } from "@/store/persist" // ⬅️ BUKAN "@/store"
import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster
                    position="top-center"
                     // tetep pakai dark base
                    toastOptions={{
                        style: {
                            background: "white",  // bg utama toast
                            color: "#000",       // warna text
                            // border: "1px solid #444", // optional
                            borderRadius: "8px",
                            fontSize: "14px",
                        },
                        className: "shadow-lg",
                    }}
                />
                {children}
            </PersistGate>
        </Provider>
    )
}