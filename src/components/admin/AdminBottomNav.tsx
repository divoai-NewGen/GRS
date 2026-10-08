"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Building2,
  BarChart3,
  Printer,
  QrCode,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  Store,
  History,
  Inbox,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      label: "Leads",
      href: "/admin/inquiries",
      icon: Inbox,
      isActive: pathname.startsWith("/admin/inquiries"),
    },
    {
      label: "Businesses",
      href: "/admin/businesses",
      icon: Building2,
      isActive: pathname.startsWith("/admin/businesses"),
    },
    {
      label: "Cards",
      href: "/admin/cards",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/cards"),
    },
    {
      label: "QR Gen",
      href: "/admin/qr-generator",
      icon: QrCode,
      isActive: pathname.startsWith("/admin/qr-generator"),
    },
    {
      label: "Print Cards",
      href: "/admin/printable",
      icon: Printer,
      isActive: pathname.startsWith("/admin/printable"),
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      isActive: pathname.startsWith("/admin/analytics"),
    },
    {
      label: "Scans",
      href: "/admin/scan-history",
      icon: History,
      isActive: pathname.startsWith("/admin/scan-history"),
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname.startsWith("/admin/users"),
    },
    {
      label: "Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldAlert,
      isActive: pathname.startsWith("/admin/audit-logs"),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      isActive: pathname.startsWith("/admin/settings"),
    },
    {
      label: "Client View",
      href: "/dashboard",
      icon: Store,
      isActive: pathname.startsWith("/dashboard"),
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-2xl border-t border-[#006B21]/40 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.7)]"
    >
      {/* Horizontal Swipeable Scroll Container */}
      <div
        ref={navRef}
        className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-3 py-1.5 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative shrink-0 flex flex-col items-center justify-center min-w-[62px] py-1.5 px-2 rounded-2xl transition-all ${
                tab.isActive
                  ? "text-[#39E900]"
                  : "text-white/50 hover:text-white/90 active:scale-95"
              }`}
            >
              {tab.isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#39E900] shadow-[0_0_8px_#39E900]" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  tab.isActive
                    ? "bg-[#10251A] scale-105 shadow-sm border border-[#006B21]/60 text-[#39E900]"
                    : "hover:bg-white/5 text-white/60"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate whitespace-nowrap ${
                  tab.isActive ? "font-bold text-[#39E900]" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Quick Sign Out Action at end of scroll */}
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 flex flex-col items-center justify-center min-w-[62px] py-1.5 px-2 rounded-2xl text-rose-400/70 hover:text-rose-400 active:scale-95 transition-all"
        >
          <div className="p-1.5 rounded-xl hover:bg-rose-950/30">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
