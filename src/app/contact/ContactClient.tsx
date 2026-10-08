"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  QrCode,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  Building,
  Send,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ContactClient() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") === "PREMIUM" ? "PREMIUM" : "BASIC";

  const { success, error: toastError } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [plan, setPlan] = useState<"BASIC" | "PREMIUM">(initialPlan);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          businessName,
          plan,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.error || "Failed to submit inquiry");
        setLoading(false);
        return;
      }

      success("Inquiry submitted successfully!");
      setSubmitted(true);
    } catch {
      toastError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10251A] text-white flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#39E900] selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#39E900] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>

        {/* Card Box */}
        <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#006B21]/50 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#006B21] flex items-center justify-center shadow-lg shadow-[#006B21]/40 group-hover:scale-105 transition-transform text-[#39E900]">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Grow<span className="text-[#39E900]">Broo</span>
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Contact Us & Request Cards
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md mx-auto">
              Apni details aur preferred plan select karein. Hamari team aapke business ke liye permanent dynamic QR cards setup karegi.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#006B21]/30 border-2 border-[#39E900] flex items-center justify-center mx-auto text-[#39E900]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Thank You, {name}!
                </h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  Aapki inquiry hamare Admin dashboard par receive ho chuki hai. Hum aapko{" "}
                  <strong className="text-[#39E900] font-mono">{phone}</strong> par contact karke aapka{" "}
                  <strong className="text-[#39E900]">
                    {plan === "PREMIUM" ? "Premium Plan (Smart Assistant)" : "Basic Plan (Direct Redirect)"}
                  </strong>{" "}
                  setup kar denge.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all text-center"
                >
                  Return to Homepage
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setPhone("");
                    setEmail("");
                    setBusinessName("");
                    setMessage("");
                  }}
                  className="px-6 py-3 rounded-xl bg-[#10251A] hover:bg-[#10251A]/80 border border-[#006B21]/40 text-white/80 font-medium text-xs transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@business.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                    Business / Shop Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Salon & Spa"
                      className="w-full pl-10 pr-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Selection (Basic vs Premium) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2.5">
                  Select Your Plan *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Basic Plan Card */}
                  <div
                    onClick={() => setPlan("BASIC")}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-left ${
                      plan === "BASIC"
                        ? "bg-[#10251A] border-[#39E900] shadow-md shadow-[#39E900]/10 ring-1 ring-[#39E900]"
                        : "bg-[#10251A]/40 border-[#006B21]/30 hover:border-[#006B21]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#39E900]" />
                        Basic Plan
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          plan === "BASIC"
                            ? "border-[#39E900] bg-[#39E900]"
                            : "border-white/30"
                        }`}
                      >
                        {plan === "BASIC" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                        )}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#39E900] mb-1">
                      Direct Google Deep-Link
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Instant 307 redirect to Google Review page. QR cards never need reprint.
                    </p>
                  </div>

                  {/* Premium Plan Card */}
                  <div
                    onClick={() => setPlan("PREMIUM")}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-left relative ${
                      plan === "PREMIUM"
                        ? "bg-[#10251A] border-[#39E900] shadow-md shadow-[#39E900]/10 ring-1 ring-[#39E900]"
                        : "bg-[#10251A]/40 border-[#006B21]/30 hover:border-[#006B21]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#39E900]" />
                        Premium Plan
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          plan === "PREMIUM"
                            ? "border-[#39E900] bg-[#39E900]"
                            : "border-white/30"
                        }`}
                      >
                        {plan === "PREMIUM" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                        )}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#39E900] mb-1">
                      Smart Assistant & Grievance Shield
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Positive 4-5★ reviews get 1-click prompts. 1-3★ complaints are trapped privately!
                    </p>
                  </div>
                </div>
              </div>

              {/* Message / Details */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                  Additional Notes / Card Quantity (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. We need 5 cards for our salon reception and stations..."
                  className="w-full px-4 py-3 bg-[#10251A]/60 border border-[#006B21]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900] text-xs transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-[#006B21] hover:bg-[#005219] text-white font-bold rounded-xl shadow-lg shadow-[#006B21]/30 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#39E900]" />
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <span>Submit Inquiry & Request Cards</span>
                    <Send className="w-4 h-4 text-[#39E900]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Trust Badge */}
          <div className="mt-6 pt-5 border-t border-[#006B21]/30 text-center">
            <p className="text-[11px] text-white/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#39E900]" />
              No credit card required. Our team will verify and activate your dynamic QR portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
