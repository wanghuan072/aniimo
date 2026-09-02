import StaticPage from "@/page/StaticPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.terms);

export default function TermsPage() {
  return <StaticPage title="Terms of Service" description="Last updated September 1, 2026. These terms set the ground rules for using Aniimo.">
    <h2>Acceptance and purpose</h2><p>By accessing Aniimo, you agree to these terms. Aniimo provides player-facing reference pages, planning tools, guides, and local tracking features. It is an independent fan-made site, not an official game service, and it does not replace the game client, official notices, or your own judgment.</p>
    <h2>Permitted use</h2><p>You may browse, link to, and use the site for personal, non-commercial gameplay research and planning. You may not interfere with the site, attempt to bypass security measures, scrape it at a rate that disrupts normal access, misrepresent Aniimo as an official service, or use its original written material and tools as your own published product without permission.</p>
    <h2>Information and player-made guidance</h2><p>Creature pages, forms, skills, habitats, and related records are presented to help with discovery. Guides, team templates, comparisons, and rankings are player-made planning aids. Patches, regional changes, launch changes, and incomplete information can make a page outdated. Check the current game when a decision affects your play.</p>
    <h2>Intellectual property</h2><p>Aniimo&apos;s original site layout, writing, and tool behavior are protected by applicable law. Game names, characters, artwork, screenshots, logos, and other game-related materials belong to their respective owners. Their presence on this fan site does not create an ownership claim, endorsement, sponsorship, or partnership.</p>
    <h2>Availability and liability</h2><p>The site is provided on an “as is” and “as available” basis. To the fullest extent permitted by United States law, Aniimo does not warrant that every page will be complete, accurate, uninterrupted, or suitable for a particular purpose. You are responsible for how you use information from the site.</p>
    <h2>Changes and contact</h2><p>We may update, pause, or remove site features and revise these terms when necessary. Continued use after a revised date means you accept the updated terms. Questions or notices may be sent to wyong@aniimo.cc.</p>
  </StaticPage>;
}
