"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { forgotPassword } from "@/lib/api/auth"
import { toast } from "sonner"
import useHydrated from "@/hooks/useHydrated"

const schema = z.object({
    email: z.email("Invalid email format."),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [delayedErrors, setDelayedErrors] = useState<Record<string, string>>({})
    const [statusFlag, setStatusFlag] = useState<
        "idle" | "success" | "expired" | "too_soon" | "not_found" | "error" 
    >("idle")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [emailUsed, setEmailUsed] = useState("")
    const hydrated = useHydrated()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })


    // Debounce error display
    useEffect(() => {
        const timer = setTimeout(() => {
            const newErrors: Record<string, string> = {}
            if (errors.email) newErrors.email = errors.email.message as string
            setDelayedErrors(newErrors)
        }, 500)

        return () => clearTimeout(timer)
    }, [errors.email])

    const onSubmit = async (data: FormData) => {
        setEmailUsed(data.email)
        setSent(false)
        setLoading(true)
        const res = await forgotPassword(data)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setStatusFlag(res.status)
        setLoading(false)
    }

    
    if (!hydrated) return null
    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("/images/background.jpg")' }}
        >
            <div className="flex flex-col items-center justify-center min-h-screen space-y-6 py-10">
                <div className="min-h-[18vh] w-[380px] space-y-4 rounded-2xl bg-[#261D1D]/80 text-white mt-2 px-10 py-6 shadow-lg">
                    <img
                        src="/images/scbddc_logo.png"
                        alt="SCBD Data Center Logo"
                        className="h-20 auto "
                    />
                    {loading ? (
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 h-8 w-8" />
                            <p className="text-sm font-semibold">Sending reset link...</p>
                        </div>
                    ) : statusFlag === "success" ? (
                        <div className="flex flex-col space-y-4 text-center">
                            <h2 className="text-lg font-bold text-green-600">Success!</h2>
                            <p className="font-semibold text-xs">
                                A reset password link has been sent to your email address. If you don’t see it in your inbox,
                                please check your spam or junk folder. The link will expire in 2 hours.
                            </p>
                            <Link href="/">
                                <p className="text-sm font-light text-center mt-4 text-gray-800">
                                    <span className="font-medium text-blue-500 hover:underline">
                                        Back to Login
                                    </span>
                                </p>
                            </Link>
                        </div>
                    ) : statusFlag === "too_soon" ? (
                        <div className="flex flex-col space-y-4 text-center">
                            <h2 className="text-lg font-bold text-yellow-600">Too Soon</h2>
                            <p className="font-semibold text-xs">
                                You recently requested a password reset. Please wait before retrying.
                            </p>
                            <Button
                                onClick={() => setStatusFlag("idle")}
                                className="w-full h-[36px] bg-[#0071BB] text-white text-sm"
                            >
                                Try Again
                            </Button>
                            <Link href="/">
                                <p className="text-sm font-light text-center mt-4 text-gray-800">
                                    <span className="font-medium text-blue-500 hover:underline">
                                        Back to Login
                                    </span>
                                </p>
                            </Link>
                        </div>
                    ) : statusFlag === "not_found" ? (
                        <div className="flex flex-col space-y-4 text-center">
                            <h2 className="text-lg font-bold text-red-600">Email not found</h2>
                            <p className="font-semibold text-xs">
                                Account with this email does not exist, please try again.
                            </p>
                            <Button
                                onClick={() => setStatusFlag("idle")}
                                className="w-full h-[36px] bg-[#0071BB] text-white text-sm"
                            >
                                Try Again
                            </Button>
                            <Link href="/">
                                <p className="text-sm font-light text-center mt-4 text-gray-800">
                                    <span className="font-medium text-blue-500 hover:underline">
                                        Back to Login
                                    </span>
                                </p>
                            </Link>
                        </div>
                    
                    ) : statusFlag === "error" ? (
                        <div className="flex flex-col space-y-4 text-center">
                            <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
                            <p className="font-semibold text-xs">
                                Unfortunately, we were unable to send the reset link. Please try again.
                            </p>
                            <Button
                                onClick={() => setStatusFlag("idle")}
                                className="w-full h-[36px] bg-[#0071BB] text-white text-sm"
                            >
                                Try Again
                            </Button>
                            <Link href="/">
                                <p className="text-sm font-light text-center mt-4 text-gray-800">
                                    <span className="font-medium text-blue-500 hover:underline">
                                        Back to Login
                                    </span>
                                </p>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold">Forgot Password</h2>
                                <p className="text-xs text-gray-300">
                                    Enter your email below to receive a reset link.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-medium" htmlFor="email">
                                    Email<span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <Input
                                    id="email"
                                    autoComplete="off"
                                    {...register("email")}
                                    placeholder="Enter your email"
                                />
                                {delayedErrors.email && (
                                    <p className="text-xs text-red-500">{delayedErrors.email}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-[36px] w-full bg-[#0071BB] rounded-md text-sm"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>

                            <Link href="/">
                                <p className="text-sm font-light text-center mt-4 text-gray-300">
                                    Already have an account?{" "}
                                    <span className="font-medium text-blue-500 hover:underline">
                                        Sign in
                                    </span>
                                </p>
                            </Link>
                        </form>
                    )}
                </div>

                <p className="text-xs font-light text-center text-gray-300">
                    ©2025 Arthatel / SCBD Data Center. All right reserved.
                </p>
            </div>
        </div>
    )
}
