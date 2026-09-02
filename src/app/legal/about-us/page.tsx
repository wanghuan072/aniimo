import StaticPage from "@/page/StaticPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.about);

export default function AboutPage() {
  return <StaticPage title="About Us" description="Aniimo is a player-made companion built around the questions players ask while exploring Idyll.">
    <h2>What Aniimo is for</h2><p>Aniimo is made for the practical moment between opening the game and choosing what to do next: comparing a few creatures, checking a form, looking up a habitat, or shaping a party around Aniimo you already have. The site connects those questions without making players work through unrelated pages.</p>
    <h2>How pages are approached</h2><p>Creature and database pages focus on fields players can use: elements, roles, forms, skills, traits, evolution connections, habitats, and related records. Guides and team templates are clearly player-made suggestions. When a useful connection cannot be supported by the available information, the site leaves it out instead of making one up.</p>
    <h2>Independent fan-made site</h2><p>Aniimo is not an official game website. It is not affiliated with, endorsed by, sponsored by, or connected to the game&apos;s owners. The site&apos;s navigation, writing, player tools, and presentation are independently created for the community.</p>
    <h2>Keeping the site useful</h2><p>Game information can change. We review reports that identify a page, the specific field, and what a player saw in the game. Clear corrections are more useful than broad complaints, and they help keep the next player from following a stale path.</p>
  </StaticPage>;
}
