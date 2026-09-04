import aniimoData from "@/data/game/aniimo.json";
import guidesData from "@/data/editorial/guides.json";
import databaseData from "@/data/editorial/database.json";
import locationsData from "@/data/editorial/locations.json";
import sourcesData from "@/data/research/sources.json";
import typeChartData from "@/data/research/type-chart.json";
import communityTierData from "@/data/research/community-tier-snapshot.json";
import officialVoteData from "@/data/research/official-vote-2026.json";
import communityDatabaseData from "@/data/research/community-database.json";
import skillExtrasData from "@/data/research/skill-extras.json";
import { applyAniimoForm } from "@/lib/aniimo-form";
import type { Aniimo, AniimoEvolutionNode, AniimoEvolutionView, AniimoFormRecord, AniimoSkill, CommunityRecord, DatabaseCategory, Guide, MapLocation } from "@/types/content";

type SkillExtraRecord = {
  name: string;
  cooldown?: string;
  break?: string;
  teamRole?: string;
  effects?: AniimoSkill["effects"];
  targeting?: AniimoSkill["targeting"];
};

const voteImageSlugs = new Set(officialVoteData.records.flatMap((record) => record.slug ? [record.slug] : []));
const skillExtrasByName = new Map((skillExtrasData.records as SkillExtraRecord[]).map((record) => [record.name, record]));

function withSkillExtras(skill: AniimoSkill): AniimoSkill {
  const extra = skillExtrasByName.get(skill.name);
  if (!extra) return skill;
  return {
    ...skill,
    cooldown: extra.cooldown || undefined,
    breakValue: extra.break || undefined,
    teamRole: extra.teamRole || undefined,
    effects: extra.effects?.length ? extra.effects : undefined,
    targeting: extra.targeting || undefined,
  };
}

function decorateAniimo(entry: Aniimo): Aniimo {
  return {
    ...entry,
    voteImage: voteImageSlugs.has(entry.slug) ? `/images/aniimo/vote/${entry.slug}.png` : undefined,
    skills: entry.skills.map(withSkillExtras),
    formRecords: entry.formRecords.map((record) => ({
      ...record,
      skills: record.skills.map(withSkillExtras),
    })),
  };
}

export const aniimo = (aniimoData.entries as Aniimo[]).map(decorateAniimo);

export const officialSource = aniimoData.source;
export const guides = guidesData as Guide[];
export const databaseCategories = databaseData as DatabaseCategory[];
export const mapLocations = locationsData as MapLocation[];
export const researchSources = sourcesData;
export const typeChart = typeChartData;
export const communityTier = communityTierData;
export const officialVote = officialVoteData;
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
  if (!base?.formRecords.some((record) => record.id === formId)) return undefined;
  return applyAniimoForm(base, formId) as Aniimo & AniimoFormRecord;
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

function lineageNames(node: AniimoEvolutionNode): string[] {
  return [node.name, ...node.children.flatMap(lineageNames)];
}

export function getRelatedAniimo(entry: Aniimo, limit = 4) {
  const family = new Set(
    (entry.evolutionTree ? lineageNames(entry.evolutionTree) : entry.evolution.map((node) => node.name))
      .filter((name) => name !== entry.name),
  );
  const relatives = aniimo.filter((candidate) => family.has(candidate.name));
  const scored = aniimo
    .filter((candidate) => candidate.slug !== entry.slug && !family.has(candidate.name))
    .map((candidate) => ({
      candidate,
      score:
        candidate.elements.filter((element) => entry.elements.includes(element)).length * 3 +
        candidate.roles.filter((role) => entry.roles.includes(role)).length +
        (candidate.stage === entry.stage ? 1 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || Number(left.candidate.entryId) - Number(right.candidate.entryId))
    .map((item) => item.candidate);
  return [...relatives, ...scored].slice(0, limit);
}

function letterGrade(value: number, values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = sorted.findIndex((candidate) => candidate >= value) / Math.max(sorted.length - 1, 1);
  return percentile >= 0.82 ? "S" : percentile >= 0.58 ? "A" : percentile >= 0.3 ? "B" : "C";
}

export function decorateEvolutionTree(node: AniimoEvolutionNode): AniimoEvolutionView {
  const local = aniimo.find((candidate) => candidate.name === node.name);
  return {
    ...node,
    slug: local?.slug,
    portrait: local?.voteImage || local?.image || node.imageUrl,
    children: node.children.map(decorateEvolutionTree),
  };
}

export function getAniimoGlance(entry: Aniimo) {
  const stats = entry.stats;
  const allStats = aniimo.flatMap((candidate) => (candidate.stats ? [candidate.stats] : []));
  const defense = stats ? Math.round((stats.physicalDefense + stats.magicDefense) / 2) : 0;
  const ratings = stats
    ? [
        ["Overall", letterGrade(stats.attributeValue, allStats.map((value) => value.attributeValue)), "✦"],
        ["P. ATK", letterGrade(stats.physicalAttack, allStats.map((value) => value.physicalAttack)), "⚔"],
        ["M. ATK", letterGrade(stats.magicAttack, allStats.map((value) => value.magicAttack)), "◆"],
        ["Defense", letterGrade(defense, allStats.map((value) => (value.physicalDefense + value.magicDefense) / 2)), "⬟"],
        ["REGEN", letterGrade(stats.haste, allStats.map((value) => value.haste)), "ϟ"],
      ]
    : [];
  const strongestStat = stats
    ? ([
        ["HP", stats.hp],
        ["Physical ATK", stats.physicalAttack],
        ["Magic ATK", stats.magicAttack],
        ["Physical DEF", stats.physicalDefense],
        ["Magic DEF", stats.magicDefense],
        ["REGEN", stats.haste],
      ].sort((a, b) => Number(b[1]) - Number(a[1]))[0] as [string, number])
    : null;
  return { ratings: ratings as Array<[string, string, string]>, strongestStat };
}

export function getTypeMatchups(elements: string[]) {
  const list = typeChart.elements as string[];
  const matrix = typeChart.matrix as number[][];
  const ours = elements.filter((element) => list.includes(element));
  const weak: string[] = [];
  const resists: string[] = [];
  const strong: string[] = [];
  for (let attacker = 0; attacker < list.length; attacker += 1) {
    const multiplier = ours.reduce((product, element) => product * matrix[attacker][list.indexOf(element)], 1);
    if (multiplier > 1) weak.push(list[attacker]);
    else if (multiplier < 1) resists.push(list[attacker]);
  }
  const seen = new Set<string>();
  for (const element of ours) {
    matrix[list.indexOf(element)].forEach((value, column) => {
      if (value > 1 && !seen.has(list[column])) {
        seen.add(list[column]);
        strong.push(list[column]);
      }
    });
  }
  return { weak, resists, strong };
}

export function getAniimoNeighbors(entry: Aniimo) {
  const roster = [...aniimo].sort((left, right) => Number(left.entryId) - Number(right.entryId));
  const index = roster.findIndex((item) => item.slug === entry.slug);
  const pick = (item: Aniimo) => ({ slug: item.slug, name: item.name, entryId: item.entryId });
  return {
    prev: pick(roster[(index - 1 + roster.length) % roster.length]),
    next: pick(roster[(index + 1) % roster.length]),
  };
}
