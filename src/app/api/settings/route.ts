import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let settings = await prisma.appSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.appSetting.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await prisma.appSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        ...result.data,
      },
      update: {
        ...result.data,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SETTINGS_UPDATED",
        entityType: "SETTING",
        entityId: "default",
        metadata: JSON.stringify(result.data),
      },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
