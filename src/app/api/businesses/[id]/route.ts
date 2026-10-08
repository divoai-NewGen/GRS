import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { businessSchema } from "@/lib/validation";

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
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      cards: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { scans: true },
          },
        },
      },
      _count: {
        select: {
          scans: true,
          cards: true,
        },
      },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Business owner can only view their own business
  if (user.role !== "ADMIN" && business.ownerId !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ business });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.business.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Business owner can only edit their own business, admins can edit any
  if (user.role !== "ADMIN" && existing.ownerId !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const partialSchema = businessSchema.partial();
    const result = partialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Track if Google Review URL changed
    const reviewUrlChanged =
      data.googleReviewUrl && data.googleReviewUrl !== existing.googleReviewUrl;

    const updated = await prisma.business.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.businessType && { businessType: data.businessType }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.googleBusinessName !== undefined && {
          googleBusinessName: data.googleBusinessName,
        }),
        ...(data.googleReviewUrl && { googleReviewUrl: data.googleReviewUrl }),
        ...(data.planType && { planType: data.planType }),
        ...(data.customTags !== undefined && { customTags: data.customTags }),
        ...(data.recommendedReviews !== undefined && { recommendedReviews: data.recommendedReviews }),
        ...(data.negativeFeedbackFilter !== undefined && { negativeFeedbackFilter: data.negativeFeedbackFilter }),
        // Only admin can change status or owner
        ...(user.role === "ADMIN" && data.status && { status: data.status }),
        ...(user.role === "ADMIN" &&
          data.ownerId !== undefined && { ownerId: data.ownerId || null }),
      },
    });

    // Audit logs
    if (reviewUrlChanged) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "GOOGLE_REVIEW_URL_UPDATED",
          entityType: "BUSINESS",
          entityId: id,
          metadata: JSON.stringify({
            oldUrl: existing.googleReviewUrl,
            newUrl: data.googleReviewUrl,
            businessName: existing.name,
          }),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "BUSINESS_UPDATED",
        entityType: "BUSINESS",
        entityId: id,
        metadata: JSON.stringify({ updatedFields: Object.keys(data) }),
      },
    });

    return NextResponse.json({ business: updated });
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
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
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  try {
    // Unassign cards associated with this business before deletion
    await prisma.card.updateMany({
      where: { businessId: id },
      data: {
        status: "UNASSIGNED",
        businessId: null,
      },
    });

    // Delete business
    await prisma.business.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "BUSINESS_DELETED",
        entityType: "BUSINESS",
        entityId: id,
        metadata: JSON.stringify({ name: business.name }),
      },
    });

    return NextResponse.json({ success: true, message: "Business deleted" });
  } catch (error) {
    console.error("Delete business error:", error);
    return NextResponse.json({ error: "Failed to delete business" }, { status: 500 });
  }
}
