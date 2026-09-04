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

function ElementPills({ elements }: { elements: string[] }) {
  return (
    <span className={styles.encounterElements}>
      {elements.map((element) => (
        <i key={element} style={{ "--boss-element": elementMeta[element]?.color || "#5d91c5" } as React.CSSProperties}>
          {elementMeta[element]?.label || element}
        </i>
      ))}
    </span>
  );
}

function EncounterCard({ record, featured = false }: { record: BossEncounter; featured?: boolean }) {
  const mapLink = resolveMapFocus(record.slug) ? mapHref({ marker: record.slug, region: record.habitats[0] || record.region }) : "";
  const place = featured ? record.region : "";
  return (
    <article id={record.slug} className={`${styles.encounterCard} ${featured ? styles.encounterFeatured : ""}`}>
      {mapLink.includes("?") ? <Link className={styles.encounterMap} href={mapLink}><Icon name="pin" /> Map</Link> : null}
      <Link className={styles.encounterMain} href={`/aniimo/${record.slug}`}>
        <span className={styles.encounterArt}><Image src={record.image} alt="" fill sizes={featured ? "280px" : "160px"} /></span>
        <span className={styles.encounterCopy}>
          <small>{record.rank}{place ? ` · ${place}` : ""}</small>
          <strong>{record.name}</strong>
          <ElementPills elements={record.elements} />
          {featured && record.unlock ? <em>Quest: {record.unlock}</em> : null}
          {!featured && record.habitats.length ? <em>{record.habitats.slice(0, 2).join(" · ")}</em> : null}
        </span>
      </Link>
    </article>
  );
}

export function BossEncounterAtlas({ records }: { records: BossEncounter[] }) {
  const omega = records.filter((record) => record.rank === "Omega");
  const alpha = records.filter((record) => record.rank === "Alpha");
  return (
    <>
      <div className={styles.catalogBar}>
        <p><strong>{records.length}</strong> encounters <span /> <b>{omega.length}</b> Omega <span /> <b>{alpha.length}</b> Alpha</p>
        <span>Open a profile, or jump to the marker on the map.</span>
      </div>
      <section className={styles.encounterBand}>
        <header><span>Omega</span><h2>Quest bosses</h2></header>
        <div className={styles.omegaRow}>{omega.map((record) => <EncounterCard record={record} featured key={record.slug} />)}</div>
      </section>
      <section className={styles.encounterBand}>
        <header><span>Alpha</span><h2>Field bosses</h2></header>
        <div className={styles.alphaRow}>{alpha.map((record) => <EncounterCard record={record} key={record.slug} />)}</div>
      </section>
    </>
  );
}
