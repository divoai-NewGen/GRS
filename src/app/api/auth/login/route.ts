import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, hashIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const ipHash = hashIp(rawIp);

    // Rate limit auth requests to 10 per minute per IP
    const rateLimit = checkRateLimit(`auth_${ipHash}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: ((result.error as any).issues?.[0]?.message || (result.error as any).errors?.[0]?.message) || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, role } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Dynamic Environment-Configured Admin Authentication
    // Seamlessly reads from .env whenever credentials are submitted
    const envAdminEmail = (process.env.ADMIN_EMAIL || "growbroo.info@gmail.com").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "GrowBroo@info2060";

    // If user clicked "Business Owner" tab but typed Admin credentials, give helpful guidance
    if (role === "BUSINESS_OWNER" && normalizedEmail === envAdminEmail) {
      return NextResponse.json(
        {
          error:
            "Yeh Platform Administrator account hai! Kripya 'Sign in as Admin' tab select karein ya Admin dwara create ki gayi Business Owner ID enter karein.",
        },
        { status: 400 }
      );
    }

    if (normalizedEmail === envAdminEmail) {
      if (password !== envAdminPassword) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // Ensure Admin user exists in DB with role ADMIN
      let adminUser = await prisma.user.findUnique({
        where: { email: envAdminEmail },
      });

      if (!adminUser) {
        const passwordHash = await hashPassword(envAdminPassword);
        adminUser = await prisma.user.create({
          data: {
            name: "GrowBroo Admin",
            email: envAdminEmail,
            passwordHash,
            role: "ADMIN",
          },
        });
      } else if (adminUser.role !== "ADMIN") {
        adminUser = await prisma.user.update({
          where: { id: adminUser.id },
          data: { role: "ADMIN" },
        });
      }

      const token = await createSessionToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: "ADMIN",
        name: adminUser.name,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: "ADMIN",
          businesses: [],
        },
      });

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // 2. Standard Database Authentication for Business Owners
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        businesses: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (role === "ADMIN" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Yeh Business Owner account hai! Kripya 'Business Owner' tab select karke login karein.",
        },
        { status: 400 }
      );
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as "ADMIN" | "BUSINESS_OWNER",
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businesses: user.businesses,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
