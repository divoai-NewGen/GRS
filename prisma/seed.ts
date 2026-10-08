import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashIp(ip: string): string {
  return crypto.createHmac("sha256", "seed-salt").update(ip).digest("hex").substring(0, 32);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.scan.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.card.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();
  await prisma.appSetting.deleteMany();

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const ownerPasswordHash = await bcrypt.hash("owner123", 10);

  // Users
  const admin = await prisma.user.create({
    data: {
      name: "Shahbaz Admin",
      email: "admin@revio.app",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "owner@royalsalon.com",
      passwordHash: ownerPasswordHash,
      role: "BUSINESS_OWNER",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Michael Chang",
      email: "owner@foodhub.com",
      passwordHash: ownerPasswordHash,
      role: "BUSINESS_OWNER",
    },
  });

  // Businesses
  const royalSalon = await prisma.business.create({
    data: {
      name: "Royal Salon",
      slug: "royal-salon",
      businessType: "SALON",
      description: "Premium hair and beauty styling salon.",
      logoUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80",
      phone: "+1 (555) 234-5678",
      email: "contact@royalsalon.com",
      website: "https://royalsalon.example.com",
      address: "124 Fashion Ave",
      city: "New York",
      state: "NY",
      country: "USA",
      googleBusinessName: "Royal Salon New York",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      status: "ACTIVE",
      ownerId: owner1.id,
    },
  });

  const foodHub = await prisma.business.create({
    data: {
      name: "Food Hub Restaurant",
      slug: "food-hub",
      businessType: "RESTAURANT",
      description: "Artisanal farm-to-table cuisine and craft drinks.",
      logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
      phone: "+1 (555) 876-5432",
      email: "hello@foodhub.example.com",
      website: "https://foodhub.example.com",
      address: "88 Culinary Blvd",
      city: "Chicago",
      state: "IL",
      country: "USA",
      googleBusinessName: "Food Hub Chicago",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
      status: "ACTIVE",
      ownerId: owner2.id,
    },
  });

  const urbanCafe = await prisma.business.create({
    data: {
      name: "Urban Cafe",
      slug: "urban-cafe",
      businessType: "CAFE",
      description: "Specialty coffee roastery and fresh bakery pastries.",
      logoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80",
      phone: "+1 (555) 432-1098",
      email: "info@urbancafe.example.com",
      website: "https://urbancafe.example.com",
      address: "312 Roasted Way",
      city: "Seattle",
      state: "WA",
      country: "USA",
      googleBusinessName: "Urban Cafe Seattle",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ123_demo_cafe_placeid",
      status: "ACTIVE",
    },
  });

  // Cards
  const card1 = await prisma.card.create({
    data: {
      cardCode: "CARD0001",
      publicToken: "Rv9K2xQa",
      status: "ASSIGNED",
      businessId: royalSalon.id,
      label: "Front Desk Checkout",
      assignedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
    },
  });

  const card2 = await prisma.card.create({
    data: {
      cardCode: "CARD0002",
      publicToken: "Lm8W3pZc",
      status: "ASSIGNED",
      businessId: royalSalon.id,
      label: "VIP Station #2",
      assignedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000),
    },
  });

  const card3 = await prisma.card.create({
    data: {
      cardCode: "CARD0003",
      publicToken: "Bk4N7yTb",
      status: "ASSIGNED",
      businessId: foodHub.id,
      label: "Host Stand Entry",
      assignedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
    },
  });

  const card4 = await prisma.card.create({
    data: {
      cardCode: "CARD0004",
      publicToken: "Tx1P9eWq",
      status: "ASSIGNED",
      businessId: urbanCafe.id,
      label: "Espresso Pickup Bar",
      assignedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
    },
  });

  await prisma.card.create({
    data: {
      cardCode: "CARD0005",
      publicToken: "Un5R8vKl",
      status: "UNASSIGNED",
      label: "Pre-printed Batch A #5",
    },
  });

  await prisma.card.create({
    data: {
      cardCode: "CARD0006",
      publicToken: "Qx3M2jPo",
      status: "UNASSIGNED",
      label: "Pre-printed Batch A #6",
    },
  });

  await prisma.card.create({
    data: {
      cardCode: "CARD0007",
      publicToken: "Ds9Y4tVn",
      status: "DISABLED",
      label: "Damaged Card Returned",
      deactivatedAt: new Date(),
    },
  });

  // Seed realistic scan telemetry
  const devices = [
    { deviceType: "Mobile", os: "iOS", browser: "Safari" },
    { deviceType: "Mobile", os: "Android", browser: "Chrome" },
    { deviceType: "Mobile", os: "iOS", browser: "Chrome" },
    { deviceType: "Desktop", os: "Windows", browser: "Chrome" },
    { deviceType: "Desktop", os: "macOS", browser: "Safari" },
  ];

  const now = Date.now();
  const scanData: Array<{
    cardId: string;
    businessId: string;
    scannedAt: Date;
    ipHash: string;
    deviceType: string;
    os: string;
    browser: string;
    city: string;
    country: string;
  }> = [];

  // Generate scans over the last 14 days
  for (let day = 13; day >= 0; day--) {
    const dayDate = new Date(now - day * 24 * 3600 * 1000);
    // 3 to 12 scans per day
    const count = 3 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const dev = devices[Math.floor(Math.random() * devices.length)];
      const targetCard = [card1, card2, card3, card4][Math.floor(Math.random() * 4)];
      scanData.push({
        cardId: targetCard.id,
        businessId: targetCard.businessId!,
        scannedAt: new Date(dayDate.getTime() + Math.random() * 86400000),
        ipHash: hashIp(`192.168.${day}.${i}`),
        deviceType: dev.deviceType,
        os: dev.os,
        browser: dev.browser,
        city: ["New York", "Chicago", "Seattle", "Austin", "San Francisco"][Math.floor(Math.random() * 5)],
        country: "USA",
      });
    }
  }

  for (const scan of scanData) {
    await prisma.scan.create({ data: scan });
  }

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: "BUSINESS_CREATED",
        entityType: "BUSINESS",
        entityId: royalSalon.id,
        metadata: JSON.stringify({ name: "Royal Salon", slug: "royal-salon" }),
        createdAt: new Date(now - 30 * 24 * 3600 * 1000),
      },
      {
        userId: admin.id,
        action: "CARD_ASSIGNED",
        entityType: "CARD",
        entityId: card1.id,
        metadata: JSON.stringify({ cardCode: "CARD0001", business: "Royal Salon" }),
        createdAt: new Date(now - 30 * 24 * 3600 * 1000),
      },
      {
        userId: admin.id,
        action: "CARD_ASSIGNED",
        entityType: "CARD",
        entityId: card2.id,
        metadata: JSON.stringify({ cardCode: "CARD0002", business: "Royal Salon" }),
        createdAt: new Date(now - 20 * 24 * 3600 * 1000),
      },
      {
        userId: admin.id,
        action: "CARD_ASSIGNED",
        entityType: "CARD",
        entityId: card3.id,
        metadata: JSON.stringify({ cardCode: "CARD0003", business: "Food Hub Restaurant" }),
        createdAt: new Date(now - 15 * 24 * 3600 * 1000),
      },
    ],
  });

  // Settings
  await prisma.appSetting.create({
    data: {
      id: "default",
      brandName: "GrowBroo",
      domain: "growbroo.com",
      supportEmail: "support@growbroo.com",
      primaryColor: "#006B21",
      secondaryColor: "#10251A",
      defaultCardText: "Scan to share your honest feedback",
      dataRetentionDays: 365,
      rateLimitPerMinute: 60,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`   Admin: admin@revio.app / admin123`);
  console.log(`   Owner: owner@royalsalon.com / owner123`);
  console.log(`   Total cards: 7, Total businesses: 3, Total scans: ${scanData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
