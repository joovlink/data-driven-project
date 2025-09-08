"use client"

import Link from "next/link"
import Image from "next/image"
import linedraw from "@/public/images/linedraw.png"
import landingpage from "@/public/images/landing.jpg"

import { motion, type Variants } from "framer-motion"

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            // easeOut cubic-bezier
            ease: [0.16, 1, 0.3, 1],
        },
    },
}

const slideDown: Variants = {
    hidden: { opacity: 0, y: -12 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            // easeOut cubic-bezier
            ease: [0.16, 1, 0.3, 1],
        },
    },
}
export default function HomeHeroSection() {
    return (
        <div className="relative w-full h-[65vh] overflow-hidden">
            {/* Background */}
            <Image
                src={landingpage}
                alt="Landing Background"
                fill
                priority
                placeholder="blur"
                className="object-cover"
                sizes="100vw"
                style={{ display: "block" }}
            />

            {/* Gradient overlay (layer opacity 82%) + fade-in */}
            <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#18206F] to-[#271010]"
                style={{ opacity: 0.62 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.62 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Navbar */}
            <motion.header
                className="absolute top-0 left-0 w-full flex items-center justify-between px-14 py-5 z-20"
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
                            className="invert brightness-0"
                        />
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center pt-2 gap-2 text-white text-md">
                        <span className="opacity-50">▸</span>
                        <Link href="/career" className="hover:text-teal-300 transition">Career</Link>
                        <span className="opacity-50">|</span>
                        <Link href="/companies" className="hover:text-teal-300 transition">Companies</Link>
                    </nav>
                </div>

                <nav className="flex items-center pt-2 gap-6 text-white">
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
                </nav>
            </motion.header>

            {/* Hero Section */}
            <motion.section
                className="relative z-10 flex flex-col justify-center h-full px-14 max-w-2xl"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.h1
                    className="text-6xl font-bold text-[#77C6FF] mt-10 mb-2"
                    variants={fadeUp}
                >
                    19M+ Jobs
                </motion.h1>

                <motion.div variants={fadeUp}>
                    <Image
                        src={linedraw}
                        alt="Line Decoration"
                        width={280}
                        height={20}
                        priority
                        placeholder="blur"
                        sizes="(max-width: 768px) 200px, 280px"
                        style={{ display: "block" }}
                    />
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold text-white leading-snug mb-4"
                    variants={fadeUp}
                >
                    Are just a click <br /> away — start your <br /> journey today!
                </motion.h2>

                <motion.p className="text-base text-gray-300" variants={fadeUp}>
                    Great platform for the job seeker that searching for <br /> new career
                    heights and passionate about startups.
                </motion.p>
            </motion.section>
        </div>
    )
}
