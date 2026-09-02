"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { elementMeta, roleLabels } from "@/config/site";
import type { Aniimo } from "@/types/content";
import styles from "@/style/page/content.module.css";

type Placement = { slug: string; tier: "S" | "A" | "B" | "C" };

const placements: Placement[] = [
  { slug: "infergon", tier: "S" }, { slug: "gachapus", tier: "S" }, { slug: "malevsera", tier: "S" },
  { slug: "wavwal", tier: "S" }, { slug: "helgon", tier: "S" }, { slug: "inferlupa", tier: "S" },
  { slug: "geoclaw", tier: "S" }, { slug: "coraliz", tier: "S" }, { slug: "grizbo", tier: "S" },
  { slug: "fulmintis", tier: "S" }, { slug: "waleetle", tier: "S" }, { slug: "minespine", tier: "S" },
  { slug: "tuckin", tier: "S" }, { slug: "magmarex", tier: "S" }, { slug: "rookey", tier: "S" },
  { slug: "glameep", tier: "S" }, { slug: "erlath", tier: "S" },
  { slug: "malangel", tier: "A" }, { slug: "pawney", tier: "A" }, { slug: "sherro", tier: "A" },
  { slug: "fenmane", tier: "A" }, { slug: "fennelun", tier: "A" }, { slug: "panpanta", tier: "A" },
  { slug: "luminelle", tier: "A" }, { slug: "bailite", tier: "A" }, { slug: "pomawk", tier: "A" },
  { slug: "shrubclaw", tier: "A" }, { slug: "tubster", tier: "A" }, { slug: "leafy", tier: "A" },
  { slug: "witchin", tier: "A" }, { slug: "helion", tier: "A" }, { slug: "irisal", tier: "A" },
  { slug: "glynsera", tier: "A" }, { slug: "thornblade", tier: "A" }, { slug: "scorchhowl", tier: "A" },
  { slug: "dazmand", tier: "A" }, { slug: "piopiota", tier: "A" }, { slug: "blazen", tier: "A" },
  { slug: "dreaple", tier: "A" }, { slug: "tromber", tier: "A" }, { slug: "bouldus", tier: "A" },
  { slug: "turbo", tier: "A" }, { slug: "somniwing", tier: "A" }, { slug: "besauce", tier: "A" },
  { slug: "glacy", tier: "A" },
  { slug: "ignitis", tier: "B" }, { slug: "cornet", tier: "B" }, { slug: "stellarys", tier: "B" },
  { slug: "sheldon", tier: "B" }, { slug: "fenrier", tier: "B" }, { slug: "popapus", tier: "B" },
  { slug: "eklue", tier: "B" }, { slug: "fragrancier", tier: "B" }, { slug: "melloblum", tier: "B" },
  { slug: "helmwhelp", tier: "B" }, { slug: "geodeback", tier: "B" }, { slug: "lavazar", tier: "B" },
  { slug: "cheekie", tier: "B" }, { slug: "veilfloat", tier: "B" }, { slug: "gracewing", tier: "B" },
  { slug: "flamerion", tier: "B" }, { slug: "reefish", tier: "B" }, { slug: "cubbo", tier: "B" },
  { slug: "flameruff", tier: "B" }, { slug: "baleetle", tier: "B" }, { slug: "fentuft", tier: "B" },
  { slug: "budsquire", tier: "B" }, { slug: "wisptis", tier: "B" }, { slug: "popota", tier: "B" },
  { slug: "hummin", tier: "B" }, { slug: "pomegg", tier: "B" }, { slug: "budclaw", tier: "B" },
  { slug: "bolty", tier: "B" }, { slug: "chirpi", tier: "B" }, { slug: "nimbi", tier: "B" },
  { slug: "pranky", tier: "B" }, { slug: "bubbeep", tier: "B" }, { slug: "fahloo", tier: "B" },
  { slug: "celestis", tier: "C" }, { slug: "iris", tier: "C" }, { slug: "shelly", tier: "C" },
  { slug: "bonesky", tier: "C" }, { slug: "emberpup", tier: "C" }, { slug: "eko", tier: "C" },
  { slug: "cozite", tier: "C" }, { slug: "dewy", tier: "C" }, { slug: "jawling", tier: "C" },
  { slug: "pebbling", tier: "C" }, { slug: "susuta", tier: "C" }, { slug: "bulbly", tier: "C" },
  { slug: "helmut", tier: "C" }, { slug: "flutternym", tier: "C" }, { slug: "sparki", tier: "C" },
  { slug: "skippy", tier: "C" },
];

