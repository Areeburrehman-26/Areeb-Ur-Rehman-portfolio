import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * This is a single-page site: `src/app/page.tsx` is the only route.
 * The `#work` / `#systems` / `#about` / `#contact` nav links are in-page
 * anchors, not separate routes, so they do not get their own sitemap entries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
