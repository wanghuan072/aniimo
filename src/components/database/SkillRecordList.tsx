"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { skillStatChips } from "@/lib/skill-display";
import styles from "@/style/page/content.module.css";

type SkillRecord = {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  cost?: string;
  power?: string;
  cooldown?: string;
  breakValue?: string;
  teamRole?: string;
  owners: Array<{ name: string; slug: string; image: string }>;
};

const batchSize = 60;

export function SkillRecordList({ records }: { records: SkillRecord[] }) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const autoLoadLocked = useRef(false);
  const hasMore = visibleCount < records.length;
  const loadMore = useCallback(() => setVisibleCount((current) => Math.min(current + batchSize, records.length)), [records.length]);

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
    <div className={styles.skillGrid}>{records.slice(0, visibleCount).map((record) => <article className={styles.skillCard} key={record.id}><span className={styles.skillArtwork}>{record.iconUrl ? <Image src={record.iconUrl} alt="" width={84} height={84} /> : "✦"}</span><div className={styles.skillCardCopy}><h2>{record.name}</h2><small>{[record.category, record.teamRole].filter(Boolean).join(" · ")}</small><dl className={styles.skillStats}>{skillStatChips(record).map((chip) => <div key={chip.label}><dt>{chip.label}</dt><dd>{chip.value}</dd></div>)}</dl><p>{record.description}</p></div><div className={styles.skillCardFooter}><span className={styles.skillUsage}>{record.owners.length === 1 ? "Used by 1 Aniimo" : `Used by ${record.owners.length} Aniimo`}</span><span className={styles.skillOwnerList}>{record.owners.map((owner) => <Link href={`/aniimo/${owner.slug}`} key={owner.slug} title={owner.name} aria-label={`Open ${owner.name}`}><span><Image src={owner.image} alt="" fill sizes="30px" /></span></Link>)}</span></div></article>)}</div>
    <div className={styles.loadMore} aria-live="polite"><span>Showing {Math.min(visibleCount, records.length)} of {records.length} skills</span>{hasMore && <button type="button" onClick={loadMore}>Load more <Icon name="arrow" /></button>}</div>
  </>;
}
