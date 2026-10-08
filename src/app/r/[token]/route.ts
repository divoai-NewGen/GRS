import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIp, parseUserAgent, checkRateLimit, isValidReviewUrl } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || typeof token !== "string" || token.length < 3 || token.length > 64) {
    return NextResponse.redirect(new URL("/r/status?reason=not_found", request.url), 307);
  }

  // Get client details for rate limiting & analytics
  const forwardedFor = request.headers.get("x-forwarded-for");
  const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const ipHash = hashIp(rawIp);
  const userAgent = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || null;

  // Rate limiting per hashed IP to protect against bot floods (30 scans per minute)
  const rateLimit = checkRateLimit(`scan_${ipHash}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.redirect(new URL("/r/status?reason=rate_limited", request.url), 307);
  }

  try {
    // 1. Look up card by publicToken
    const card = await prisma.card.findUnique({
      where: { publicToken: token },
      include: {
        business: true,
      },
    });

    // 2. Card not found
    if (!card) {
      return NextResponse.redirect(new URL("/r/status?reason=not_found", request.url), 307);
    }

    // 3. Card is disabled
    if (card.status === "DISABLED") {
      return NextResponse.redirect(new URL("/r/status?reason=disabled", request.url), 307);
    }

    // 4. Card is unassigned or has no business
    if (card.status === "UNASSIGNED" || !card.businessId || !card.business) {
      return NextResponse.redirect(new URL("/r/status?reason=unassigned", request.url), 307);
    }

    // 5. Business is inactive
    if (card.business.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/r/status?reason=business_inactive", request.url), 307);
    }

    // 6. Validate destination URL (Open Redirect protection)
    const destinationUrl = card.business.googleReviewUrl;
    if (!destinationUrl || !isValidReviewUrl(destinationUrl)) {
      return NextResponse.redirect(new URL("/r/status?reason=invalid_destination", request.url), 307);
    }

    // 7. Parse UA and record scan telemetry
    const parsedUa = parseUserAgent(userAgent);

    // Record scan in database
    await prisma.scan.create({
      data: {
        cardId: card.id,
        businessId: card.business.id,
        ipHash,
        userAgent: userAgent.substring(0, 500),
        deviceType: parsedUa.deviceType,
        browser: parsedUa.browser,
        os: parsedUa.os,
        referrer: referrer ? referrer.substring(0, 500) : null,
      },
    });

    // 8. Plan Routing:
    // PREMIUM: Route to Smart Review Assistant (Tags, 1-Click Copy & Negative Feedback Filter)
    // BASIC: Instant direct 307 redirect to Google Review Page
    if (card.business.planType === "PREMIUM") {
      return NextResponse.redirect(new URL(`/review/${token}`, request.url), {
        status: 307,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    // Default BASIC: Direct redirect to Google Reviews
    return NextResponse.redirect(destinationUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error in dynamic QR redirect:", error);
    return NextResponse.redirect(new URL("/r/status?reason=error", request.url), 307);
  }
}