const tierDetails = {
  S: { label: "Highest ceiling", note: "Leading published stat profiles within their role", color: "#bd8a28" },
  A: { label: "Strong team core", note: "Reliable options for a focused four-Aniimo team", color: "#3b8bca" },
  B: { label: "Useful specialists", note: "Good when the team needs their particular job", color: "#55a278" },
  C: { label: "Situational picks", note: "Best chosen for a specific plan or personal preference", color: "#8a78b8" },
} as const;

function verdict(entry: Aniimo) {
  const skills = entry.skills.slice(0, 2).map((skill) => skill.name).filter(Boolean);
  const role = roleLabels[entry.roles[0]] || entry.roles[0] || "team";
  if (skills.length) return `${role} option with ${skills.join(" and ")}.`;
  return `${role} option with the details you need to compare on its profile.`;
}

export function PlayerTierBoard({ entries }: { entries: Aniimo[] }) {
  const [role, setRole] = useState("all");
  const index = useMemo(() => new Map(entries.map((entry) => [entry.slug, entry])), [entries]);
  const roleOptions = useMemo(() => [...new Set(entries.flatMap((entry) => entry.roles))].sort(), [entries]);
  const grouped = useMemo(() => {
    return (Object.keys(tierDetails) as Array<keyof typeof tierDetails>).map((tier) => ({
      tier,
      entries: placements
        .filter((placement) => placement.tier === tier)
        .map((placement) => index.get(placement.slug))
        .filter((entry): entry is Aniimo => Boolean(entry))
        .filter((entry) => role === "all" || entry.roles.includes(role)),
    })).filter((group) => group.entries.length > 0);
  }, [index, role]);

  return <section className={styles.playerTierBoard} aria-labelledby="tier-board-title">
    <header className={styles.playerTierHeader}>
      <div><span>Player tier list</span><h2 id="tier-board-title">Choose by the job your team needs</h2></div>
      <p>Roles are compared with their own job in mind. A healer is not scored against a damage dealer just because one base field is higher.</p>
    </header>
    <nav className={styles.tierRoleFilters} aria-label="Filter tier list by role">
      <button type="button" className={role === "all" ? styles.tierRoleActive : ""} onClick={() => setRole("all")}>All roles</button>
      {roleOptions.map((value) => <button type="button" key={value} className={role === value ? styles.tierRoleActive : ""} onClick={() => setRole(value)}>{roleLabels[value] || value}</button>)}
    </nav>
    <div className={styles.tierBands}>
      {grouped.map(({ tier, entries: tierEntries }) => {
        const details = tierDetails[tier];
        return <section className={styles.playerTierBand} style={{ "--tier-color": details.color } as React.CSSProperties} key={tier}>
          <aside><strong>{tier}</strong><span>{details.label}</span><small>{details.note}</small></aside>
          <div>{tierEntries.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}>
            <span className={styles.playerTierPortrait}><Image src={entry.image} alt="" fill sizes="86px" /></span>
            <span className={styles.playerTierCopy}><b>{entry.name}</b><em>{entry.elements.map((element) => elementMeta[element]?.label || element).join(" / ")} · {entry.roles.map((entryRole) => roleLabels[entryRole] || entryRole).join(" / ")}</em><small>{verdict(entry)}</small></span>
          </Link>)}</div>
        </section>;
      })}
    </div>
  </section>;
}
