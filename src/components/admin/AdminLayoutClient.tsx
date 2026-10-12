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
    <div className="min-h-screen bg-[#F7FBF7] text-[#050505] flex relative overflow-x-hidden selection:bg-[#006B21] selection:text-white print:bg-white print:overflow-visible print:block print:min-h-0 print:m-0 print:p-0">
      {/* Extremely subtle ambient mint gradient glow behind the top area */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(233,248,233,0.8),rgba(247,251,247,0))] z-0 print:hidden"
      />

      {/* Sidebar for Desktop */}
      <div className="print:hidden">
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 relative z-10 print:pl-0 print:m-0 print:p-0 print:block">
        <div className="print:hidden">
          <AdminHeader
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            adminName={user.name}
            adminEmail={user.email}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto print:p-0 print:m-0 print:max-w-none print:w-full">
          {children}
        </main>
      </div>

      {/* Native App-Like Mobile Bottom Navigation */}
      <div className="print:hidden">
        <AdminBottomNav />
      </div>
    </div>
  );
}
