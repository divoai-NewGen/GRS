import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ businesses: [], cards: [], users: [] });
  }

  const [businesses, cards, users] = await Promise.all([
    prisma.business.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
          { email: { contains: q } },
          { city: { contains: q } },
        ],
      },
      include: {
        _count: { select: { cards: true, scans: true } },
      },
      take: 10,
    }),
    prisma.card.findMany({
      where: {
        OR: [
          { cardCode: { contains: q } },
          { label: { contains: q } },
          { publicToken: { contains: q } },
          { business: { name: { contains: q } } },
        ],
      },
      include: {
        business: { select: { id: true, name: true, slug: true } },
        _count: { select: { scans: true } },
      },
      take: 10,
    }),
    prisma.user.findMany({
      where: {
        OR: [{ name: { contains: q } }, { email: { contains: q } }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      take: 10,
    }),
  ]);

  return NextResponse.json({ businesses, cards, users });
}
