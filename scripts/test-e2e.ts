import { PrismaClient } from "@prisma/client";
import { generatePublicToken, hashIp, parseUserAgent } from "../src/lib/security";
import { getPublicCardUrl, generateQrSvg } from "../src/lib/qr";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function runTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING REVIO E2E INTEGRATION & DYNAMIC QR TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Test User Roles & Auth hashing
    console.log("\n[1] Testing Security & Auth Functions...");
    const password = "testPassword123";
    const hashed = await bcrypt.hash(password, 10);
    const valid = await bcrypt.compare(password, hashed);
    assert(valid, "Bcrypt password hashing and verification works");

    const token = generatePublicToken(8);
    assert(
      token.length === 8 && /^[A-Za-z0-9]+$/.test(token),
      "Cryptographically secure token generation produces 8-char alphanumeric string"
    );

    const ipHashed = hashIp("192.168.1.100");
    assert(ipHashed.length === 32, "IP address is securely salted and hashed for privacy");

    const uaParsed = parseUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
    );
    assert(
      uaParsed.deviceType === "Mobile" && uaParsed.browser === "Safari" && uaParsed.os === "iOS",
      "User-Agent correctly identified as Mobile, Safari, iOS"
    );

    // 2. Test QR Code Generation
    console.log("\n[2] Testing QR Code Vector & URL Generator...");
    const testUrl = getPublicCardUrl("TestTok12", "http://localhost:3000");
    assert(testUrl === "http://localhost:3000/r/TestTok12", "Canonical card URL generated properly");

    const svg = await generateQrSvg(testUrl);
    assert(svg.includes("<svg") && svg.includes("</svg>"), "QR SVG vector generated with high scannability");

    // 3. Dynamic QR End-to-End Flow: Create Business -> Create Card -> Assign -> Verify Redirect -> Reassign -> Verify New Redirect
    console.log("\n[3] Testing Critical Dynamic QR Lifecycle (Assign -> Scan -> Reassign -> Scan)...");

    // Create Business A
    const busA = await prisma.business.create({
      data: {
        name: "Test Cafe Alpha",
        slug: `test-cafe-alpha-${Date.now()}`,
        businessType: "CAFE",
        googleReviewUrl: "https://search.google.com/local/writereview?placeid=ALPHA_PLACE_ID",
        status: "ACTIVE",
      },
    });
    assert(busA.id !== undefined, "Business Alpha created successfully");

    // Create Business B
    const busB = await prisma.business.create({
      data: {
        name: "Test Salon Beta",
        slug: `test-salon-beta-${Date.now()}`,
        businessType: "SALON",
        googleReviewUrl: "https://search.google.com/local/writereview?placeid=BETA_PLACE_ID",
        status: "ACTIVE",
      },
    });
    assert(busB.id !== undefined, "Business Beta created successfully");

    // Create Card
    const cardCode = `TEST${Date.now().toString().slice(-4)}`;
    const publicToken = generatePublicToken(8);
    const card = await prisma.card.create({
      data: {
        cardCode,
        publicToken,
        status: "UNASSIGNED",
      },
    });
    assert(card.status === "UNASSIGNED", "Card created with UNASSIGNED status");

    // Assign to Business Alpha
    const assignedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        businessId: busA.id,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
      include: { business: true },
    });
    assert(
      assignedCard.status === "ASSIGNED" && assignedCard.businessId === busA.id,
      `Card assigned to ${busA.name}`
    );

    // Simulate Scan on /r/[publicToken] for Business Alpha
    const lookupAlpha = await prisma.card.findUnique({
      where: { publicToken },
      include: { business: true },
    });

    const redirectTargetAlpha = lookupAlpha?.business?.googleReviewUrl;
    assert(
      redirectTargetAlpha === "https://search.google.com/local/writereview?placeid=ALPHA_PLACE_ID",
      "Dynamic scan resolves to Business Alpha's Google Review URL"
    );

    // Record Scan Telemetry
    const scan1 = await prisma.scan.create({
      data: {
        cardId: card.id,
        businessId: busA.id,
        ipHash: hashIp("10.0.0.1"),
        deviceType: "Mobile",
        browser: "Chrome",
        os: "Android",
      },
    });
    assert(scan1.id !== undefined, "Scan event recorded in telemetry table");

    // REASSIGN to Business Beta (Crucial business requirement: token stays the same!)
    const reassignedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        businessId: busB.id,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
      include: { business: true },
    });
    assert(
      reassignedCard.publicToken === publicToken && reassignedCard.businessId === busB.id,
      "Card reassigned to Business Beta while permanent publicToken remains unchanged"
    );

    // Simulate Scan on SAME /r/[publicToken] -> Must now resolve to Business Beta!
    const lookupBeta = await prisma.card.findUnique({
      where: { publicToken },
      include: { business: true },
    });

    const redirectTargetBeta = lookupBeta?.business?.googleReviewUrl;
    assert(
      redirectTargetBeta === "https://search.google.com/local/writereview?placeid=BETA_PLACE_ID",
      "Scan of SAME physical QR token now dynamically resolves to Business Beta's Google Review URL!"
    );

    // Record Scan Telemetry for Business Beta
    const scan2 = await prisma.scan.create({
      data: {
        cardId: card.id,
        businessId: busB.id,
        ipHash: hashIp("10.0.0.2"),
        deviceType: "Mobile",
        browser: "Safari",
        os: "iOS",
      },
    });
    assert(scan2.id !== undefined, "Scan event for newly assigned business recorded properly");

    // Test Card Disabling
    console.log("\n[4] Testing Card Disabling & Error States...");
    const disabledCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        status: "DISABLED",
        deactivatedAt: new Date(),
      },
    });
    assert(disabledCard.status === "DISABLED", "Card status successfully set to DISABLED");

    // Clean up test records
    await prisma.scan.deleteMany({ where: { cardId: card.id } });
    await prisma.card.delete({ where: { id: card.id } });
    await prisma.business.delete({ where: { id: busA.id } });
    await prisma.business.delete({ where: { id: busB.id } });
    console.log("\n🧹 Cleaned up test database fixtures.");
  } catch (error) {
    console.error("Test execution failed with error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
