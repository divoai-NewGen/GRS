import { NextRequest, NextResponse } from "next/server";
import { prisma as defaultPrisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const prisma = (defaultPrisma as any).inquiry ? defaultPrisma : new PrismaClient();

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(6, "Valid phone number required"),
  email: z.string().email("Valid email address required"),
  businessName: z.string().optional().nullable(),
  plan: z.enum(["BASIC", "PREMIUM"]).default("BASIC"),
  message: z.string().max(1000).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const data = result.data;

    let inquiry: any;
    if ((prisma as any).inquiry?.create) {
      inquiry = await (prisma as any).inquiry.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email.toLowerCase().trim(),
          businessName: data.businessName || null,
          plan: data.plan,
          message: data.message || null,
          status: "NEW",
        },
      });
    } else {
      const id = "inq_" + Math.random().toString(36).substring(2, 12);
      const now = new Date().toISOString();
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO Inquiry (id, name, phone, email, businessName, plan, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        data.name,
        data.phone,
        data.email.toLowerCase().trim(),
        data.businessName || null,
        data.plan,
        data.message || null,
        "NEW",
        now,
        now
      );
      inquiry = {
        id,
        name: data.name,
        phone: data.phone,
        email: data.email.toLowerCase().trim(),
        businessName: data.businessName,
        plan: data.plan,
        message: data.message,
        status: "NEW",
        createdAt: now,
      };
    }

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let inquiries: any[] = [];
    if ((prisma as any).inquiry?.findMany) {
      const where: any = {};
      if (status) where.status = status;
      inquiries = await (prisma as any).inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } else {
      if (status) {
        inquiries = await (prisma as any).$queryRawUnsafe(
          `SELECT * FROM Inquiry WHERE status = ? ORDER BY createdAt DESC`,
          status
        );
      } else {
        inquiries = await (prisma as any).$queryRawUnsafe(
          `SELECT * FROM Inquiry ORDER BY createdAt DESC`
        );
      }
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Get inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
