import { alphaBossSlugs, omegaBosses } from "@/data/editorial/encounters";
import { decorateEvolutionTree, getAniimoGlance, getAniimoNeighbors, getRelatedAniimo, getTypeMatchups, mapLocations, officialSource } from "@/lib/data";
import { applyAniimoForm } from "@/lib/aniimo-form";
import { getAniimoSpawns, mapHref } from "@/lib/map-atlas";
import { roleLabels, siteConfig } from "@/config/site";
import type { Aniimo } from "@/types/content";
import progressionData from "@/data/research/progression.json";

const normalizeLocation = (value: string) => value.replace(/[.]$/, "").trim().toLowerCase();
const titleCase = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

function habitatLinksFor(habitats: string[], slug: string) {
  return habitats.map((habitat) => {
    const name = habitat.replace(/[.]$/, "");
    const location = mapLocations.find((candidate) => normalizeLocation(candidate.name) === normalizeLocation(habitat));
    const href = mapHref({ marker: slug, region: location?.id || name });
    return { name, href: href.includes("?") ? href : "/database/habitats" };
  });
}

function mapLinkFor(habitats: string[], slug: string) {
  const firstHabitat = habitats[0] || omegaBosses.find((boss) => boss.slug === slug)?.region;
  const href = mapHref({ marker: slug, region: firstHabitat ? mapLocations.find((candidate) => normalizeLocation(candidate.name) === normalizeLocation(firstHabitat))?.id || firstHabitat : undefined });
  return href.includes("?") ? href : undefined;
}

function habitatNoteFor(view: Aniimo, hasSpawns: boolean) {
  if (view.habitats.length) return null;
  if (view.sourceSpawnCount) return { text: `The community source lists ${view.sourceSpawnCount} field ${view.sourceSpawnCount === 1 ? "spawn" : "spawns"}. Coordinates have not been imported into this site's map.`, href: view.sourceUrl || "/sources", label: "Open source record" };
  const omega = omegaBosses.find((boss) => boss.slug === view.slug);
  if (omega) return { text: `Quest boss in ${omega.region}. No wild habitat is listed.`, href: `/database/bosses#${view.slug}`, label: "Open World Bosses" };
  if ((alphaBossSlugs as readonly string[]).includes(view.slug)) return { text: "Alpha field boss. No wild habitat is listed.", href: `/database/bosses#${view.slug}`, label: "Open World Bosses" };
  if ((view.evolutionTree && view.evolutionTree.name !== view.name) || view.stage >= 2) return { text: "Evolved form. No wild habitat is listed on this profile.", href: "#lineage", label: "See evolution path" };
  if (hasSpawns) return { text: "No named habitats on the official record. Field locations are on the map above.", href: "#locations", label: "See field locations" };
  return { text: "No published wild habitat.", href: "/database/habitats", label: "Browse habitats" };
}

export function getAniimoPageData(entry: Aniimo) {
  const spawnAtlases = getAniimoSpawns(entry.slug);
  const ids = entry.formRecords.length ? entry.formRecords.map((record) => record.id) : [entry.id];
  const formViews = ids.map((id) => {
    const view = applyAniimoForm(entry, id);
    const glance = getAniimoGlance(view);
    return {
      id: view.id,
      entry: view,
      ratings: glance.ratings,
      strongestStat: glance.strongestStat,
      matchups: getTypeMatchups(view.elements),
      habitatLinks: habitatLinksFor(view.habitats, entry.slug),
      habitatNote: habitatNoteFor(view, spawnAtlases.length > 0),
      findOnMapHref: mapLinkFor(view.habitats, entry.slug),
    };
  });
  return {
    entry,
    progression: (progressionData.entries as Record<string, (typeof progressionData.entries)[keyof typeof progressionData.entries]>)[entry.slug] || null,
    formViews,
    spawnAtlases,
    evolutionTree: entry.evolutionTree ? decorateEvolutionTree(entry.evolutionTree) : null,
    neighbors: getAniimoNeighbors(entry),
    related: getRelatedAniimo(entry).map((item) => ({
      slug: item.slug,
      name: item.name,
      image: item.voteImage || item.image,
      caption: [item.elements.map(titleCase).join(" / "), item.roles.map((role) => roleLabels[role] || titleCase(role)).join(" / ")].filter(Boolean).join(" · "),
    })),
    author: siteConfig.author,
    updated: new Date(officialSource.syncedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

export type AniimoPageData = ReturnType<typeof getAniimoPageData>;
