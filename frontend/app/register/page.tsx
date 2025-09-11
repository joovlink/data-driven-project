"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, RefreshCcw } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { register as registerApi, resendVerification } from "@/lib/api/auth";

// ===== Zod Schema =====
const schema = z
  .object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[a-z]/, "Must include lowercase")
      .regex(/\d/, "Must include number")
      .regex(/[\W_]/, "Must include symbol"),
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const pathname = usePathname();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

  // cooldown resend (detik)
  const [cooldown, setCooldown] = useState(0);
  const isCoolingDown = cooldown > 0;

  useEffect(() => {
    if (!isCoolingDown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isCoolingDown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  // watch nilai per-field
  const emailVal = watch("email");
  const passVal = watch("password");
  const confirmVal = watch("confirm_password");

  // helper: tampilkan error hanya jika field tidak kosong
  const showErr = (val?: string) => (val ?? "").trim() !== "";

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      await registerApi({ email: values.email, password: values.password });
      setRegisteredEmail(values.email);
      setIsSuccess(true);
      toast.success("Sign up successful! Check your email for verification.");
      setSubmitting(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Sign up failed"
      );
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail || isCoolingDown) return;
    setCooldown(30);
    try {
      const res = await resendVerification({ email: registeredEmail });
      if (res.status === "success") {
        toast.success(res.message || "Verification link has been resent.");
      } else {
        // kalau BE balas error, hentikan cooldown biar user bisa coba lagi
        setCooldown(0);
        toast.error(res.message || "Failed to resend verification email");
      }
    } catch (e) {
      setCooldown(0);
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F7F7]">
      {/* BG animasi */}
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
          style={{ backgroundImage: 'url("/images/register.jpg")' }}
        >
          
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#03314B]/60 via-[#0071BB]/30 to-transparent" /> */}
        </motion.div>
      </AnimatePresence>

      {/* Panel kiri */}
      <div className="relative z-10 h-screen flex flex-col justify-center w-[25%] space-y-4 px-10 bg-[#F7F7F7]">
        <div className="space-y-1">
          <Link href="/" className="inline-block">
            <img
              src="/images/joovlink_logo.png"
              alt="Joovlink Logo"
              className="h-10 pr-4 cursor-pointer"
            />
          </Link>
          {!isSuccess && (
            <p className="text-xs font-semibold text-gray-900">
              One step closer to your future — sign up today.
            </p>
          )}
        </div>

        {/* === SUCCESS STATE === */}
        {isSuccess ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Thank you for registering!
              </h2>
            </div>

            <div className="text-sm text-gray-900 space-y-2">
              <p>
                A confirmation link has been sent to{" "}
                <span className="font-bold">{registeredEmail}</span>.
              </p>
              <p>
                If you don’t see it in your inbox, please check your spam or
                junk folder. The link will expire in{" "}
                <span className="font-bold">24 hours</span>.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleResend}
                disabled={isCoolingDown}
                className="h-[36px] w-full bg-[#03314B] hover:bg-[#011926] rounded-md text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                {isCoolingDown
                  ? `Resend available in ${cooldown}s`
                  : "Resend verification email"}
              </Button>

              {/* Back to Login */}
              <Button
                type="button"
                asChild
                variant="outline"
                className="h-[36px] w-full rounded-md text-sm"
              >
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          // === FORM ===
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                autoComplete="on"
                placeholder="Enter your email"
                aria-invalid={!!errors.email && showErr(emailVal)}
                className={`border-gray-600 ${errors.email && showErr(emailVal) ? "border-red-500" : ""
                  }`}
                {...register("email")}
              />
              {errors.email && showErr(emailVal) && (
                <p className="text-[11px] text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <label className="block text-xs font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password && showErr(passVal)}
                className={`pr-10 border-gray-600 ${errors.password && showErr(passVal) ? "border-red-500" : ""
                  }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[26px] text-gray-800 hover:text-gray-700"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              {errors.password && showErr(passVal) && (
                <p className="text-[11px] text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <label
                className="block text-xs font-medium"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <Input
                id="confirm_password"
                type={showPassword2 ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirm_password && showErr(confirmVal)}
                className={`pr-10 border-gray-600 ${errors.confirm_password && showErr(confirmVal)
                    ? "border-red-500"
                    : ""
                  }`}
                {...register("confirm_password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword2((v) => !v)}
                className="absolute right-3 top-[26px] text-gray-800 hover:text-gray-700"
              >
                {showPassword2 ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              {errors.confirm_password && showErr(confirmVal) && (
                <p className="text-[11px] text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-[36px] w-full bg-[#03314B] hover:bg-[#011926] rounded-md text-sm flex items-center justify-center gap-2 transition"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Signing up..." : "Sign up"}
            </Button>

            {/* Divider */}
            <div>
              <div className="flex items-center space-x-4">
                <div className="flex-grow border-t border-gray-900"></div>
                <span className="text-sm text-gray-900 font-semibold">Or</span>
                <div className="flex-grow border-t border-gray-900"></div>
              </div>
            </div>

            {/* Social buttons */}
            <div className="space-y-2">
              <Button
                type="button"
                disabled={submitting}
                className="h-[36px] w-full bg-white text-black hover:bg-gray-100 border border-gray-300 rounded-md text-sm flex items-center justify-center gap-2 transition"
              >
                <Image
                  src="/images/google.png"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
              <Button
                type="button"
                disabled={submitting}
                className="h-[36px] w-full bg-[#0071BB] text-white hover:bg-[#007ed3] rounded-md text-sm flex items-center justify-center gap-2 transition"
              >
                <Image
                  src="/images/linkedin.png"
                  alt="LinkedIn logo"
                  width={20}
                  height={20}
                />
                Continue with LinkedIn
              </Button>
            </div>

            <div className="text-center text-xs font-semibold">
              <span>Already have an account? </span>
              <Link href="/login" className="text-[#0071BB] hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
