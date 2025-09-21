"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Briefcase,
    Bookmark,
    Compass,
    Settings,
    FileUser,
    Blocks,
    User2,
    ListChecks,
    KeyRound,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const items = [
    { label: "General Information", href: "/profile", icon: User2 },
    { label: "CV & Portofolio", href: "/profile/cv", icon: FileUser },
    { label: "Skills & Certification", href: "/profile/skills", icon: Blocks },
    { label: "Experience & Education", href: "/profile/experience", icon: Briefcase },
    { label: "Saved Work", href: "/profile/saved", icon: Bookmark },
    {
        label: "Journey",
        href: "/profile/journey",
        icon: Compass,
        children: [
            {
                label: "Submission Progress",
                href: "/profile/journey/submission-progress",
                icon: ListChecks,
            },
        ],
    },
    { label: "Change Password", href: "/profile/change-password", icon: KeyRound },
    { label: "Settings", href: "/profile/settings", icon: Settings },
]

export function ProfileSidebar() {
    const pathname = usePathname()
    const activeRef = useRef<HTMLAnchorElement | null>(null)

    useEffect(() => {
        const el = activeRef.current
        if (!el) return

        const t = setTimeout(() => {
            const container = el.closest("nav") as HTMLElement | null
            if (!container) return

            const allLinks = Array.from(container.querySelectorAll("a"))
            const index = allLinks.findIndex((link) => link === el)

            if (index <= 4) return

            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        }, 50)

        return () => clearTimeout(t)
    }, [pathname])

    return (
        <aside className="w-[260px] shrink-0">
            <motion.nav
                className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-4 scroll-smooth"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut",
                }}
            >
                {items.map((item) => {
                    const Icon = item.icon
                    const isParentActive =
                        pathname === item.href || item.children?.some((c) => c.href === pathname)

                    return (
                        <div key={item.label} className="flex flex-col">
                            <Link
                                ref={pathname === item.href ? activeRef : null}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-1 rounded-3xl text-sm font-medium transition-colors duration-150 ease-out",
                                    isParentActive
                                        ? "bg-[#17255A] text-white font-bold"
                                        : "text-neutral-700 hover:bg-neutral-100"
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>

                            {item.children && isParentActive && (
                                <div className="ml-4 mt-1 flex flex-col gap-1">
                                    {item.children.map((child) => {
                                        const ChildIcon = child.icon
                                        const isChildActive = pathname === child.href

                                        return (
                                            <Link
                                                key={child.label}
                                                ref={isChildActive ? activeRef : null}
                                                href={child.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-5 py-1 rounded-3xl text-sm font-medium transition-colors duration-150 ease-out",
                                                    isChildActive
                                                        ? "bg-[#17255A] text-white font-bold"
                                                        : "text-neutral-700 hover:bg-neutral-100"
                                                )}
                                            >
                                                <ChildIcon className="h-4 w-4 shrink-0" />
                                                <span>{child.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </motion.nav>
        </aside>
    )
}
