// components/layout/AppNavbar.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants, cubicBezier } from "framer-motion"
import { AccountDropdown } from "../AccountDropdown"


const slideDown: Variants = {
    hidden: { opacity: 0, y: -12 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: cubicBezier(0.16, 1, 0.3, 1), // ✅ ini valid ke type TS
        },
    },
}

export default function AppNavbar({
    dummyUser,
}: {
    dummyUser: { username: string } | null
}) {
    return (
        <motion.header
            className="relative w-full flex items-center justify-between px-14 py-5 z-20 shadow-sm bg-white"
            variants={slideDown}
            initial="hidden"
            animate="show"
        >
            {/* Left: Logo + Nav items */}
            <div className="flex items-center gap-4 h-[40px]">
                <Link href="/" className="inline-block">
                    <Image
                        src="/images/joovlink_logo.png"
                        alt="Joovlink Logo"
                        width={100}
                        height={40}
                        priority
                        className="auto"
                    />
                </Link>

                <nav className="hidden md:flex items-center pt-2 gap-2 text-[#03314B] font-semibold text-md">
                    <span className="opacity-50">▸</span>
                    <Link href="/career" className="hover:text-[#021927] transition">
                        Career
                    </Link>
                    <span className="opacity-50">|</span>
                    <Link href="/companies" className="hover:text-[#021927] transition">
                        Companies
                    </Link>
                </nav>
            </div>

            <nav className="flex items-center pt-2 gap-6">
                {dummyUser ? (
                    <AccountDropdown username={dummyUser.username} variant="light" />
                ) : (
                    <>
                        <Link href="/login" className="hover:text-teal-300 transition">
                            Login
                        </Link>
                        <span className="text-white/60">|</span>
                        <motion.a
                            href="/register"
                            className="px-4 py-2 bg-[#6155F5] text-white font-semibold rounded-sm"
                            whileHover={{ y: -2, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            Sign up
                        </motion.a>
                    </>
                )}
            </nav>
        </motion.header>
    )
}
