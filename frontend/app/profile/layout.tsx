"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import SplashScreen from "@/components/SplashScreen"
import AppNavbar from "@/components/layout/AppNavbar"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"
import { usePathname } from "next/navigation"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const [firstVisit, setFirstVisit] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        const timer = setTimeout(() => setFirstVisit(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    if (firstVisit) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <SplashScreen key="splash" />
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#F7F7F7]">
            {/* Navbar */}
            <AppNavbar dummyUser={{ username: "anggaratriputra" }} />

            {/* Sidebar + Content */}
            <div className="w-full flex space-x-6 py-8 px-28">
                <ProfileSidebar />


                <main className="flex-1 relative">
                   
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            // ❌ hilangin exit biar ga double render
                            transition={{
                                duration: 0.45,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                
                </main>

            </div>
        </div>
    )
}
