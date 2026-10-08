import { z } from "zod";

export const BusinessTypeEnum = z.enum([
  "SALON",
  "RESTAURANT",
  "CAFE",
  "HOTEL",
  "GYM",
  "CLINIC",
  "DENTIST",
  "RETAIL",
  "AUTO_SERVICE",
  "REAL_ESTATE",
  "OTHER",
]);

export const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(100),
  businessType: BusinessTypeEnum.default("OTHER"),
  description: z.string().max(500).optional().nullable(),
  logoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  googleBusinessName: z.string().max(150).optional().nullable(),
  googleReviewUrl: z
    .string()
    .url("A valid official Google review link is required")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "Must be a secure HTTP or HTTPS link"
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  planType: z.enum(["BASIC", "PREMIUM"]).default("BASIC"),
  customTags: z.string().optional().nullable(),
  recommendedReviews: z.string().optional().nullable(),
  negativeFeedbackFilter: z.boolean().default(true),
  ownerId: z.string().optional().nullable(),
});

export const cardCreateBatchSchema = z.object({
  count: z.number().int().min(1).max(500),
  prefix: z.string().max(15).optional().default("CARD"),
  startNumber: z.number().int().min(1).optional(),
  digits: z.number().int().min(1).max(8).optional().default(3),
  labelPrefix: z.string().max(50).optional(),
});

export const cardAssignSchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  label: z.string().max(100).optional(),
});

export const bulkAssignSchema = z.object({
  cardIds: z.array(z.string().min(1)).min(1, "Select at least one card"),
  businessId: z.string().min(1, "Business is required"),
});

export const bulkDeleteCardsSchema = z.object({
  cardIds: z.array(z.string().min(1)).min(1, "Select at least one card to delete"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "BUSINESS_OWNER"]).optional(),
});

export const settingsSchema = z.object({
  brandName: z.string().min(2).max(50),
  domain: z.string().min(3).max(100),
  supportEmail: z.string().email(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  defaultCardText: z.string().min(5).max(150),
  dataRetentionDays: z.number().int().min(30).max(1825),
  rateLimitPerMinute: z.number().int().min(10).max(300),
});

export function getZodErrorMessage(error: any): string {
  if (!error) return "Validation failed";
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0].message || "Validation failed";
  }
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0].message || "Validation failed";
  }
  return error.message || "Validation failed";
}
