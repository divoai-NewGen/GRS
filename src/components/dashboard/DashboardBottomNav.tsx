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
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-2xl border-t border-[#006B21]/40 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.7)]"
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
                isActive ? "text-[#39E900]" : "text-white/50 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-7 h-1 rounded-full bg-[#39E900] shadow-[0_0_8px_#39E900]" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#10251A] scale-110 border border-[#006B21]/60 text-[#39E900]"
                    : "hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate ${
                  isActive ? "font-bold text-[#39E900]" : "font-medium"
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
