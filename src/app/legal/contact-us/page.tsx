import Link from "next/link";
import StaticPage from "@/page/StaticPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.contact);

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us" description="How to email aniimo.cc for a correction, map or tool issue, rights notice or privacy request — and what this independent companion cannot do for official game accounts.">
      <h2>1. The only public inbox</h2>
      <p>
        Write to <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. There is no contact form, chatbot, Discord moderation queue, or in-game ticket bridge. You decide what to include. English is the language of the site and the easiest for us to match against page text; other languages are welcome, but a reply may be slower or shorter.
      </p>
      <p>
        This address is for the independent companion at aniimo.cc. It is not official player support. We cannot see your game account, purchases, friend list, or cloud save.
      </p>
      <p>
        Suggested subject prefixes, so the right kind of message is obvious:
      </p>
      <ul>
        <li><code>Correction:</code> a profile, database row, or map marker that does not match the live game;</li>
        <li><code>Map:</code> atlas, layer or “find on map” jump;</li>
        <li><code>Tools:</code> Team Builder, Compare, Collection Tracker, templates;</li>
        <li><code>Guide:</code> a step that led you the wrong way;</li>
        <li><code>Ranking:</code> Tier List versus Global Vote (say which);</li>
        <li><code>Copyright notice:</code> rights request (see the <Link href="/legal/copyright">Copyright</Link> page for required fields);</li>
        <li><code>Privacy:</code> local storage, email deletion, or a child-related request;</li>
        <li><code>Accessibility:</code> a control, contrast, or keyboard issue;</li>
        <li><code>Question:</code> anything else about this companion.</li>
      </ul>

      <h2>2. Report a page correction</h2>
      <p>
        Use this when a displayed game field looks wrong. A useful message is boring and specific:
      </p>
      <ol>
        <li>Full URL, including query string if the bug only appears with a filter or map parameter (example: an Aniimo profile, <code>/database/skills</code>, or <code>/map?atlas=astra&amp;marker=…</code>).</li>
        <li>The exact field: element, role, stage, skill name or body text, trait, evolution node, habitat chip, item description, boss location, vote count, and so on.</li>
        <li>What the page shows now, and what you saw in the live game.</li>
        <li>Platform (PC, console, or mobile), and the date and roughly the time you checked.</li>
        <li>A screenshot or a short reproducible path (“open Leafy, switch to the second form, habitat chip still says …”).</li>
      </ol>
      <p>
        “This site is wrong” without a URL is not actionable. We also do not fill gaps by guesswork. If your report cannot be matched to a published field, the page may stay unchanged and the field may remain blank. That is deliberate; see <Link href="/sources">How this site works</Link>.
      </p>

      <h2>3. Map reports</h2>
      <p>
        The atlas is local: Breezy Plains, Astra, Whisperwake Isles, The Lost Islets. When you write about the map, include:
      </p>
      <ul>
        <li>which atlas you were on;</li>
        <li>the marker name, type (spawn, chest, teleporter, boss, region outline) or the URL that was supposed to fly there;</li>
        <li>whether the wrong map opened, the right map opened but the camera missed, or the layer was off;</li>
        <li>whether you came from a profile “Find on Map” control, a habitat chip, a boss card, or the map search box.</li>
      </ul>
      <p>
        Thousands of points sit on Breezy Plains. The first view hides many creature and gathering layers on purpose. If a pin is “missing”, say whether the layer was enabled. A spawn that depends on time of day or weather in the game may not be tagged that way yet in the local JSON.
      </p>

      <h2>4. Tools, templates and collection</h2>
      <ul>
        <li><strong>Team Builder.</strong> Paste the URL (it should contain <code>team=</code> and up to four slugs). Say which coverage note looked wrong (for example “it asked for BREAK but Helgon is already in slot 3”). Coverage notes are heuristics, not a combat sim.</li>
        <li><strong>Compare.</strong> Name the two or three Aniimo and which column disagreed with the profiles.</li>
        <li><strong>Templates.</strong> These are player-made shells. Feedback like “this four-slot example no longer matches published roles after a patch” is useful; “make a god-tier team” is not a task this inbox performs.</li>
        <li><strong>Collection Tracker.</strong> Ticks live only in your browser under <code>aniimo-collection</code>. We cannot recover a list from the server, merge two devices, or undo a clear-site-data. If the tracker fails to save, mention browser name and whether storage is blocked.</li>
      </ul>

      <h2>5. Guides, tier list and Global Vote</h2>
      <p>
        Guides are short routes for a first team, forms and evolution, and combat roles. Explain the goal you had and which step failed. Do not expect a guide to be rewritten into a full campaign walkthrough by return mail.
      </p>
      <p>
        The <Link href="/tier-list">Tier List</Link> is a job-based placement. <Link href="/tier-list/global-vote">Global Vote 2026</Link> is a popularity snapshot. If you write about rankings, say which page you mean. “Put my main in S tier” or “delete the vote because I disagree” will not change published vote counts. A factual error (wrong slug, missing profile note, swapped art) will.
      </p>

      <h2>6. Copyright, privacy and accessibility</h2>
      <p>
        Rights requests must include the fields listed on the <Link href="/legal/copyright">Copyright</Link> page — especially a precise URL and a description of the file or passage. A demand to “remove all Aniimo art” without identifying works is not a complete notice.
      </p>
      <p>
        Privacy requests (delete an email thread, child-related concern, questions about local storage) are described in the <Link href="/legal/privacy-policy">Privacy Policy</Link>. Put <code>Privacy</code> in the subject and tell us which address you used.
      </p>
      <p>
        For accessibility, name the URL, the control (button, filter, map search, skip link), what you expected, what happened, and the browser or assistive technology. Keyboard traps on the atlas and missing alt text on a specific portrait are the kind of report that can be checked.
      </p>

      <h2>7. Feature ideas</h2>
      <p>
        Ideas are welcome if they fit a player companion: a missing filter, a habitat that should link, a form that is not switchable on a profile. Ideas that require accounts, chat, ads, or cloning the official client are outside what this site is. We may say no without a long debate.
      </p>

      <h2>8. What this inbox cannot do</h2>
      <ul>
        <li>recover, reset, ban, unban, or inspect an official Aniimo game account;</li>
        <li>process refunds, keys, platform tickets, or storefront billing;</li>
        <li>change official patch notes, Global Vote rules, or live spawns at the publisher;</li>
        <li>provide legal representation, employment, or press credentials;</li>
        <li>restore Collection Tracker data that existed only in your browser;</li>
        <li>promise a reply time, a patch date, or that a report will be accepted.</li>
      </ul>
      <p>
        Do not send passwords, backup codes, payment card data, government IDs, or other people’s personal information. If your message is about harassment in the live game, use the publisher’s and platform’s own reporting tools; we have no moderation power there.
      </p>

      <h2>9. What to expect</h2>
      <p>
        Mail is read as time permits by a small independent operator. You should not expect an auto-reply, a ticket number, or a guaranteed change. Complete reports are easier to act on than follow-up pings. If we change a page, the public page is the record; we may not write back for every accepted fix.
      </p>
      <p>
        Sending email does not create a support contract. It also does not make you a source we must name on the page.
      </p>
      <p>
        For what the site contains and how it stays unofficial, see <Link href="/legal/about-us">About Us</Link>. For permitted use, see <Link href="/legal/terms-of-service">Terms of Service</Link>.
      </p>
    </StaticPage>
  );
}
