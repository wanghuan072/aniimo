import { aniimo } from "@/lib/data";

export type OwnerLink = { name: string; slug: string; image: string };

export type SharedDatabaseRecord = {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  cost?: string;
  power?: string;
  owners: OwnerLink[];
};

const recordSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const groupedSkills: SharedDatabaseRecord[] = Object.values(aniimo.flatMap((entry) => entry.skills.map((skill) => ({ ...skill, owner: { name: entry.name, slug: entry.slug, image: entry.image } }))).reduce<Record<string, SharedDatabaseRecord>>((groups, skill) => {
  const key = skill.name;
  if (!groups[key]) groups[key] = { id: `skill-${recordSlug(skill.name)}`, name: skill.name, description: skill.description, category: skill.category, iconUrl: skill.iconUrl, cost: skill.cost, power: skill.power, owners: [] };
  groups[key].owners.push(skill.owner);
  return groups;
}, {})).sort((a, b) => a.name.localeCompare(b.name));

export const groupedTraits: SharedDatabaseRecord[] = Object.values(aniimo.flatMap((entry) => entry.traits.map((trait) => ({ ...trait, owner: { name: entry.name, slug: entry.slug, image: entry.image } }))).reduce<Record<string, SharedDatabaseRecord>>((groups, trait) => {
  const key = trait.name;
  if (!groups[key]) groups[key] = { id: `trait-${recordSlug(trait.name)}`, name: trait.name, description: trait.description, category: "Trait", iconUrl: trait.iconUrl, owners: [] };
  groups[key].owners.push(trait.owner);
  return groups;
}, {})).sort((a, b) => a.name.localeCompare(b.name));
