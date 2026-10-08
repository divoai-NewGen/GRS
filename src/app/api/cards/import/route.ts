import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generatePublicToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const { cardCodes, defaultLabel } = await request.json();

    if (!Array.isArray(cardCodes) || cardCodes.length === 0) {
      return NextResponse.json(
        { error: "Please provide an array of card codes to import" },
        { status: 400 }
      );
    }

    // Clean and validate codes
    const cleanedCodes: string[] = [];
    const duplicatesInPayload = new Set<string>();
    const seen = new Set<string>();

    for (const code of cardCodes) {
      const clean = typeof code === "string" ? code.trim().toUpperCase() : "";
      if (!clean) continue;
      if (seen.has(clean)) {
        duplicatesInPayload.add(clean);
      } else {
        seen.add(clean);
        cleanedCodes.push(clean);
      }
    }

    if (cleanedCodes.length === 0) {
      return NextResponse.json({ error: "No valid card codes found in input" }, { status: 400 });
    }

    // Check for existing duplicates in the database
    const existingCards = await prisma.card.findMany({
      where: { cardCode: { in: cleanedCodes } },
      select: { cardCode: true },
    });

    const existingInDb = existingCards.map((c) => c.cardCode);

    // Filter out cards that already exist
    const cardsToCreate = cleanedCodes.filter((code) => !existingInDb.includes(code));

    if (cardsToCreate.length === 0) {
      return NextResponse.json(
        {
          error: "All provided card codes already exist in the database",
          existingDuplicates: existingInDb,
        },
        { status: 409 }
      );
    }

    const created = [];
    for (const cardCode of cardsToCreate) {
      let publicToken = generatePublicToken(8);
      while (await prisma.card.findUnique({ where: { publicToken } })) {
        publicToken = generatePublicToken(8);
      }

      const newCard = await prisma.card.create({
        data: {
          cardCode,
          publicToken,
          status: "UNASSIGNED",
          label: defaultLabel ? `${defaultLabel} (${cardCode})` : `Imported ${cardCode}`,
        },
      });
      created.push(newCard);
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CARDS_IMPORTED",
        entityType: "CARD",
        metadata: JSON.stringify({
          importedCount: created.length,
          skippedExisting: existingInDb.length,
          existingInDb,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      importedCount: created.length,
      skippedCount: existingInDb.length,
      skippedCodes: existingInDb,
    });
  } catch (error) {
    console.error("Card import error:", error);
    return NextResponse.json({ error: "Failed to import cards" }, { status: 500 });
  }
}
