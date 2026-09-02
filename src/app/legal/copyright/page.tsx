import StaticPage from "@/page/StaticPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.copyright);

export default function CopyrightPage() {
  const year = new Date().getFullYear();
  return <StaticPage title="Copyright" description="Last updated September 1, 2026. This notice explains ownership and copyright requests for Aniimo.">
    <h2>Site content</h2><p>Copyright © {year} Aniimo. All rights reserved. Unless a page says otherwise, the original site writing, information architecture, tool interactions, and visual interface created for Aniimo are owned by the site operator. You may link to and quote short portions with a clear attribution and link back to the relevant page.</p>
    <h2>Game-related material</h2><p>Aniimo is an independent fan-made site. Game titles, names, character names, artwork, screenshots, logos, and related intellectual property remain the property of their respective owners. They are used here only to identify and discuss the game for player-reference purposes. Aniimo is not affiliated with, endorsed by, or connected to those owners.</p>
    <h2>Copyright concerns</h2><p>If you believe content on Aniimo infringes a copyright you own or represent, email wyong@aniimo.cc with the URL, identification of the protected work, a description of the concern, your contact information, and a statement that your notice is accurate and made in good faith. We will review complete notices and may remove or restrict material where appropriate.</p>
    <h2>Counter-notices</h2><p>If material you submitted or authorized was removed in error, you may send a counter-notice with the affected URL, your contact information, a good-faith statement explaining the mistake, and any information needed to evaluate the request. We may forward relevant parts of a notice or counter-notice when reasonably necessary to resolve it.</p>
  </StaticPage>;
}
