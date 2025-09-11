"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import { toast } from "sonner";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const schema = z.object({
    email: z.string().email("Invalid email format."),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const pathname = usePathname();

    const [statusFlag, setStatusFlag] = useState<
        "idle" | "success" | "too_soon" | "not_found" | "error"
    >("idle");
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await forgotPassword({ email: data.email });
            await new Promise((r) => setTimeout(r, 800)); // biar ada feel loading
            setStatusFlag(res.status);
            if (res.status === "success") {
                toast.success("Reset link sent to your email.");
            } else if (res.status === "not_found") {
                toast.error("Email not found.");
            } else if (res.status === "too_soon") {
                toast.warning("Please wait before retrying.");
            } else {
                toast.error("Something went wrong.");
            }
        } catch {
            setStatusFlag("error");
            toast.error("Server error, try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F7F7F7]">

            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, x: 80, scale: 1.02 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1], // mirip easeOutExpo
                        },
                    }}
                    exit={{
                        opacity: 0,
                        x: -80,
                        scale: 1.01,
                        transition: {
                            duration: 0.6,
                            ease: [0.7, 0, 0.84, 0], // fast exit
                        },
                    }}
                    className="absolute inset-0 left-[25%] h-full bg-cover bg-center"
                    style={{ backgroundImage: 'url("/images/forgotpassword.jpg")' }}
                >
                   
                    {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#03314B]/60 via-[#0071BB]/30 to-transparent" /> */}
                </motion.div>
            </AnimatePresence>


            <div className="relative z-10 h-screen flex flex-col justify-center w-[25%] space-y-4 px-10 bg-[#F7F7F7]">
                <div className="space-y-1">
                    <Link href="/" className="inline-block">
                        <img
                            src="/images/joovlink_logo.png"
                            alt="Joovlink Logo"
                            className="h-10 pr-4 cursor-pointer"
                        />
                    </Link>
                    {statusFlag === "idle" && (
                        <p className="text-xs font-semibold text-gray-900">
                            Enter your email to receive a reset password link.
                        </p>
                    )}
                </div>

                {statusFlag === "success" ? (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-green-600">Success!</h2>
                        <p className="text-xs font-medium">
                            A reset password link has been sent to your email. Please check
                            your inbox or spam folder.
                        </p>
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full bg-[#03314B] hover:bg-[#011926] text-white text-sm"
                        >
                            Go to Login
                        </Button>
                    </div>
                ) : statusFlag === "too_soon" ? (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-yellow-600">Too Soon</h2>
                        <p className="text-xs font-medium">
                            You recently requested a reset link. Please wait before retrying.
                        </p>
                        <Button
                            onClick={() => setStatusFlag("idle")}
                            className="w-full bg-[#03314B] hover:bg-[#011926] text-white text-sm"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : statusFlag === "not_found" ? (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-red-600">Email not found</h2>
                        <p className="text-xs font-medium">
                            We couldn’t find an account with that email. Please try again.
                        </p>
                        <Button
                            onClick={() => setStatusFlag("idle")}
                            className="w-full bg-[#03314B] hover:bg-[#011926] text-white text-sm"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : statusFlag === "error" ? (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
                        <p className="text-xs font-medium">
                            We were unable to send the reset link. Please try again.
                        </p>
                        <Button
                            onClick={() => setStatusFlag("idle")}
                            className="w-full bg-[#03314B] hover:bg-[#011926] text-white text-sm"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    // === idle (form) ===
                    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label className="block text-xs font-medium" htmlFor="email">
                                Email
                            </label>
                            <Input
                                id="email"
                                autoComplete="off"
                                {...register("email")}
                                placeholder="Enter your email"
                                className="border-gray-600"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="h-[36px] w-full bg-[#03314B] hover:bg-[#011926] rounded-md text-sm flex items-center justify-center gap-2 transition"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <div className="text-center text-xs font-semibold"> <span>Remembered your password? </span> <Link href="/login" className="text-[#0071BB] hover:underline"> Back to Login </Link> </div>
                    </form>
                )}

            </div>
        </div>
    );
}
