"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-cover bg-center space-y-6"
            style={{ backgroundImage: `url('/images/notfound.png')` }}
        >
            <Link href="/" className="inline-block">
                <motion.div
                    animate={{
                          
                        opacity: [1, 0.7, 1],
                       
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 5,         
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        src="/images/joovlink_logo.png"
                        alt="Joovlink Logo"
                        width={240}
                        height={40}
                        priority
                        className="invert brightness-0 drop-shadow-lg"
                    />
                </motion.div>
            </Link>

            <div className="bg-white/20 backdrop-blur-sm p-10 rounded-xl max-w-md">
                <h2 className="text-lg text-white font-bold mb-2">Oops! Something went wrong.</h2>
                <p className="text-sm text-white">
                    We couldn’t find the page you’re looking for.
                </p>
                <Link
                    href="/"
                    className="text-black px-4 py-1 rounded-lg bg-white/90 font-semibold hover:scale-105 transition mt-4 inline-block"
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    )
}
