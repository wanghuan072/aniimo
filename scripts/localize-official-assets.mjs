import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "src/data/game/aniimo.json");
const assetRoot = path.join(root, "public/images/database");
const source = JSON.parse(await readFile(sourcePath, "utf8"));

const tasks = [];
for (const entry of source.entries) {
  entry.skills.forEach((skill, index) => {
    if (!skill.iconUrl?.startsWith("http")) return;
    const local = `/images/database/skills/${entry.slug}-${index + 1}.png`;
    tasks.push({ url: skill.iconUrl, file: path.join(assetRoot, `skills/${entry.slug}-${index + 1}.png`), local, target: skill });
  });
  entry.traits.forEach((trait, index) => {
    if (!trait.iconUrl?.startsWith("http")) return;
    const local = `/images/database/traits/${entry.slug}-${index + 1}.png`;
    tasks.push({ url: trait.iconUrl, file: path.join(assetRoot, `traits/${entry.slug}-${index + 1}.png`), local, target: trait });
  });
}

async function download(task) {
  try {
    await access(task.file);
    return true;
  } catch {}
  await mkdir(path.dirname(task.file), { recursive: true });
  const response = await fetch(task.url);
  if (!response.ok) return false;
  await writeFile(task.file, Buffer.from(await response.arrayBuffer()));
  return true;
}

const queue = [...tasks];
await Promise.all(Array.from({ length: 12 }, async () => {
  while (queue.length) {
    const task = queue.shift();
    if (await download(task)) task.target.iconUrl = task.local;
  }
}));
await writeFile(sourcePath, `${JSON.stringify(source, null, 2)}\n`);
console.log(`Localized ${tasks.length} official database icons.`);
