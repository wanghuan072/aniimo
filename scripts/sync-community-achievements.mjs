import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "src/data/research/community-database.json");
const assetRoot = path.join(root, "public/images/database/achievements");
const html = await (await fetch("https://www.aniimoverse.com/achievements")).text();
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&rsquo;/g, "’");
const strip = (value) => decode(value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
const records = [...html.matchAll(/<a href="\/achievements\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => {
  const [, slug, card] = match;
  const name = strip((card.match(/font-display[^>]*truncate">([\s\S]*?)<\//) || [])[1] || slug);
  const source = (card.match(/<img[^>]+src="([^"]+)/) || [])[1] || "";
  const iconUrl = new URL(decode(source), "https://www.aniimoverse.com").searchParams.get("url") || "";
  const text = strip(card);
  return { slug, name, description: text.replace(name, "").trim() || "Achievement badge line.", rarity: "Badge line", category: "Achievement", iconUrl };
});
const bySlug = [...new Map(records.map((record) => [record.slug, record])).values()];
await mkdir(assetRoot, { recursive: true });
await Promise.all(bySlug.map(async (record) => {
  if (!record.iconUrl) return;
  const response = await fetch(record.iconUrl);
  if (!response.ok) return;
  await writeFile(path.join(assetRoot, `${record.slug}.webp`), Buffer.from(await response.arrayBuffer()));
  record.image = `/images/database/achievements/${record.slug}.webp`;
}));
const data = JSON.parse(await readFile(output, "utf8"));
data.achievements = bySlug;
await writeFile(output, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${bySlug.length} achievement record groups.`);
