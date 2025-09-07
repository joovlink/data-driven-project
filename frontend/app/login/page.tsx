"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Linkedin, Loader2, LogIn } from "lucide-react";
import { login, logout } from "@/lib/api/auth";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearAccountProfile, setAccountProfile } from "@/store/slices/accountSlice";
import { motion } from "framer-motion"; // ⬅️ Tambah import Framer Motion
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showMotion, setShowMotion] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAccountProfile());

    // clear HttpOnly cookie
    logout().catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowMotion(true), 100); // small delay
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!username.trim() || !password.trim()) {
      toast.error("Username or password cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await login({ username, password, remember });

      dispatch(setAccountProfile(res));

      const role = res?.role?.toLowerCase();

      let redirectUrl = "";

      switch (role) {
        case "superadmin":
        case "admin":
        case "admin-sales":
          redirectUrl = "/admin/account-management";
          break;
        case "customer-admin":
          redirectUrl = "/customer-admin/account-management";
          break;
        default:
          toast.error("Unknown role. Access denied.");
          setLoading(false);
          return;
      }

      toast.success("Login successful!");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1200);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-[#F7F7F7] flex justify-start"
      style={{ backgroundImage: 'url("/images/login.jpg")' }}
    >
      <div className="h-screen flex flex-col justify-center w-[25%] space-y-4 px-10 bg-[#F7F7F7]">
        <div className="space-y-1">
          <img src="/images/joovlink_logo.png" alt="Joovlink Logo" className="h-10 pr-4" />
          <p className="text-xs font-semibold text-gray-900">Log in to your account using your credentials.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-xs font-medium" htmlFor="username">
              Email
            </label>
            <Input
              id="username"
              autoComplete="on"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border-gray-600"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="block text-xs font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              autoComplete="on"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pr-10 border-gray-600 "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[26px] text-gray-800 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" checked={remember} onCheckedChange={(checked) => setRemember(!!checked)} />
            <label htmlFor="remember" className="text-xs">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-[36px] w-full bg-[#03314B] hover:bg-[#011926] rounded-md text-sm flex items-center justify-center gap-2 transition"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="flex text-md">
            <Link href="/forgot-password" className="text-black hover:underline font-semibold text-xs">
              Forgot your password?
            </Link>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <div className="flex-grow border-t border-gray-900"></div>
              <span className="text-sm text-gray-900 font-semibold">Or</span>
              <div className="flex-grow border-t border-gray-900"></div>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              disabled={loading}
              className="h-[36px] w-full bg-white text-black hover:bg-gray-100 border  border-gray-300 rounded-md text-sm flex items-center justify-center space-x-1 transition"
            >
              <Image
                src="/images/google.png" 
                alt="Google logo"
                width={20}
                height={20}
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logging in..." : "Google"}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-[36px] w-full bg-[#0071BB] text-white hover:bg-[#007ed3] rounded-md text-sm flex items-center justify-center space-x-1 transition"
            >
                 <Image
                src="/images/linkedin.png" 
                alt="Google logo"
                width={20}
                height={20}
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logging in..." : "LinkedIn"}
            </Button>
          </div>
          <div className="text-center text-xs font-semibold ">
            <span>Dont have an account? </span>
            <Link href="/register" className="text-[#0071BB] hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>

      {/* <p className="text-xs mr-20 font-light text-center text-gray-300">
                        ©2025 Arthatel / SCBD Data Center. All right reserved.
                    </p> */}
    </div>
  );
}
