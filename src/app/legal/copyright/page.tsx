import Link from "next/link";
import StaticPage from "@/page/StaticPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.copyright);

export default function CopyrightPage() {
  const year = new Date().getFullYear();
  return (
    <StaticPage title="Copyright" description="Last updated September 2, 2026. A detailed split between original aniimo.cc work and game-owned names, artwork, map tiles and text, plus how to send a complete rights request.">
      <h2>1. Two layers of material</h2>
      <p>
        Almost every page on aniimo.cc mixes two kinds of material. The first is original work created for this companion: explanations, page structure, player tools and editorial labels. The second is game-owned material used so a player can recognize a creature, a place or a skill. This notice keeps those layers separate. It is not a claim that the fan site owns the game, and it is not a claim that the game’s owners endorse the fan site.
      </p>
      <p>
        Aniimo.cc is independent. It is not affiliated with, endorsed by, sponsored by, or connected to the owners, publishers or platform holders of the game Aniimo.
      </p>

      <h2>2. Original work on aniimo.cc</h2>
      <p>
        Copyright © {year} Aniimo (aniimo.cc). All rights reserved in original material created for this site, including:
      </p>
      <ul>
        <li>prose on guides, About, legal pages, tool copy, homepage explanations and the “how this site works” notes;</li>
        <li>information architecture: how roster, database, map, tools and rankings are grouped and linked;</li>
        <li>original interface design, layout and interaction of Team Builder, Compare, Collection Tracker, the atlas chrome, filters and coverage messages;</li>
        <li>player team templates, the role-based tier list as arranged on this site, and editorial captions that are not in-game strings;</li>
        <li>the particular compilation and presentation of records on aniimo.cc (the way rows are ordered, labeled and cross-linked), as distinct from the underlying game facts.</li>
      </ul>
      <p>
        “Aniimo” as a game title remains the owners’ trademark. “aniimo.cc” as this companion’s address and original writing is the fan site’s own layer. Using the same word for the game and the companion is for identification; it does not merge the two.
      </p>

      <h2>3. What visitors may do with original work</h2>
      <p>
        You may:
      </p>
      <ul>
        <li>link to any public page, including deep links to a profile, a map marker query, or a shared team URL;</li>
        <li>quote a short excerpt of original writing in a forum post, video description or similar, with clear attribution and a link to the source page;</li>
        <li>take a screenshot of a page for personal reference or to illustrate a correction email.</li>
      </ul>
      <p>
        You may not, without permission:
      </p>
      <ul>
        <li>copy a full guide, a template set, or a substantial portion of original tool UI and publish it as your own product or mirror;</li>
        <li>scrape and republish the compiled database presentation in bulk;</li>
        <li>frame aniimo.cc inside another site in a way that hides these notices or suggests official status;</li>
        <li>train a public commercial dataset on the original writing if that would substitute for visiting the pages, unless applicable law clearly allows the use — when in doubt, ask.</li>
      </ul>
      <p>
        Permission requests: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with the URL you want to reuse and how you intend to use it.
      </p>

      <h2>4. Game-owned names, art, maps and text</h2>
      <p>
        The following remain the property of their respective owners and appear here only to identify and discuss the game for player reference:
      </p>
      <ul>
        <li>the Aniimo name, the world name Idyll, character names, creature names, logos, logotypes and other trademarks;</li>
        <li>official portraits, illustrations, vote artwork (including images served from <code>/images/aniimo/</code> and <code>/images/aniimo/vote/</code>), screenshots and cinematic stills;</li>
        <li>map basemaps, zoom tiles, marker icons and point data for Breezy Plains, Astra, Whisperwake Isles and The Lost Islets, stored locally so the atlas can run without a third-party iframe;</li>
        <li>in-game strings reproduced as reference fields: skill names and descriptions, trait names, item and material names, habitat labels, boss names, achievement titles, and similar.</li>
      </ul>
      <p>
        Displaying those assets on a fan companion does not transfer ownership, does not exhaust the owners’ rights, and does not authorize you to download the tile set or portrait pack for your own app, merch, or wiki mirror. If you need official art for a project, ask the owners — not this site.
      </p>

      <h2>5. Why those assets appear here</h2>
      <p>
        Portraits exist so a roster row matches what you see in Idyll. Vote art exists so the Global Vote page matches the published contest images. Map tiles exist so a “find on map” link from a profile can fly to a spawn instead of describing a coordinate in prose. Skill and habitat text exist so you can compare kits without retyping the client.
      </p>
      <p>
        Roster fields on this site are normalized from published English material for player lookup. That compilation is described on <Link href="/legal/about-us">About Us</Link>. A source link is identification, not a statement that aniimo.cc is the official wiki or that the wiki endorses this companion.
      </p>

      <h2>6. Community catalogs and third-party compilations</h2>
      <p>
        Some database categories (items, materials, achievements, world bosses where populated) are labeled community catalogs. They may include names and descriptions gathered for browsing. They are still presented as part of a fan companion. If you are the owner of a distinct compilation and believe a catalog copies your protected arrangement rather than game-owned facts, use the notice process below and identify the arrangement, not only a single item name that also exists in the game.
      </p>

      <h2>7. Trademarks</h2>
      <p>
        All trademarks, service marks and trade dress mentioned on aniimo.cc are the property of their owners. No trademark license is granted to you except the limited right to refer to those marks when discussing the game in ordinary language. Do not use official logos from this site on merch, thumbnails that imply endorsement, or app icons.
      </p>

      <h2>8. Copyright complaints</h2>
      <p>
        If you own a copyright, or are authorized to act for the owner, and you believe a specific file or passage on aniimo.cc infringes that copyright, email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with the subject line “Copyright notice” and include all of the following:
      </p>
      <ol>
        <li>the exact URL on aniimo.cc (a homepage complaint without a path is not enough);</li>
        <li>a description of the protected work (for example “portrait of [name] on the profile”, “tile folder for Whisperwake Isles”, “paragraph copied from [work]”);</li>
        <li>where the original work is published, if that helps us identify it;</li>
        <li>your full name, role (owner or agent), mailing address or other reliable contact, and email;</li>
        <li>a statement that you have a good-faith belief the use is not authorized by the owner, its agent, or the law;</li>
        <li>a statement that the notice is accurate, and that you are authorized to act, made under penalty of perjury if you are sending a formal statutory notice;</li>
        <li>your physical or electronic signature (typing your full legal name is enough for email).</li>
      </ol>
      <p>
        We will review complete notices. We may remove, replace, or restrict the identified material. We may also ask a clarifying question if the URL points at a whole category rather than a file. Incomplete or bulk “take down the entire fan site” letters that do not identify a work take longer and may be returned for detail.
      </p>
      <p>
        This site is small and has no separate registered statutory agent listed here. Email is the designated channel. We are not a common carrier and we do not host open user uploads; almost all media is editorial.
      </p>

      <h2>9. Counter-notices</h2>
      <p>
        If material you submitted, or that you authorized this site to use, was removed and you believe that was a mistake (wrong URL, public-domain work, authorized license, or misidentification), send a counter-notice to the same address with:
      </p>
      <ul>
        <li>the URL as it appeared and a description of the material;</li>
        <li>your contact information;</li>
        <li>a good-faith explanation of the error;</li>
        <li>consent to share relevant parts of the counter-notice with the original complainant if that is needed to resolve the dispute;</li>
        <li>your signature as above.</li>
      </ul>
      <p>
        We may restore material, leave it down, or replace it with a text-only identifier (for example a name without a portrait) while a dispute is pending.
      </p>

      <h2>10. Design marks of this companion</h2>
      <p>
        Original layout, color, and interface patterns of aniimo.cc should not be cloned as a confusingly similar unofficial site. Linking with a normal hyperlink is fine. Copying the chrome so visitors think they are still on aniimo.cc is not.
      </p>

      <h2>11. Related pages</h2>
      <p>
        <Link href="/legal/terms-of-service">Terms of Service</Link> · <Link href="/legal/privacy-policy">Privacy Policy</Link> · <Link href="/legal/about-us">About Us</Link> · <Link href="/legal/contact-us">Contact Us</Link>
      </p>
    </StaticPage>
  );
}
