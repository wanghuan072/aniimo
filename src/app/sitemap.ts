import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { aniimo, databaseCategories, guides } from "@/lib/data";
import { aniimoTdk, categoryTdk, guideTdk, tdk } from "@/seo/tdk";

const staticEntries = [tdk.home, tdk.aniimo, tdk.database, tdk.tierList, tdk.globalVote, tdk.map, tdk.teamBuilder, tdk.teamTemplates, tdk.guides, tdk.tools, tdk.compare, tdk.collectionTracker, tdk.updates, tdk.howItWorks, tdk.privacy, tdk.terms, tdk.copyright, tdk.about, tdk.contact];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticEntries.map((entry) => ({ url: new URL(entry.pathname, siteConfig.url).toString(), lastModified: entry.lastModified, changeFrequency: entry.pathname === "/" ? "weekly" as const : "monthly" as const, priority: entry.pathname === "/" ? 1 : .7 })),
    ...aniimo.map((entry) => { const seo = aniimoTdk(entry); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, changeFrequency: "monthly" as const, priority: .75, images: [new URL(entry.image, siteConfig.url).toString()] }; }),
    ...guides.map((guide) => { const seo = guideTdk(guide); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, changeFrequency: "monthly" as const, priority: .7 }; }),
    ...databaseCategories.filter((category) => category.status !== "tracking").map((category) => { const seo = categoryTdk(category); return { url: new URL(seo.pathname, siteConfig.url).toString(), lastModified: seo.lastModified, changeFrequency: "monthly" as const, priority: .65 }; }),
  ];
}
