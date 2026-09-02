import StaticPage from "@/page/StaticPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.privacy);

export default function PrivacyPolicyPage() {
  return <StaticPage title="Privacy Policy" description="Last updated September 1, 2026. This policy explains the limited information handled when you use Aniimo.">
    <h2>Scope</h2><p>Aniimo is an independent fan-made information website for players in the United States. This policy applies to this website and its player tools. It does not cover any game publisher, platform, storefront, social network, or website you may reach from a link on Aniimo.</p>
    <h2>Information stored in your browser</h2><p>The Collection Tracker and map tools may save the Aniimo IDs, filters, and display choices you select in your browser&apos;s local storage. This information stays on the device and browser where you made the choice. Clearing browser storage or using a different browser may remove or separate those choices.</p>
    <h2>Information you send to us</h2><p>If you email us, we receive the email address, message content, attachments, and the information you choose to include. We use that information to review the request, respond when appropriate, protect the website, and keep a record of resolved corrections or rights concerns.</p>
    <h2>Service and security data</h2><p>The hosting provider may process routine technical information needed to deliver and secure the site, such as IP address, browser type, device information, request time, requested page, and error logs. Aniimo does not sell personal information, run advertising profiles, or require a player account. We do not knowingly collect sensitive personal information.</p>
    <h2>Cookies and analytics</h2><p>Aniimo does not currently use advertising cookies or third-party behavioral analytics. Essential technical cookies may be introduced only when needed to operate a future site feature. If our practices materially change, this policy will be updated before that change applies.</p>
    <h2>Your choices and requests</h2><p>You can control local storage through your browser settings. To ask about an email you sent, request deletion where applicable, or report a privacy concern, email wyong@aniimo.cc with enough detail to identify the request. We may need reasonable information to verify that a request relates to your communication.</p>
    <h2>Children and changes</h2><p>Aniimo is not directed to children under 13, and we do not knowingly collect personal information from children. We may revise this policy when the site changes or law requires it. The updated date at the top will show when a material revision was published.</p>
  </StaticPage>;
}
