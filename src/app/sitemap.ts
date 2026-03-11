import type { MetadataRoute } from "next";

type Product = {
  _id: string;
  isActive?: boolean;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://www.synister.shop";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/clothes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/register`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/checkout`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const res = await fetch("https://synister-backend.onrender.com/products", {
      // Keep it fresh but cacheable for crawlers/build.
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) return staticRoutes;

    const products = (await res.json()) as Product[];
    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p && p._id && p.isActive !== false)
      .map((p) => ({
        url: `${siteUrl}/clothes/${p._id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}


