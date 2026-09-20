import { writeFile } from "node:fs/promises";
import { load } from "cheerio";

const sourceUrl = "https://www.aniimoverse.com/aniilog";
const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Aniilog request failed: ${response.status}`);
const $ = load(await response.text());
const heading = $("h2").filter((_, el) => $(el).text().trim() === "Unreleased Aniimo found in the game files").first();
const lists = heading.closest("section").find("ul");
if (lists.length < 2) throw new Error("Unreleased Aniimo sections were not found");

function imageUrl(image) {
  const src = image.attr("src");
  if (!src) throw new Error("Missing unreleased portrait");
  const url = new URL(src, sourceUrl);
  const original = url.searchParams.get("url") || url.href;
  if (!original.startsWith("https://cdn.aniimoverse.com/v1/aniimo/unreleased/")) {
    throw new Error(`Unexpected portrait URL: ${original}`);
  }
  return original;
}

const species = lists.eq(0).children("li").map((_, el) => {
  const card = $(el);
  const details = card.children("div").last();
  const id = details.children("span").first().text().trim();
  const labels = details.children("span").map((_, span) => $(span).text().trim()).get();
  const alternateForms = card.find("img").map((_, image) => imageUrl($(image))).get()
    .filter((url) => url.includes("/unreleased/forms/"))
    .map((image) => ({ id: image.match(/\/(\d+)\.webp$/)?.[1], image }));
  return {
    id,
    name: details.find("strong").first().text().trim(),
    note: labels[1] || "",
    alternateForms,
    assetStatus: labels.at(-1) || "Artwork only",
    image: imageUrl(card.find("img").first()),
  };
}).get();

const forms = lists.eq(1).children("li").map((_, el) => {
  const card = $(el);
  const link = card.find("a[href^='/aniilog/']").first();
  const image = imageUrl(card.find("img").first());
  return {
    id: image.match(/\/(\d+)\.webp$/)?.[1],
    name: link.text().trim(),
    href: link.attr("href"),
    image,
  };
}).get();

const speciesFormCount = species.reduce((sum, entry) => sum + entry.alternateForms.length, 0);
if (species.length !== 33 || forms.length !== 15 || speciesFormCount !== 10 || species.some(({ id, name, alternateForms }) => !id || !name || alternateForms.some(({ id: formId }) => !formId)) || forms.some(({ id, name, href }) => !id || !name || !href)) {
  throw new Error(`Unexpected unreleased coverage: ${species.length} species, ${speciesFormCount} internal forms, ${forms.length} known forms`);
}

const data = { sourceUrl, reviewedAt: new Date().toISOString().slice(0, 10), species, forms };
await writeFile(new URL("../src/data/research/unreleased-aniimo.json", import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Imported ${species.length} unreleased species cards, ${speciesFormCount} forms of those species, and ${forms.length} forms of known Aniimo.`);
