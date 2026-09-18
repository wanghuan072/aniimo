import sharp from "sharp";
import { guides } from "@/lib/data";
import { getGuideDossier } from "@/data/editorial/guide-dossiers";

const treatments: Record<string, { accent: string; pale: string; code: string; mark: string }> = {
  "aniimo-catching-guide": { accent: "#2d79b3", pale: "#e8f5fc", code: "CATCH LOG 00", mark: "ANIIPOD" },
  "aniimo-beginners-guide": { accent: "#6f9d48", pale: "#edf5e6", code: "FIELD ROUTE 01", mark: "01—05" },
  "aniimo-forms-and-evolution": { accent: "#b47a22", pale: "#fff3d9", code: "LINEAGE FILE 02", mark: "1 → 2 → 3" },
  "aniimo-combat-guide": { accent: "#c9554d", pale: "#ffebe7", code: "COMBAT LOG 03", mark: "BREAK / EP" },
  "aniimo-elements-guide": { accent: "#6552a9", pale: "#f1eefc", code: "MATCHUP GRID 04", mark: "1.6× / .625×" },
  "aniimo-traits-guide": { accent: "#39785c", pale: "#edf7f1", code: "TRAIT TEST 05", mark: "TRIGGER" },
  "aniimo-materials-guide": { accent: "#a46628", pale: "#fff4e6", code: "ROUTE LEDGER 06", mark: "MAP / BAG" },
  "aniimo-eggs-guide": { accent: "#9a6c19", pale: "#fff7df", code: "EGG RECORD 07", mark: "ALPHA / ELITE" },
  "aniimo-collection-guide": { accent: "#26748c", pale: "#e8f6f7", code: "ROSTER LOG 08", mark: "OWNED / MISSING" },
};

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
function wrap(text: string, max = 26) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > max) { lines.push(line); line = word; } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export function getStaticPaths() {
  return guides.map((guide) => ({ params: { slug: guide.slug } }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const guide = guides.find((entry) => entry.slug === params.slug);
  const dossier = getGuideDossier(params.slug);
  if (!guide || !dossier) return new Response("Not found", { status: 404 });
  const treatment = treatments[params.slug];
  const lines = wrap(dossier.title);
  const title = lines.map((line, index) => `<tspan x="108" dy="${index ? 58 : 0}">${escape(line)}</tspan>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fbfdfd"/><stop offset="1" stop-color="${treatment.pale}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><rect x="54" y="54" width="1092" height="522" rx="28" fill="white" fill-opacity=".84" stroke="#d4e0e3" stroke-width="2"/><rect x="54" y="54" width="13" height="522" fill="${treatment.accent}"/><circle cx="108" cy="118" r="8" fill="${treatment.accent}"/><text x="132" y="126" fill="${treatment.accent}" font-family="Arial" font-size="24" font-weight="800" letter-spacing="2">ANIIMO FIELD NOTES</text><text x="850" y="126" fill="#627c90" font-family="Arial" font-size="21" font-weight="700">${escape(treatment.code)}</text><text x="108" y="290" fill="${treatment.accent}" font-family="Arial" font-size="24" font-weight="800">${escape(guide.category.toUpperCase())}</text><text x="108" y="355" fill="#173b58" font-family="Arial" font-size="53" font-weight="800">${title}</text><rect x="875" y="330" width="230" height="150" rx="75" fill="${treatment.pale}" stroke="${treatment.accent}" stroke-width="3"/><text x="990" y="420" fill="${treatment.accent}" text-anchor="middle" font-family="Arial" font-size="28" font-weight="900">${escape(treatment.mark)}</text><text x="108" y="535" fill="#718899" font-family="Arial" font-size="21">Verified fields, visible limits, player-facing notes</text><text x="940" y="535" fill="#173b58" font-family="Arial" font-size="21" font-weight="800">aniimo.cc</text></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" } });
}
