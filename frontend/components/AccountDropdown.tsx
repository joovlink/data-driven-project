"use client"

import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDownCircle, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Props = {
    username: string | null
    variant?: "light" | "dark"
}

export function AccountDropdown({ username, variant = "light" }: Props) {
    const [mounted, setMounted] = useState(false)
    const [currentUser, setCurrentUser] = useState<string | null>(username)

    useEffect(() => setMounted(true), [])

    const handleLogout = () => {
        toast.success("Logged out (dummy)")
        setCurrentUser(null) // ✅ langsung null → dropdown ilang
    }

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[80px] rounded-md" />
            </div>
        )
    }

    // Kalau ga ada user → render Login/Signup
    if (!currentUser) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-teal-300 transition">
                    Login
                </Link>
                <span className={variant === "dark" ? "text-white/60" : "text-[#03314B]/60"}>|</span>
                <Link
                    href="/register"
                    className="px-4 py-2 bg-[#6155F5] text-white font-semibold rounded-sm hover:opacity-90 transition"
                >
                    Sign up
                </Link>
            </div>
        )
    }

    // ✅ hanya trigger button yang beda
    const triggerText = variant === "dark" ? "text-white" : "text-[#03314B]"
    const triggerIcon = variant === "dark" ? "text-white" : "text-[#03314B]"
    const triggerHover = variant === "dark" ? "hover:bg-white/10" : "hover:bg-muted"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md transition text-sm font-medium focus:outline-none focus:ring-0",
                        triggerHover
                    )}
                >
                    <span className={triggerText}>{currentUser}</span>
                    <ChevronDownCircle className={cn("w-4 h-4", triggerIcon)} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 mr-3 bg-[#F7F7F7]" align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100">
                    <LogOut className="h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
