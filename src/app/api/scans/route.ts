import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const businessId = searchParams.get("businessId") || "";

  const where: any = {};
  if (businessId) where.businessId = businessId;

  const scans = await prisma.scan.findMany({
    where,
    include: {
      card: { select: { cardCode: true, publicToken: true, label: true } },
      business: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { scannedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ scans });
}
