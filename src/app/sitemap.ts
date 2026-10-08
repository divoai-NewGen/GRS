import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://revioqr.com";

  return [
    {
      url: baseUrl,
      lastModified: "2026-10-07",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: "2026-10-07",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
