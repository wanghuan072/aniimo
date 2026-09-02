import Link from "next/link";
import StaticPage from "@/page/StaticPage";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.privacy);

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Privacy Policy" description="Last updated September 2, 2026. A detailed account of what aniimo.cc stores, what stays in your browser, what appears in shared URLs, and how email and hosting logs are handled.">
      <h2>1. Who we are and what this policy covers</h2>
      <p>
        This policy describes how the independent fan site at aniimo.cc (“Aniimo”, “we”, “the site”) handles information when you browse pages or use player tools. The operator of aniimo.cc is a small, independent publisher of a player companion. It is not the game’s owner, publisher, platform holder, or official wiki.
      </p>
      <p>
        The policy covers every public page on this domain, including the home page, Aniimo roster and profiles, database catalogs, interactive map, Team Builder and templates, Compare, Collection Tracker, guides, tier list, Global Vote, updates, sources, and these legal pages.
      </p>
      <p>
        It does not cover: the official game client; official websites or wikis; Steam or other storefronts; payment processors; social networks; video platforms; or any site you reach by following an outbound link. Those services have their own notices.
      </p>
      <p>
        Aniimo.cc does not require an account, does not offer a login, does not run a player profile on our servers, and does not sell personal information. There is no paid membership and no advertising network on this site at the date above.
      </p>

      <h2>2. What we try not to collect</h2>
      <p>
        We do not ask for your real name, date of birth, postal address, telephone number, payment card, government ID, or official game account credentials. We do not need those to run a reference site. If you include them in an email anyway, treat that as a mistake: we will ignore credentials and you should change any password you exposed.
      </p>
      <p>
        We do not currently run third-party advertising pixels, behavioral analytics suites, or social-login buttons that would phone home with a persistent advertising identifier.
      </p>

      <h2>3. Information that stays on your device</h2>
      <h3>Collection Tracker</h3>
      <p>
        The <Link href="/tools/collection-tracker">Collection Tracker</Link> is the only feature that currently writes to web local storage. When you mark an Aniimo as found, the browser saves an array of slugs (short public ids such as <code>emberpup</code>) under the key <code>aniimo-collection</code>. The list does not include your email, IP address, or a site password — there is no site password.
      </p>
      <p>
        That checklist never leaves the browser unless you copy it yourself. We cannot restore it from a backup on our side. It will disappear or fork if you:
      </p>
      <ul>
        <li>clear site data, cookies, or local storage for aniimo.cc;</li>
        <li>use a different browser, device, or profile;</li>
        <li>open a private/incognito window (the list in that window is usually discarded when the window closes);</li>
        <li>block local storage in browser settings, in which case the tracker cannot remember ticks between visits.</li>
      </ul>
      <h3>On-page controls that are not uploaded</h3>
      <p>
        Map layer toggles, search boxes, element/role filters, and similar UI state live in the current page session (React state in the tab). Closing the tab drops them unless they were also written into the URL, which is described next. They are not sent to a user database on aniimo.cc.
      </p>

      <h2>4. Information that appears in the address bar</h2>
      <p>
        Several tools put choices in the query string so a bookmark or shared link reopens the same view. Those values are public creature or map identifiers, not an account. Anyone who receives the link can see them. Typical parameters:
      </p>
      <ul>
        <li><Link href="/team-builder">Team Builder</Link> — <code>team</code>, a comma-separated list of up to four slugs.</li>
        <li><Link href="/tools/compare">Compare</Link> — <code>first</code>, the slug to load in the first column.</li>
        <li>Roster — <code>q</code>, <code>element</code>, <code>role</code>, <code>stage</code>, <code>sort</code>, <code>view</code> so a filtered list can be linked.</li>
        <li>Database lists — type, rarity or similar filters when the catalog supports them.</li>
        <li>Map — <code>atlas</code>, <code>marker</code>, <code>region</code>, plus an <code>#atlas</code> fragment so a profile or habitat can open the matching map.</li>
      </ul>
      <p>
        If you paste a team URL into a public chat, you are publishing that shortlist. Do not add personal notes, emails, or real names into query parameters; the tools do not provide a field for that, and extra text is not a private channel.
      </p>
      <p>
        The site header search is a jump tool. Typing a name does not create a saved search history on our servers. Your browser or a network filter might still log the resulting page request, as with any website.
      </p>

      <h2>5. Information you send by email</h2>
      <p>
        The contact address is <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. There is no web form. If you write to us, the mail system (yours, ours, and the operators in between) will process:
      </p>
      <ul>
        <li>your email address and any name in the From header;</li>
        <li>subject, body, and attachments (screenshots of a spawn, a cropped skill tooltip, and similar);</li>
        <li>technical mail headers that normally travel with email.</li>
      </ul>
      <p>
        We use that material only to: understand a correction or question; reply when a reply is useful; handle a copyright, privacy, or accessibility request; and keep a short working record of what was decided so we do not reverse a fix blindly. We do not add addresses to a marketing list. There is no newsletter to opt into on this site.
      </p>
      <p>
        Please do not send game passwords, backup codes, payment receipts with full card numbers, or identity documents. This companion cannot reset an official Aniimo account. If a message contains credentials, treat them as compromised on the game side as well.
      </p>

      <h2>6. Hosting, CDN, images and security logs</h2>
      <p>
        Pages, map tiles, portraits and other static files are delivered by a hosting provider and may pass through a content-delivery network. Those operators process the technical data any public website generates in order to route traffic and absorb abuse:
      </p>
      <ul>
        <li>IP address and approximate network location derived from it;</li>
        <li>browser, device and operating-system strings;</li>
        <li>date and time, requested URL, referrer, and response status;</li>
        <li>error logs and, if a request looks like an attack, security flags.</li>
      </ul>
      <p>
        We do not use that stream to build a marketing profile or to retarget you on other sites. Retention follows the host’s ordinary operations (often measured in days or weeks for raw logs, longer if a security incident must be investigated). We cannot turn off IP logging on a public HTTPS server; it is how the internet delivers the page.
      </p>
      <p>
        Your browser will also cache images and tiles locally according to its own settings. That cache is on your device, not a profile on aniimo.cc.
      </p>

      <h2>7. Cookies, analytics and advertising</h2>
      <p>
        At the date on this page, aniimo.cc does not set advertising cookies, login cookies, or third-party analytics cookies. We do not currently embed a “share this” widget that would load a social network’s tracker on every view.
      </p>
      <p>
        If a future feature cannot work without an essential cookie (for example a preference that local storage cannot hold, or a security cookie required by the host), we will update this policy before that cookie is used for anything beyond operating the feature. We will not silently introduce an ad network.
      </p>

      <h2>8. Outbound links and other companies</h2>
      <p>
        Updates and research notes may link to the official Aniimo site, the official wiki, a store page, or community sites. Clicking those links is optional. Once you leave aniimo.cc, this policy no longer applies. Map tiles and marker data used on this site are stored locally; we do not load a third-party map iframe in the atlas view.
      </p>
      <p>
        Email itself is a third-party transport. We cannot promise how your own provider stores mail.
      </p>

      <h2>9. Children</h2>
      <p>
        The site is a general-audience player companion written in English. It is not directed at children under 13, and we do not knowingly collect personal information from children. A Collection Tracker tick is not an account. If a parent or guardian believes a child sent personal information to {siteConfig.contactEmail}, write to that address and we will delete the identifiable message where we can find it.
      </p>

      <h2>10. Your choices and requests</h2>
      <ul>
        <li><strong>Local checklist.</strong> Clear storage for aniimo.cc, or toggle Aniimo off in the tracker, to remove ticks.</li>
        <li><strong>Shared URLs.</strong> Stop circulating a team or compare link if you no longer want that shortlist public. We cannot retract a URL someone else already copied.</li>
        <li><strong>Email.</strong> Ask us to delete a thread you started, or to send you a copy of what we still have of that thread. Include the address you used and enough of the subject or date to find it. We may refuse a request that we cannot reasonably match to you, or that we must keep briefly for a live copyright or security dispute.</li>
        <li><strong>Do not sell.</strong> We do not sell personal information. There is no “sale opt-out” toggle because there is no sale.</li>
      </ul>
      <p>
        Send privacy requests to <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with a subject that includes the word “privacy”.
      </p>

      <h2>11. How long we keep email</h2>
      <p>
        Correspondence is kept as long as it is useful to finish a correction or rights request, then as ordinary mail in the operator’s inbox until it is deleted in the normal course of housekeeping. There is no separate marketing database. Host logs follow the host’s schedule, as described above.
      </p>

      <h2>12. Security</h2>
      <p>
        The site is served over HTTPS. That protects the page in transit; it does not make a shared team URL private, and it does not encrypt local storage against someone with access to your unlocked browser. This is a small fan site. Do not treat it as a vault for secrets.
      </p>

      <h2>13. International visitors</h2>
      <p>
        The site is published in English and reachable worldwide. Hosting and mail may be processed in more than one country. By using the site or sending email, you understand that technical and correspondence data may be handled outside the country you are sitting in. We do not geo-fence the companion.
      </p>

      <h2>14. Changes to this policy</h2>
      <p>
        If we add an account system, analytics, a comment form, or any other collection that this page does not describe, we will revise this policy first and change the date at the top. Continued use after that date means the new description applies to later visits. Older email is still handled under the policy that was current when we received it, unless a later law requires a different treatment.
      </p>
      <p>
        Questions: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Related: <Link href="/legal/terms-of-service">Terms of Service</Link>, <Link href="/legal/contact-us">Contact Us</Link>, <Link href="/legal/about-us">About Us</Link>.
      </p>
    </StaticPage>
  );
}
