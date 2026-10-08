import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateQrSvg, generateQrDataUrl, getPublicCardUrl } from "@/lib/qr";

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

  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      business: true,
      scans: {
        orderBy: { scannedAt: "desc" },
        take: 50,
      },
      _count: {
        select: { scans: true },
      },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Check access if business owner
  if (user.role !== "ADMIN" && card.business?.ownerId !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const inferredOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const customHost = searchParams.get("host") || inferredOrigin;
  const publicUrl = getPublicCardUrl(card.publicToken, customHost);
  const qrSvg = await generateQrSvg(publicUrl);
  const qrDataUrl = await generateQrDataUrl(publicUrl);

  // Compute scans summary
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  const [scansToday, scans7d, scans30d] = await Promise.all([
    prisma.scan.count({
      where: { cardId: id, scannedAt: { gte: todayStart } },
    }),
    prisma.scan.count({
      where: { cardId: id, scannedAt: { gte: sevenDaysAgo } },
    }),
    prisma.scan.count({
      where: { cardId: id, scannedAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  return NextResponse.json({
    card,
    publicUrl,
    qrSvg,
    qrDataUrl,
    stats: {
      total: card._count.scans,
      today: scansToday,
      sevenDays: scans7d,
      thirtyDays: scans30d,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await prisma.card.update({
      where: { id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
      },
    });

    return NextResponse.json({ card: updated });
  } catch (error) {
    console.error("Update card error:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const card = await prisma.card.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Delete card (related scans cascade delete)
    await prisma.card.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_DELETED",
        entityType: "CARD",
        entityId: id,
        metadata: JSON.stringify({
          cardCode: card.cardCode,
          publicToken: card.publicToken,
          businessName: card.business?.name || null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Card ${card.cardCode} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete card error:", error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}

