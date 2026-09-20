import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const database = JSON.parse(await readFile(new URL("../src/data/research/community-database.json", import.meta.url), "utf8"));
const output = new URL("../src/data/research/achievement-details.json", import.meta.url);
const entries = {};
const failures = [];
const pending = [...database.achievements];
await Promise.all(Array.from({ length: 5 }, async () => {
  while (pending.length) {
    const record = pending.shift();
    const url = `https://www.aniimoverse.com/achievements/${record.slug}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const $ = load(await response.text());
      const schema = $('script[type="application/ld+json"]').toArray().map((node) => { try { return JSON.parse($(node).html()); } catch { return null; } }).find((value) => value?.["@type"] === "Thing" && value.additionalType === "Achievement");
      if (!schema) throw new Error("achievement schema absent");
      const properties = Object.fromEntries(schema.additionalProperty.map(({ name, value }) => [name.toLowerCase(), value]));
      const tiers = $("main h2").toArray().map((node) => $(node).text().trim()).filter(Boolean);
      if (tiers.length !== Number(properties.tiers)) throw new Error(`expected ${properties.tiers} tiers, got ${tiers.length}`);
      entries[record.slug] = { sourceUrl: url, path: properties.path || "", section: properties.section || "", element: properties.element || "", rarity: properties.rarity || "", tiers };
    } catch (error) { failures.push(`${record.slug}: ${error.message}`); }
  }
}));
if (Object.keys(entries).length < 30) throw new Error(`Only ${Object.keys(entries).length} achievements parsed; leaving prior data untouched. ${failures.join(", ")}`);
await writeFile(output, `${JSON.stringify({ reviewedAt: new Date().toISOString().slice(0, 10), entries }, null, 2)}\n`);
console.log(`Imported ${Object.keys(entries).length}/${database.achievements.length} achievement lines.`);
if (failures.length) console.log(`Unavailable: ${failures.join(", ")}`);
