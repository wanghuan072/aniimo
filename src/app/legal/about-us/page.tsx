import Link from "next/link";
import StaticPage from "@/page/StaticPage";
import { playerTeamTemplates } from "@/data/editorial/team-templates";
import atlasIndexData from "@/data/map/index.json";
import { aniimo, communityDatabase, databaseCategories, guides, mapLocations, officialSource, officialVote } from "@/lib/data";
import { elementMeta, roleLabels, siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.about);

export default function AboutPage() {
  const atlasIndex = atlasIndexData.index;
  const mappedPoints = atlasIndex.reduce((sum, entry) => sum + entry.total, 0);
  const skillCount = aniimo.reduce((sum, entry) => sum + entry.skills.length, 0);
  const uniqueTraits = new Set(aniimo.flatMap((entry) => entry.traits.map((trait) => trait.name))).size;
  const elementList = Object.values(elementMeta).map((item) => item.label).join(", ");
  const roleList = [...new Set(Object.values(roleLabels))].join(", ");
  const verifiedCategories = databaseCategories.filter((category) => category.status === "verified");
  const communityCategories = databaseCategories.filter((category) => category.status === "community");

  return (
    <StaticPage title="About Us" description="Aniimo.cc is an independent player companion for the game Aniimo. This page explains what the site is for, what each section contains, and how it stays separate from the official game.">
      <h2>What aniimo.cc is</h2>
      <p>
        <Link href="/">{siteConfig.name}</Link> is an English-language, independently operated companion at aniimo.cc. It is made for people who are playing, or preparing to play, the game Aniimo — a creature-collection adventure set in the world of Idyll. In that game you catch companion Aniimo, Twin them into a four-member party, and explore habitats through action combat. Each Aniimo has an element, a combat role, and field locations you can visit.
      </p>
      <p>
        This website is not a launcher, store, wiki replacement, or publisher help desk. It is a player-facing reference: look up a creature, see where it appears, compare a shortlist, draft a four-slot team, and keep a private checklist of what you have already found. The aim is to answer the next practical question without sending you through unrelated pages.
      </p>
      <p>
        Announced platforms, as recorded on this site: {siteConfig.releaseNote}. Treat those dates as a published schedule, not a promise from this fan site. Confirm purchases, patches and events on the official channels before you plan around them.
      </p>

      <h2>The game this site is about</h2>
      <p>
        Aniimo (the game) mixes discovery, action combat and exploration. A typical session is not “collect everything”; it is choosing a small objective — a habitat, a form, a missing team job — and using the roster you already have. Combat roles on this site are labeled {roleList}. Element affinities currently listed are {elementList}. Stages on profiles are described as Lumin, Gamma and Nova where the record has a stage number.
      </p>
      <p>
        Twining is the four-slot party. The tools on this site assume that shape: one to four Aniimo at a time in Team Builder, with coverage notes for damage, sustain or support, BREAK, and elemental spread. Those notes are planning aids. They are not a hidden official formula.
      </p>

      <h2>Why the site is arranged this way</h2>
      <p>
        Players usually arrive with a concrete job: “what does this Aniimo do?”, “where do I find it?”, “which of these two should I raise?”, “does this party lack heal or BREAK?”, or “what changed before launch?”. Navigation follows those jobs rather than a single encyclopedia dump. Creature fields stay on profiles. Catalogs that are shared across many Aniimo live under Database. Geography lives on the map. Advice that involves a trade-off lives in Guides, templates and the tier list, and is labeled as player-made.
      </p>
      <p>
        When a connection cannot be matched with confidence, the page leaves it blank instead of inventing a route, a spawn or a ranking. That rule is spelled out again on <Link href="/sources">How this site works</Link>.
      </p>

      <h2>Aniimo roster and profiles</h2>
      <p>
        The <Link href="/aniimo">roster</Link> currently lists {aniimo.length} Aniimo records. You can filter by element, role and stage, search by name, and switch between grid and list. Opening a profile is meant to show the fields that actually change a decision:
      </p>
      <ul>
        <li>Identity: name, artwork, stage, form, elements and combat roles.</li>
        <li>Published base fields and skills, including the skill text attached to that record.</li>
        <li>Traits, mobility notes where present, and form switches when more than one form exists.</li>
        <li>Evolution path, including branches, with links to other profiles on this site when the destination exists here.</li>
        <li>Habitats, with jumps onto the local atlas when a matching marker or region can be resolved.</li>
      </ul>
      <p>
        Across the current roster the site indexes {skillCount} skill entries and {uniqueTraits} distinct trait names. Those counts move when records are added or corrected. A profile that is missing a field is unfinished or unmatched; it is not an invitation to guess.
      </p>
      <p>
        Names, descriptions, elements, roles, stages, base stats, evolution, habitats, traits and skills are normalized from published English material. The current compilation note on the roster data is: {officialSource.note} Source: <a href={officialSource.url}>{officialSource.name}</a>.
      </p>

      <h2>Database</h2>
      <p>
        The <Link href="/database">database</Link> groups records that many Aniimo share, then links each row back to the creatures that use it. Categories currently published:
      </p>
      <h3>Verified game-field catalogs</h3>
      <ul>
        {verifiedCategories.map((category) => (
          <li key={category.slug}>
            <Link href={`/database/${category.slug}`}>{category.name}</Link> — {category.description}
          </li>
        ))}
      </ul>
      <h3>Community catalogs</h3>
      <p>
        Items, materials, world bosses and achievements are labeled as community catalogs. They help you browse names and descriptions, but they are not treated as the same class of evidence as a profile’s element or skill text. Current list sizes on this site:
      </p>
      <ul>
        {communityCategories.map((category) => {
          const count = communityDatabase[category.slug]?.length || 0;
          return (
            <li key={category.slug}>
              <Link href={`/database/${category.slug}`}>{category.name}</Link>
              {count ? ` — ${count.toLocaleString("en-US")} records` : " — browse the category for whatever records are currently attached"}
              . {category.description}
            </li>
          );
        })}
      </ul>
      <p>
        Habitats also appear as a directory of {mapLocations.length} named areas (for example Nimbus Fields or Crescent Bay). Those area pages are meant to send you to the Aniimo that list the habitat and, when possible, to the matching outline or spawn on the atlas.
      </p>

      <h2>Interactive map</h2>
      <p>
        The <Link href="/map">map</Link> is hosted on this site. Basemap tiles, icons and marker JSON are stored locally so the atlas does not depend on a third-party map iframe. Four atlases are published:
      </p>
      <ul>
        {atlasIndex.map((entry) => (
          <li key={entry.id}>
            <Link href={entry.href}>{entry.name}</Link> — {entry.tagline}, {entry.total.toLocaleString("en-US")} mapped points.
          </li>
        ))}
      </ul>
      <p>
        Together that is {mappedPoints.toLocaleString("en-US")} points. Breezy Plains is large, so the first view keeps key layers on (bosses, teleporters, temples, landmarks and gold chests) and leaves creature, chest and gathering layers optional. Depth filters on Breezy Plains separate surface points from caves. Search jumps to a named chest, shop or landmark when that name exists in the local data.
      </p>
      <p>
        Aniimo profiles, habitat chips and boss cards can open <code>/map</code> with an atlas, region or marker in the query string. The atlas switches maps if needed, turns on the relevant layer, and flies to the spawn or area. Marker cards that name a creature still return to this site’s <code>/aniimo/{"{slug}"}</code> profile, not to an external list image.
      </p>
      <p>
        Map data can lag a live patch. A missing chest or a moved spawn is a data issue, not a claim that the location never existed. Send a correction with the atlas name and the marker if you catch one.
      </p>

      <h2>Team Builder, templates and planning tools</h2>
      <p>
        <Link href="/team-builder">Team Builder</Link> holds up to four Aniimo. It reviews which elements and roles are already present and flags common gaps (no DPS label, little sustain or support, no BREAK label, or a very narrow element spread). Those messages are heuristics for a first look. They do not simulate damage, EP, BREAK windows or a specific boss.
      </p>
      <p>
        A team can be shared by URL: the address bar stores a comma-separated <code>team</code> list of slugs. Anyone with that link can reopen the same four slots. Do not put personal information in that URL; there is nothing to encrypt there, only public creature ids.
      </p>
      <p>
        <Link href="/team-builder/templates">{playerTeamTemplates.length} player team templates</Link> are written as example shells (balanced field, fire-led starter, mixed-habitat coverage, and similar). They name a use case and the labels each slot is meant to show. They are not ranked “best teams” and they are not copied from an official builder.
      </p>
      <p>
        <Link href="/tools/compare">Compare</Link> puts up to three records side by side when you are choosing a role, an element or a kit. The first slot can be prefilled with <code>?first=</code>. <Link href="/tools/collection-tracker">Collection Tracker</Link> is a private checklist of the Aniimo you mark as found. It is saved only in this browser (local storage key <code>aniimo-collection</code>). Clearing site data, using another browser or a private window will drop or isolate that list. This site never sees it unless you paste it into an email.
      </p>

      <h2>Guides</h2>
      <p>
        Guides are short, player-written routes, not patch notes. The current set:
      </p>
      <ul>
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guides/${guide.slug}`}>{guide.title}</Link> — {guide.category}, about {guide.readTime}. {guide.excerpt}
          </li>
        ))}
      </ul>
      <p>
        Each guide is meant to leave room for the roster you actually have. If a step assumes a field the live game no longer shows, say so in a correction rather than treating the guide as a script.
      </p>

      <h2>Tier List and Global Vote</h2>
      <p>
        The <Link href="/tier-list">Tier List</Link> is a player-made placement by combat job. Read a tier as a starting point for the slot you still need, then open the profile and the kit. A lower-tier Aniimo can be the better fourth slot if it covers the gap your other three do not.
      </p>
      <p>
        <Link href="/tier-list/global-vote">Global Vote 2026</Link> is a popularity ranking compiled from published vote counts ({officialVote.records.length} names in the current snapshot, retrieved {officialVote.retrievedAt}). Vote count sets the order. It is not a damage ranking, a catch-rate ranking, or a claim that the community “solved” the game. Some vote names may not have a profile yet; the page will say so instead of inventing a page. Source URL recorded with the snapshot: <a href={officialVote.sourceUrl}>{officialVote.sourceUrl}</a>.
      </p>

      <h2>Updates</h2>
      <p>
        The <Link href="/updates">updates</Link> hub collects launch dates, feature notes and event highlights in a readable timeline. Entries often point at the publisher’s own news posts so you can read the original wording. This site does not rewrite official patch legal text; it summarizes what changed in player language and keeps the outbound link.
      </p>

      <h2>How information is treated</h2>
      <p>
        Three kinds of content sit on the same domain and should not be mixed up:
      </p>
      <ol>
        <li><strong>Game fields</strong> on profiles and verified database pages — elements, roles, skills, traits, forms, habitats, evolution. Shown when they can be matched; omitted when they cannot.</li>
        <li><strong>Player guidance</strong> — guides, templates, the role tier list, coverage notes in Team Builder. Useful for a decision; never a substitute for the live client.</li>
        <li><strong>Dated snapshots</strong> — Global Vote counts, update timeline, map tiles. Labeled for what they measure and when they were taken. They can go stale.</li>
      </ol>
      <p>
        Community item and material catalogs are closer to a browsing index than to a verified profile. Rankings are labeled for the question they answer. If two sources disagree, the page states less rather than pretending to know more.
      </p>

      <h2>Independent fan-made site</h2>
      <p>
        Aniimo.cc is not affiliated with, endorsed by, sponsored by, or connected to the game’s owners, publishers, platform holders, or the official wiki. The name of the game, the world Idyll, creature names, artwork, map tiles and in-game terminology remain theirs. This site’s writing, navigation, tool behavior and page design are independently made for players.
      </p>
      <p>
        Official notices, storefronts, account recovery and customer support remain on the publisher’s and platform’s own sites. Linking to them is a courtesy, not a partnership. A fuller split of original work versus game-owned material is on the <Link href="/legal/copyright">Copyright</Link> page.
      </p>

      <h2>Language, availability and limits</h2>
      <p>
        Pages are written in English. The site is provided as a free public companion with no account and no paid tier. Hosting can pause, a page can be wrong, and a map marker can miss. Using the information is your choice; see <Link href="/legal/terms-of-service">Terms of Service</Link> for the legal limits of that choice.
      </p>

      <h2>Keeping pages useful</h2>
      <p>
        Launch and later patches will move numbers, spawns and skill text. A useful report names the URL, the exact field, the platform, and what you saw in-game, ideally with a date. Broad ratings (“this site is outdated”) are harder to act on than one wrong habitat chip. How to write that email, and what this inbox cannot do, is on <Link href="/legal/contact-us">Contact Us</Link>.
      </p>
      <p>
        Privacy of the Collection Tracker, shared team URLs, and mail is described in the <Link href="/legal/privacy-policy">Privacy Policy</Link>. Contact: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </StaticPage>
  );
}
