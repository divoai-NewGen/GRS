"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  QrCode,
  BarChart3,
  History,
  Users,
  ScrollText,
  Settings,
  Printer,
  ChevronRight,
  ExternalLink,
  Store,
  Inbox,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Inquiries & Leads", href: "/admin/inquiries", icon: Inbox },
    { label: "Businesses", href: "/admin/businesses", icon: Building2 },
    { label: "Cards", href: "/admin/cards", icon: CreditCard },
    { label: "QR Generator", href: "/admin/qr-generator", icon: QrCode },
    { label: "Printable Cards", href: "/admin/printable", icon: Printer },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Scan History", href: "/admin/scan-history", icon: History },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5EEE6] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#E5EEE6]">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#006B21] flex items-center justify-center shadow-sm shadow-[#006B21]/20 text-white transition-transform group-hover:scale-105 duration-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-[#050505] tracking-tight">
                Grow<span className="text-[#006B21]">Broo</span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E3F4E8] text-[#168A3A] border border-[#D0ECD7] tracking-wider uppercase">
                ADMIN
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#718096]">
            PLATFORM MANAGEMENT
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#0B3B24] text-white shadow-sm"
                    : "text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-[#52606D] group-hover:text-[#006B21]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/90" />}
              </Link>
            );
          })}

          <div className="pt-4 pb-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#718096]">
              CLIENT PORTAL VIEW
            </div>
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-[#52606D] group-hover:text-[#006B21] transition-colors duration-200" />
                <span>Business Portal</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#8896A4] group-hover:text-[#006B21]" />
            </Link>
            <Link
              href="/"
              target="_blank"
              onClick={onCloseMobile}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#52606D] group-hover:text-[#006B21] transition-colors duration-200" />
                <span>Marketing Website</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom quick links / Dynamic QR widget */}
        <div className="p-3.5 border-t border-[#E5EEE6] bg-[#FFFFFF]">
          <div className="p-3 bg-gradient-to-br from-[#0B3B24] via-[#0E4B2F] to-[#072617] rounded-2xl border border-[#145332] text-white shadow-md relative overflow-hidden group">
            {/* Ambient wave SVG in background */}
            <svg
              className="absolute -right-4 -bottom-4 w-28 h-28 opacity-25 pointer-events-none text-emerald-400"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" />
            </svg>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#145332]/80 border border-[#23784A]/60 flex items-center justify-center text-[#39E900]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white leading-tight">
                    Dynamic QR Active
                  </div>
                  <div className="text-[10px] text-white/70 leading-tight mt-0.5">
                    Auto-route without reprints
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
