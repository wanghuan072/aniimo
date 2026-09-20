import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const sourceUrl = "https://www.aniimoverse.com/aniilog";
const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Reference roster returned ${response.status}`);
const $ = load(await response.text());
const reference = $("main a[href^='/aniilog/']").toArray()
  .filter((node) => /^No\.\d+/.test($(node).text().trim()))
  .map((node) => ({ slug: $(node).attr("href").split("/").at(-1), entryId: $(node).text().match(/^No\.(\d+)/)?.[1], url: new URL($(node).attr("href"), sourceUrl).href }));
if (reference.length < 90) throw new Error(`Only ${reference.length} reference entries parsed; previous audit remains untouched.`);
if (reference.some((entry) => !entry.entryId) || new Set(reference.map((entry) => entry.slug)).size !== reference.length) throw new Error("Reference index contains a missing or duplicate ID");
const official = JSON.parse(await readFile(new URL("../src/data/game/aniimo.json", import.meta.url), "utf8")).entries;
const additions = JSON.parse(await readFile(new URL("../src/data/research/roster-additions.json", import.meta.url), "utf8")).entries;
const local = [...official.filter((entry) => entry.slug !== "fennelun").map((entry) => ({ ...entry, slug: entry.slug === "witchin" ? "hexxin" : entry.slug })), ...additions];
const localSlugs = new Set(local.map((entry) => entry.slug));
const referenceSlugs = new Set(reference.map((entry) => entry.slug));
const report = {
  checkedAt: new Date().toISOString().slice(0, 10), sourceUrl,
  localCount: local.length, officialSnapshotCount: official.length, supplementCount: additions.length, referenceCount: reference.length,
  referenceNumbers: Object.fromEntries(reference.map(({ slug, entryId }) => [slug, entryId])),
  unmatchedReference: reference.filter((entry) => !localSlugs.has(entry.slug)).map((entry) => ({ ...entry, possibleExistingSlug: null })),
  unmatchedLocal: local.filter((entry) => !referenceSlugs.has(entry.slug)).map((entry) => ({ slug: entry.slug, name: entry.name, possibleCurrentSlug: null })),
};
await writeFile(new URL("../src/data/research/roster-audit.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Compared ${local.length} local profiles with ${reference.length} reference profiles.`);
console.log(`${report.unmatchedReference.length} reference slugs and ${report.unmatchedLocal.length} local slugs need review.`);
if (report.unmatchedReference.length || report.unmatchedLocal.length) process.exitCode = 1;
