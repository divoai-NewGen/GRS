import { NextRequest, NextResponse } from "next/server";
import { prisma as defaultPrisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = (defaultPrisma as any).inquiry ? defaultPrisma : new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { status } = await request.json();
    if (!["NEW", "CONTACTED", "CONVERTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    let updated: any;
    if ((prisma as any).inquiry?.update) {
      updated = await (prisma as any).inquiry.update({
        where: { id },
        data: { status },
      });
    } else {
      const now = new Date().toISOString();
      await (prisma as any).$executeRawUnsafe(
        `UPDATE Inquiry SET status = ?, updatedAt = ? WHERE id = ?`,
        status,
        now,
        id
      );
      updated = { id, status };
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    if ((prisma as any).inquiry?.delete) {
      await (prisma as any).inquiry.delete({ where: { id } });
    } else {
      await (prisma as any).$executeRawUnsafe(`DELETE FROM Inquiry WHERE id = ?`, id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
