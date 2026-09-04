import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();

function token(value) {
  return String(value || "")
    .replace(/[.]$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function writeSearchIndex() {
  const aniimo = JSON.parse(await readFile(path.join(ROOT, "src/data/game/aniimo.json"), "utf8"));
  const guides = JSON.parse(await readFile(path.join(ROOT, "src/data/editorial/guides.json"), "utf8"));
  const database = JSON.parse(await readFile(path.join(ROOT, "src/data/editorial/database.json"), "utf8"));
  const locations = JSON.parse(await readFile(path.join(ROOT, "src/data/editorial/locations.json"), "utf8"));
  const community = JSON.parse(await readFile(path.join(ROOT, "src/data/research/community-database.json"), "utf8"));
  if (!Array.isArray(aniimo.entries) || aniimo.entries.length < 1) {
    throw new Error("aniimo.json is missing entries");
  }

  const skills = new Map();
  const traits = new Map();
  const habitats = new Map();
  for (const entry of aniimo.entries) {
    for (const skill of entry.skills || []) {
      if (!skills.has(skill.name)) skills.set(skill.name, { skill, owner: entry });
    }
    for (const trait of entry.traits || []) {
      if (!traits.has(trait.name)) traits.set(trait.name, { trait, owner: entry });
    }
    for (const habitat of entry.habitats || []) {
      const name = habitat.replace(/[.]$/, "");
      if (!habitats.has(name)) habitats.set(name, name);
    }
  }

  const locationByName = new Map(locations.map((location) => [token(location.name), location]));

  const records = [
    ...aniimo.entries.map((entry) => ({
      title: entry.name,
      subtitle: `${entry.elements.join(" / ")} · ${entry.roles.join(" / ")}`,
      href: `/aniimo/${entry.slug}`,
      type: "Aniimo",
      image: entry.image,
    })),
    ...[...skills.values()].map(({ skill, owner }) => ({
      title: skill.name,
      subtitle: `Skill · ${owner.name}`,
      href: `/aniimo/${owner.slug}`,
      type: "Skill",
      image: skill.iconUrl || owner.image,
    })),
    ...[...traits.values()].map(({ trait, owner }) => ({
      title: trait.name,
      subtitle: `Trait · ${owner.name}`,
      href: `/aniimo/${owner.slug}`,
      type: "Trait",
      image: trait.iconUrl || owner.image,
    })),
    ...[...habitats.values()].map((name) => {
      const location = locationByName.get(token(name));
      return {
        title: name,
        subtitle: "Habitat",
        href: location ? `/database/habitats#${location.id}` : "/database/habitats",
        type: "Habitat",
        image: "",
      };
    }),
    ...(community.items || []).map((item) => ({
      title: item.name,
      subtitle: `Item · ${item.category || item.rarity || "Catalogue"}`,
      href: `/database/items?q=${encodeURIComponent(item.slug)}`,
      type: "Item",
      image: item.image || "",
    })),
    ...guides.map((guide) => ({
      title: guide.title,
      subtitle: guide.category,
      href: `/guides/${guide.slug}`,
      type: "Guide",
      image: "",
    })),
    ...database.map((category) => ({
      title: category.name,
      subtitle: category.status === "verified" ? "Database" : "Community",
      href: `/database/${category.slug}`,
      type: "Database",
      image: "",
    })),
    {
      title: "Type Chart",
      subtitle: "Element matchups",
      href: "/database/elements#matchups",
      type: "Database",
      image: "",
    },
  ];
  const dest = path.join(ROOT, "src/data/editorial/search-index.json");
  await writeFile(dest, `${JSON.stringify(records)}\n`, "utf8");
  return records.length;
}

if (process.argv[1] && path.basename(fileURLToPath(import.meta.url)) === path.basename(process.argv[1])) {
  writeSearchIndex()
    .then((count) => console.log(`Wrote ${count} search records`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
