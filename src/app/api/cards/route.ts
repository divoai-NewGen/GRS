import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generatePublicToken } from "@/lib/security";
import { cardCreateBatchSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";
  const businessId = searchParams.get("businessId") || "";
  const sort = searchParams.get("sort") || "newest";

  const where: any = {};

  // If business owner, restrict to cards assigned to their businesses
  if (user.role !== "ADMIN") {
    const userBusinesses = await prisma.business.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });
    const businessIds = userBusinesses.map((b) => b.id);
    where.businessId = { in: businessIds };
  } else if (businessId) {
    where.businessId = businessId;
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { cardCode: { contains: search } },
      { label: { contains: search } },
      { business: { name: { contains: search } } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  else if (sort === "code_asc") orderBy = { cardCode: "asc" };
  else if (sort === "code_desc") orderBy = { cardCode: "desc" };

  const cards = await prisma.card.findMany({
    where,
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          googleReviewUrl: true,
        },
      },
      _count: {
        select: { scans: true },
      },
    },
    orderBy,
  });

  // If sorting by scans (calculated via relation count in memory)
  if (sort === "most_scans") {
    cards.sort((a, b) => b._count.scans - a._count.scans);
  } else if (sort === "least_scans") {
    cards.sort((a, b) => a._count.scans - b._count.scans);
  }

  return NextResponse.json({ cards });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = cardCreateBatchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const { count, prefix: inputPrefix, labelPrefix, startNumber: requestedStart, digits: requestedDigits } = result.data;

    // Smart extraction of prefix, start number, and padding digits
    let raw = (inputPrefix || "CARD").trim().toUpperCase();
    // Normalize typos where letter O was used instead of number 0 (e.g. "OO1" -> "001")
    raw = raw.replace(/^O+(?=\d)/, "0").replace(/O(?=\d)/g, "0");

    let prefix = "CARD";
    let startNumber = requestedStart;
    let digits = requestedDigits || 3;

    if (/^\d+$/.test(raw)) {
      // Input was purely numbers, e.g. "001" or "1"
      prefix = "CARD";
      if (startNumber === undefined) {
        startNumber = parseInt(raw, 10);
      }
      if (!requestedDigits) {
        digits = Math.max(3, raw.length);
      }
    } else {
      // Input has prefix with optional trailing numbers, e.g. "CARD001"
      const match = raw.match(/^([A-Z\-_]+?)(\d+)$/);
      if (match) {
        prefix = match[1];
        if (startNumber === undefined) {
          startNumber = parseInt(match[2], 10);
        }
        if (!requestedDigits) {
          digits = Math.max(3, match[2].length);
        }
      } else {
        prefix = raw;
      }
    }

    // Determine highest sequential number for this prefix
    const existingCards = await prisma.card.findMany({
      where: {
        cardCode: { startsWith: prefix },
      },
      select: { cardCode: true },
    });

    let currentStart = startNumber;
    if (currentStart === undefined) {
      let maxNum = 0;
      const regex = new RegExp(`^${prefix}(\\d+)$`, "i");
      for (const c of existingCards) {
        const match = c.cardCode.match(regex);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      currentStart = maxNum + 1;
    }

    // Set of existing cardCodes to prevent any collision
    const existingCodeSet = new Set(existingCards.map((c) => c.cardCode.toUpperCase()));

    // Generate batch of cards
    const createdCards = [];
    let curNum = currentStart;

    for (let i = 0; i < count; i++) {
      // Skip any existing codes
      while (existingCodeSet.has(`${prefix}${curNum.toString().padStart(digits, "0")}`)) {
        curNum++;
      }

      const cardNum = curNum.toString().padStart(digits, "0");
      const cardCode = `${prefix}${cardNum}`;
      existingCodeSet.add(cardCode);
      curNum++;

      // Ensure public token is unique and unpredictable
      let publicToken = generatePublicToken(8);
      while (await prisma.card.findUnique({ where: { publicToken } })) {
        publicToken = generatePublicToken(8);
      }

      const card = await prisma.card.create({
        data: {
          cardCode,
          publicToken,
          status: "UNASSIGNED",
          label: labelPrefix ? `${labelPrefix} #${cardNum}` : `Card ${cardCode}`,
        },
      });

      createdCards.push(card);
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARD_CREATED",
        entityType: "CARD",
        metadata: JSON.stringify({
          batchCount: count,
          prefix,
          startCode: createdCards[0]?.cardCode,
          endCode: createdCards[createdCards.length - 1]?.cardCode,
        }),
      },
    });

    return NextResponse.json(
      { success: true, count: createdCards.length, cards: createdCards },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create cards error:", error);
    return NextResponse.json({ error: "Failed to generate cards" }, { status: 500 });
  }
}
