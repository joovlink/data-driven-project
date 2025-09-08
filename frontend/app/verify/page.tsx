"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, RefreshCcw, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { verifyEmail, resendVerificationByToken } from "@/lib/api/auth";

const COOLDOWN = 30; // seconds

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        token ? "loading" : "error"
    );
    const [message, setMessage] = useState(token ? "" : "Missing token in URL.")

    const [retryCd, setRetryCd] = useState<number>(0);
    const [resendCd, setResendCd] = useState<number>(0);
    const isLoading = status === "loading";
   
    const hasRun = useRef(false)

    useEffect(() => {
        const id = setInterval(() => {
            setRetryCd((s) => (s > 0 ? s - 1 : 0));
            setResendCd((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, []);


    useEffect(() => {
        if (!token || hasRun.current) return
        hasRun.current = true

        const verify = async () => {
            try {
                setStatus("loading")
                await new Promise(resolve => setTimeout(resolve, 2000));
                const res = await verifyEmail(token)

                if (res.status === "success") {
                    setStatus("success")
                    setMessage(res.message)
                    toast.success(res.message)
                } else {
                    setStatus("error")
                    setMessage(res.message)
                    toast.error(res.message)
                }
            } catch (err: any) {
                setStatus("error")
                setMessage("Something went wrong.")
                toast.error("Verification failed.")
            }
        }

        verify()
    }, []) 

    const handleRetry = async () => {
        if (!token) {
            setStatus("error");
            setMessage("Missing token in URL.");
            toast.error("Missing token in URL.");
            return;
        }
        if (retryCd > 0 || isLoading) return;

        setRetryCd(COOLDOWN);
        setStatus("loading");
        const result = await verifyEmail(token);
        if (result.status === "success") {
            setTimeout(() => {
                setStatus("success");
                toast.success(result.message);
                setRetryCd(0);
                setResendCd(0);
            }, 1000);
        } else {
            setStatus("error");
            setMessage(result.message);
            toast.error(result.message);
        }
    };

    const handleResend = async () => {
        if (!token || isLoading || resendCd > 0) return;

        setResendCd(COOLDOWN);
        const res = await resendVerificationByToken({ token });
        if (res.status === "success") {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-[calc(100dvh)] bg-[#F7F7F7] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="relative rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                    {/* Top */}
                    <div className="flex flex-col items-center px-6 pt-6">
                        <img src="/images/joovlink_logo.png" alt="Joovlink Logo" className="h-10" />
                        <div className="text-sm text-gray-500">Account Verification</div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-8">
                        <AnimatePresence mode="wait">
                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                    <h1 className="text-xl font-semibold">Verifying your account...</h1>
                                </motion.div>
                            )}

                            {status === "success" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 className="h-7 w-7" />
                                    </div>
                                    <h1 className="text-xl font-semibold">Your email is verified</h1>
                                    <p className="text-sm text-gray-600">You can now sign in with your account.</p>
                                    <div className="pt-2">
                                        <Link href="/login">
                                            <Button className="w-full bg-[#03314B] hover:bg-[#011926]">
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Go to Login
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                                        <XCircle className="h-7 w-7" />
                                    </div>
                                    <h1 className="text-xl font-semibold">Verification failed</h1>
                                    <p className="text-sm text-red-600">{message}</p>

                                    <div className="pt-2 grid grid-cols-1 gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={handleRetry}
                                            disabled={retryCd > 0 || isLoading}
                                        >
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            {retryCd > 0 ? `Try Again (${retryCd}s)` : "Try Again"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleResend}
                                            disabled={resendCd > 0 || isLoading}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            {resendCd > 0 ? `Resend Verification (${resendCd}s)` : "Resend Verification"}
                                        </Button>
                                    </div>

                                    <div className="pt-2">
                                        <Link href="/login">
                                            <Button className="w-full bg-[#03314B] hover:bg-[#011926]">
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Back to Login
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
