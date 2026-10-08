import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessId,
      cardId,
      rating,
      tags,
      feedback,
      customerName,
      customerPhone,
    } = body;

    if (!businessId || typeof businessId !== "string") {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    if (!feedback || typeof feedback !== "string" || feedback.trim().length === 0) {
      return NextResponse.json({ error: "Feedback message is required" }, { status: 400 });
    }

    const numericRating = Number(rating) || 1;

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const created = await prisma.privateFeedback.create({
      data: {
        businessId,
        cardId: cardId || null,
        rating: Math.min(Math.max(numericRating, 1), 5),
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags || null,
        feedback: feedback.trim().substring(0, 1000),
        customerName: customerName ? String(customerName).trim().substring(0, 100) : null,
        customerPhone: customerPhone ? String(customerPhone).trim().substring(0, 50) : null,
        status: "UNREAD",
      },
    });

    return NextResponse.json({
      success: true,
      id: created.id,
      message: "Private feedback recorded successfully",
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  try {
    let whereClause: any = {};

    if (user.role !== "ADMIN") {
      // Ensure business belongs to user
      const userBusinesses = await prisma.business.findMany({
        where: { ownerId: user.id },
        select: { id: true },
      });
      const allowedIds = userBusinesses.map((b) => b.id);
      if (businessId && !allowedIds.includes(businessId)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
      whereClause.businessId = businessId ? businessId : { in: allowedIds };
    } else if (businessId) {
      whereClause.businessId = businessId;
    }

    const feedbacks = await prisma.privateFeedback.findMany({
      where: whereClause,
      include: {
        business: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error("Get feedback error:", error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
