import crypto from "crypto";

// Hash IP address with a salt for privacy compliance (GDPR/privacy-friendly)
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || "revio-salt-ip";
  return crypto.createHmac("sha256", salt).update(ip).digest("hex").substring(0, 32);
}

// Generate unpredictable public token for card QR URL (e.g. 8 chars alphanumeric base62)
export function generatePublicToken(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

// Parse device, browser, and OS from User-Agent string
export function parseUserAgent(ua: string | null) {
  if (!ua) {
    return {
      deviceType: "Unknown",
      browser: "Unknown",
      os: "Unknown",
    };
  }

  // Device
  let deviceType = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    deviceType = "Mobile";
  } else if (/bot|crawler|spider|crawling/i.test(ua)) {
    deviceType = "Bot";
  }

  // OS
  let os = "Other";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Opera|OPR\//i.test(ua)) browser = "Opera";

  return { deviceType, browser, os };
}

// In-memory sliding-window rate limiter (for abuse protection on redirects & auth)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(key: string, maxRequests: number = 30, windowMs: number = 60000): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

// Strictly validate redirect URL (Open Redirect protection)
export function isValidReviewUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    // Must be http or https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // Cannot contain javascript: or data: or file:
    return true;
  } catch {
    return false;
  }
}
