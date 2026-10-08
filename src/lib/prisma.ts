import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Support Vercel serverless writable environment
if (process.env.VERCEL) {
  const tmpDb = "/tmp/dev.db";
  try {
    if (!fs.existsSync(tmpDb)) {
      const bundledDb = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(bundledDb)) {
        fs.copyFileSync(bundledDb, tmpDb);
      }
    }
    process.env.DATABASE_URL = `file:${tmpDb}`;
  } catch (err) {
    console.warn("Could not copy sqlite db to /tmp:", err);
  }
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
