"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

type ProgressiveRecord = {
  id: string;
  name: string;
  description: string;
  meta: string;
  image?: string;
  href: string;
  linkLabel: string;
  relatedLinks?: Array<{ label: string; href: string; image?: string }>;
};

const batchSize = 60;

export function ProgressiveRecordList({ records, noun, fallback = "✦" }: { records: ProgressiveRecord[]; noun: string; fallback?: string }) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const autoLoadLocked = useRef(false);
  const hashScrolled = useRef(false);
  const hasMore = visibleCount < records.length;
  const loadMore = useCallback(() => setVisibleCount((current) => Math.min(current + batchSize, records.length)), [records.length]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const index = records.findIndex((record) => record.id === id);
    if (index >= 0) setVisibleCount((current) => Math.max(current, index + 1));
  }, [records]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id || hashScrolled.current) return;
    const target = document.getElementById(id);
    if (!target) return;
    hashScrolled.current = true;
    target.scrollIntoView({ block: "start" });
  }, [visibleCount, records]);

  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      const root = document.documentElement;
      const atEnd = root.scrollTop + window.innerHeight >= root.scrollHeight - 280;
      if (!atEnd) {
        autoLoadLocked.current = false;
      } else if (!autoLoadLocked.current) {
        autoLoadLocked.current = true;
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loadMore]);

  return <>
    <div className={styles.recordList}>{records.slice(0, visibleCount).map((record) => <article id={record.id} key={record.id}><div><span className={styles.recordImage}>{record.image ? <Image src={record.image} alt="" width={44} height={44} /> : fallback}</span><span><h2>{record.name}</h2><small>{record.meta}</small></span></div><p>{record.description}</p>{record.relatedLinks ? <span className={styles.ownerLinks}>{record.relatedLinks.map((related) => <Link href={related.href} key={related.href} title={related.label} aria-label={`Open ${related.label}`}>{related.image ? <span><Image src={related.image} alt="" fill sizes="22px" /></span> : related.label}</Link>)}</span> : <Link href={record.href}>{record.linkLabel} <Icon name="arrow" /></Link>}</article>)}</div>
    <div className={styles.loadMore} aria-live="polite"><span>Showing {Math.min(visibleCount, records.length)} of {records.length} {noun}</span>{hasMore && <button type="button" onClick={loadMore}>Load more <Icon name="arrow" /></button>}</div>
  </>;
}
