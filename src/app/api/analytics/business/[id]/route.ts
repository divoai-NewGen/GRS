import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && business.ownerId !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 3600 * 1000);

  const [totalScans, scansToday, scansThisMonth, activeCardsCount] = await Promise.all([
    prisma.scan.count({ where: { businessId: id } }),
    prisma.scan.count({ where: { businessId: id, scannedAt: { gte: todayStart } } }),
    prisma.scan.count({ where: { businessId: id, scannedAt: { gte: monthStart } } }),
    prisma.card.count({ where: { businessId: id, status: "ASSIGNED" } }),
  ]);

  // Unique visitors
  const uniqueVisitorsRaw = await prisma.scan.groupBy({
    by: ["ipHash"],
    where: { businessId: id },
  });
  const uniqueVisitors = uniqueVisitorsRaw.length;

  // Scans in last 14 days
  const recentScans = await prisma.scan.findMany({
    where: { businessId: id, scannedAt: { gte: fourteenDaysAgo } },
    include: {
      card: { select: { cardCode: true, label: true } },
    },
    orderBy: { scannedAt: "asc" },
  });

  // Daily timeline
  const scansByDateMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    scansByDateMap[dateStr] = 0;
  }

  const deviceMap: Record<string, number> = {};
  const cardMap: Record<string, { code: string; label: string | null; count: number }> = {};

  for (const s of recentScans) {
    const dateStr = s.scannedAt.toISOString().split("T")[0];
    if (scansByDateMap[dateStr] !== undefined) {
      scansByDateMap[dateStr] += 1;
    }

    const dev = s.deviceType || "Other";
    deviceMap[dev] = (deviceMap[dev] || 0) + 1;

    const cCode = s.card?.cardCode || "Unknown";
    if (!cardMap[cCode]) {
      cardMap[cCode] = { code: cCode, label: s.card?.label || null, count: 0 };
    }
    cardMap[cCode].count += 1;
  }

  const scansOverTime = Object.entries(scansByDateMap).map(([date, count]) => ({
    date,
    scans: count,
  }));

  const deviceBreakdown = Object.entries(deviceMap).map(([name, count]) => ({ name, value: count }));
  const cardBreakdown = Object.values(cardMap).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    metrics: {
      totalScans,
      scansToday,
      scansThisMonth,
      activeCardsCount,
      uniqueVisitors,
    },
    scansOverTime,
    deviceBreakdown,
    cardBreakdown,
  });
}
