import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cardAssignSchema } from "@/lib/validation";

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
    const body = await request.json();
    const result = cardAssignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const { businessId, label } = result.data;

    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const updated = await prisma.card.update({
      where: { id },
      data: {
        businessId,
        status: "ASSIGNED",
        assignedAt: new Date(),
        ...(label !== undefined && { label }),
      },
      include: {
        business: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_ASSIGNED",
        entityType: "CARD",
        entityId: card.id,
        metadata: JSON.stringify({
          cardCode: card.cardCode,
          businessId: business.id,
          businessName: business.name,
        }),
      },
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (error) {
    console.error("Assign card error:", error);
    return NextResponse.json({ error: "Failed to assign card" }, { status: 500 });
  }
}
