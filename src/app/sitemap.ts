import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { EVENTS } from "@/lib/events-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mission`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/membership`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/events`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/donate`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = EVENTS.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}
