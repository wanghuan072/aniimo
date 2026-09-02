import Link from "next/link";
import StaticPage from "@/page/StaticPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.terms);

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" description="Last updated September 2, 2026. The full ground rules for using aniimo.cc: what the companion is, how you may use it, how rankings and maps should be read, and the limits of relying on a fan site.">
      <h2>1. Agreement</h2>
      <p>
        These terms are a contract between you and the operator of aniimo.cc. By visiting the site, using a tool, following a shared team URL, or emailing us, you agree to them. If you do not agree, do not use the site.
      </p>
      <p>
        Additional pages explain details that these terms only summarize: <Link href="/legal/privacy-policy">Privacy Policy</Link>, <Link href="/legal/copyright">Copyright</Link>, <Link href="/legal/about-us">About Us</Link>, and <Link href="/sources">How this site works</Link>. If a sentence here conflicts with a more specific legal page on a narrow topic (for example how local storage works), the specific page controls that topic.
      </p>

      <h2>2. What aniimo.cc is — and is not</h2>
      <p>
        Aniimo.cc is an independent, fan-made companion for the game Aniimo. It publishes reference pages and planning tools so you can look up creatures, habitats, items and routes in Idyll. It is provided free of charge, in English, without an account.
      </p>
      <p>
        It is not: an official website; an official wiki; a game client, launcher or patcher; a store; a payment processor; a tournament organizer; or a customer-support desk for the publisher or any platform. It does not sell the game, recover accounts, process refunds, or speak for the game’s owners.
      </p>
      <p>
        Announced dates recorded on the site ({siteConfig.releaseNote}) are a published schedule copied for player convenience. They are not a guarantee by this fan site that a platform will ship, stay online, or keep a given feature.
      </p>

      <h2>3. License to use the site</h2>
      <p>
        We grant you a limited, revocable, non-exclusive, non-transferable license to access public pages and tools for personal, non-commercial research and planning related to your own play. That includes:
      </p>
      <ul>
        <li>browsing profiles, database catalogs, guides, rankings and the updates timeline;</li>
        <li>using the local interactive map in a normal browser;</li>
        <li>using Team Builder, Compare and Collection Tracker for your own shortlists;</li>
        <li>bookmarking pages and sharing ordinary hyperlinks;</li>
        <li>quoting a short excerpt of original writing with credit and a link back to the source page.</li>
      </ul>
      <p>
        This license does not give you ownership of the site, the data files, the original writing, or any game-owned artwork that appears for identification. See <Link href="/legal/copyright">Copyright</Link>.
      </p>

      <h2>4. What you must not do</h2>
      <p>
        You agree not to:
      </p>
      <ul>
        <li>present aniimo.cc as official, or impersonate the game’s owners, this site’s operator, or another player;</li>
        <li>remove or obscure notices that the site is independent and fan-made;</li>
        <li>interfere with the site, probe it for vulnerabilities except as allowed by applicable law, or bypass technical limits;</li>
        <li>scrape, crawl, bulk-download or mirror pages, portraits, vote art, map tiles or marker JSON at a rate or in a manner that burdens hosting, duplicates the companion as a competing product, or circumvents the public interface;</li>
        <li>republish original guides, tool UIs, or a substantial portion of the compiled database as your own product without permission;</li>
        <li>use automated traffic to hammer the atlas tiles or image CDN;</li>
        <li>introduce malware, or use the site to send spam;</li>
        <li>submit unlawful, harassing, or knowingly false material by email (for example a fake copyright claim, or a fabricated “official” stat);</li>
        <li>attempt to inject personal data into query strings as if they were a private channel.</li>
      </ul>
      <p>
        Reasonable, polite, human browsing and linking is welcome. Coordinated copying of the tile set or the compiled JSON for a third-party app is not.
      </p>

      <h2>5. How to read the content</h2>
      <h3>Game fields</h3>
      <p>
        Aniimo profiles and verified database pages aim to reflect published fields: elements, roles, skills, traits, forms, habitats, evolution. Compilation can lag the live client. A blank field means the connection was not matched, not that the game has no such concept.
      </p>
      <h3>Player-made guidance</h3>
      <p>
        Guides, player team templates, Team Builder coverage notes, and the role-based tier list are planning aids written for this site. They are not an official rotation, catch order, or spend guide. You remain responsible for what you do in-game.
      </p>
      <h3>Votes and tiers</h3>
      <p>
        Global Vote 2026 follows a published popularity snapshot. Vote count is not combat power. The tier list is a job-based starting point. Using either as the only reason to buy, skip, or reroll a creature is your choice, not a recommendation we warrant.
      </p>
      <h3>Map</h3>
      <p>
        The atlas stores four local maps (Breezy Plains, Astra, Whisperwake Isles, The Lost Islets). Markers can be wrong, incomplete, or behind a later patch. Flying to a spawn from a profile is a convenience, not a guarantee that the Aniimo is standing there at the moment you arrive, in that weather, or on that platform.
      </p>
      <h3>Community catalogs</h3>
      <p>
        Items, materials, world bosses and achievements that are labeled community catalogs are browsing indexes. Treat them with more caution than a profile’s element or skill text.
      </p>
      <p>
        When a decision actually costs you time, currency or a limited material in the live game, check the client and official notices.
      </p>

      <h2>6. Tools, URLs and local storage</h2>
      <p>
        There is no site account. Collection Tracker ticks stay in your browser. Team Builder and Compare can put slugs in the address bar. Shared links are public. You are responsible for the device you use and for what you paste into chats. Details: <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </p>
      <p>
        Tools may be changed, rate-limited, or withdrawn. A broken share URL after a slug rename is an inconvenience, not a breach of a service-level promise — this site does not offer SLAs.
      </p>

      <h2>7. Email and user submissions</h2>
      <p>
        The public site does not currently host comments, reviews, or player-uploaded images. If you email a screenshot or a suggested correction, you still own your message, but you give us permission to use the factual content as needed to fix a page (for example, updating a habitat string). Do not send material you are not allowed to share. Do not send secrets.
      </p>

      <h2>8. Third-party sites and services</h2>
      <p>
        Outbound links (official news, wiki, stores, community sites) are provided for convenience. We do not control those destinations and are not responsible for their content, availability, or terms. Your dealings with them are solely between you and them.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        Original writing, layout, navigation and tool behavior on aniimo.cc are the site operator’s, except where a page says otherwise. Game names, characters, artwork, logos, map art and related IP remain with their owners. Use on this fan site is for identification and player reference. It is not a license for you to rehost those assets. Full notice: <Link href="/legal/copyright">Copyright</Link>.
      </p>

      <h2>10. Availability, disclaimers and limitation of liability</h2>
      <p>
        THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE.” To the fullest extent permitted by applicable law, we disclaim warranties of accuracy, completeness, merchantability, fitness for a particular purpose, quiet enjoyment, and non-infringement. We do not warrant that pages, tiles or tools will be uninterrupted, timely, secure, or free of typing mistakes.
      </p>
      <p>
        You accept that using this companion is at your own risk. That includes team choices, farming routes, time spent, in-game purchases, and platform decisions. To the fullest extent permitted by applicable law, the operator of aniimo.cc is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill, arising from the site or from inability to use it, even if we were told that such damage was possible.
      </p>
      <p>
        If a jurisdiction does not allow certain disclaimers, those parts apply only to the extent that jurisdiction allows. Nothing in these terms excludes liability that cannot be excluded (for example, liability for death or personal injury caused by negligence where that bar cannot be waived).
      </p>

      <h2>11. Suspension</h2>
      <p>
        We may refuse, throttle, or block access (including by IP or user-agent) if we reasonably believe these terms are being broken, if the host is under attack, or if we must take the site down for maintenance or a rights request. We may also remove or alter pages without notice when a record is wrong, incomplete, or challenged.
      </p>

      <h2>12. Changes to the terms</h2>
      <p>
        We may update these terms when the site or the law changes. The date at the top is the current version. Continued use after that date is acceptance of the new terms for later visits. If you do not agree, stop using the site.
      </p>

      <h2>13. General</h2>
      <p>
        These terms are the entire agreement for use of aniimo.cc, together with the Privacy Policy and Copyright notice. If a court finds one clause unenforceable, the rest still applies. Our failure to enforce a clause once is not a waiver of later enforcement. You may not assign these terms; we may assign them if the site changes operator, in which case the new operator steps into the same fan-site role described here.
      </p>
      <p>
        Governing law is the law that applies to the operator’s provision of a free informational website, without a choice-of-forum clause that would surprise a visitor. If a dispute arises, contact <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> first and describe the page or conduct at issue.
      </p>
    </StaticPage>
  );
}
