import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  // 1. Fetch all products to generate dynamic URLs
  // Using direct DB access for build-time/ISR performance
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const productUrls = allProducts.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.createdAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 2. Add static pages
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...productUrls,
  ];
}
