"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Aniimo } from "@/types/content";
import { elementMeta, roleLabels } from "@/config/site";
import styles from "@/style/components/tools.module.css";

const fields = [
  ["hp", "HP"],
  ["physicalAttack", "ATK"],
  ["magicAttack", "BREAK"],
  ["physicalDefense", "P. DEF"],
  ["magicDefense", "M. DEF"],
  ["haste", "REGEN"],
] as const;

export function CompareTool({ entries }: { entries: Aniimo[] }) {
  const [slugs, setSlugs] = useState(["stellarys", "eklue", "emberpup"]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [query, setQuery] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { const first = new URL(window.location.href).searchParams.get("first"); if (first && entries.some((entry) => entry.slug === first)) setSlugs((current) => [first, ...current.filter((slug) => slug !== first)].slice(0, 3)); }, 0); return () => window.clearTimeout(timer); }, [entries]);
  const selected = useMemo(() => slugs.map((slug) => entries.find((entry) => entry.slug === slug)!).filter(Boolean), [slugs, entries]);
  const replace = (index: number, slug: string) => setSlugs((current) => {
    const existingIndex = current.indexOf(slug);
    if (existingIndex === index) return current;
    if (existingIndex >= 0) {
      return current.map((value, currentIndex) => currentIndex === index ? slug : currentIndex === existingIndex ? current[index] : value);
    }
    return current.map((value, currentIndex) => currentIndex === index ? slug : value);
  });
  const roster = useMemo(() => entries.filter((entry) => entry.name.toLowerCase().includes(query.trim().toLowerCase())), [entries, query]);

  return <div className={styles.compareApp}>
    <section className={styles.compareStage}>
      <header><div><span>Three-record comparison</span><h2>Compare Aniimo Stats, Elements and Roles</h2></div><p>Choose up to three official records. Their role, element labels and published fields update together.</p></header>
      <div className={styles.compareGrid}>{slugs.map((slug, index) => {
        const entry = entries.find((item) => item.slug === slug)!;
        const primary = elementMeta[entry.elements[0]];
        return <article key={index} style={{ "--compare-accent": primary?.color || "#4b89c4" } as React.CSSProperties}>
          <button type="button" className={activeSlot === index ? styles.compareSlotActive : ""} onClick={() => setActiveSlot(index)}><span>Slot {String(index + 1).padStart(2, "0")}</span><b>{activeSlot === index ? "Choosing from list" : "Choose this slot"}</b></button>
          <div className={styles.compareImage}><Image src={entry.image} alt={`${entry.name} official artwork`} fill sizes="260px" /></div>
          <div className={styles.compareIdentity}><div><h3>{entry.name}</h3><small>Stage {entry.stage} · {entry.form}</small></div><Link href={`/aniimo/${entry.slug}`} aria-label={`Open ${entry.name} profile`}>↗</Link></div>
          <div className={styles.compareTags}><span>{entry.elements.map((element) => `${elementMeta[element]?.symbol} ${elementMeta[element]?.label}`).join(" · ")}</span><strong>{entry.roles.map((role) => roleLabels[role] || role).join(" / ")}</strong></div>
        </article>;
      })}</div>
    </section>
    <section className={styles.comparePicker} aria-label="Choose Aniimo to compare">
      <header><div><span>Available Aniimo</span><h2>Choose Aniimo for Comparison</h2></div><label><span>Search roster</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Aniimo…" /></label></header>
      <div className={styles.comparePickerList}>{roster.map((entry) => <button type="button" className={slugs[activeSlot] === entry.slug ? styles.comparePickerCurrent : ""} key={entry.slug} onClick={() => replace(activeSlot, entry.slug)} title={`Set ${entry.name} in slot ${activeSlot + 1}`}>
        <span><Image src={entry.image} alt="" fill sizes="92px" /></span><strong>{entry.name}</strong>
      </button>)}</div>
    </section>
    <section className={styles.compareMatrix} aria-label="Official base stat comparison">
      <header><div><span>Published base fields</span><h2>Base Stats Comparison</h2></div><p>The blue mark identifies the largest number in each row, only among these selected Aniimo.</p></header>
      <div className={styles.compareMatrixHead}><span>Field</span>{selected.map((entry, index) => <strong key={`${entry.slug}-${index}`}>{entry.name}</strong>)}</div>
      {fields.map(([field, label]) => {
        const values = selected.map((entry) => entry.stats?.[field] || 0);
        const max = Math.max(...values, 1);
        return <div className={styles.compareMetric} key={field}><span>{label}</span>{selected.map((entry, index) => { const value = values[index]; return <div className={value === max && value > 0 ? styles.compareBest : ""} key={`${entry.slug}-${index}`}><b>{value || "—"}</b><i><em style={{ "--compare-progress": `${Math.round((value / max) * 100)}%` } as React.CSSProperties} /></i></div>; })}</div>;
      })}
      <div className={styles.compareMetric}><span>Skills</span>{selected.map((entry, index) => <div key={`${entry.slug}-${index}`}><b>{entry.skills.length}</b><small>published</small></div>)}</div>
      <div className={styles.compareMetric}><span>Habitats</span>{selected.map((entry, index) => <div key={`${entry.slug}-${index}`}><b>{entry.habitats.length || "—"}</b><small>listed</small></div>)}</div>
    </section>
    <section className={styles.compareSummary}><div><span>Comparison reminder</span><h2>Compare the Details That Matter</h2><p>Base fields do not account for encounter behavior, cooldowns or a player’s preferred rotation. Open each profile after comparing to read its skills, trait, evolution and habitat information.</p></div><div>{selected.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}><span><Image src={entry.image} alt="" fill sizes="42px" /></span>{entry.name} <b>→</b></Link>)}</div></section>
  </div>;
}
