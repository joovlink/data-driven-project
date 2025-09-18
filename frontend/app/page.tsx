"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import SplashScreen from "@/components/SplashScreen"
import HomeHeroSection from "@/components/HomeHeroSection"
import ASSAHeroSection from "@/components/ASSAHeroSection"


export default function HomePage() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 2000)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className="relative w-screen h-screen">
            <AnimatePresence mode="wait">
                {loading ? (
                    <SplashScreen key="splash" />
                ) : (
                    <div key="landing" className="flex flex-col">
                        <HomeHeroSection dummyUser={{ username: "anggaratriputra" }} />
                        <ASSAHeroSection />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

