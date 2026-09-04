import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "src", "data", "game", "aniimo.json");
const IMAGE_DIR = path.join(ROOT, "public", "images", "aniimo");
const ASSET_DIR = path.join(ROOT, "public", "images", "wiki");
const WIKI_URL = "https://wiki.aniimo.com/en";
const WIKI_DETAIL_URL = "https://wiki.aniimo.com/item";
const SKILL_ELEMENT_MAP = {
  2: "ice",
  3: "water",
  4: "electric",
  5: "fire",
  6: "grass",
  8: "rock",
  9: "wind",
  12: "dark",
  13: "holy",
};
const SKILL_TYPE_MAP = { 0: "Support", 1: "Physical", 2: "Magic" };

function decodeNuxtPayload(html) {
  const match = html.match(
    /<script type="application\/json"[^>]+id="__NUXT_DATA__">([\s\S]*?)<\/script>/,
  );
  if (!match) throw new Error("Nuxt payload was not found");

  const flat = JSON.parse(match[1]);
  const memo = new Map();

  function reference(value) {
    if (typeof value !== "number") return value;
    if (value < 0) {
      if (value === -1) return undefined;
      if (value === -2) return Number.NaN;
      if (value === -3) return Number.POSITIVE_INFINITY;
      if (value === -4) return Number.NEGATIVE_INFINITY;
      if (value === -5) return -0;
      return undefined;
    }
    return hydrate(value);
  }

  function hydrate(index) {
    if (memo.has(index)) return memo.get(index);
    const value = flat[index];
    if (value === null || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const tag = value[0];
        if (["ShallowReactive", "Reactive", "Ref", "ShallowRef"].includes(tag)) {
          return reference(value[1]);
        }
        if (tag === "Set") return [...new Set(value.slice(1).map(reference))];
      }
      const array = [];
      memo.set(index, array);
      for (const item of value) array.push(reference(item));
      return array;
    }

    const object = {};
    memo.set(index, object);
    for (const [key, item] of Object.entries(value)) object[key] = reference(item);
    return object;
  }

  return hydrate(0);
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "AniimoIndexDataSync/1.0" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 350));
    }
  }
  throw lastError;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeTags(values = [], prefix) {
  return values.map((value) => value.replace(`${prefix}-`, ""));
}

function flattenEvolution(node, result = []) {
  if (!node) return result;
  result.push({
    name: node.name,
    stage: Number(node.stage),
    imageUrl: node.icon || "",
    isVariant: Boolean(node.condition?.isVariant),
  });
  for (const child of node.children || []) flattenEvolution(child, result);
  return result;
}

function normalizeEvolutionTree(node) {
  if (!node) return null;
  return {
    name: node.name,
    stage: Number(node.stage),
    imageUrl: node.icon || "",
    isVariant: Boolean(node.condition?.isVariant),
    children: (node.children || []).map(normalizeEvolutionTree),
  };
}

function normalizeSkillValues(values, map) {
  return (values || []).map((value) => map[String(value)]).filter(Boolean);
}

function findComponents(detail) {
  const collected = [];
  function walk(component, section = "") {
    if (!component) return;
    const currentSection = component.type === "crumbTitle" ? component.props?.title : section;
    collected.push({ component, section: currentSection });
    for (const child of component.children || []) walk(child, currentSection);
    for (const tab of component.props?.tabs || []) {
      for (const child of tab.children || []) walk(child, `${currentSection}:${tab.title}`);
    }
  }
  for (const directory of detail?.directories || []) {
    for (const component of directory.components || []) walk(component, directory.title);
  }
  return collected;
}

