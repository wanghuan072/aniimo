import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "src", "data", "research", "skill-extras.json");
const ANIIMO_FILE = path.join(ROOT, "src", "data", "game", "aniimo.json");
const INDEX_URL = "https://www.aniimoverse.com/skills";
const EFFECT_KINDS = new Set(["Movement", "Buff", "Debuff", "Mechanic", "Damage", "Control"]);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "AniimoIndexDataSync/1.0", accept: "text/html" },
      });
      if (response.status === 404) return { status: 404, html: "" };
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return { status: response.status, html: await response.text() };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }
  throw lastError;
}

function labeledValue(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagged = html.match(new RegExp(`${escaped}</div><div class="mt-1 font-display[^"]*">([^<]+)`, "i"));
  if (tagged?.[1]) return tagged[1].replace(/&#x27;/g, "'").trim();
  const display = html.match(new RegExp(`${escaped}</span><span class="av-nums[^"]*">([^<]+)`, "i"));
  return display?.[1]?.replace(/&#x27;/g, "'").trim() || "";
}

function decode(value) {
  return value
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseEffects(html) {
  const effects = [];
  const pattern = /uppercase[^>]*>([A-Za-z ]+)<\/span><span class="min-w-\[180px\][^"]*"><span>([^<]+)/g;
  for (const match of html.matchAll(pattern)) {
    const kind = match[1].trim();
    if (!EFFECT_KINDS.has(kind)) continue;
    effects.push({ kind, text: decode(match[2]) });
  }
  return effects;
}

function parseTargeting(html) {
  const range = html.match(/configured range of ([0-9]+(?:\.[0-9]+)?)/i)?.[1];
  const shape = html.match(/in a (circular|fan-shaped|rectangular|linear) area/i)?.[1];
  const hitCap = html.match(/hit cap:\s*([0-9]+)/i)?.[1];
  const interval = html.match(/interval:\s*([0-9.]+s)/i)?.[1];
  if (!range && !shape && !hitCap && !interval) return null;
  return {
    ...(shape ? { shape } : {}),
    ...(range ? { range } : {}),
    ...(hitCap ? { hitCap } : {}),
    ...(interval ? { interval } : {}),
  };
}

function parseSkillPage(html, name, slug) {
  if (!html || html.includes("Page not found")) return null;
  const cooldown = labeledValue(html, "Cooldown");
  const breakValue = labeledValue(html, "Break");
  const teamRole = labeledValue(html, "Team role");
  const effects = parseEffects(html);
  const targeting = parseTargeting(html);
  if (!cooldown && !breakValue && !teamRole && effects.length === 0 && !targeting) return null;
  return {
    name,
    slug,
    cooldown,
    break: breakValue,
    teamRole,
    effects,
    targeting,
  };
}

async function mapConcurrent(items, limit, mapper) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return output;
}

const aniimo = JSON.parse(await readFile(ANIIMO_FILE, "utf8"));
const limit = Number(process.argv.find((argument) => argument.startsWith("--limit="))?.split("=")[1] || 0);
const names = [...new Set(aniimo.entries.flatMap((entry) => [
  ...entry.skills.map((skill) => skill.name),
  ...(entry.formRecords || []).flatMap((record) => (record.skills || []).map((skill) => skill.name)),
]))].sort((a, b) => a.localeCompare(b));
const targets = limit ? names.slice(0, limit) : names;

const records = (await mapConcurrent(targets, 6, async (name, index) => {
  const slug = slugify(name);
  process.stdout.write(`\rSkill extras ${index + 1}/${targets.length} ${slug.padEnd(28).slice(0, 28)}`);
  const { status, html } = await fetchText(`${INDEX_URL}/${slug}`);
  if (status === 404) return { name, slug, missing: true };
  return parseSkillPage(html, name, slug) || { name, slug, empty: true };
})).filter((record) => record && !record.missing && !record.empty);

process.stdout.write("\n");

const payload = {
  source: {
    name: "AniimoVerse",
    url: INDEX_URL,
    grade: "community",
    syncedAt: new Date().toISOString(),
    note: "Cooldown, BREAK, team role, parsed effects and targeting come from AniimoVerse skill pages. Official Wiki does not publish these fields. EP cost and power stay on the official records.",
  },
  requested: targets.length,
  count: records.length,
  records,
};

await mkdir(path.dirname(DATA_FILE), { recursive: true });
await writeFile(DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${records.length}/${targets.length} skill extras to ${path.relative(ROOT, DATA_FILE)}`);
