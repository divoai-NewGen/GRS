"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Store,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const { success, error: toastError } = useToast();

  const [activeRole, setActiveRole] = useState<"ADMIN" | "BUSINESS_OWNER">("ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          password: targetPassword,
          role: activeRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login failed");
        toastError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      success(`Welcome back, ${data.user.name}!`);

      if (redirect) {
        router.push(redirect);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please try again.");
      toastError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10251A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#39E900] selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#006B21]/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Logo, Title & Description Inside Black Box */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#006B21] flex items-center justify-center shadow-lg shadow-[#006B21]/40 group-hover:scale-105 transition-transform text-[#39E900]">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Grow<span className="text-[#39E900]">Broo</span>
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sign in to your portal
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
              Manage dynamic QR review cards, client businesses, and scan analytics.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#10251A] rounded-2xl border border-[#006B21]/40 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveRole("ADMIN");
                setErrorMessage("");
                setEmail("");
                setPassword("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeRole === "ADMIN"
                  ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#39E900]" />
              <span>Sign in as Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole("BUSINESS_OWNER");
                setErrorMessage("");
                setEmail("");
                setPassword("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeRole === "BUSINESS_OWNER"
                  ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4 text-[#39E900]" />
              <span>Business Owner</span>
            </button>
          </div>

          {/* Role Info Notice */}
          <div className="mb-5 px-3.5 py-2 rounded-xl bg-[#10251A]/70 border border-[#006B21]/30 flex items-center justify-between text-[11px]">
            <span className="text-white/70">
              {activeRole === "ADMIN" ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39E900]"></span>
                  Platform Administrator Master Portal
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39E900]"></span>
                  Business Owner Dashboard Login
                </span>
              )}
            </span>
            <span className="text-[#39E900] font-mono text-[10px] font-bold uppercase tracking-wider">
              {activeRole === "ADMIN" ? "ENV Secured" : "Admin Generated"}
            </span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in duration-150">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                {activeRole === "ADMIN" ? "Admin Email Address" : "Business Owner ID / Email"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeRole === "ADMIN"
                      ? "growbroo.info@gmail.com"
                      : "owner@business.com"
                  }
                  className="w-full pl-11 pr-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    activeRole === "ADMIN"
                      ? "••••••••"
                      : "Enter password provided by Admin"
                  }
                  className="w-full pl-11 pr-12 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-sm font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-[#39E900] transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#006B21] hover:bg-[#005219] text-white font-bold rounded-xl shadow-lg shadow-[#006B21]/25 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#39E900]" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>
                    {activeRole === "ADMIN"
                      ? "Sign In to Admin Panel"
                      : "Sign In to Business Dashboard"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#39E900]" />
                </>
              )}
            </button>
          </form>

          {/* Bottom helper text inside card */}
          <div className="mt-6 pt-5 border-t border-[#006B21]/30 text-center">
            <p className="text-xs text-white/60 leading-relaxed">
              {activeRole === "BUSINESS_OWNER" ? (
                <span>
                  Business owners ko login credentials (ID aur Password) unke{" "}
                  <strong className="text-[#39E900] font-semibold">GrowBroo Administrator</strong> dwaara generate karke provide kiya jaata hai.
                </span>
              ) : (
                <span>
                  Admin credentials dynamic system environment (<code className="text-[#39E900] font-mono text-[11px]">.env</code>) se manage hote hain.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#10251A] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
