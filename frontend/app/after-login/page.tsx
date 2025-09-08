"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import SplashScreen from "@/components/SplashScreen"
import { motion } from "framer-motion";

export default function AfterLoginPage() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 2000)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                {loading ? (
                    <SplashScreen key="splash" />
                ) : (
                    <VideoScreen key="video" />
                )}
            </AnimatePresence>
        </div>
    )
}

// contoh dummy VideoScreen, nanti bisa kamu pisahin juga kalau mau
function VideoScreen() {
    return (
        <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
            >
                <source src="/videos/videoplayback.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </motion.div>
    )
}