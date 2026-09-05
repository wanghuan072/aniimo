"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type DragEvent } from "react";
import type { AniimoStats } from "@/types/content";
import { elementMeta, roleLabels } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/components/tools.module.css";
import reviewStyles from "@/style/components/team-review.module.css";

export type TeamBuilderEntry = {
  slug: string;
  name: string;
  image: string;
  elements: string[];
  roles: string[];
  stats: Pick<AniimoStats, "hp" | "physicalAttack" | "magicAttack" | "physicalDefense" | "magicDefense"> | null;
};

export function TeamBuilder({ entries, initialTeam = [] }: { entries: TeamBuilderEntry[]; initialTeam?: string[] }) {
  const [slots, setSlots] = useState<string[]>(initialTeam);
  const [activeSlot, setActiveSlot] = useState(() => Math.min(initialTeam.length, 3));
  const [query, setQuery] = useState("");
  const [element, setElement] = useState("all");
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [shareState, setShareState] = useState("");

  const commitTeam = (next: string[]) => {
    const allowed = new Set(entries.map((entry) => entry.slug));
    const clean = [...new Set(next.filter((slug) => allowed.has(slug)))].slice(0, 4);
    setSlots(clean);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (clean.length) url.searchParams.set("team", clean.join(","));
      else url.searchParams.delete("team");
      window.history.replaceState({}, "", url);
    }
    return clean;
  };

  const team = slots.map((slug) => entries.find((entry) => entry.slug === slug)).filter((entry): entry is TeamBuilderEntry => Boolean(entry));
  const filtered = useMemo(() => entries.filter((entry) => (element === "all" || entry.elements.includes(element)) && entry.name.toLowerCase().includes(query.trim().toLowerCase())), [element, entries, query]);
  const elementOptions = useMemo(() => [...new Set(entries.flatMap((entry) => entry.elements))].sort(), [entries]);
  const analysis = useMemo(() => {
    const elements = [...new Set(team.flatMap((entry) => entry.elements))];
    const roles = [...new Set(team.flatMap((entry) => entry.roles))];
    const missing: string[] = [];
    if (team.length && !roles.includes("dps")) missing.push("Add a DPS-labelled Aniimo");
    if (team.length && !roles.includes("heal") && !roles.includes("regen") && !roles.includes("sup") && !roles.includes("energy")) missing.push("Consider sustain or support");
    if (team.length && !roles.includes("break")) missing.push("Consider a BREAK-labelled Aniimo");
    if (team.length > 1 && elements.length < 3) missing.push("Element coverage is narrow");
    return { elements, roles, missing };
  }, [team]);

  const chooseEntry = (slug: string) => {
    const existingIndex = slots.indexOf(slug);
    if (existingIndex >= 0) {
      setActiveSlot(existingIndex);
      return;
    }
    const next = [...slots];
    if (next.length < 4) {
      next.push(slug);
      setActiveSlot(next.length - 1);
    } else {
      next[activeSlot] = slug;
    }
    commitTeam(next);
  };

  const removeSlot = (index: number) => {
    const next = slots.filter((_, slotIndex) => slotIndex !== index);
    commitTeam(next);
    setActiveSlot(Math.max(0, Math.min(index, next.length)));
  };

  const swapSlots = (from: number, to: number) => {
    if (from === to || !slots[from] || !slots[to]) return;
    const next = [...slots];
    [next[from], next[to]] = [next[to], next[from]];
    commitTeam(next);
    setActiveSlot(to);
  };

  const onDrop = (event: DragEvent<HTMLElement>, index: number) => {
    event.preventDefault();
    const rosterSlug = event.dataTransfer.getData("application/x-aniimo-slug");
    if (rosterSlug) {
      const existingIndex = slots.indexOf(rosterSlug);
      if (existingIndex >= 0) {
        setActiveSlot(existingIndex);
      } else {
        const next = [...slots];
        if (index >= next.length) next.push(rosterSlug);
        else next[index] = rosterSlug;
        commitTeam(next);
        setActiveSlot(Math.min(index, next.length - 1));
      }
    } else if (draggedSlot !== null) swapSlots(draggedSlot, index);
    setDraggedSlot(null);
  };

  const copyTeamLink = async () => {
    if (!slots.length) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("Link copied");
    } catch {
      setShareState("Copy the page URL to share this team");
    }
    window.setTimeout(() => setShareState(""), 2400);
  };

  return <div className={styles.teamBuilder}>
    <div className={styles.teamBuilderMain}>
      <section className={styles.teamDeck} aria-label="Your team">
        <header className={styles.teamDeckHeader}>
          <div><span>Your four-slot party</span><h2>Build Your Four-Aniimo Team</h2></div>
          <div className={styles.deckActions}><Link href="/team-builder/templates">Player templates</Link><button type="button" onClick={() => commitTeam([])} disabled={!slots.length}>Clear</button><button type="button" onClick={copyTeamLink} disabled={!slots.length}><Icon name="share" /> Share team</button></div>
        </header>
        <div className={styles.teamSlotsGrid}>
          {Array.from({ length: 4 }, (_, index) => {
            const entry = team[index];
            const isActive = activeSlot === index;
            return <article key={entry?.slug || `empty-${index}`} draggable={Boolean(entry)} onDragStart={() => setDraggedSlot(index)} onDragEnd={() => setDraggedSlot(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, index)} className={`${styles.builderSlot} ${isActive ? styles.builderSlotActive : ""} ${entry ? "" : styles.builderSlotEmpty}`}>
              <button type="button" className={styles.slotSelect} onClick={() => setActiveSlot(index)} aria-label={`Select slot ${index + 1}`}><span>Slot {index + 1}</span>{isActive && <b>Picking</b>}</button>
              {entry ? <>
                <div className={styles.slotArtwork}><Image src={entry.image} alt="" fill sizes="150px" /></div>
                <div className={styles.slotIdentity}><div><h3>{entry.name}</h3><p>{entry.roles.map((role) => roleLabels[role] || role).join(" / ")}</p></div><button type="button" onClick={() => removeSlot(index)} aria-label={`Remove ${entry.name}`}><Icon name="close" /></button></div>
                <Link href={`/aniimo/${entry.slug}`} className={styles.slotProfile}>View record <Icon name="arrow" /></Link>
              </> : <div className={styles.slotEmptyCopy}><span>+</span><p>Select an Aniimo below</p></div>}
            </article>;
          })}
        </div>
        {shareState && <p className={styles.shareFeedback}>{shareState}</p>}
      </section>

      <section className={styles.teamRoster} aria-label="Aniimo roster">
        <header className={styles.teamRosterHeader}><div><span>Choose an Aniimo</span><h2>Choose Aniimo for Your Team</h2></div><label><span>Search the index</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Aniimo…" /></label></header>
        <nav className={styles.teamFilters} aria-label="Filter Aniimo by element"><button type="button" className={element === "all" ? styles.teamFilterActive : ""} onClick={() => setElement("all")}>All elements</button>{elementOptions.map((value) => <button type="button" className={element === value ? styles.teamFilterActive : ""} onClick={() => setElement(value)} key={value} style={{ "--team-element": elementMeta[value]?.color || "#4b89c4" } as React.CSSProperties}>{elementMeta[value]?.symbol} {elementMeta[value]?.label}</button>)}</nav>
        <div className={styles.aniimoPickerGrid}>{filtered.map((entry) => <article key={entry.slug} draggable onDragStart={(event) => event.dataTransfer.setData("application/x-aniimo-slug", entry.slug)} className={slots.includes(entry.slug) ? styles.pickerSelected : ""}>
          <button type="button" onClick={() => chooseEntry(entry.slug)} title={`Use ${entry.name} in the selected slot`}><span><Image src={entry.image} alt="" fill sizes="104px" /></span><strong>{entry.name}</strong><small>{entry.elements.map((value) => elementMeta[value]?.label || value).join(" / ")}</small></button>
          <Link href={`/aniimo/${entry.slug}`} aria-label={`Open ${entry.name} record`}>↗</Link>
        </article>)}</div>
      </section>
    </div>

    <aside className={styles.teamReview} aria-label="Team analysis">
      <header><span>Live team readout</span><h2>{team.length ? "Team Role and Element Coverage" : "Choose Your First Aniimo"}</h2><p>{team.length ? "The readout changes as you select, replace, or reorder the party." : "Pick from the roster or apply a team template to begin."}</p></header>
      {team.length > 0 && <section className={reviewStyles.reviewRoster}><h3>Selected Aniimo</h3>{team.map((entry) => {
        const stats = entry.stats;
        const attack = stats ? Math.max(stats.physicalAttack, stats.magicAttack) : null;
        const defense = stats ? Math.round((stats.physicalDefense + stats.magicDefense) / 2) : null;
        return <Link href={`/aniimo/${entry.slug}`} key={entry.slug} className={reviewStyles.reviewMember}>
          <span><Image src={entry.image} alt="" fill sizes="44px" /></span>
          <div><strong>{entry.name}</strong><small>{entry.roles.map((role) => roleLabels[role] || role).join(" / ")}</small></div>
          {stats ? <em><b>HP {stats.hp}</b><b>ATK {attack}</b><b>DEF {defense}</b></em> : <i>Stats not listed</i>}
        </Link>;
      })}</section>}
      <section className={styles.reviewSection}><h3>Elements</h3><div>{analysis.elements.length ? analysis.elements.map((value) => <span key={value} style={{ "--tag": elementMeta[value]?.color } as React.CSSProperties}>{elementMeta[value]?.symbol} {elementMeta[value]?.label}</span>) : <small>Element coverage appears here.</small>}</div></section>
      <section className={styles.reviewSection}><h3>Roles</h3><div>{analysis.roles.length ? analysis.roles.map((value) => <span key={value}>{roleLabels[value] || value}</span>) : <small>Role coverage appears here.</small>}</div></section>
      {analysis.missing.length > 0 && <section className={styles.reviewGaps}><h3>Consider next</h3>{analysis.missing.map((item) => <p key={item}><span>!</span>{item}</p>)}</section>}
      {team.length > 1 && <Link className={styles.compareTeamLink} href={`/tools/compare?first=${team[0].slug}`}>Compare your lead Aniimo <Icon name="arrow" /></Link>}
    </aside>
  </div>;
}
