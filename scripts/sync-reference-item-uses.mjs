import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const progression = JSON.parse(await readFile(new URL("../src/data/research/progression.json", import.meta.url), "utf8"));
const candidateUrls = [...new Set(Object.values(progression.entries).flatMap((entry) => [...entry.build.items, ...entry.resonance.materials].map((item) => item.url)))];
const bySlug = new Map();
for (const url of candidateUrls) {
  const parsed = new URL(url);
  const slug = parsed.pathname.split("/").at(-1);
  if (!bySlug.has(slug) || parsed.searchParams.has("id")) bySlug.set(slug, url);
}
const pending = [...bySlug];
const entries = {};
const failures = [];
const clean = (value) => value.replace(/\s+/g, " ").trim();
await Promise.all(Array.from({ length: 5 }, async () => {
  while (pending.length) {
    const [slug, url] = pending.shift();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const $ = load(await response.text());
      const heading = $("h2").filter((_, node) => clean($(node).text()).startsWith("How to get ")).first();
      const panel = heading.closest("section");
      const methods = panel.find("ul > li").toArray().map((node) => $(node).contents().toArray().map((part) => clean($(part).text())).filter(Boolean).join(" — ")).filter(Boolean);
      const shops = panel.find("article").toArray().map((node) => {
        const text = clean($(node).text());
        if (!text.includes("Quantity ") || text.startsWith("Where to buy ")) return null;
        const paragraphs = $(node).find("p").toArray().map((paragraph) => clean($(paragraph).text())).filter(Boolean);
        return {
          name: clean(text.slice(0, text.indexOf("Quantity "))),
          quantity: paragraphs.find((value) => value.startsWith("Quantity")) || `Quantity ${text.match(/Quantity\s+(.+?)(?:Price|Purchase limit|$)/)?.[1]?.trim() || ""}`.trim(),
          price: $(node).find('a[href^="/items/"]').toArray().map((link) => clean($(link).text())),
          limit: paragraphs.find((value) => value.startsWith("Purchase limit:")) || "",
        };
      }).filter((shop) => shop?.name);
      entries[slug] = { sourceUrl: url, methods, shops };
    } catch (error) { failures.push(`${slug}: ${error.message}`); }
  }
}));
const filled = Object.values(entries).filter((entry) => entry.methods.length || entry.shops.length).length;
if (Object.keys(entries).length < 18 || filled < 10) {
  throw new Error(`Only ${filled} item records have acquisition details; previous data remains untouched.`);
}
await writeFile(new URL("../src/data/research/item-uses.json", import.meta.url), `${JSON.stringify({ reviewedAt: new Date().toISOString().slice(0, 10), entries }, null, 2)}\n`);
console.log(`Imported acquisition and shop data for ${Object.keys(entries).length}/${bySlug.size} progression items.`);
if (failures.length) console.log(`Unavailable: ${failures.join(", ")}`);