function normalizeDetail(listItem, detail, options = {}) {
  const source = detail?.searchKey || listItem.searchKey;
  const components = findComponents(detail);
  const info = components.find(({ component }) => component.type === "aniimoInfo")?.component
    ?.props?.formData;
  const evolution = components.find(({ component }) => component.type === "evolution")?.component
    ?.props?.data;
  const habitats = components
    .filter(({ component, section }) => component.type === "capsule" && section === "Habitats")
    .map(({ component }) => component.props?.title)
    .filter(Boolean);
  const homelandAbilities = components
    .filter(({ component, section }) => component.type === "capsule" && section === "Homeland Ability")
    .map(({ component }) => ({
      key: component.props?.customKey || "home-unknown",
      value: component.props?.title || "0",
    }))
    .filter((ability) => ability.key !== "home-unknown");
  const mobility = components
    .filter(({ component, section }) => component.type === "circle" && section === "Mobility")
    .map(({ component }) => ({
      name: component.props?.descTitle || component.props?.iconTitle || "Mobility",
      description: component.props?.descContent || "",
      iconUrl: component.props?.icon || "",
    }));
  const pathfinding = components
    .filter(({ component, section }) => component.type === "circle" && section === "Pathfinding")
    .map(({ component }) => component.props?.iconTitle || component.props?.descTitle)
    .filter(Boolean);
  const traits = components
    .filter(({ component, section }) => component.type === "circle" && section === "Trait")
    .map(({ component }) => ({
      name: component.props?.descTitle || "Trait",
      description: component.props?.descContent || "",
      iconUrl: component.props?.icon || "",
    }));
  const skills = components
    .filter(({ component, section }) => component.type === "circle" && section.startsWith("Skill Details"))
    .map(({ component, section }) => ({
      name: component.props?.descTitle || "Skill",
      description: component.props?.descContent || "",
      category: section.split(":")[1] || "Combat",
      elements: normalizeSkillValues(component.props?.source?.attributes, SKILL_ELEMENT_MAP),
      types: normalizeSkillValues(component.props?.source?.type, SKILL_TYPE_MAP),
      iconUrl: component.props?.icon || "",
      cost: component.props?.source?.consume || "",
      power: component.props?.source?.power || "",
    }));
  const slug = options.slug || slugify(source.name);
  const id = String(options.formId || listItem.id);

  return {
    id,
    entryId: source.entryId,
    slug,
    name: source.name,
    description: source.description,
    image: options.formId ? `/images/aniimo/forms/${id}.png` : `/images/aniimo/${slug}.png`,
    officialImageUrl: source.imageUrl,
    illustrationUrl: info?.illustrationImage || "",
    form: source.currentMorphology,
    stage: Number(source.currentStage),
    roles: normalizeTags(info?.position || source.position, "position"),
    elements: normalizeTags(info?.attributes || source.attributes, "attributes"),
    gender: info?.gender || [],
    weight: {
      min: info?.weightMin ?? null,
      max: info?.weightMax ?? null,
    },
    stats: info
      ? {
          hp: info.hp,
          physicalAttack: info.physicalAttack,
          magicAttack: info.magicAttack,
          physicalDefense: info.physicalDefense,
          magicDefense: info.magicDefense,
          haste: info.haste,
          attributeValue: info.attributeValue,
        }
      : null,
    forms: (detail?.morphologyList || []).map((form) => ({
      id: String(form.id),
      label: form.currentMorphology || "Form",
      isCurrent: String(form.id) === id,
    })),
    habitats,
    homelandAbilities,
    mobility,
    pathfinding,
    evolution: flattenEvolution(evolution),
    evolutionTree: normalizeEvolutionTree(evolution),
    traits,
    skills,
    viewCount: detail?.viewCount ?? null,
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

async function downloadImage(entry) {
  if (!entry.officialImageUrl.startsWith("http")) return;
  const destination = path.join(ROOT, "public", entry.image);
  await mkdir(path.dirname(destination), { recursive: true });
  const response = await fetch(entry.officialImageUrl);
  if (!response.ok) throw new Error(`Image ${entry.name}: ${response.status}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

const assetCache = new Map();
async function localizeAsset(url) {
  if (!url || url.startsWith("/")) return url;
  if (assetCache.has(url)) return assetCache.get(url);
  const extension = path.extname(new URL(url).pathname).match(/^\.[a-z0-9]{1,5}$/i)?.[0] || ".png";
  const fileName = `${createHash("sha1").update(url).digest("hex")}${extension}`;
  const localUrl = `/images/wiki/${fileName}`;
  assetCache.set(url, localUrl);
  const response = await fetch(url);
  if (!response.ok) {
    assetCache.set(url, "");
    return "";
  }
  await writeFile(path.join(ASSET_DIR, fileName), Buffer.from(await response.arrayBuffer()));
  return localUrl;
}

async function localizeRecordAssets(record) {
  record.officialImageUrl = await localizeAsset(record.officialImageUrl);
  record.illustrationUrl = await localizeAsset(record.illustrationUrl);
  await Promise.all([
    ...record.evolution.map(async (node) => { node.imageUrl = await localizeAsset(node.imageUrl); }),
    ...record.traits.map(async (trait) => { trait.iconUrl = await localizeAsset(trait.iconUrl); }),
    ...record.skills.map(async (skill) => { skill.iconUrl = await localizeAsset(skill.iconUrl); }),
    ...record.mobility.map(async (ability) => { ability.iconUrl = await localizeAsset(ability.iconUrl); }),
  ]);
  async function localizeEvolutionTree(node) {
    if (!node) return;
    node.imageUrl = await localizeAsset(node.imageUrl);
    await Promise.all((node.children || []).map(localizeEvolutionTree));
  }
  await localizeEvolutionTree(record.evolutionTree);
}

async function main() {
  const inspectId = process.argv.find((argument) => argument.startsWith("--inspect="))?.split("=")[1];
  if (inspectId) {
    const payload = decodeNuxtPayload(await fetchText(`${WIKI_DETAIL_URL}/${inspectId}`));
    const detail = Object.entries(payload.data).find(([key]) => key.startsWith(`aniimo-detail-${inspectId}-`))?.[1];
    const components = findComponents(detail);
    console.log(JSON.stringify({
      detailKeys: detail ? Object.keys(detail) : [],
      morphologyList: detail?.morphologyList,
      searchKey: detail?.searchKey,
      sections: components.map(({ component, section }) => ({
        section,
        type: component.type,
        props: component.props,
      })),
    }, null, 2));
    return;
  }

  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  await mkdir(ASSET_DIR, { recursive: true });

  const indexPayload = decodeNuxtPayload(await fetchText(WIKI_URL));
  const list = indexPayload.data["aniimo-wiki-list-en"];
  if (!Array.isArray(list) || list.length < 90) {
    throw new Error(`Expected at least 90 official records, received ${list?.length || 0}`);
  }

  let entries = await mapConcurrent(list, 8, async (item, index) => {
    try {
      const payload = decodeNuxtPayload(await fetchText(`${WIKI_DETAIL_URL}/${item.id}`));
      const detail = Object.entries(payload.data).find(([key]) =>
        key.startsWith(`aniimo-detail-${item.id}-`),
      )?.[1];
      process.stdout.write(`\rOfficial details ${index + 1}/${list.length}`);
      return normalizeDetail(item, detail);
    } catch (error) {
      console.warn(`\nDetail fallback for ${item.searchKey.name}: ${error.message}`);
      return normalizeDetail(item, null);
    }
  });

  const variantParents = new Map();
  for (const entry of entries) {
    const parent = list.find((item) => String(item.id) === entry.id);
    for (const form of entry.forms) if (form.id !== entry.id && parent) variantParents.set(form.id, { parent, slug: entry.slug });
  }
  const variants = await mapConcurrent([...variantParents], 8, async ([formId, parent], index) => {
    const payload = decodeNuxtPayload(await fetchText(`${WIKI_DETAIL_URL}/${formId}`));
    const detail = Object.entries(payload.data).find(([key]) => key.startsWith(`aniimo-detail-${formId}-`))?.[1];
    process.stdout.write(`\rOfficial form details ${index + 1}/${variantParents.size}`);
    return [formId, normalizeDetail(parent.parent, detail, { formId, slug: parent.slug })];
  });
  const variantMap = new Map(variants);
  const toFormRecord = (record) => {
    const formRecord = { ...record };
    for (const key of ["entryId", "slug", "name", "forms", "formRecords", "voteImage"]) delete formRecord[key];
    return formRecord;
  };
  entries = entries.map((entry) => ({
    ...entry,
    formRecords: entry.forms.map((form) => form.id === entry.id ? toFormRecord(entry) : toFormRecord(variantMap.get(form.id))).filter(Boolean),
  }));

  process.stdout.write("\nDownloading official creature images…\n");
  await mapConcurrent([...entries, ...variants.map(([, entry]) => entry)], 12, downloadImage);

  await mapConcurrent([...entries, ...variants.map(([, entry]) => entry)], 12, localizeRecordAssets);
  await mapConcurrent(entries.flatMap((entry) => entry.formRecords), 12, localizeRecordAssets);

  const payload = {
    source: {
      name: "Official Aniimo Wiki",
      url: WIKI_URL,
      syncedAt: new Date().toISOString(),
      note: "Names, descriptions, elements, roles, stages, base stats, evolution, habitats, traits and skills are normalized from the official English Wiki.",
    },
    count: entries.length,
    entries,
  };
  await writeFile(DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  if (entries.length < 1) throw new Error("Official sync produced no Aniimo records");
  const { writeSearchIndex } = await import("./write-search-index.mjs");
  const searchCount = await writeSearchIndex();
  console.log(`Saved ${entries.length} records to ${path.relative(ROOT, DATA_FILE)}`);
  console.log(`Wrote ${searchCount} search records`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
