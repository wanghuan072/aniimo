"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

import type { CommunityRecord } from "@/types/content";

const batchSize = 60;

function formatAchievementDescription(description: string) {
  return description
    .replace(/^→\s*/, "")
    .replace(/(\d+)\s*tiers?(?:gold|prismatic)?/gi, "")
    .replace(/Not available in this version\./gi, "")
    .replace(/([a-z])([A-Z])/g, "$1. $2")
    .trim();
}

export function CommunityRecordList({ records, categorySlug }: { records: CommunityRecord[]; categorySlug: string }) {
  const searchParams = useSearchParams();
  const isItemsCatalogue = categorySlug === "items";
  const isMaterialsCatalogue = categorySlug === "materials";
  const isAchievementsCatalogue = categorySlug === "achievements";
  const type = searchParams.get("type") || "";
  const rarity = searchParams.get("rarity") || "";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const itemCategories = isItemsCatalogue ? [...new Set(records.map((record) => record.category))].sort() : [];
  const materialRarities = isMaterialsCatalogue ? [...new Set(records.map((record) => record.rarity))].sort((a, b) => ["Common", "Uncommon", "Rare", "Epic", "Legendary"].indexOf(a) - ["Common", "Uncommon", "Rare", "Epic", "Legendary"].indexOf(b)) : [];
  const activeFilter = isMaterialsCatalogue ? rarity : type;
  const filteredRecords = records
    .filter((record) => !activeFilter || (isMaterialsCatalogue ? record.rarity === activeFilter : record.category === activeFilter))
    .filter((record) => !query || record.slug.toLowerCase() === query || record.name.toLowerCase().includes(query));
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const autoLoadLocked = useRef(false);
  const hasMore = visibleCount < filteredRecords.length;

  const loadMore = useCallback(() => setVisibleCount((current) => Math.min(current + batchSize, filteredRecords.length)), [filteredRecords.length]);

  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      const root = document.documentElement;
      const nearListEnd = root.scrollTop + window.innerHeight >= root.scrollHeight - 280;
      if (!nearListEnd) {
        autoLoadLocked.current = false;
        return;
      }
      if (!autoLoadLocked.current) {
        autoLoadLocked.current = true;
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loadMore]);

  return <>
    {(activeFilter || query) && <div className={styles.filterNotice}><span>Showing {query ? `"${searchParams.get("q")}"` : activeFilter} records</span><Link href={`/database/${categorySlug}`}>Clear filter <Icon name="close" /></Link></div>}
    {isItemsCatalogue ? <>
      <div className={styles.itemCatalogueBar}><p><strong>{filteredRecords.length}</strong> catalogued items <span /> browse by item family</p><span>Images and descriptions are loaded as you browse.</span></div>
      <nav className={styles.itemCategoryFilter} aria-label="Item categories">
        <Link className={!type ? styles.itemCategoryActive : ""} href={`/database/${categorySlug}`}>All items <b>{records.length}</b></Link>
        {itemCategories.map((category) => <Link className={type === category ? styles.itemCategoryActive : ""} href={`/database/${categorySlug}?type=${encodeURIComponent(category)}`} key={category}>{category} <b>{records.filter((record) => record.category === category).length}</b></Link>)}
      </nav>
      <div className={styles.itemCatalogueGrid}>{filteredRecords.slice(0, visibleCount).map((record) => <article id={record.slug} className={styles.itemCatalogueCard} key={record.slug}>
        <div className={styles.itemArtwork}><span>{record.image ? <Image src={record.image} alt="" fill sizes="(max-width: 680px) 45vw, 220px" /> : <Icon name="item" />}</span><b>{record.rarity}</b></div>
        <div className={styles.itemCatalogueCopy}><h2>{record.name}</h2><p>{record.description}</p></div>
      </article>)}</div>
    </> : isMaterialsCatalogue ? <>
      <div className={styles.materialInventoryBar}><p><strong>{filteredRecords.length}</strong> collected materials <span /> filter by rarity</p><span>Material names and descriptions are shown from the indexed catalogue.</span></div>
      <nav className={styles.materialRarityFilter} aria-label="Material rarity">
        <Link className={!rarity ? styles.materialRarityActive : ""} href={`/database/${categorySlug}`}>All materials <b>{records.length}</b></Link>
        {materialRarities.map((value) => <Link className={rarity === value ? styles.materialRarityActive : ""} href={`/database/${categorySlug}?rarity=${encodeURIComponent(value)}`} key={value}>{value} <b>{records.filter((record) => record.rarity === value).length}</b></Link>)}
      </nav>
      <div className={styles.materialInventoryGrid}>{filteredRecords.slice(0, visibleCount).map((record) => <article className={styles.materialInventoryCard} key={record.slug}>
        <span className={styles.materialImage}>{record.image ? <Image src={record.image} alt="" fill sizes="76px" /> : <Icon name="item" />}</span>
        <div><small>{record.rarity}</small><h2 title={record.name}>{record.name}</h2><p>{record.description}</p></div>
      </article>)}</div>
    </> : isAchievementsCatalogue ? <>
      <div className={styles.achievementArchiveBar}><p><strong>{filteredRecords.length}</strong> achievement badges <span /> <b>31</b> badge lines</p><span>Browse the indexed badge archive.</span></div>
      <div className={styles.achievementGrid}>{filteredRecords.slice(0, visibleCount).map((record) => {
        const tiers = record.description.match(/(\d+)\s*tiers?/i)?.[1];
        return <article className={styles.achievementCard} key={record.slug}>
          <span className={styles.achievementSeal}>{record.image ? <Image src={record.image} alt="" fill sizes="76px" /> : <Icon name="boss" />}</span>
          <div><small>{tiers ? `${tiers} tiers` : "Achievement"}</small><h2 title={record.name}>{record.name}</h2><p>{formatAchievementDescription(record.description)}</p><em>{record.rarity}</em></div>
        </article>;
      })}</div>
    </> : <div className={styles.recordList}>{filteredRecords.slice(0, visibleCount).map((record) => <article key={record.slug}><div><span className={styles.recordImage}>{record.image ? <Image src={record.image} alt="" width={44} height={44} /> : <Icon name="item" />}</span><span><h2>{record.name}</h2><small>{record.rarity} · {record.category}</small></span></div><p>{record.description}</p><Link className={styles.catalogueStatus} href={`/database/${categorySlug}?type=${encodeURIComponent(record.category)}`}>More {record.category} <Icon name="arrow" /></Link></article>)}</div>}
    <div className={styles.loadMore} aria-live="polite">
      <span>Showing {Math.min(visibleCount, filteredRecords.length)} of {filteredRecords.length} records</span>
      {hasMore && <button type="button" onClick={loadMore}>Load more <Icon name="arrow" /></button>}
    </div>
  </>;
}
