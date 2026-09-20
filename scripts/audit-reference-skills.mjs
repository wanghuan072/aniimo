import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const root = "https://www.aniimoverse.com/aniilog";
const official = JSON.parse(await readFile(new URL("../src/data/game/aniimo.json", import.meta.url), "utf8")).entries;
const additions = JSON.parse(await readFile(new URL("../src/data/research/roster-additions.json", import.meta.url), "utf8")).entries;
const current = JSON.parse(await readFile(new URL("../src/data/research/current-profile-kits.json", import.meta.url), "utf8")).profiles;
const snapshot = [...official.filter((entry) => entry.slug !== "fennelun").map((entry) => ({ ...entry, slug: entry.slug === "witchin" ? "hexxin" : entry.slug })), ...additions];
if (current.length !== 98 || snapshot.length !== 98 || new Set(current.map((entry) => entry.slug)).size !== 98) {
  throw new Error("Unexpected local roster; existing audit remains untouched.");
}
const snapshotBySlug = new Map(snapshot.map((entry) => [entry.slug, entry]));

const results = new Array(current.length);
let next = 0;
async function worker() {
  while (next < current.length) {
    const index = next++;
    const profile = current[index];
    const url = `${root}/${profile.slug}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    const $ = load(await response.text());
    const referenceSkills = [];
    $("a[data-tip-kind='skill']").each((_, node) => {
      const row = $(node).closest("[class*='abilityRow']");
      const name = $(node).text().trim();
      if (!row.length || !name || referenceSkills.some((skill) => skill.name === name)) return;
      const rowText = row.text().replace(/\s+/g, " ");
      referenceSkills.push({
        name, description: row.find("p").first().text().trim(),
        cost: rowText.match(/(?:EP cost|Ultimate cost)\s*(\d+)/)?.[1] || "",
        power: rowText.match(/Might\s*(\d+(?:\/\d+)?)/)?.[1] || "",
        unlockFormPaths: row.find(`a[href^='/aniilog/${profile.slug}/']`).map((_, link) => $(link).attr("href")).get(),
      });
    });
    const prefix = `${$("h1").first().text().trim()} (`;
    const referenceForms = [...new Set($("main img[alt]").map((_, node) => $(node).attr("alt") || "").get()
      .filter((alt) => alt.startsWith(prefix) && alt.endsWith(")"))
      .map((alt) => alt.slice(prefix.length, -1)))];
    if (referenceSkills.length < 2 || !referenceForms.length) throw new Error(`Incomplete reference page ${url}; existing audit remains untouched.`);
    const currentByName = new Map(profile.skills.map((skill) => [skill.name, skill]));
    const fieldDifferences = referenceSkills.filter((skill) => {
      const saved = currentByName.get(skill.name);
      return !saved || saved.description !== skill.description || saved.cost !== skill.cost || saved.power !== skill.power
        || JSON.stringify(saved.unlockFormPaths) !== JSON.stringify(skill.unlockFormPaths);
    }).map((skill) => skill.name);
    const staleNames = profile.skills.filter((skill) => !referenceSkills.some((item) => item.name === skill.name)).map((skill) => skill.name);
    const formDifferences = {
      missingLocal: referenceForms.filter((name) => !profile.forms.some((form) => form.label === name)),
      absentReference: profile.forms.filter((form) => !referenceForms.includes(form.label)).map((form) => form.label),
    };
    const old = snapshotBySlug.get(profile.slug);
    const oldNames = [...new Set(old.skills.map((skill) => skill.name))];
    const snapshotDifference = {
      slug: profile.slug,
      missingSnapshot: referenceSkills.map((skill) => skill.name).filter((name) => !oldNames.includes(name)),
      absentReference: oldNames.filter((name) => !referenceSkills.some((skill) => skill.name === name)),
    };
    const referenceDescription = $("h1").first().parent().parent().find("p").first().text().trim();
    results[index] = { slug: profile.slug, sourceUrl: url, fieldDifferences, staleNames, formDifferences,
      profileDescriptionDifference: profile.description !== referenceDescription, snapshotDifference };
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
const elementPages = await Promise.all(["fire", "water", "grass", "electric", "ice", "wind", "earth", "dark", "light"].map(async (element) => {
  const response = await fetch(`${root}/element/${element}`);
  if (!response.ok) throw new Error(`Element table ${element} returned ${response.status}`);
  return load(await response.text());
}));
for (const [index, profile] of current.entries()) {
  let referenceStats;
  for (const $ of elementPages) {
    const row = $(`a[href='/aniilog/${profile.slug}']`).last().closest("tr");
    if (!row.length) continue;
    const values = row.find("th,td").map((_, cell) => $(cell).text().trim()).get().slice(4).map(Number);
    if (values.length !== 7 || values.some((value) => !Number.isFinite(value))) continue;
    referenceStats = { hp: values[0], attack: values[1], physicalDefense: values[2], magicDefense: values[3], break: values[4], regen: values[5], total: values[6] };
    break;
  }
  if (!referenceStats) throw new Error(`No current stat row for ${profile.slug}; existing audit remains untouched.`);
  results[index].statDifference = JSON.stringify(profile.referenceStats) !== JSON.stringify(referenceStats);
}
const changed = results.filter((result) => result.fieldDifferences.length || result.staleNames.length || result.formDifferences.missingLocal.length || result.formDifferences.absentReference.length || result.statDifference || result.profileDescriptionDifference);
const snapshotChanged = results.map((result) => result.snapshotDifference).filter((result) => result.missingSnapshot.length || result.absentReference.length);
const report = {
  checkedAt: new Date().toISOString().slice(0, 10), sourceUrl: root,
  scope: "Current profile descriptions, skill names/descriptions/costs/power/unlock links, form labels and seven-field base blocks are compared with live AniimoVerse pages. Legacy wiki snapshot differences are reported separately.",
  profilesChecked: results.length, changedCount: changed.length, changed,
  legacySnapshotChangedCount: snapshotChanged.length, legacySnapshotChanged: snapshotChanged,
};
await writeFile(new URL("../src/data/research/skill-audit.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Checked ${results.length} current profiles: ${changed.length} live differences. ${snapshotChanged.length} older snapshot profiles differ but are superseded at runtime.`);
if (changed.length) process.exitCode = 1;
