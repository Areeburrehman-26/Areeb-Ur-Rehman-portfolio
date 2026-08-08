import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Not content — no reason for a crawler to index the mail-sending route.
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
