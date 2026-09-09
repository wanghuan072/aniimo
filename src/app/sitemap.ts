import type { MetadataRoute } from "next";
import aniimoData from "@/data/game/aniimo.json";
import databaseData from "@/data/editorial/database.json";
import guidesData from "@/data/editorial/guides.json";
import { siteConfig } from "@/config/site";
import { tdk } from "@/seo/tdk";

const rosterSynced = aniimoData.source.syncedAt;
const staticEntries = [
  tdk.home,
  tdk.aniimo,
  tdk.database,
  tdk.tierList,
  tdk.globalVote,
  tdk.map,
  tdk.teamBuilder,
  tdk.teamTemplates,
  tdk.guides,
  tdk.tools,
  tdk.typeChart,
  tdk.compare,
  tdk.collectionTracker,
  tdk.updates,
  tdk.howItWorks,
  tdk.privacy,
  tdk.terms,
  tdk.copyright,
  tdk.about,
  tdk.contact,
];

function loc(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

function sitemapFields(pathname: string): Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> {
  if (pathname === "/") return { changeFrequency: "weekly", priority: 1 };
  if (["/aniimo", "/database", "/map", "/guides", "/tier-list", "/team-builder", "/tools"].includes(pathname)) {
    return { changeFrequency: "weekly", priority: 0.8 };
  }
  if (pathname.startsWith("/aniimo/") || pathname.startsWith("/guides/") || pathname.startsWith("/database/")) {
    return { changeFrequency: "monthly", priority: 0.7 };
  }
  return { changeFrequency: "monthly", priority: 0.5 };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticEntries.map((entry) => ({
      url: loc(entry.pathname),
      lastModified: entry.lastModified,
      ...sitemapFields(entry.pathname),
    })),
    ...(aniimoData.entries as Array<{ slug: string }>).map((entry) => {
      const pathname = `/aniimo/${entry.slug}`;
      return { url: loc(pathname), lastModified: rosterSynced, ...sitemapFields(pathname) };
    }),
    ...(guidesData as Array<{ slug: string; updated: string }>).map((guide) => {
      const pathname = `/guides/${guide.slug}`;
      return { url: loc(pathname), lastModified: guide.updated, ...sitemapFields(pathname) };
    }),
    ...(databaseData as Array<{ slug: string; status: string }>)
      .filter((category) => category.status !== "tracking")
      .map((category) => {
        const pathname = `/database/${category.slug}`;
        return { url: loc(pathname), lastModified: rosterSynced, ...sitemapFields(pathname) };
      }),
  ];
}
