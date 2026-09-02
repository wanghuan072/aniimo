import aniimoData from "@/data/game/aniimo.json";
import guidesData from "@/data/editorial/guides.json";
import databaseData from "@/data/editorial/database.json";
import locationsData from "@/data/editorial/locations.json";
import sourcesData from "@/data/research/sources.json";
import typeChartData from "@/data/research/type-chart.json";
import communityTierData from "@/data/research/community-tier-snapshot.json";
import officialVoteData from "@/data/research/official-vote-2026.json";
import communityDatabaseData from "@/data/research/community-database.json";
import type { Aniimo, AniimoFormRecord, DatabaseCategory, Guide, MapLocation } from "@/types/content";

const voteImageSlugs = new Set(officialVoteData.records.flatMap((record) => record.slug ? [record.slug] : []));
export const aniimo = aniimoData.entries.map((entry) => ({ ...entry, voteImage: voteImageSlugs.has(entry.slug) ? `/images/aniimo/vote/${entry.slug}.png` : undefined })) as Aniimo[];
export const officialSource = aniimoData.source;
export const guides = guidesData as Guide[];
export const databaseCategories = databaseData as DatabaseCategory[];
export const mapLocations = locationsData as MapLocation[];
export const researchSources = sourcesData;
export const typeChart = typeChartData;
export const communityTier = communityTierData;
export const officialVote = officialVoteData;
export type CommunityRecord = {
  slug: string;
  name: string;
  description: string;
  rarity: string;
  category: string;
  image?: string;
};
export const communityDatabase = communityDatabaseData as Record<string, CommunityRecord[]>;

export const elements = [...new Set(aniimo.flatMap((entry) => entry.elements))].sort();
export const roles = [...new Set(aniimo.flatMap((entry) => entry.roles))].sort();
export const forms = [...new Set(aniimo.map((entry) => entry.form))].sort();
export const habitats = [...new Set(aniimo.flatMap((entry) => entry.habitats))].sort();

export function getAniimo(slug: string) {
  return aniimo.find((entry) => entry.slug === slug);
}

export function getAniimoForm(slug: string, formId: string) {
  const base = getAniimo(slug);
  const form = base?.formRecords.find((record) => record.id === formId);
  if (!base || !form) return undefined;
  return {
    ...base,
    ...form,
    voteImage: undefined,
    forms: base.forms.map((item) => ({ ...item, isCurrent: item.id === formId })),
    formRecords: base.formRecords,
  } as Aniimo & AniimoFormRecord;
}

export function getGuide(slug: string) {
  return guides.find((entry) => entry.slug === slug);
}

export function getDatabaseCategory(slug: string) {
  return databaseCategories.find((entry) => entry.slug === slug);
}

export function getCommunityRecord(category: string, slug: string) {
  return communityDatabase[category]?.find((record) => record.slug === slug);
}

export function getFeaturedAniimo() {
  const slugs = ["stellarys", "emberpup", "eklue", "leafy", "helgon", "coraliz"];
  return slugs.map(getAniimo).filter((entry): entry is Aniimo => Boolean(entry));
}

export function getRelatedAniimo(entry: Aniimo, limit = 4) {
  return aniimo
    .filter(
      (candidate) =>
        candidate.slug !== entry.slug &&
        (candidate.elements.some((element) => entry.elements.includes(element)) ||
          candidate.roles.some((role) => entry.roles.includes(role))),
    )
    .slice(0, limit);
}

export function getSearchRecords() {
  return [
    ...aniimo.map((entry) => ({
      title: entry.name,
      subtitle: `${entry.elements.join(" / ")} · ${entry.roles.join(" / ")}`,
      href: `/aniimo/${entry.slug}`,
      type: "Aniimo",
      image: entry.image,
    })),
    ...guides.map((guide) => ({
      title: guide.title,
      subtitle: guide.excerpt,
      href: `/guides/${guide.slug}`,
      type: "Guide",
      image: "",
    })),
    ...databaseCategories.map((category) => ({
      title: category.name,
      subtitle: category.description,
      href: `/database/${category.slug}`,
      type: category.status === "verified" ? "Official database" : "Community dataset",
      image: "",
    })),
  ];
}
