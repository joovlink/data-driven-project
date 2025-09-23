"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SplashScreen from "@/components/SplashScreen"
import AppNavbar from "@/components/layout/AppNavbar"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"
import { usePathname } from "next/navigation"
import { FileUser, MapPin, PhoneCall, User2 } from "lucide-react"

type ProfileData = {
    name: string
    title: string
    location: string
    email: string
    phone: string
    skills: string[]
    cvFile: string
    photo: string
}

function ProfileHeader() {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const dummy: ProfileData = {
            name: "Taufiq Ahmadi",
            title: "Data Scientist",
            location: "Jakarta, Indonesia",
            email: "taufiq.ahmadi@gmail.com",
            phone: "+6281280810302",
            skills: ["NextJS", "TypeScript", "Go", "MongoDB"],
            cvFile: "/CV_TaufiqAhmadi_August_2025.pdf",
            photo: "/images/profile_dummy2.png",
        }
        setProfile(dummy)
    }, [])

    if (!profile) return null

    return (
        <motion.div
            initial={!hasAnimated ? { opacity: 0, y: -60 } : false}
            animate={!hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1] // mirip easing iOS spring
            }}
            onAnimationComplete={() => setHasAnimated(true)}
            className="relative w-full rounded-2xl shadow-md overflow-hidden px-10 py-8 text-white 
    bg-[linear-gradient(to_right,rgba(255,255,255,0.35),rgba(23,37,90,0.75))]"
        >
            {/* Background image layer */}
            <div className="absolute inset-0 bg-[url('/images/bannerabstract.png')] bg-cover bg-center opacity-10" />

            {/* Content (di atas gradient + image) */}
            <div className="relative flex items-center gap-6">
                {/* Foto */}
                <div className="w-32 aspect-[3/4] rounded-md overflow-hidden border border-white/20">
                    <img
                        src={profile.photo}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h2 className="text-2xl text-[#17255A] font-bold">{profile.name}</h2>
                    <p className="text-[#17255A] ">{profile.title}</p>

                    <div className="mt-2 text-sm space-y-1 text-[#17255A] ">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User2 className="w-4 h-4" />
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PhoneCall className="w-4 h-4" />
                            <span>{profile.phone}</span>
                        </div>
                    </div>


                </div>
                <div>
                    {/* Tombol CV */}
                    <a
                        href={profile.cvFile}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#FFFFFF]/80  text-[#17255A] hover:bg-[#17255A] hover:text-white rounded-lg transition"
                    >
                        <FileUser className="w-4 h-4" />
                        {/* <span>{profile.cvFile.split("/").pop()}</span> */}
                        <span>CV_TaufiqAhmadi_August_2025.pdf</span>
                    </a>
                    <div className="flex gap-2 mt-3 flex-wrap text-[#17255A]">
                        {profile.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    background: "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.8))",
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}


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

            {/* Header banner */}
            <div className="px-14 pt-6">
                <ProfileHeader />
            </div>

            {/* Body */}
            <div className="grid grid-cols-[16rem_1fr] gap-8 px-28 py-8">
                {/* Sidebar sticky di bawah navbar */}
                <aside className="sticky top-[100px] self-start">
                    <ProfileSidebar />
                </aside>

                {/* Content */}
                <main>
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="space-y-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
