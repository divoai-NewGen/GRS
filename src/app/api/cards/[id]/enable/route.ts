import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
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
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const newStatus = card.businessId ? "ASSIGNED" : "UNASSIGNED";

    const updated = await prisma.card.update({
      where: { id },
      data: {
        status: newStatus,
        deactivatedAt: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_ENABLED",
        entityType: "CARD",
        entityId: card.id,
        metadata: JSON.stringify({
          cardCode: card.cardCode,
          newStatus,
        }),
      },
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (error) {
    console.error("Enable card error:", error);
    return NextResponse.json({ error: "Failed to enable card" }, { status: 500 });
  }
}
