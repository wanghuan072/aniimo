import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const origin = "https://www.aniimoverse.com";
const headers = { "user-agent": "AniimoIndexDataSync/1.0", accept: "text/html" };
const usesFile = new URL("../src/data/research/item-uses.json", import.meta.url);
const catalogFile = new URL("../src/data/research/community-database.json", import.meta.url);
const strip = (value) => String(value || "").replace(/\s+/g, " ").trim();

function itemSlug(href) {
  const raw = (href || "").split("/").filter(Boolean).at(-1)?.split(/[?#]/)[0] || "";
  return raw.replace(/-\d{5,}$/, "") || raw;
}

function parseOffers(html) {
  const $ = load(html);
  const skip = new Set(["Search AniimoVerse", "Database", "Tools", "Community"]);
  const offers = [];
  let shop = "";
  $("main").find("h2, div.flex.items-start.gap-3").each((_, node) => {
    if (node.tagName === "h2") {
      const name = strip($(node).text());
      if (name && !skip.has(name)) shop = name;
      return;
    }
    if (!shop) return;
    const $row = $(node);
    const itemLink = $row.find('a[href^="/items/"]').filter((_, link) => strip($(link).text())).first();
    const href = itemLink.attr("href") || "";
    const slug = itemSlug(href);
    if (!slug || slug === "vendors") return;
    const currencyLink = $row.find('a[href^="/items/"]').filter((_, link) => {
      const path = $(link).attr("href") || "";
      return path !== href && strip($(link).text());
    }).last();
    const amount = strip($row.text()).match(/Base cost\s*([\d,]+)/i)?.[1]?.replace(/,/g, "") || "";
    const currency = strip(currencyLink.text()) || "Credits";
    const cap = strip($row.text()).match(/Cap\s+(.+?)(?:Epic|Legendary|Rare|Uncommon|Common|Prismatic|Base cost|$)/i)?.[1] || "";
    offers.push({
      slug,
      sourceUrl: `${origin}${href}`,
      shop: {
        name: shop,
        quantity: "Quantity 1",
        price: amount ? [`${currency}×${Number(amount).toLocaleString("en-US")}`] : [currency],
        limit: cap ? `Purchase limit: ${cap.replace(/\s+/g, " ").trim()}.` : "",
      },
    });
  });
  return offers;
}

const catalog = JSON.parse(await readFile(catalogFile, "utf8"));
const knownSlugs = new Set((catalog.items || []).map((item) => item.slug));
const previous = JSON.parse(await readFile(usesFile, "utf8"));
const entries = { ...(previous.entries || {}) };
const allOffers = [];
for (let page = 1; page <= 12; page += 1) {
  const response = await fetch(`${origin}/items/vendors${page > 1 ? `?page=${page}` : ""}`, { headers });
  if (!response.ok) throw new Error(`Vendors page ${page} returned ${response.status}`);
  const batch = parseOffers(await response.text());
  if (!batch.length) break;
  allOffers.push(...batch);
  process.stdout.write(`\rVendor listings ${page} (${allOffers.length})`);
}
process.stdout.write("\n");
if (allOffers.length < 200) throw new Error(`Only ${allOffers.length} vendor listings parsed; previous item-uses remain untouched.`);

let attached = 0;
for (const offer of allOffers) {
  if (!knownSlugs.has(offer.slug) && !entries[offer.slug]) continue;
  const current = entries[offer.slug] || { sourceUrl: offer.sourceUrl, methods: [], shops: [] };
  const key = `${offer.shop.name}|${offer.shop.price.join("+")}|${offer.shop.limit}`;
  const existing = new Set((current.shops || []).map((shop) => `${shop.name}|${(shop.price || []).join("+")}|${shop.limit || ""}`));
  if (!existing.has(key)) {
    current.shops = [...(current.shops || []), offer.shop];
    attached += 1;
  }
  if (!current.sourceUrl) current.sourceUrl = offer.sourceUrl;
  entries[offer.slug] = current;
}

const filled = Object.values(entries).filter((entry) => entry.shops?.length).length;
await writeFile(usesFile, `${JSON.stringify({ reviewedAt: new Date().toISOString().slice(0, 10), entries }, null, 2)}\n`);
console.log(`Kept ${Object.keys(entries).length} item-use records; ${filled} have shop offers; ${attached} new vendor rows matched the catalogue.`);
