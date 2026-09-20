import type { SearchRecord } from "@/types/content";
import records from "@/data/editorial/search-index.json";
import additions from "@/data/research/roster-additions.json";

const preserved = (records as SearchRecord[])
  .filter((record) => !(record.type === "Aniimo" && record.href === "/aniimo/fennelun"))
  .map((record) => ({
    ...record,
    title: record.type === "Aniimo" && record.title === "Witchin" ? "Hexxin" : record.title,
    subtitle: record.subtitle.replace(/Witchin/g, "Hexxin").replace(/Fennelun/g, "Lunara"),
    href: record.href === "/aniimo/witchin" ? "/aniimo/hexxin" : record.href === "/aniimo/fennelun" ? "/aniimo/lunara" : record.href,
  }));
const added: SearchRecord[] = additions.entries.flatMap((entry) => [
  { title: entry.name, subtitle: `${entry.elements.join(" / ")} · ${entry.roles.join(" / ")}`, href: `/aniimo/${entry.slug}`, type: "Aniimo", image: entry.image },
  ...entry.skills.map((skill) => ({ title: skill.name, subtitle: `Skill · ${entry.name}`, href: `/aniimo/${entry.slug}`, type: "Skill", image: skill.iconUrl || entry.image })),
  ...entry.traits.map((trait) => ({ title: trait.name, subtitle: `Trait · ${entry.name}`, href: `/aniimo/${entry.slug}`, type: "Trait", image: trait.iconUrl || entry.image })),
]);
const seen = new Set<string>();
export const searchRecords = [...preserved, ...added].filter((record) => {
  const key = `${record.type}|${record.title}|${record.href}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
