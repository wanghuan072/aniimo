import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const officialRoster = JSON.parse(await readFile(new URL("../src/data/game/aniimo.json", import.meta.url), "utf8"));
const additions = JSON.parse(await readFile(new URL("../src/data/research/roster-additions.json", import.meta.url), "utf8"));
const roster = { entries: [...officialRoster.entries.filter((entry) => entry.slug !== "fennelun").map((entry) => ({ ...entry, slug: entry.slug === "witchin" ? "hexxin" : entry.slug })), ...additions.entries] };
const output = new URL("../src/data/research/progression.json", import.meta.url);
const entries = {};
const clean = (value) => value.replace(/\s+/g, " ").trim();
const section = ($, label) => $("main h2").filter((_, node) => clean($(node).text()) === label).first().parent().parent();
const item = ($, link) => ({ name: clean($(link).text()), url: new URL($(link).attr("href"), "https://www.aniimoverse.com").href });

async function importEntry(entry) {
  const url = `https://www.aniimoverse.com/aniilog/${entry.slug}`;
  const response = await fetch(url, { headers: { "user-agent": "Aniimo data review (public pages)" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const $ = load(await response.text());
  const build = section($, "Recommended build");
  const resonance = section($, "Resonance Training");
  const research = section($, "Aniimo Research");
  if (!build.length && !resonance.length && !research.length) throw new Error("progression sections absent");
  const buildLinks = build.find('a[href^="/items/"]').toArray().map((link) => item($, link));
  const partnerLinks = build.find('a[href^="/aniilog/"]').toArray().map((link) => {
    const sourceSlug = $(link).attr("href").split("/").at(-1);
    return { name: clean($(link).text()).replace(/^No\.\d+/, ""), slug: sourceSlug };
  });
  const materials = resonance.children("div").find('a[href^="/items/"]').slice(0, 3).toArray().map((link) => {
    const text = clean($(link).text());
    return { kind: text.match(/^(Stage material|Training material|Stage substitute)/)?.[0] || "Material", ...item($, link), name: text.replace(/^(Stage material|Training material|Stage substitute)/, "") };
  });
  const stages = resonance.find("ol").first().children("li").toArray().map((node, index) => {
    const badges = $(node).find("summary > span").first().children().toArray().map((badge) => clean($(badge).text()));
    const levels = $(node).find("details > div > div").toArray().map((level) => {
      const columns = $(level).children("span").toArray();
      return { level: Number(clean($(columns[0]).text()).replace(/[^\d]/g, "")), gain: clean($(columns[1]).text()), costs: $(columns[2]).find("a").toArray().map((link) => clean($(link).text())) };
    }).filter((level) => level.level && level.gain);
    return { stage: index + 1, gate: badges[1] || "", bonus: badges[2] || "", cost: badges.slice(3), levels };
  });
  const topics = research.find("article").toArray().filter((node) => $(node).find("h4").length).map((node) => ({
    title: clean($(node).find("h4").first().text()),
    milestones: $(node).find("ul > li").toArray().map((milestone) => ({
      required: Number($(milestone).find('[aria-label$=" required"]').attr("aria-label")?.replace(/[^\d]/g, "") || 0),
      points: Number($(milestone).find('[aria-label$=" research points"]').attr("aria-label")?.replace(/[^\d]/g, "") || 0),
    })).filter((milestone) => milestone.required && milestone.points),
  }));
  if (!stages.length && !topics.length && !buildLinks.length) throw new Error("no structured data");
  return { sourceUrl: url, reviewedAt: new Date().toISOString().slice(0, 10), build: { items: buildLinks, partners: partnerLinks }, resonance: { materials, stages }, research: { topics } };
}

const pending = [...roster.entries];
const failures = [];
await Promise.all(Array.from({ length: 5 }, async () => {
  while (pending.length) {
    const entry = pending.shift();
    try { entries[entry.slug] = await importEntry(entry); }
    catch (error) { failures.push(`${entry.slug}: ${error.message}`); }
  }
}));
if (Object.keys(entries).length < 97) throw new Error(`Only ${Object.keys(entries).length} progression records parsed; leaving previous data untouched.`);
await writeFile(output, `${JSON.stringify({ source: "AniimoVerse public Aniilog pages", entries }, null, 2)}\n`);
console.log(`Imported ${Object.keys(entries).length}/${roster.entries.length} progression records.`);
if (failures.length) console.log(`Unavailable or incomplete: ${failures.join(", ")}`);
