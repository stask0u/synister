import type { MetadataRoute } from "next";

type Product = {
  _id: string;
  slug?: string;
  isActive?: boolean;
  updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://www.synister.shop";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/clothes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const res = await fetch("https://synister-backend.onrender.com/products", {
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) return staticRoutes;

    const products = (await res.json()) as Product[];
    const productRoutes: MetadataRoute.Sitemap = products
        .filter((p) => p && p._id && p.isActive !== false)
        .map((p) => ({
          url: `${siteUrl}/clothes/${p.slug ?? p._id}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}