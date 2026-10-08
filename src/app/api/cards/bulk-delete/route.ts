import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bulkDeleteCardsSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = bulkDeleteCardsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error:
            (result.error as any).issues?.[0]?.message ||
            (result.error as any).errors?.[0]?.message ||
            "Validation failed",
        },
        { status: 400 }
      );
    }

    const { cardIds } = result.data;

    // Fetch card codes or basic info for audit logging
    const cards = await prisma.card.findMany({
      where: { id: { in: cardIds } },
      select: { id: true, cardCode: true },
    });

    if (cards.length === 0) {
      return NextResponse.json({ error: "No matching cards found to delete" }, { status: 404 });
    }

    // Delete cards (related scans cascade delete)
    const deleteResult = await prisma.card.deleteMany({
      where: {
        id: { in: cardIds },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARDS_BULK_DELETED",
        entityType: "CARD",
        metadata: JSON.stringify({
          count: deleteResult.count,
          cardCodes: cards.map((c) => c.cardCode),
          cardIds,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} card(s)`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ error: "Failed to bulk delete cards" }, { status: 500 });
  }
}
