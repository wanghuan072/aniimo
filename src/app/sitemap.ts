import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { aniimo, databaseCategories, guides } from "@/lib/data";
import { aniimoTdk, categoryTdk, guideTdk, tdk } from "@/seo/tdk";

const staticEntries = [tdk.home, tdk.aniimo, tdk.database, tdk.tierList, tdk.globalVote, tdk.map, tdk.teamBuilder, tdk.teamTemplates, tdk.guides, tdk.tools, tdk.typeChart, tdk.compare, tdk.collectionTracker, tdk.updates, tdk.howItWorks, tdk.privacy, tdk.terms, tdk.copyright, tdk.about, tdk.contact];

function sitemapFields(pathname: string) {
  if (pathname === "/") return { changeFrequency: "weekly" as const, priority: 1 };
  if (["/aniimo", "/database", "/map", "/guides", "/tier-list", "/team-builder", "/tools"].includes(pathname)) {
    return { changeFrequency: "weekly" as const, priority: 0.8 };
  }
  if (pathname.startsWith("/aniimo/") || pathname.startsWith("/guides/") || pathname.startsWith("/database/")) {
    return { changeFrequency: "monthly" as const, priority: 0.7 };
  }
  return { changeFrequency: "monthly" as const, priority: 0.5 };
}

export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticEntries.map((entry) => ({ url: new URL(entry.pathname, siteConfig.url).toString(), lastModified: entry.lastModified, ...sitemapFields(entry.pathname) })),
    ...aniimo.map((entry) => { const seo = aniimoTdk(entry); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, ...sitemapFields(seo.pathname) }; }),
    ...guides.map((guide) => { const seo = guideTdk(guide); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, ...sitemapFields(seo.pathname) }; }),
    ...databaseCategories.filter((category) => category.status !== "tracking").map((category) => { const seo = categoryTdk(category); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, ...sitemapFields(seo.pathname) }; }),
  ];
}
