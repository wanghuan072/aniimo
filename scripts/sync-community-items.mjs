import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

const root = process.cwd();
const output = path.join(root, "src/data/research/community-database.json");
const imageRoot = path.join(root, "public/images/database/items");
const origin = "https://www.aniimoverse.com";
const keepCategories = new Set(["Material", "Key Item", "Equipment"]);
const headers = { "user-agent": "AniimoIndexDataSync/1.0", accept: "text/html" };
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&rsquo;/g, "’");
const strip = (value) => decode(String(value || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());

function iconFromImg(src) {
  if (!src) return "";
  try {
    const url = new URL(decode(src.split(" ")[0]), origin);
    return url.searchParams.get("url") || (src.startsWith("http") ? src.split(" ")[0] : "");
  } catch {
    return "";
  }
}

function parsePage(html) {
  const $ = load(html);
  const records = [];
  $("a[href^='/items/']").each((_, node) => {
    const $card = $(node);
    const title = $card.find(".catalog-record-title").first();
    if (!title.length) return;
    const slug = ($card.attr("href") || "").replace(/^\/items\//, "").split(/[?#]/)[0];
    if (!slug || slug === "vendors") return;
    const img = $card.find("img").attr("src") || $card.find("img").attr("srcset") || "";
    records.push({
      slug,
      name: strip(title.text()) || slug,
      description: strip($card.find(".line-clamp-2").first().text()) || "No description published.",
      rarity: strip($card.find("span.rounded-pill").first().text()) || "Unknown",
      category: strip($card.find("span.uppercase").last().text()) || "Other",
      iconUrl: iconFromImg(img),
    });
  });
  return records;
}

const crawled = new Map();
for (let page = 1; page <= 80; page += 1) {
  const response = await fetch(`${origin}/items${page > 1 ? `?page=${page}` : ""}`, { headers });
  if (!response.ok) throw new Error(`Items page ${page} returned ${response.status}`);
  const batch = parsePage(await response.text());
  if (!batch.length) break;
  let added = 0;
  for (const record of batch) {
    if (!crawled.has(record.slug)) added += 1;
    crawled.set(record.slug, record);
  }
  process.stdout.write(`\rItem catalogue ${page} (+${added}, ${crawled.size} unique)`);
  if (added === 0) break;
}
process.stdout.write("\n");

const overlay = [...crawled.values()].filter((record) => keepCategories.has(record.category));
const materialCount = overlay.filter((record) => record.category === "Material").length;
if (materialCount < 150) {
  throw new Error(`Only ${materialCount} material records parsed; previous catalogue remains untouched.`);
}

let previous = {};
try { previous = JSON.parse(await readFile(output, "utf8")); } catch {}

async function download(record) {
  if (!record.iconUrl) return;
  const local = `/images/database/items/${record.slug}.webp`;
  const target = path.join(imageRoot, `${record.slug}.webp`);
  try { await access(target); record.image = local; return; } catch {}
  const response = await fetch(record.iconUrl, { headers });
  if (!response.ok) return;
  await mkdir(imageRoot, { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  record.image = local;
}

const queue = overlay.slice();
await Promise.all(Array.from({ length: 16 }, async () => {
  while (queue.length) await download(queue.shift());
}));

const itemsBySlug = new Map((previous.items || []).map((record) => [record.slug, record]));
for (const record of overlay) {
  const current = itemsBySlug.get(record.slug) || {};
  itemsBySlug.set(record.slug, { ...current, ...record, image: record.image || current.image });
}
const items = [...itemsBySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
const materials = items.filter((item) => item.category.toLowerCase() === "material");

await writeFile(output, `${JSON.stringify({ ...previous, items, materials }, null, 2)}\n`);
const { writeSearchIndex } = await import("./write-search-index.mjs");
const searchCount = await writeSearchIndex();
console.log(`Merged ${overlay.length} Material/Key Item/Equipment records. Catalogue ${items.length} items, ${materials.length} materials. Search index ${searchCount}.`);
