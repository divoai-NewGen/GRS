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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#050505] border-r border-[#006B21]/30 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#006B21]/20">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006B21] flex items-center justify-center shadow-md shadow-[#006B21]/30 text-[#39E900]">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Grow<span className="text-[#39E900]">Broo</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/30">
                  ADMIN
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#39E900]">
            Platform Management
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
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30"
                    : "text-white/70 hover:text-white hover:bg-[#10251A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#39E900]" : "text-white/50 group-hover:text-[#39E900]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#39E900]" />}
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Client Portal View
            </div>
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#10251A] hover:bg-[#006B21] border border-[#006B21]/50 text-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-[#39E900] group-hover:text-white" />
                <span>Business Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#39E900] group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Bottom quick links */}
        <div className="p-3 border-t border-[#006B21]/20 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-white/60 hover:text-[#39E900] hover:bg-[#10251A] transition-colors font-medium"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-white/40" />
              Marketing Website
            </span>
          </Link>
          <div className="p-3 bg-[#10251A] rounded-xl border border-[#006B21]/40 text-[11px] text-white/70">
            <div className="font-bold text-[#39E900] mb-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E900] animate-pulse"></span>
              Dynamic QR Active
            </div>
            <div>Scans auto-route without reprints</div>
          </div>
        </div>
      </aside>
    </>
  );
}
