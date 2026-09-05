import { ImageResponse } from "next/og";
import { getGuide } from "@/lib/data";

export const alt = "Aniimo player guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const treatments: Record<string, { accent: string; pale: string; code: string; mark: string }> = {
  "aniimo-beginners-guide": { accent: "#6f9d48", pale: "#edf5e6", code: "FIELD ROUTE 01", mark: "01—05" },
  "aniimo-forms-and-evolution": { accent: "#b47a22", pale: "#fff3d9", code: "LINEAGE FILE 02", mark: "1 → 2 → 3" },
  "aniimo-combat-guide": { accent: "#c9554d", pale: "#ffebe7", code: "COMBAT LOG 03", mark: "BREAK / EP" },
};

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const treatment = treatments[slug] || treatments["aniimo-beginners-guide"];
  const title = guide?.title || "Aniimo Player Guide";
  const category = guide?.category || "Player Guide";

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      color: "#173b58",
      background: `linear-gradient(135deg, #fbfdfd 0%, ${treatment.pale} 100%)`,
      fontFamily: "Arial, sans-serif",
      padding: "54px",
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "2px solid #d4e0e3",
        borderRadius: "28px",
        background: "rgba(255,255,255,.84)",
        padding: "48px 52px",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "13px", background: treatment.accent }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", color: treatment.accent, fontSize: 24, fontWeight: 800, letterSpacing: "2px" }}>
            <span style={{ display: "flex", width: "16px", height: "16px", borderRadius: "50%", background: treatment.accent }} />
            ANIIMO FIELD NOTES
          </div>
          <div style={{ display: "flex", color: "#627c90", fontSize: 21, fontWeight: 700, letterSpacing: "1px" }}>{treatment.code}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "50px" }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ display: "flex", marginBottom: "17px", color: treatment.accent, fontSize: 24, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>{category}</div>
            <div style={{ display: "flex", maxWidth: "790px", fontSize: 53, fontWeight: 800, lineHeight: 1.07, letterSpacing: "-1.5px" }}>{title}</div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "250px",
            height: "150px",
            border: `3px solid ${treatment.accent}`,
            borderRadius: "75px",
            color: treatment.accent,
            background: treatment.pale,
            fontSize: slug === "aniimo-combat-guide" ? 28 : 34,
            fontWeight: 900,
            letterSpacing: "1px",
          }}>{treatment.mark}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#718899", fontSize: 21 }}>
          <span>Verified fields, visible limits, player-facing notes</span>
          <span style={{ color: "#173b58", fontWeight: 800 }}>aniimo.cc</span>
        </div>
      </div>
    </div>,
    size,
  );
}
