import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "src/data/research/community-database.json");
const imageRoot = path.join(root, "public/images/database/items");
const origin = "https://www.aniimoverse.com";
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&rsquo;/g, "’");
const strip = (value) => decode(value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());

function parsePage(html) {
  return [...html.matchAll(/<a class="no-underline" href="\/items\/([^"]+)">([\s\S]*?)<\/a>/g)].map((match) => {
    const [, slug, card] = match;
    const source = (card.match(/<img[^>]+src="([^"]+)/) || [])[1] || "";
    const iconUrl = new URL(decode(source), origin).searchParams.get("url") || "";
    const name = strip((card.match(/font-display[^"]*">([\s\S]*?)<\//) || [])[1] || slug);
    const description = strip((card.match(/line-clamp-2[^"]*">([\s\S]*?)<\//) || [])[1] || "No description published.");
    const rarity = strip((card.match(/text-\[9\.5px\]"[^>]*>([\s\S]*?)<\//) || [])[1] || "Unknown");
    const category = strip((card.match(/tracking-\[\.1em\][^"]*">([\s\S]*?)<\//) || [])[1] || "Other");
    return { slug, name, description, rarity, category, iconUrl };
  });
}

const bySlug = new Map();
for (let page = 1; page <= 40; page += 1) {
  const response = await fetch(`${origin}/items${page > 1 ? `?page=${page}` : ""}`);
  if (!response.ok) throw new Error(`Items page ${page} returned ${response.status}`);
  for (const record of parsePage(await response.text())) bySlug.set(record.slug, record);
}
const items = [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));

async function download(record) {
  if (!record.iconUrl) return;
  const local = `/images/database/items/${record.slug}.webp`;
  const target = path.join(imageRoot, `${record.slug}.webp`);
  try { await access(target); record.image = local; return; } catch {}
  const response = await fetch(record.iconUrl);
  if (!response.ok) return;
  await mkdir(imageRoot, { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  record.image = local;
}

let previous = {};
try { previous = JSON.parse(await readFile(output, "utf8")); } catch {}
const materials = items.filter((item) => item.category.toLowerCase() === "material");
await writeFile(output, `${JSON.stringify({ ...previous, items, materials }, null, 2)}\n`);

const queue = [...items];
await Promise.all(Array.from({ length: 16 }, async () => {
  while (queue.length) await download(queue.shift());
}));

await writeFile(output, `${JSON.stringify({ ...previous, items, materials }, null, 2)}\n`);
console.log(`Saved ${items.length} item records and ${materials.length} material records.`);
