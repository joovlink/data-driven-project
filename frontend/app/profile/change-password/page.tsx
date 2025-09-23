"use client"

import { KeyRound, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// 🔐 Zod schema
const schema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
            .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
            .regex(/[0-9]/, "Must contain at least 1 number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least 1 symbol"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })

type FormValues = z.infer<typeof schema>

export default function ChangePasswordPage() {
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const newPassword = watch("newPassword") || ""

    const getStrengthScore = (password: string) => {
        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[a-z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    }

    const score = getStrengthScore(newPassword)

    const onSubmit = (data: FormValues) => {
        console.log("Password change submitted:", data)
    }

    return (
        <div className="relative rounded-2xl shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/bg_pattern.png')] bg-cover bg-center opacity-70" />
            <div className="relative px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex space-x-2 items-center">
                        <KeyRound className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Change Password</h2>
                    </div>
                </div>

                <p className="text-sm text-gray-900 mt-4">
                    Update your password to keep your account secure.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 max-w-md">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter your current password"
                                {...register("currentPassword")}
                                className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-500"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                {...register("newPassword")}
                                className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-500"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                        )}

                        {/* Strength bar */}
                        {newPassword && (
                            <div className="mt-3">
                                <div className="flex gap-0.5 w-1/2">   {/* << batasi lebar di sini */}
                                    {[1, 2, 3, 4].map((level, idx, arr) => {
                                        let shape = "polygon(10% 0, 100% 0, 90% 100%, 0 100%)"
                                        if (idx === 0) shape = "polygon(0 0, 100% 0, 90% 100%, 0 100%)"
                                        else if (idx === arr.length - 1)
                                            shape = "polygon(10% 0, 100% 0, 100% 100%, 0 100%)"

                                        return (
                                            <div
                                                key={level}
                                                className={`h-1.5 flex-1 ${score >= level ? "bg-[#17255A]" : "bg-gray-200"
                                                    }`}
                                                style={{ clipPath: shape }}
                                            />
                                        )
                                    })}
                                </div>
                                <div className="mt-1 text-xs text-gray-700 flex items-center gap-1">
                                    <span>Password Strength:</span>
                                    <span className="font-semibold">
                                        {score <= 2
                                            ? "Weak"
                                            : score === 3
                                                ? "Medium"
                                                : score === 4
                                                    ? "Strong"
                                                    : "Excellent"}
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Re-enter New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter new password"
                                {...register("confirmPassword")}
                                className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-500"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-800 hover:bg-teal-800 text-white rounded-md text-sm font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
