"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Aniimo } from "@/types/content";
import { elementMeta, roleLabels } from "@/config/site";
import styles from "@/style/components/explorer.module.css";

type VoteRecord = { rank: number; name: string; slug?: string; votes: number };
const batchSize = 32;

export function TierListExplorer({ entries, records, rangeLabel = "Official results" }: { entries: Aniimo[]; records: VoteRecord[]; rangeLabel?: string }) {
  const [element, setElement] = useState("all");
  const [role, setRole] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loadingLock = useRef(false);
  const index = useMemo(() => new Map(entries.map((entry) => [entry.slug, entry])), [entries]);
  const elementOptions = useMemo(() => [...new Set(entries.flatMap((entry) => entry.elements))].sort(), [entries]);
  const roleOptions = useMemo(() => [...new Set(entries.flatMap((entry) => entry.roles))].sort(), [entries]);
  const filtered = useMemo(() => records.filter((record) => {
    const entry = record.slug ? index.get(record.slug) : undefined;
    return record.name.toLowerCase().includes(query.trim().toLowerCase()) && (element === "all" || entry?.elements.includes(element)) && (role === "all" || entry?.roles.includes(role));
  }), [element, index, query, records, role]);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => { const root = document.documentElement; const nearEnd = root.scrollTop + window.innerHeight >= root.scrollHeight - 320; if (!nearEnd) { loadingLock.current = false; return; } if (!loadingLock.current) { loadingLock.current = true; setVisibleCount((value) => Math.min(value + batchSize, filtered.length)); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [filtered.length, hasMore]);

  const resetAndSetElement = (value: string) => { setVisibleCount(batchSize); setElement(value); };
  const resetAndSetRole = (value: string) => { setVisibleCount(batchSize); setRole(value); };
  const updateQuery = (value: string) => { setVisibleCount(batchSize); setQuery(value); };

  return <div className={styles.voteExplorer}>
    <section className={styles.voteFilterDeck} aria-label="Official vote filters">
      <div><span>{rangeLabel}</span><strong>{filtered.length} ranked Aniimo</strong></div>
      <label><span>Search</span><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search vote ranking…" /></label>
      <nav className={styles.voteFilterRows}><span>Element</span><div><button className={element === "all" ? styles.voteFilterActive : ""} onClick={() => resetAndSetElement("all")}>All</button>{elementOptions.map((value) => <button className={element === value ? styles.voteFilterActive : ""} key={value} onClick={() => resetAndSetElement(value)} style={{ "--vote-filter": elementMeta[value]?.color || "#4f8cc8" } as React.CSSProperties}>{elementMeta[value]?.symbol} {elementMeta[value]?.label}</button>)}</div><span>Role</span><div><button className={role === "all" ? styles.voteFilterActive : ""} onClick={() => resetAndSetRole("all")}>All</button>{roleOptions.map((value) => <button className={role === value ? styles.voteFilterActive : ""} key={value} onClick={() => resetAndSetRole(value)}>{roleLabels[value] || value}</button>)}</div></nav>
    </section>
    <div className={styles.voteSummary}><span>Ranked by official vote count</span><span>{records.length} results in this section</span><span>Images use official Vote artwork</span></div>
    <div className={styles.voteBoard}>{filtered.slice(0, visibleCount).map((record) => {
      const entry = record.slug ? index.get(record.slug) : undefined;
      const content = <><span className={styles.voteRank}>#{record.rank}</span>{entry ? <span className={styles.voteImage}><Image src={`/images/aniimo/vote/${entry.slug}.png`} alt="" fill sizes="120px" /></span> : <span className={styles.voteMissing}>?</span>}<div><strong>{record.name}</strong><small>{entry ? `${entry.elements.map((value) => elementMeta[value]?.label || value).join(" / ")} · ${entry.roles.map((value) => roleLabels[value] || value).join(" / ")}` : "Official vote record · profile pending"}</small></div><b>{record.votes.toLocaleString("en-US")}<i>votes</i></b></>;
      return entry ? <Link className={styles.voteEntry} href={`/aniimo/${entry.slug}`} key={record.rank}>{content}</Link> : <article className={styles.voteEntry} key={record.rank}>{content}</article>;
    })}</div>
    {hasMore && <p className={styles.voteLoading}>More official vote results load as you scroll.</p>}
  </div>;
}
