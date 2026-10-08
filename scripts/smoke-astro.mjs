import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { load } from "cheerio";

const base = process.env.ASTRO_TEST_URL || "http://127.0.0.1:4321";
const staticRoot = process.env.ASTRO_TEST_STATIC_DIR ? resolve(process.env.ASTRO_TEST_STATIC_DIR) : "";
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json"],
  [".png", "image/png"], [".webp", "image/webp"], [".avif", "image/avif"],
  [".svg", "image/svg+xml"], [".woff2", "font/woff2"], [".ico", "image/x-icon"],
]);
const staticFileFor = (value) => {
  const pathname = decodeURIComponent(new URL(value, base).pathname);
  let relative = pathname.replace(/^\/+/, "");
  if (!relative) relative = "index.html";
  else if (!extname(relative)) relative += ".html";
  const file = normalize(join(staticRoot, relative));
  return file.startsWith(normalize(staticRoot)) ? file : "";
};
const readStaticResponse = async (value) => {
  const file = staticFileFor(value);
  if (!file) return { status: 403, body: Buffer.from("Forbidden"), contentType: "text/plain" };
  try { return { status: 200, body: await readFile(file), contentType: contentTypes.get(extname(file)) || "application/octet-stream" }; }
  catch { return { status: 404, body: Buffer.from("Not found"), contentType: "text/plain" }; }
};
if (staticRoot) {
  globalThis.fetch = async (input) => {
    const result = await readStaticResponse(typeof input === "string" || input instanceof URL ? input : input.url);
    return new Response(result.body, { status: result.status, headers: { "content-type": result.contentType } });
  };
}
const routeStaticFiles = async (page) => {
  if (!staticRoot) return;
  await page.route(`${base}/**`, async (route) => {
    const result = await readStaticResponse(route.request().url());
    await route.fulfill(result);
  });
};
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const currentProfiles = JSON.parse(await readFile(new URL("../src/data/research/current-profile-kits.json", import.meta.url), "utf8")).profiles;
const profileByPath = new Map(currentProfiles.map((profile) => [`/aniimo/${profile.slug}`, profile]));
assert.equal(currentProfiles.length, 98);
assert.equal(currentProfiles.reduce((sum, profile) => sum + profile.forms.length, 0), 235);
let checked = 0;
for (const path of urls) {
  if (path === "/tools/type-chart") continue; // Vercel handles this legacy redirect.
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  const html = await response.text();
  assert.match(html, /<title>[^<]+<\/title>/, `${path} has no title`);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path} must have exactly one H1 in static HTML`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, `${path} has no canonical`);
  assert.equal(new URL(canonical[1]).pathname, path, `${path} has a mismatched canonical`);
  assert.doesNotMatch(html, /\/_next\//, `${path} still includes Next assets`);
  const profile = profileByPath.get(path);
  if (profile) {
    const $ = load(html);
    assert.equal($("[data-form-panel]").length, profile.forms.length, `${path} has incomplete form panels`);
    assert.match($("[data-form-panel]").first().text(), /Current Base Stats/, `${path} lacks current base fields`);
    const visibleSkills = new Set($("[data-form-panel] [class*='skillCard'] h3").map((_, node) => $(node).text().trim()).get());
    for (const skill of profile.skills) assert.ok(visibleSkills.has(skill.name), `${path} does not show ${skill.name} in any form`);
  }
  checked++;
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
await routeStaticFiles(page);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.clock.install({ time: new Date("2026-09-30T12:00:00Z") });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  assert.equal((await page.locator("h1").innerText()).replace("✦", "").replace(/\s+/g, " ").trim(), "Explore the world of Aniimo");
  assert.match(await page.locator("[data-home-hero] img").getAttribute("src"), /aniimo-world-hero-v2-960\.webp$/);
  assert.equal(await page.locator('[data-home-section="start"] a').count(), 6);
  for (const section of ["live", "tools", "editorial", "stories", "next"]) assert.equal(await page.locator(`[data-home-section="${section}"]`).count(), 1, `home is missing ${section}`);
  assert.match(await page.locator("[data-home-stats]").innerText(), /98\s+Aniimo/);
  assert.equal(await page.locator("[data-home-region]").count(), 3);
  await page.locator('[data-home-region="america"]').click();
  assert.equal(await page.locator('[data-home-region="america"]').getAttribute("aria-pressed"), "true");
  assert.match(await page.locator("[data-home-event-time]").first().innerText(), /America/);
  assert.equal(await page.locator("[data-home-journey] a").count(), 5);
  for (const href of ["/aniimo", "/database", "/map", "/team-builder", "/guides"]) assert.ok(await page.locator(`[data-home-journey] a[href="${href}"]`).count() === 1);
  assert.equal(await page.locator('a[href^="http"]').count(), 0);
  assert.ok(await page.locator('a[href="/legal/about-us"]').count() >= 1);
  assert.ok(await page.locator('a[href="/sources"]').count() >= 1);

  await page.goto(`${base}/aniimo`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-card]").count(), 98);
  await page.locator("[data-open-search]").click();
  await page.locator("[data-search-input]").fill("Squarrel");
  await page.locator('[data-search-results] a[href="/aniimo/squarrel"]').first().waitFor();
  await page.locator("[data-close-search]").click();
  for (const slug of ["squarrel", "squashel", "irisalis", "sparkelf", "lunara", "hexxin"]) {
    assert.ok(await page.locator(`[data-card][data-name="${slug}"]`).count() > 0, `${slug} missing from index`);
  }
  await page.locator('details[class*="moreFilters"] summary').click();
  await page.locator('[data-filter="stage"][data-value="4"]').click();
  assert.ok(await page.locator('[data-card][data-name="irisalis"]').isVisible());
  await page.locator('[data-filter="stage"][data-value="all"]').click();
  await page.locator("[data-search]").fill("Emberpup");
  assert.ok(await page.locator("[data-card]:visible").count() >= 1);
  assert.ok(await page.locator('[data-card][data-name="emberpup"]').isVisible());
  assert.ok(await page.getByRole("heading", { name: "Unreleased Aniimo found in the game files" }).count() === 1);
  assert.ok(await page.getByRole("heading", { name: "Unreleased forms of known Aniimo" }).count() === 1);
  assert.equal(await page.locator('article[class*="unreleasedCard"]').count(), 48);
  assert.equal(await page.locator('[class*="unreleasedVariants"]').count(), 0);
  assert.match(await page.locator('[class*="unreleasedPortrait"] img').first().getAttribute("src"), /^https:\/\/cdn\.aniimoverse\.com\/v1\/aniimo\/unreleased\//);
  await page.goto(`${base}/aniimo/squarrel`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.getByRole("heading", { name: "Evolution Path" }).isVisible());
  assert.ok(await page.getByRole("heading", { name: "Recommended build" }).isVisible());
  assert.match(await page.locator('[class*="referenceStats"]').innerText(), /HP/);
  await page.goto(`${base}/aniimo/lunara`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.locator(`[data-select-form="10002823"]`).count() > 0);
  await page.goto(`${base}/aniimo/witchin`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("h1").innerText(), "Hexxin");
  await page.goto(`${base}/aniimo/fennelun`, { waitUntil: "domcontentloaded" });
  assert.match(await page.locator("[data-aniimo-detail]").innerText(), /Lunara’s temporary battle transformation/);
  await page.goto(`${base}/aniimo`, { waitUntil: "domcontentloaded" });

  await page.goto(`${base}/aniimo/emberpup`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-form-panel]:visible").count(), 1);
  assert.equal(await page.locator("h1").count(), 1);
  assert.ok(await page.getByRole("heading", { name: "Recommended build" }).isVisible());
  assert.ok(await page.getByRole("heading", { name: "Resonance Training" }).isVisible());
  assert.ok(await page.getByRole("heading", { name: "Aniimo Research" }).isVisible());
  await page.locator(".trainingLevels summary").nth(1).click();
  assert.match(await page.locator(".trainingLevels").nth(1).innerText(), /Level 2/);
  assert.match(await page.locator("[data-spawn-areas] li:first-child small").innerText(), /Day|Night/);
  const forms = page.locator("[data-select-form]");
  if (await forms.count() > 1) {
    await forms.nth(1).click();
    assert.equal(await forms.nth(1).getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("h1:visible").count(), 1);
  }
  await page.locator('[data-spawn-time="night"]').click();
  assert.match(await page.locator("[data-spawn-intro]").innerText(), /at night/);
  assert.match(await page.locator("[data-spawn-summary]").innerText(), /pin/);

  await page.goto(`${base}/aniimo/emberpup?form=10002771`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.locator('[data-form-panel="10002771"]').isVisible());
  assert.equal(await page.locator('[data-select-form="10002771"]').getAttribute("aria-pressed"), "true");
  await page.goto(`${base}/database/elements`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.locator('a[href="/aniimo/emberpup?form=10002771"]').count() > 0);
  await page.goto(`${base}/database/skills`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.locator('a[href="/aniimo/emberpup?form=10002771"]').count() > 0);
  await page.goto(`${base}/database/work-abilities`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.getByRole("heading", { name: "Fire", exact: true }).isVisible());
  assert.ok(await page.locator('[class*="workCard"] a[href*="?form="]').count() > 0);
  await page.goto(`${base}/database/items?q=blaze`, { waitUntil: "domcontentloaded" });
  await page.locator('#blaze-stone [data-item-uses] summary').click();
  assert.match(await page.locator('#blaze-stone [data-item-uses]').innerText(), /Mysterious Vendor/);
  await page.goto(`${base}/sources`, { waitUntil: "domcontentloaded" });
  assert.match(await page.getByRole("heading", { name: "Roster coverage review" }).locator("..").innerText(), /98 species|98\./i);
  await page.goto(`${base}/database/achievements`, { waitUntil: "domcontentloaded" });
  assert.match(await page.locator("[data-community-catalog=achievements]").innerText(), /85 tier badges/);
  await page.locator("[data-achievement-tiers] summary").first().click();
  assert.match(await page.locator("[data-achievement-tiers] ol").first().innerText(), /Tier 4: Windspeaker of the Plains/);

  const updatesPage = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await routeStaticFiles(updatesPage);
  updatesPage.on("pageerror", (error) => errors.push(`updates: ${error.message}`));
  await updatesPage.clock.install({ time: new Date("2026-09-30T12:00:00Z") });
  await updatesPage.goto(`${base}/updates`, { waitUntil: "domcontentloaded" });
  assert.equal(await updatesPage.locator("h1").innerText(), "Aniimo Updates");
  for (const anchor of ["now", "events", "codes", "resets", "archive"]) assert.equal(await updatesPage.locator(`#${anchor}`).count(), 1, `updates is missing #${anchor}`);
  assert.ok(await updatesPage.locator('[data-event][data-state="live"], [data-event][data-state="ending"]').count() >= 4);
  assert.ok(await updatesPage.locator('[data-copy-code]').count() >= 1);
  assert.ok(await updatesPage.locator('a[href="https://aniimo.com/newslist/detail/100147"]').count() >= 1);
  await updatesPage.locator('[data-server="america"]').click();
  assert.match(await updatesPage.locator('[data-selected-server]').innerText(), /America/);
  assert.equal(await updatesPage.locator('[data-server="america"]').getAttribute("aria-pressed"), "true");
  await updatesPage.locator('[data-copy-code]').first().click();
  assert.equal(await updatesPage.locator('[data-copy-code]').first().locator('span').innerText(), "Copied");
  const updatesUrl = updatesPage.url();
  await updatesPage.locator('[data-update-filter="patch"]').click();
  assert.equal(await updatesPage.locator('[data-update-entry]:visible').count(), 1);
  assert.equal(updatesPage.url(), updatesUrl);
  await updatesPage.close();

  await page.goto(`${base}/team-builder?team=witchin,fennelun`, { waitUntil: "domcontentloaded" });
  assert.match(await page.locator("[data-team-slots]").innerText(), /Hexxin/);
  assert.match(await page.locator("[data-team-slots]").innerText(), /Lunara/);
  await page.goto(`${base}/team-builder?team=emberpup,skippy`, { waitUntil: "domcontentloaded" });
  assert.match(await page.locator("[data-team-slots]").innerText(), /Emberpup/);
  assert.match(await page.locator("[data-team-review]").innerText(), /Selected Aniimo · current base fields/i);
  assert.match(await page.locator("[data-team-review]").innerText(), /ATK \d+/);
  await page.locator("[data-team-search]").fill("Leafy");
  await page.locator('[data-choose="leafy"]').click();
  assert.match(new URL(page.url()).searchParams.get("team") || "", /leafy/);

  await page.goto(`${base}/tools/compare?first=leafy`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("[data-compare-slots]")?.textContent?.includes("Leafy"));
  assert.match(await page.locator("[data-compare-matrix]").innerText(), /BREAK/);
  assert.match(await page.locator("[data-compare-matrix]").innerText(), /Total/);
  await page.locator("[data-compare-search]").fill("Emberpup");
  assert.equal(await page.locator("[data-compare-pick]:visible").count(), 1);

  await page.evaluate(() => localStorage.setItem("aniimo-collection", JSON.stringify(["witchin", "fennelun"])));
  await page.goto(`${base}/tools/collection-tracker`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-owned-count]").innerText(), "2");
  assert.ok((await page.locator('[data-collection-entry="hexxin"]').getAttribute("class"))?.includes("owned"));
  await page.evaluate(() => localStorage.removeItem("aniimo-collection"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-collection-entry="emberpup"] [data-toggle-owned]').click();
  assert.equal(await page.locator("[data-owned-count]").innerText(), "1");
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-owned-count]").innerText(), "1");

  await page.goto(`${base}/database/skills`, { waitUntil: "domcontentloaded" });
  assert.ok(await page.locator("[data-catalog-record]").count() > 200);
  await page.locator("[data-catalog-more] button").click();
  assert.ok(await page.locator("[data-catalog-record]:visible").count() >= 120);
  for (const path of ["/database/traits", "/database/achievements"]) {
    await page.goto(new URL(path, base).href, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("[data-catalog-more]:visible").count(), 0, `${path} has an unnecessary Load more control`);
  }

  await page.goto(`${base}/map?marker=emberpup#atlas`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("[data-atlas-name]")?.textContent === "Breezy Plains", { timeout: 15000 });
  await page.locator("[data-map-search]").fill("Emberpup");
  assert.ok(await page.locator("[data-map-hit]").count() > 0);
  await page.locator("[data-map-hit]").last().click();
  assert.ok(await page.locator('[data-map-card]:visible a[href="/aniimo/emberpup"]').count() > 0);
  assert.match(await page.locator("[data-map-card]:visible").innerText(), /BREAK/);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
  await routeStaticFiles(mobile);
  mobile.on("pageerror", (error) => errors.push(`mobile: ${error.message}`));
  for (const path of ["/", "/aniimo", "/aniimo/emberpup", "/database/skills", "/guides/aniimo-catching-guide", "/team-builder", "/map", "/tools/compare", "/updates"]) {
    await mobile.goto(new URL(path, base).href, { waitUntil: "domcontentloaded" });
    assert.equal(await mobile.locator("h1:visible").count(), 1, `${path} has an unexpected visible mobile H1 count`);
    const width = await mobile.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    assert.ok(width.scroll <= width.viewport + 2, `${path} overflows mobile viewport: ${width.scroll} > ${width.viewport}`);
  }
  await mobile.goto(new URL("/", base).href, { waitUntil: "domcontentloaded" });
  await mobile.locator("[data-toggle-menu]").click();
  assert.equal(await mobile.locator("[data-toggle-menu]").getAttribute("aria-expanded"), "true");
  assert.ok(await mobile.locator("[data-mobile-nav]:visible").count() > 0);
  await mobile.close();

  assert.deepEqual(errors, [], `Browser errors: ${errors.join(" | ")}`);
  console.log(`Astro smoke passed: ${checked} sitemap pages and key interactions.`);
} finally {
  await browser.close();
}
