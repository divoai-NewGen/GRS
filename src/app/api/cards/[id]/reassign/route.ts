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

    const card = await prisma.card.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const newBusiness = await prisma.business.findUnique({ where: { id: businessId } });
    if (!newBusiness) {
      return NextResponse.json({ error: "Target business not found" }, { status: 404 });
    }

    const oldBusinessName = card.business ? card.business.name : "Unassigned";

    // Reassign card: publicToken and cardCode remain unchanged!
    const updated = await prisma.card.update({
      where: { id },
      data: {
        businessId: newBusiness.id,
        status: "ASSIGNED",
        assignedAt: new Date(),
        ...(label !== undefined && { label }),
      },
      include: { business: true },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_REASSIGNED",
        entityType: "CARD",
        entityId: card.id,
        metadata: JSON.stringify({
          cardCode: card.cardCode,
          oldBusinessId: card.businessId,
          oldBusinessName,
          newBusinessId: newBusiness.id,
          newBusinessName: newBusiness.name,
        }),
      },
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (error) {
    console.error("Reassign card error:", error);
    return NextResponse.json({ error: "Failed to reassign card" }, { status: 500 });
  }
}
