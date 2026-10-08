"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Store, CreditCard, MessageSquareHeart, Building2 } from "lucide-react";

function BottomNavContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      href: "/dashboard?tab=overview",
      icon: Store,
    },
    {
      id: "cards",
      label: "My Cards",
      href: "/dashboard?tab=cards",
      icon: CreditCard,
    },
    {
      id: "feedback",
      label: "Feedbacks",
      href: "/dashboard?tab=feedback",
      icon: MessageSquareHeart,
    },
    {
      id: "profile",
      label: "Store Info",
      href: "/dashboard?tab=profile",
      icon: Building2,
    },
  ];

  return (
    <nav
      aria-label="Business Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#006B21]/20 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,107,33,0.08)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all ${
                isActive ? "text-[#006B21]" : "text-[#050505]/60 hover:text-[#050505]"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-[#006B21] shadow-[0_0_8px_rgba(0,107,33,0.4)]" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#E9F8E9] scale-105 border border-[#006B21]/30 text-[#006B21]"
                    : "hover:bg-[#E9F8E9]/50"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate ${
                  isActive ? "font-bold text-[#006B21]" : "font-medium text-[#050505]/70"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardBottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
