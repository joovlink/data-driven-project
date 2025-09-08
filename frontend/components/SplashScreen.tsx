"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
    return (
        <motion.div
            className="relative w-full h-full bg-[#F7F7F7] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Logo + loading bar */}
            <motion.div
                className="relative z-10 flex flex-col items-center gap-4"
                initial={{ scale: 0.9, opacity: 0, filter: "blur(6px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Image
                    src="/images/joovlink_logo.png"
                    alt="Joovlink Logo"
                    width={160}
                    height={160}
                    priority
                />

                {/* Loading bar */}
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#0a1f44] via-[#14b8a6] to-[#0a1f44]"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="text-white/70 text-sm tracking-wider">
                    Preparing your workspace…
                </div>
            </motion.div>
        </motion.div>
    )
}