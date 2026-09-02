import StaticPage from "@/page/StaticPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.contact);

export default function ContactPage() {
  return <StaticPage title="Contact Us" description="Use email to report a correction, share player feedback, or send a question about Aniimo.">
    <h2>Contact Aniimo</h2><p>Email <a href="mailto:wyong@aniimo.cc">wyong@aniimo.cc</a> for page corrections, player feedback, accessibility concerns, general site questions, or copyright notices. Aniimo does not use a contact form, so you decide exactly what information to include.</p>
    <h2>Report a correction</h2><p>Include the page URL, the field you believe needs attention, the language and game version you were using, and the date you noticed the difference. A clear screenshot or reproducible in-game step can help us review the report without guessing.</p>
    <h2>Share player feedback</h2><p>For a guide, team shape, or map experience, explain what you were trying to do, which form or party you used, and what happened. Specific context is more useful than a broad rating and helps distinguish a page issue from a playstyle difference.</p>
    <h2>Response expectations</h2><p>We review messages as time permits. Sending an email does not guarantee a reply, a content change, or a particular outcome, but complete and focused reports are easier to evaluate. Do not send passwords, payment information, government IDs, or other sensitive information.</p>
  </StaticPage>;
}
