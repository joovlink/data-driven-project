"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "./storage"; // ⬅️ use the safe storage
import { rootReducer } from "./rootReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["account", "sidebar"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

// (optional) types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;