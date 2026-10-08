import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bulkAssignSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = bulkAssignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const { cardIds, businessId } = result.data;

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Update all cards in one transaction
    const updateResult = await prisma.card.updateMany({
      where: {
        id: { in: cardIds },
      },
      data: {
        businessId: business.id,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_BULK_ASSIGNED",
        entityType: "CARD",
        metadata: JSON.stringify({
          count: updateResult.count,
          businessId: business.id,
          businessName: business.name,
          cardIds,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      updatedCount: updateResult.count,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Bulk assign error:", error);
    return NextResponse.json({ error: "Failed to bulk assign cards" }, { status: 500 });
  }
}
