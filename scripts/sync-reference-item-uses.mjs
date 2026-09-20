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
      const section = (prefix) => $("main h2").filter((_, node) => clean($(node).text()).startsWith(prefix)).first().parent().parent();
      const methods = section("How to get ").find("ul > li").toArray().map((node) => $(node).contents().toArray().map((part) => clean($(part).text())).filter(Boolean).join(" — ")).filter(Boolean);
      const shops = section("Where to buy ").find("article").toArray().map((node) => ({
        name: clean($(node).find("h3").first().text()),
        quantity: clean($(node).find("p").first().text()),
        price: $(node).find('a[href^="/items/"]').toArray().map((link) => clean($(link).text())),
        limit: $(node).find("p").toArray().map((paragraph) => clean($(paragraph).text())).find((value) => value.startsWith("Purchase limit:")) || "",
      })).filter((shop) => shop.name);
      entries[slug] = { sourceUrl: url, methods, shops };
    } catch (error) { failures.push(`${slug}: ${error.message}`); }
  }
}));
if (Object.keys(entries).length < 18) throw new Error(`Only ${Object.keys(entries).length} item records parsed; previous data remains untouched.`);
await writeFile(new URL("../src/data/research/item-uses.json", import.meta.url), `${JSON.stringify({ reviewedAt: new Date().toISOString().slice(0, 10), entries }, null, 2)}\n`);
console.log(`Imported acquisition and shop data for ${Object.keys(entries).length}/${bySlug.size} progression items.`);
if (failures.length) console.log(`Unavailable: ${failures.join(", ")}`);
