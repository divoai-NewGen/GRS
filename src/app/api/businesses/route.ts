import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { businessSchema } from "@/lib/validation";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";

  // Role check: If not admin, only show businesses owned by this user
  const where: any = {};
  if (user.role !== "ADMIN") {
    where.ownerId = user.id;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { city: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (type) {
    where.businessType = type;
  }

  if (status) {
    where.status = status;
  }

  const businesses = await prisma.business.findMany({
    where,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: {
          cards: true,
          scans: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ businesses });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = businessSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Generate unique slug
    let baseSlug = generateSlug(data.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const business = await prisma.business.create({
      data: {
        name: data.name,
        slug: uniqueSlug,
        businessType: data.businessType,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        googleBusinessName: data.googleBusinessName || null,
        googleReviewUrl: data.googleReviewUrl,
        status: data.status,
        planType: data.planType || "BASIC",
        customTags: data.customTags || null,
        recommendedReviews: data.recommendedReviews || null,
        negativeFeedbackFilter: data.negativeFeedbackFilter ?? true,
        ownerId: data.ownerId || null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "BUSINESS_CREATED",
        entityType: "BUSINESS",
        entityId: business.id,
        metadata: JSON.stringify({
          name: business.name,
          slug: business.slug,
          googleReviewUrl: business.googleReviewUrl,
        }),
      },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error("Create business error:", error);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}
