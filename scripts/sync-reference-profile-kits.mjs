import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const sourceRoot = "https://www.aniimoverse.com/aniilog";
const official = JSON.parse(await readFile(new URL("../src/data/game/aniimo.json", import.meta.url), "utf8")).entries;
const additions = JSON.parse(await readFile(new URL("../src/data/research/roster-additions.json", import.meta.url), "utf8")).entries;
const entries = [...official.filter((entry) => entry.slug !== "fennelun").map((entry) => ({ ...entry, slug: entry.slug === "witchin" ? "hexxin" : entry.slug })), ...additions];
if (entries.length !== 98 || new Set(entries.map((entry) => entry.slug)).size !== entries.length) throw new Error("Unexpected local roster; current profile kits remain untouched.");

function originalUrl(src) {
  if (!src) return "";
  const parsed = new URL(src, sourceRoot);
  return parsed.searchParams.get("url") || parsed.href;
}
function localElement(element) { return element === "light" ? "holy" : element === "electric" ? "lightning" : element; }

const profiles = new Array(entries.length);
let next = 0;
async function worker() {
  while (next < entries.length) {
    const index = next++;
    const entry = entries[index];
    const url = `${sourceRoot}/${entry.slug}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    const $ = load(await response.text());
    const skills = [];
    $("a[data-tip-kind='skill']").each((_, node) => {
      const row = $(node).closest("[class*='abilityRow']");
      const name = $(node).text().trim();
      if (!row.length || !name || skills.some((skill) => skill.name === name)) return;
      const rowText = row.text().replace(/\s+/g, " ");
      const element = row.find("a[data-tip-kind='element']").first().attr("data-tip-slug");
      const unlockFormPaths = row.find(`a[href^='/aniilog/${entry.slug}/']`).map((_, link) => $(link).attr("href")).get();
      const types = ["Physical", "Magic", "Support"].filter((type) => row.find("span").toArray().some((span) => $(span).text().trim() === type));
      skills.push({
        name,
        description: row.find("p").first().text().trim(),
        category: name === "ATK" || /Ultimate cost/.test(rowText) ? "Innate" : "Combat",
        elements: element ? [localElement(element)] : entry.elements,
        types: types.slice(0, 1),
        iconUrl: originalUrl(row.find("img").first().attr("src")),
        cost: rowText.match(/(?:EP cost|Ultimate cost)\s*(\d+)/)?.[1] || "",
        power: rowText.match(/Might\s*(\d+(?:\/\d+)?)/)?.[1] || "",
        unlockFormPaths,
      });
    });
    const forms = [];
    const title = $("h1").first();
    const currentName = title.text().trim();
    const description = title.parent().parent().find("p").first().text().trim();
    const prefix = `${currentName} (`;
    $("main img[alt]").each((_, node) => {
      const alt = $(node).attr("alt") || "";
      if (!alt.startsWith(prefix) || !alt.endsWith(")")) return;
      const label = alt.slice(prefix.length, -1);
      const card = $(node).parent().parent().parent();
      const elements = [...new Set(card.find("a[data-tip-kind='element']").map((_, link) => $(link).attr("data-tip-slug")).get())]
        .map(localElement);
      const form = { label, image: originalUrl($(node).attr("src")), description: card.find("p").first().text().trim(), elements: elements.length > 2 ? entry.elements : elements };
      const existing = forms.findIndex((candidate) => candidate.label === label);
      if (existing === -1) forms.push(form);
      else forms[existing] = form;
    });
    if (skills.length < 2 || !forms.length || !description || skills.some((skill) => !skill.description || !skill.iconUrl.startsWith("https://cdn.aniimoverse.com/"))) {
      throw new Error(`Incomplete profile kit at ${url}: ${skills.length} skills, ${forms.length} forms, invalid skills ${skills.filter((skill) => !skill.description || !skill.iconUrl.startsWith("https://cdn.aniimoverse.com/")).map((skill) => `${skill.name} (${skill.iconUrl})`).join(", ")}; current profile kits remain untouched.`);
    }
    profiles[index] = { slug: entry.slug, name: currentName, description, sourceUrl: url, skills, forms };
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
const formCount = profiles.reduce((sum, profile) => sum + profile.forms.length, 0);
const skillCount = profiles.reduce((sum, profile) => sum + profile.skills.length, 0);
if (formCount < 235 || skillCount < 481) throw new Error(`Only ${formCount} forms and ${skillCount} skills parsed; current profile kits remain untouched.`);
const elements = ["fire", "water", "grass", "electric", "ice", "wind", "earth", "dark", "light"];
const elementPages = await Promise.all(elements.map(async (element) => {
  const response = await fetch(`${sourceRoot}/element/${element}`);
  if (!response.ok) throw new Error(`Element table ${element} returned ${response.status}`);
  return load(await response.text());
}));
for (const profile of profiles) {
  for (const $ of elementPages) {
    const row = $(`a[href='/aniilog/${profile.slug}']`).last().closest("tr");
    if (!row.length) continue;
    const values = row.find("th,td").map((_, cell) => $(cell).text().trim()).get().slice(4).map(Number);
    if (values.length !== 7 || values.some((value) => !Number.isFinite(value))) continue;
    profile.referenceStats = { hp: values[0], attack: values[1], physicalDefense: values[2], magicDefense: values[3], break: values[4], regen: values[5], total: values[6] };
    break;
  }
}
const missingStats = profiles.filter((profile) => !profile.referenceStats).map((profile) => profile.slug);
if (missingStats.length) throw new Error(`Missing current stat blocks for ${missingStats.join(", ")}; current profile kits remain untouched.`);
const data = { sourceUrl: sourceRoot, reviewedAt: new Date().toISOString().slice(0, 10), profiles };
await writeFile(new URL("../src/data/research/current-profile-kits.json", import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Synced ${profiles.length} Aniimo profiles, ${skillCount} skills, ${formCount} form portraits, and ${profiles.length} current stat blocks.`);
