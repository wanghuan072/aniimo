import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API = "https://www.aniimoverse.com/api/map";
const CDN = "https://cdn.aniimoverse.com/v1";
const ATLAS_IDS = ["breezy-plains", "astra", "whisperwake-isles", "lost-islets"];

async function fetchBuffer(url) {
  const candidates = [url];
  if (/\.(png|jpe?g|gif)(\?|$)/i.test(url)) candidates.push(url.replace(/\.(png|jpe?g|gif)(?=\?|$)/i, ".webp"));
  let last = `${url} failed`;
  for (const candidate of candidates) {
    const res = await fetch(candidate);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    last = `${res.status} ${candidate}`;
  }
  throw new Error(last);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function save(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

async function pool(items, limit, worker) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  }));
}

function localPoi(src) {
  if (!src.startsWith("/")) return src;
  if (src.startsWith("/aniimo/")) return src;
  return `/images/map${src}`;
}

const payloads = [];
for (const id of ATLAS_IDS) {
  console.log("atlas", id);
  payloads.push(await fetchJson(`${API}/${id}`));
}

const index = (payloads[0].index || []).map((entry) => ({
  ...entry,
  href: entry.id === "breezy-plains" ? "/map" : `/map?atlas=${entry.id}`,
  thumb: `/images/map/tiles/${entry.id}/base.webp`,
}));

const vocabulary = payloads[0].vocabulary || { times: {}, weather: {} };
const iconUrls = new Set();
const tileJobs = [];

for (const payload of payloads) {
  const atlas = payload.atlas;
  const { cols, rows } = atlas.meta.tiles;
  atlas.meta.tiles.template = `/images/map/tiles/${atlas.id}/{x}_{y}.webp`;
  atlas.icons = atlas.icons.map((src) => {
    const next = localPoi(src).replace(/\.(png|jpe?g|gif)$/i, ".webp");
    if (src.startsWith("/")) iconUrls.add(src);
    return next;
  });
  for (const category of atlas.categories) {
    for (const type of category.types) {
      if (type.art?.startsWith("/poi/")) {
        iconUrls.add(type.art);
        type.art = localPoi(type.art);
      }
    }
  }
  tileJobs.push({ id: atlas.id, file: "base.webp" });
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) tileJobs.push({ id: atlas.id, file: `${x}_${y}.webp` });
  }
  await save(path.join(ROOT, "src/data/map", `${atlas.id}.json`), `${JSON.stringify({ atlas, vocabulary: payload.vocabulary || vocabulary })}\n`);
}

if (index.length !== ATLAS_IDS.length) throw new Error(`Expected ${ATLAS_IDS.length} atlas index entries, got ${index.length}`);
for (const payload of payloads) {
  const atlas = payload.atlas;
  if (!atlas?.id || !Array.isArray(atlas.pois) || typeof atlas.total !== "number") {
    throw new Error(`Atlas payload is missing required fields (${atlas?.id || "unknown"})`);
  }
  if (!atlas.pois.length) throw new Error(`Atlas ${atlas.id} has no points`);
}

await save(path.join(ROOT, "src/data/map/index.json"), `${JSON.stringify({ index, vocabulary }, null, 2)}\n`);

console.log("tiles", tileJobs.length, "icons", iconUrls.size);
let tilesOk = 0;
let tilesSkip = 0;
await pool(tileJobs, 8, async (job) => {
  const url = `${CDN}/map-tiles/${job.id}/${job.file}`;
  const dest = path.join(ROOT, "public/images/map/tiles", job.id, job.file);
  try {
    await save(dest, await fetchBuffer(url));
    tilesOk += 1;
  } catch (error) {
    tilesSkip += 1;
    console.warn("skip tile", url, error.message);
  }
});

let iconsOk = 0;
let iconsSkip = 0;
await pool([...iconUrls], 8, async (src) => {
  const dest = path.join(ROOT, "public/images/map", src.replace(/^\//, "").replace(/\.(png|jpe?g|gif)$/i, ".webp"));
  try {
    await save(dest, await fetchBuffer(`${CDN}${src}`));
    iconsOk += 1;
  } catch (error) {
    iconsSkip += 1;
    console.warn("skip icon", src, error.message);
  }
});

console.log(`done tiles ${tilesOk}/${tileJobs.length} skipped ${tilesSkip} icons ${iconsOk} skipped ${iconsSkip}`);
