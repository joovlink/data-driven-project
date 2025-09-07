"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/lib/api/auth"
import { Eye, EyeOff } from "lucide-react"
import useHydrated from "@/hooks/useHydrated"

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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const hydrated = useHydrated()

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

    const onSubmit = async (data: FormData) => {
        if (!code) {
            setStatusFlag("invalid")
            return
        }

        setLoading(true)

        const res = await resetPassword({
            token: code,
            password: data.password,
        })

        await new Promise((resolve) => setTimeout(resolve, 3000))

        setStatusFlag(res.status) // kalau mau bisa juga simpan res.message
        setLoading(false)
    }

    if (!hydrated) return null

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/background.jpg")' }}
        >
            <div className="flex flex-col items-center justify-between min-h-screen space-y-6 py-10">
                <img
                    src="/images/scbddc_logo.png"
                    alt="SCBD Data Center Logo"
                    className="h-20 w-auto filter brightness-0 invert contrast-200"
                />

                <div className="min-h-[18vh] w-[380px] space-y-4 rounded-2xl bg-[#261D1D]/40 text-white mt-2 px-10 py-6 shadow-lg">
                    {loading ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 h-8 w-8" />
                            <p className="text-sm font-semibold">Resetting password...</p>
                        </div>
                    ) : statusFlag === "success" ? (
                        <div className="text-center space-y-4">
                            <h2 className="text-lg font-bold text-green-600">Success</h2>
                            <p className="text-xs font-semibold">
                                Your password has been successfully updated.
                            </p>
                            <Button onClick={() => router.push("/")} className="w-full bg-[#0071BB] text-white text-sm">
                                Go to Login
                            </Button>
                        </div>
                    ) : statusFlag === "expired" ? (
                        <div className="text-center space-y-4">
                            <h2 className="text-lg font-bold text-yellow-600">Code Expired</h2>
                            <p className="text-xs font-semibold">The reset code has expired. Please request a new one.</p>

                            <Button onClick={() => router.push("/")} className="w-full bg-[#0071BB] text-white text-sm">
                                Go to Login
                            </Button>
                        </div>
                    ) : statusFlag === "not_found" ? (
                        <div className="text-center space-y-4">
                            <h2 className="text-lg font-bold text-red-600">Invalid Code</h2>
                            <p className="text-xs font-semibold">The reset code is invalid or already used.</p>
                            <Button onClick={() => router.push("/")} className="w-full bg-[#0071BB] text-white text-sm">
                                Go to Login
                            </Button>
                        </div>
                    ) : statusFlag === "error" ? (
                        <div className="text-center space-y-4">
                            <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
                            <p className="text-xs font-semibold">Unable to reset password. Please try again.</p>
                            <Button onClick={() => router.push("/")} className="w-full bg-[#0071BB] text-white text-sm">
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold">Reset Password</h2>
                                <p className="text-xs text-gray-300">Enter your new password below.</p>
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-xs font-medium">New Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...register("password")}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-xs font-medium">Confirm Password</label>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter new password"
                                    {...register("confirmPassword")}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-[36px] w-full bg-[#0071BB] text-sm"
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    )}
                </div>

                <p className="text-xs font-light text-center text-gray-300">
                    ©2025 Arthatel. All right reserved.
                </p>
            </div>
        </div>
    )
}
