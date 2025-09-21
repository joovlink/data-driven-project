"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/lib/api/auth"
import { Eye, EyeOff } from "lucide-react"
import useHydrated from "@/hooks/useHydrated"

import { AnimatePresence, motion } from "framer-motion"
import SplashScreen from "@/components/SplashScreen"

const schema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Must include lowercase")
            .regex(/[A-Z]/, "Must include uppercase")
            .regex(/[0-9]/, "Must include number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const hydrated = useHydrated()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    // === Splash state (match Forgot Password) ===
    const [loadingSplash, setLoadingSplash] = useState(true)
    useEffect(() => {
        const t = setTimeout(() => setLoadingSplash(false), 2000)
        return () => clearTimeout(t)
    }, [])

    // === Page states (match Forgot Password style) ===
    const [statusFlag, setStatusFlag] = useState<
        "idle" | "success" | "invalid" | "expired" | "error" | "not_found" | "unverified"
    >("idle")
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onSubmit = async (data: FormData) => {
        if (!token) {
            setStatusFlag("invalid")
            return
        }

        setLoading(true)
        try {
            const res = await resetPassword({
                token: token,
                password: data.password,
            })
            // samain feel loading singkat kayak Forgot Password
            await new Promise((r) => setTimeout(r, 800))
            setStatusFlag(res.status)
        } catch {
            setStatusFlag("error")
        } finally {
            setLoading(false)
        }
    }

    if (!hydrated) return null

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                {loadingSplash ? (
                    <SplashScreen key="splash" />
                ) : (
                    <motion.div
                        key="page"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
                        style={{ backgroundImage: 'url("/images/bahaya.png")' }}
                    >
                        <div className="flex flex-col items-center justify-center min-h-screen space-y-6 py-10">
                            <div className="min-h-[18vh] w-[380px] space-y-4 rounded-2xl bg-white mt-2 px-10 py-6 shadow-lg">
                                <img
                                    src="/images/joovlink_logo.png"
                                    alt="Joovlink Logo"
                                    className="h-10 auto"
                                />

                                {loading ? (
                                    <div className="flex flex-col items-center space-y-4 ">
                                        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 h-8 w-8" />
                                        <p className="text-sm font-semibold">Resetting password...</p>
                                    </div>
                                ) : statusFlag === "success" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-green-600">Success!</h2>
                                        <p className="font-semibold text-xs">
                                            Your password has been successfully updated.
                                        </p>
                                        <Button
                                            onClick={() => router.push("/login")}
                                            className="w-full h-[36px] bg-[#17255A] hover:bg-[#011926] text-white text-sm"
                                        >
                                            Go to Login
                                        </Button>
                                    </div>
                                ) : statusFlag === "expired" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-yellow-600">Code Expired</h2>
                                        <p className="font-semibold text-xs">
                                            The reset code has expired. Please request a new one.
                                        </p>
                                        <Button
                                            onClick={() => router.push("/login")}
                                            className="w-full h-[36px] bg[#0071BB] text-white text-sm"
                                        >
                                            Go to Login
                                        </Button>
                                    </div>
                                ) : statusFlag === "not_found" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-red-600">Invalid Code</h2>
                                        <p className="font-semibold text-xs">
                                            The reset code is invalid or already used.
                                        </p>
                                        <Button
                                            onClick={() => router.push("/login")}
                                            className="w-full h-[36px] bg-[#17255A] hover:bg-[#011926] text-white text-sm"
                                        >
                                            Go to Login
                                        </Button>
                                    </div>
                                ) : statusFlag === "invalid" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-red-600">Invalid Request</h2>
                                        <p className="font-semibold text-xs">
                                            Missing or invalid reset token. Please use the latest link from your email.
                                        </p>
                                        <Button
                                            onClick={() => router.push("/login")}
                                            className="w-full h-[36px] bg-[#17255A] hover:bg-[#011926] text-white text-sm"
                                        >
                                            Go to Login
                                        </Button>
                                    </div>
                                ) : statusFlag === "unverified" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-yellow-600">Email Not Verified</h2>
                                        <p className="font-semibold text-xs">
                                            Please verify your email before resetting the password.
                                        </p>
                                        <Button
                                            onClick={() => router.push("/login")}
                                            className="w-full h-[36px] bg-[#17255A] hover:bg-[#011926] text-white text-sm"
                                        >
                                            Go to Login
                                        </Button>
                                    </div>
                                ) : statusFlag === "error" ? (
                                    <div className="flex flex-col space-y-4 ">
                                        <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
                                        <p className="font-semibold text-xs">
                                            Unable to reset password. Please try again.
                                        </p>
                                        <Link href="/">
                                            <p className="text-sm font-light  mt-4 text-gray-800">
                                                <span className="font-medium text-blue-500 hover:underline">
                                                    Back to Login
                                                </span>
                                            </p>
                                        </Link>
                                    </div>
                                ) : (
                                    // ======= FORM (hanya bagian ini yang beda dari Forgot Password) =======
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-bold">Reset Password</h2>
                                            <p className="text-xs text-gray-700">
                                                Enter your new password below.
                                            </p>
                                        </div>

                                        <div className="space-y-1 relative">
                                            <label className="text-xs font-medium" htmlFor="password">
                                                New Password
                                                <span className="text-red-500 ml-0.5">*</span>
                                            </label>
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="pr-10"
                                                {...register("password")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                            {errors.password && (
                                                <p className="text-xs text-red-500">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1 relative">
                                            <label className="text-xs font-medium" htmlFor="confirmPassword">
                                                Confirm Password
                                                <span className="text-red-500 ml-0.5">*</span>
                                            </label>
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter new password"
                                                className="pr-10"
                                                {...register("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((s) => !s)}
                                                className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                            {errors.confirmPassword && (
                                                <p className="text-xs text-red-500">
                                                    {errors.confirmPassword.message}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-[36px] w-full bg-[#17255A] hover:bg-[#011926] rounded-md text-sm"
                                        >
                                            {isSubmitting ? "Resetting..." : "Reset Password"}
                                        </Button>

                                        <Link href="/login">
                                            <p className="text-sm font-light  mt-4 text-gray-800">
                                                Remember your password?{" "}
                                                <span className="font-medium text-blue-500 hover:underline">
                                                    Sign in
                                                </span>
                                            </p>
                                        </Link>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
