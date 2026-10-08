import React, { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BusinessDashboardClient } from "./BusinessDashboardClient";

export default async function DashboardPage() {
  const user = await requireAuth();

  // If user is ADMIN, they can also view this or be redirected to /admin
  let businesses = [];
  if (user.role === "ADMIN") {
    businesses = await prisma.business.findMany({
      select: { id: true, name: true, slug: true },
      take: 20,
    });
  } else {
    businesses = await prisma.business.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true, slug: true },
    });
  }

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-white/50 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
          <span className="text-xs">Loading portal...</span>
        </div>
      }
    >
      <BusinessDashboardClient initialBusinesses={businesses} />
    </Suspense>
  );
}
