import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.ASTRO_TEST_URL || "http://127.0.0.1:4321";
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
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
  checked++;
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}/aniimo`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-card]").count(), 94);
  await page.locator("[data-search]").fill("Emberpup");
  assert.ok(await page.locator("[data-card]:visible").count() >= 1);
  assert.ok(await page.locator('[data-card][data-name="emberpup"]').isVisible());

  await page.goto(`${base}/aniimo/emberpup`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("[data-form-panel]:visible").count(), 1);
  assert.equal(await page.locator("h1").count(), 1);
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

  await page.goto(`${base}/team-builder?team=emberpup,skippy`, { waitUntil: "domcontentloaded" });
  assert.match(await page.locator("[data-team-slots]").innerText(), /Emberpup/);
  await page.locator("[data-team-search]").fill("Leafy");
  await page.locator('[data-choose="leafy"]').click();
  assert.match(new URL(page.url()).searchParams.get("team") || "", /leafy/);

  await page.goto(`${base}/tools/compare?first=leafy`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("[data-compare-slots]")?.textContent?.includes("Leafy"));
  await page.locator("[data-compare-search]").fill("Emberpup");
  assert.equal(await page.locator("[data-compare-pick]:visible").count(), 1);

  await page.goto(`${base}/tools/collection-tracker`, { waitUntil: "domcontentloaded" });
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

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
  mobile.on("pageerror", (error) => errors.push(`mobile: ${error.message}`));
  for (const path of ["/", "/aniimo", "/aniimo/emberpup", "/database/skills", "/guides/aniimo-catching-guide", "/team-builder", "/map", "/tools/compare"]) {
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
