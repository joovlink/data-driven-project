"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function ASSAHeroSection({ className }: { className?: string }) {
    return (
        <section
            className={cn(
                "relative w-full h-[35vh] overflow-hidden rounded-xl",
                "shadow-sm ring-1 ring-black/5",
                "bg-[linear-gradient(90deg,rgba(3,49,75,0.06)_0%,rgba(15,123,110,0.06)_100%)]",
                "md:px-24 px-6 md:py-8 py-6",
                className
            )}
        >
            {/* subtle white overlay (20% -> 0%) */}
            <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 to-white/0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* SIMPLE LAYOUT: flex like your HomeHeroSection */}
            <motion.div
                className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between gap-6"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Left copy */}
                <motion.div className="text-center md:text-left" variants={fadeUp}>
                    <h2 className="font-bold tracking-tight text-[clamp(20px,2.6vw,28px)] text-[#03314B]">
                        Advance your career with{" "}
                        <span className="inline-flex items-baseline">
                            <span className="font-bold text-[#03314B]">Joov</span>
                            <span className="font-bold text-[#0F7B6E]">link</span>
                            <span className="font-bold text-black">{" "}!</span>
                        </span>
                    </h2>
                    <p className="mt-2 text-[20px] text-center leading-6 text-[#03314B]/80">
                        Apply faster. Hire smarter. All in one <br /> powerful platform.
                    </p>
                </motion.div>

                {/* Separator */}
                <motion.div
                    className="hidden md:block self-stretch w-[2px] bg-white"
                    variants={fadeUp}
                />

                {/* Right features */}
                <motion.div className="grid gap-4" variants={fadeUp}>
                    <Feature
                        imgSrc="/images/assa1.png"
                        title="APPLY IN ONE CLICK"
                        desc={
                            <>
                                Submit your application quickly
                                and effortlessly, <br />  starting your journey with just one click.
                            </>
                        }
                    />
                    <Feature
                        imgSrc="/images/assa2.png"
                        title="EASY SCREENING & SCORING"
                        desc={
                            <>
                                Efficiently filter top talent with <br/> fair, transparent scoring.
                            </>
                        }
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

function Feature({ imgSrc, title, desc }: { imgSrc: string; title: string; desc: React.ReactNode; }) {
    return (
        <motion.div
            variants={fadeUp}
            className="flex items-center gap-16"
        >
            <div className="shrink-0 overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={title}
                    width={150} // atau gedein lagi sesuai kebutuhan
                    height={150}
                    className="object-contain"
                    priority
                />
            </div>
            <div className="min-w-0">
                <div className="text-[16px] font-bold tracking-wide text-[#03314B] uppercase">{title}</div>
                <div className="mt-1 text-[14px] leading-6 text-[#03314B]/80">{desc}</div>
            </div>
        </motion.div>
    );
}
