import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const cutoffDate = new Date(now.getTime() - days * 24 * 3600 * 1000);

  // High-level counts
  const [
    totalBusinesses,
    activeBusinesses,
    totalCards,
    assignedCards,
    unassignedCards,
    disabledCards,
    totalScans,
    scansToday,
    scansThisMonth,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: "ACTIVE" } }),
    prisma.card.count(),
    prisma.card.count({ where: { status: "ASSIGNED" } }),
    prisma.card.count({ where: { status: "UNASSIGNED" } }),
    prisma.card.count({ where: { status: "DISABLED" } }),
    prisma.scan.count(),
    prisma.scan.count({ where: { scannedAt: { gte: todayStart } } }),
    prisma.scan.count({ where: { scannedAt: { gte: monthStart } } }),
  ]);

  // Unique approximate visitors
  const uniqueVisitorsRaw = await prisma.scan.groupBy({
    by: ["ipHash"],
    _count: { id: true },
  });
  const uniqueVisitors = uniqueVisitorsRaw.length;

  // Recent scans for time breakdown
  const scans = await prisma.scan.findMany({
    where: { scannedAt: { gte: cutoffDate } },
    select: {
      id: true,
      scannedAt: true,
      deviceType: true,
      browser: true,
      os: true,
      cardId: true,
      businessId: true,
      card: { select: { cardCode: true } },
      business: { select: { name: true } },
    },
    orderBy: { scannedAt: "asc" },
  });

  // Aggregate scans over time (grouped by date YYYY-MM-DD)
  const scansByDateMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    scansByDateMap[dateStr] = 0;
  }

  const deviceMap: Record<string, number> = {};
  const browserMap: Record<string, number> = {};
  const osMap: Record<string, number> = {};
  const businessMap: Record<string, number> = {};
  const cardMap: Record<string, number> = {};

  for (const s of scans) {
    const dateStr = s.scannedAt.toISOString().split("T")[0];
    if (scansByDateMap[dateStr] !== undefined) {
      scansByDateMap[dateStr] += 1;
    }

    const dev = s.deviceType || "Other";
    deviceMap[dev] = (deviceMap[dev] || 0) + 1;

    const br = s.browser || "Other";
    browserMap[br] = (browserMap[br] || 0) + 1;

    const os = s.os || "Other";
    osMap[os] = (osMap[os] || 0) + 1;

    const bName = s.business?.name || "Unknown";
    businessMap[bName] = (businessMap[bName] || 0) + 1;

    const cCode = s.card?.cardCode || "Unknown";
    cardMap[cCode] = (cardMap[cCode] || 0) + 1;
  }

  const scansOverTime = Object.entries(scansByDateMap).map(([date, count]) => ({
    date,
    scans: count,
  }));

  const deviceBreakdown = Object.entries(deviceMap).map(([name, count]) => ({ name, value: count }));
  const browserBreakdown = Object.entries(browserMap).map(([name, count]) => ({ name, value: count }));
  const osBreakdown = Object.entries(osMap).map(([name, count]) => ({ name, value: count }));

  const scansByBusiness = Object.entries(businessMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const scansByCard = Object.entries(cardMap)
    .map(([cardCode, count]) => ({ cardCode, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    metrics: {
      totalBusinesses,
      activeBusinesses,
      totalCards,
      assignedCards,
      unassignedCards,
      disabledCards,
      totalScans,
      uniqueVisitors,
      scansToday,
      scansThisMonth,
    },
    scansOverTime,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    scansByBusiness,
    scansByCard,
  });
}
