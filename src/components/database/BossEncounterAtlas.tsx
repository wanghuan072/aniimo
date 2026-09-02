import Image from "next/image";
import Link from "next/link";
import { elementMeta } from "@/config/site";
import { mapHref, resolveMapFocus } from "@/lib/map-atlas";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export type BossEncounter = {
  slug: string;
  name: string;
  image: string;
  elements: string[];
  habitats: string[];
  description: string;
  rank: "Alpha" | "Omega";
  primegy: number;
  region?: string;
  unlock?: string;
};

function BossCard({ record, featured = false }: { record: BossEncounter; featured?: boolean }) {
  const mapLink = resolveMapFocus(record.slug) ? mapHref({ marker: record.slug, region: record.habitats[0] || record.region }) : "";
  return <article className={`${styles.bossCard} ${featured ? styles.bossCardFeatured : ""}`}>
    {mapLink.includes("?") ? <Link className={styles.bossMapPin} href={mapLink}><Icon name="pin" /> Map</Link> : null}
    <Link className={styles.bossCardMain} href={`/aniimo/${record.slug}`}>
      <span className={styles.bossPortrait}><Image src={record.image} alt="" fill sizes={featured ? "180px" : "120px"} /></span>
      <span className={styles.bossRank}>{record.rank}</span>
      <span className={styles.bossCardCopy}>
        <small>{record.rank === "Omega" ? record.region || "Omega encounter" : "Alpha encounter"}</small>
        <strong>{record.name}</strong>
        <span className={styles.bossElements}>{record.elements.map((element) => <i key={element} style={{ "--boss-element": elementMeta[element]?.color || "#5d91c5" } as React.CSSProperties}>{elementMeta[element]?.symbol} {elementMeta[element]?.label || element}</i>)}</span>
        <p>{record.description}</p>
        <span className={styles.bossCardFooter}>
          <em>{record.rank === "Omega" && record.unlock ? `Quest: ${record.unlock}` : record.habitats.length ? record.habitats.slice(0, 2).join(" · ") : "Profile data available"}</em>
          <span className={styles.bossReward}>{record.primegy}<small>Primegy</small></span>
        </span>
      </span>
    </Link>
  </article>;
}

export function BossEncounterAtlas({ records }: { records: BossEncounter[] }) {
  const omega = records.filter((record) => record.rank === "Omega");
  const alpha = records.filter((record) => record.rank === "Alpha");
  return <>
    <div className={styles.bossDirectory}><p><strong>{records.length}</strong> documented encounters <span /> <b>{omega.length}</b> Omega <span /> <b>{alpha.length}</b> Alpha</p><span>Open a profile, or jump to the encounter marker on the map.</span></div>
    <section className={styles.bossSection}><header><span>Omega encounters</span><h2>Quest Boss Encounters</h2></header><div className={styles.omegaBossGrid}>{omega.map((record) => <BossCard record={record} featured key={record.slug} />)}</div></section>
    <section className={styles.bossSection}><header><span>Alpha encounters</span><h2>Field Boss Encounters</h2></header><div className={styles.alphaBossGrid}>{alpha.map((record) => <BossCard record={record} key={record.slug} />)}</div></section>
  </>;
}
