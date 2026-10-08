import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { QrCode, Store, LogOut, ExternalLink, BarChart3, CreditCard, ShieldCheck } from "lucide-react";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#10251A] text-white flex flex-col">
      {/* Admin Preview Mode Notice */}
      {user.role === "ADMIN" && (
        <div className="bg-[#050505] text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-[#006B21]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse"></span>
            <span className="text-white/80">
              <strong className="text-[#39E900]">Admin Preview Mode:</strong> You are viewing the Client Business Owner Portal.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1 rounded-lg bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#39E900]" />
            Return to Admin Panel →
          </Link>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 h-16 bg-[#050505]/95 backdrop-blur-md border-b border-[#006B21]/30 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006B21] flex items-center justify-center shadow-md shadow-[#006B21]/20 text-white">
              <Store className="w-5 h-5 text-[#39E900]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Grow<span className="text-[#39E900]">Broo</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/30">
                  PORTAL
                </span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">
              {user.name}
            </span>
            <span className="text-[10px] text-white/50">{user.email}</span>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-2 rounded-xl text-white/50 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8 max-w-6xl w-full mx-auto">
        {children}
      </main>

      <footer className="py-6 pb-24 sm:pb-6 border-t border-[#006B21]/20 text-center text-xs text-white/40">
        GrowBroo Dynamic Review Network • Powered by Google Business Profile Deep-Link
      </footer>

      {/* Mobile Native Bottom Navigation */}
      <DashboardBottomNav />
    </div>
  );
}
