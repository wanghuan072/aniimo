import { writeFile } from "node:fs/promises";
import { load } from "cheerio";

const sourceRoot = "https://www.aniimoverse.com/aniilog";
const definitions = [
  { slug: "squarrel", entryId: "047", stage: 1, elements: ["fire"], roles: ["break"] },
  { slug: "squashel", entryId: "048", stage: 3, elements: ["fire"], roles: ["break"] },
  { slug: "irisalis", entryId: "10001", stage: 4, elements: ["grass"], roles: ["dps"] },
  { slug: "sparkelf", entryId: "11001", stage: 3, elements: ["fire"], roles: ["sup"] },
  { slug: "lunara", entryId: "99996", stage: 0, elements: ["holy"], roles: ["dps"] },
];

function originalUrl(src) {
  if (!src) return "";
  const parsed = new URL(src, sourceRoot);
  return parsed.searchParams.get("url") || parsed.href;
}

const entries = [];
const elementRows = new Map();
for (const definition of definitions) {
  const url = `${sourceRoot}/${definition.slug}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const $ = load(await response.text());
  const title = $("h1").first();
  const name = title.text().trim();
  const hero = title.parent().parent();
  const description = hero.find("p").first().text().trim();
  const image = originalUrl($("main img").first().attr("src"));
  const spawnHeading = $("h2").filter((_, node) => $(node).text().trim() === `Where to find ${name}`).first();
  const sourceSpawnCount = Number(spawnHeading.parent().parent().text().match(/(\d+) exact spawns?/)?.[1] || 0);
  const elementPath = definition.elements[0] === "holy" ? "light" : definition.elements[0];
  if (!elementRows.has(elementPath)) {
    const elementResponse = await fetch(`${sourceRoot}/element/${elementPath}`);
    if (!elementResponse.ok) throw new Error(`Element table returned ${elementResponse.status}`);
    elementRows.set(elementPath, load(await elementResponse.text()));
  }
  const table = elementRows.get(elementPath);
  const cells = table(`a[href='/aniilog/${definition.slug}']`).last().closest("tr").find("th,td").map((_, cell) => table(cell).text().trim()).get();
  const values = cells.slice(4).map(Number);
  const referenceStats = values.length === 7 && values.every(Number.isFinite) ? {
    hp: values[0], attack: values[1], physicalDefense: values[2], magicDefense: values[3], break: values[4], regen: values[5], total: values[6],
  } : null;
  const observedId = hero.text().match(/No\.(\d+)/)?.[1];
  if (name.toLowerCase() !== definition.slug || observedId !== definition.entryId || !description || !image.startsWith("https://cdn.aniimoverse.com/") || !referenceStats) {
    throw new Error(`Unexpected profile data for ${definition.slug}`);
  }

  const skills = [];
  $("a[data-tip-kind='skill']").each((_, node) => {
    const row = $(node).closest("[class*='abilityRow']");
    const skillName = $(node).text().trim();
    if (!row.length || skills.some((skill) => skill.name === skillName)) return;
    const rowText = row.text().replace(/\s+/g, " ");
    const skillElement = row.find("[data-tip-kind='element']").first().attr("data-tip-slug");
    skills.push({
      name: skillName,
      description: row.find("p").first().text().trim(),
      category: skillName === "ATK" || /Ultimate cost/.test(rowText) ? "Innate" : "Combat",
      elements: skillElement ? [skillElement === "light" ? "holy" : skillElement] : definition.elements,
      types: ["Physical", "Magic", "Support"].filter((type) => row.find("span").toArray().some((span) => $(span).text().trim() === type)).slice(0, 1),
      iconUrl: originalUrl(row.find("img").first().attr("src")),
      cost: rowText.match(/(?:EP cost|Ultimate cost)\s*(\d+)/)?.[1] || "",
      power: rowText.match(/Might\s*(\d+)/)?.[1] || "",
    });
  });

  const traits = [];
  $("a[data-tip-kind='trait']").each((_, node) => {
    const traitName = $(node).text().trim();
    if (traits.some((trait) => trait.name === traitName)) return;
    traits.push({ name: traitName, description: $(node).parent().parent().find("p").first().text().trim(), iconUrl: "" });
  });

  const entry = {
    ...definition,
    id: `reference-${definition.slug}`,
    name, description, image,
    officialImageUrl: "", illustrationUrl: "", form: definition.slug === "irisalis" ? "Prismana Form" : "Basic Form",
    gender: [], weight: { min: null, max: null }, stats: null,
    forms: [{ id: `reference-${definition.slug}`, label: definition.slug === "irisalis" ? "Prismana Form" : "Basic Form", isCurrent: true }],
    habitats: [], homelandAbilities: [], mobility: [], pathfinding: [], evolution: [], evolutionTree: null,
    traits, skills, viewCount: null, referenceStats, sourceSpawnCount, sourceUrl: url, sourceKind: "community-launch",
  };
  entry.formRecords = [{ id: entry.id, description, image, officialImageUrl: "", illustrationUrl: "", form: entry.form, stage: entry.stage, roles: entry.roles, elements: entry.elements, gender: [], weight: entry.weight, stats: null, habitats: [], homelandAbilities: [], mobility: [], pathfinding: [], evolution: [], evolutionTree: null, traits, skills, viewCount: null }];
  if (definition.slug === "sparkelf") {
    const prismanaImage = originalUrl($("img[alt='Sparkelf (Prismana Form)']").first().attr("src"));
    if (!prismanaImage) throw new Error("Missing Sparkelf Prismana portrait");
    const formId = "reference-sparkelf-prismana";
    entry.forms.push({ id: formId, label: "Prismana Form", isCurrent: false });
    entry.formRecords.push({ ...entry.formRecords[0], id: formId, image: prismanaImage, form: "Prismana Form" });
  }
  if (skills.length < 2) throw new Error(`Too few skills for ${name}`);
  entries.push(entry);
}

const squarrel = entries.find((entry) => entry.slug === "squarrel");
const squashel = entries.find((entry) => entry.slug === "squashel");
const evolutionTree = { name: "Squarrel", stage: 1, imageUrl: squarrel.image, isVariant: false, children: [{ name: "Squashel", stage: 3, imageUrl: squashel.image, isVariant: false, children: [] }] };
for (const entry of [squarrel, squashel]) {
  entry.evolutionTree = evolutionTree;
  entry.evolution = [{ name: "Squarrel", stage: 1, imageUrl: squarrel.image, isVariant: false }, { name: "Squashel", stage: 3, imageUrl: squashel.image, isVariant: false }];
  entry.formRecords[0].evolutionTree = evolutionTree;
  entry.formRecords[0].evolution = entry.evolution;
}

const data = { sourceUrl: sourceRoot, reviewedAt: new Date().toISOString().slice(0, 10), entries };
await writeFile(new URL("../src/data/research/roster-additions.json", import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Imported ${entries.length} missing Aniimo profiles with ${entries.reduce((sum, entry) => sum + entry.skills.length, 0)} skills.`);
