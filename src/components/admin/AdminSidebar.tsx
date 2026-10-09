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
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#050505] tracking-tight flex items-center gap-1.5">
                Grow<span className="text-[#006B21]">Broo</span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#E9F8E9] text-[#006B21] border border-[#DCEBDD]">
                  ADMIN
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#52606D]">
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
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#E9F8E9] text-[#006B21]"
                    : "text-[#52606D] hover:text-[#050505] hover:bg-[#F0F8F1]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isActive ? "text-[#006B21]" : "text-[#006B21]/80 group-hover:text-[#006B21]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#006B21]" />}
              </Link>
            );
          })}

          <div className="pt-4 pb-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#52606D]">
              Client Portal View
            </div>
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F7FBF7] hover:bg-[#E9F8E9] border border-[#E5EEE6] hover:border-[#DCEBDD] text-[#050505] transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-[#006B21] transition-transform duration-200 group-hover:scale-105" />
                <span className="font-semibold text-[#050505]">Business Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#52606D] group-hover:text-[#006B21] transition-colors duration-200" />
            </Link>
          </div>
        </div>

        {/* Bottom quick links */}
        <div className="p-3.5 border-t border-[#E5EEE6] space-y-2 bg-[#FFFFFF]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] transition-colors duration-200 font-medium"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#52606D]" />
              Marketing Website
            </span>
          </Link>
          <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E5EEE6] text-[11px] text-[#52606D]">
            <div className="font-bold text-[#006B21] mb-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E900]"></span>
              Dynamic QR Active
            </div>
            <div>Scans auto-route without reprints</div>
          </div>
        </div>
      </aside>
    </>
  );
}
