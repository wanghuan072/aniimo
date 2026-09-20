import { aniimo } from "@/lib/data";
import type { AniimoSkill } from "@/types/content";

export type OwnerLink = { name: string; slug: string; image: string; formId: string; form: string; href: string };

export type SharedDatabaseRecord = {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  cost?: string;
  power?: string;
  cooldown?: string;
  breakValue?: string;
  teamRole?: string;
  owners: OwnerLink[];
};

export const recordSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const allForms = aniimo.flatMap((entry) => entry.formRecords.map((form) => ({
  form,
  owner: {
    name: entry.name,
    slug: entry.slug,
    image: form.image || entry.image,
    formId: form.id,
    form: form.form,
    href: `/aniimo/${entry.slug}?form=${encodeURIComponent(form.id)}`,
  },
})));

function groupRecords<T extends { name: string; description: string; iconUrl: string }>(
  pick: (form: typeof allForms[number]["form"]) => T[],
  create: (record: T) => SharedDatabaseRecord,
): SharedDatabaseRecord[] {
  const groups = new Map<string, SharedDatabaseRecord>();
  for (const { form, owner } of allForms) for (const record of pick(form)) {
    if (!groups.has(record.name)) groups.set(record.name, create(record));
    const group = groups.get(record.name)!;
    if (!group.owners.some((candidate) => candidate.slug === owner.slug && candidate.formId === owner.formId)) group.owners.push(owner);
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const groupedSkills = groupRecords<AniimoSkill>((form) => form.skills, (skill) => ({
  id: `skill-${recordSlug(skill.name)}`, name: skill.name, description: skill.description, category: skill.category,
  iconUrl: skill.iconUrl, cost: skill.cost, power: skill.power, cooldown: skill.cooldown,
  breakValue: skill.breakValue, teamRole: skill.teamRole, owners: [],
}));

export const groupedTraits = groupRecords<(typeof allForms)[number]["form"]["traits"][number]>((form) => form.traits, (trait) => ({
  id: `trait-${recordSlug(trait.name)}`, name: trait.name, description: trait.description,
  category: "Trait", iconUrl: trait.iconUrl, owners: [],
}));
