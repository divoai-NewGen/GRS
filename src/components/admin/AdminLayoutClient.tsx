"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminBottomNav } from "./AdminBottomNav";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E9F8E9] text-[#050505] flex">
      {/* Sidebar for Desktop */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          adminName={user.name}
          adminEmail={user.email}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Native App-Like Mobile Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}
