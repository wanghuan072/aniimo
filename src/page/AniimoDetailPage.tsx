"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Aniimo, AniimoEvolutionNode } from "@/types/content";
import { aniimo } from "@/lib/data";
import { Breadcrumb, ElementBadge, StageBadge } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { StatRadar } from "@/components/aniimo/StatRadar";
import { roleLabels, siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/seo/JsonLd";
import styles from "@/style/page/detail.module.css";

const titleCase = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());
const stageLabel = (stage: number) => stage === 1 ? "Lumin" : stage === 2 ? "Gamma" : stage === 3 ? "Nova" : "Special";

function EvolutionCard({ node, currentName }: { node: AniimoEvolutionNode; currentName: string }) {
  const local = aniimo.find((candidate) => candidate.name === node.name);
  const current = node.name === currentName;
  const portrait = local ? <Image src={local.voteImage || local.image} alt="" fill sizes="72px" /> : node.imageUrl ? <Image src={node.imageUrl} alt="" fill sizes="72px" /> : null;
  const body = <><span className={styles.evoMedal}>{portrait}</span><strong>{node.name}</strong><small data-stage={node.stage}>{stageLabel(node.stage)}</small></>;
  const className = `${styles.evoCard} ${current ? styles.evoCurrent : ""}`;
  return local
    ? <Link href={`/aniimo/${local.slug}`} className={className} aria-current={current ? "page" : undefined} aria-label={`${node.name}, ${stageLabel(node.stage)}`}>{body}</Link>
    : <div className={className}>{body}</div>;
}

function EvolutionNode({ node, currentName }: { node: AniimoEvolutionNode; currentName: string }) {
  const branches = node.children.length;
  return (
    <div className={styles.evoLane}>
      <EvolutionCard node={node} currentName={currentName} />
      {branches === 1 && (
        <>
          <span className={styles.evoRail} aria-hidden />
          <EvolutionNode node={node.children[0]} currentName={currentName} />
        </>
      )}
      {branches > 1 && (
        <>
          <span className={styles.evoRail} aria-hidden />
          <div className={styles.evoFork} data-count={branches}>
            {node.children.map((child) => <EvolutionNode key={`${child.name}-${child.stage}`} node={child} currentName={currentName} />)}
          </div>
        </>
      )}
    </div>
  );
}

const letter = (value: number, values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = sorted.findIndex((candidate) => candidate >= value) / Math.max(sorted.length - 1, 1);
  return percentile >= .82 ? "S" : percentile >= .58 ? "A" : percentile >= .3 ? "B" : "C";
};

export default function AniimoDetailPage({ entry: initialEntry, findOnMapHref, habitatLinks }: { entry: Aniimo; findOnMapHref?: string; habitatLinks: Array<{ name: string; href: string }> }) {
  const [illustrationOpen, setIllustrationOpen] = useState(false);
  const entry = initialEntry;
  const evolution = entry.evolution.map((node) => ({ ...node, local: aniimo.find((candidate) => candidate.name === node.name) }));
  const role = entry.roles.map((value) => roleLabels[value] || titleCase(value)).join(" / ");
  const stats = entry.stats;
  const allStats = aniimo.flatMap((candidate) => candidate.stats ? [candidate.stats] : []);
  const defense = stats ? Math.round((stats.physicalDefense + stats.magicDefense) / 2) : 0;
  const ratings = stats ? [
    ["Overall", letter(stats.attributeValue, allStats.map((value) => value.attributeValue)), "✦"],
    ["P. ATK", letter(stats.physicalAttack, allStats.map((value) => value.physicalAttack)), "⚔"],
    ["M. ATK", letter(stats.magicAttack, allStats.map((value) => value.magicAttack)), "◆"],
    ["Defense", letter(defense, allStats.map((value) => (value.physicalDefense + value.magicDefense) / 2)), "⬟"],
    ["REGEN", letter(stats.haste, allStats.map((value) => value.haste)), "ϟ"],
  ] : [];
  const strongestStat = stats ? [
    ["HP", stats.hp],
    ["Physical ATK", stats.physicalAttack],
    ["Magic ATK", stats.magicAttack],
    ["Physical DEF", stats.physicalDefense],
    ["Magic DEF", stats.magicDefense],
    ["REGEN", stats.haste],
  ].sort((a, b) => Number(b[1]) - Number(a[1]))[0] : null;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Aniimo", href: "/aniimo" }, { name: entry.name, href: `/aniimo/${entry.slug}` }], siteConfig.url)} />

      <section className={styles.detailHero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.identity}>
            <Breadcrumb items={[{ label: "Database", href: "/database" }, { label: "Aniimo", href: "/aniimo" }, { label: entry.name }]} />
            <div className={styles.elementRow}>
              {entry.elements.map((element) => <Link href={`/aniimo?element=${element}`} key={element}><ElementBadge element={element} /></Link>)}
            </div>
            <h1>{entry.name}</h1>
            <div className={styles.stageLine}>
              <span aria-hidden>{"★".repeat(Math.max(entry.stage, 1))}</span>
              <StageBadge stage={entry.stage} />
              <small>NO. {entry.entryId}</small>
            </div>
            <p className={styles.description}>{entry.description}</p>
            <div className={styles.roleChips}>
              <Link href={`/aniimo?role=${entry.roles[0] || "all"}`}><Icon name="team" /><small>Combat Role</small><strong>{role}</strong></Link>
              <span><Icon name="spark" /><small>Highest Base Field</small><strong>{strongestStat ? `${strongestStat[0]} · ${strongestStat[1]}` : "Not listed"}</strong></span>
            </div>
            <div className={styles.heroActions}>
              <Link href="/team-builder" className="button-primary">Build a Team <Icon name="arrow" /></Link>
              {findOnMapHref && <Link href={findOnMapHref} className="button-secondary"><Icon name="pin" /> Find on Map</Link>}
              <Link href={`/tools/compare?first=${entry.slug}`} className="button-secondary">Compare</Link>
              {entry.illustrationUrl && <button type="button" className="button-secondary" onClick={() => setIllustrationOpen(true)}>View Illustration</button>}
            </div>
          </div>

          <div className={styles.creatureArt}>
            <Image key={entry.id} src={entry.voteImage || entry.image} alt={`${entry.name} official artwork`} fill priority sizes="(max-width: 760px) 78vw, 440px" />
          </div>

          <aside className={styles.factCard}>
            <span className={styles.factEyebrow}>Aniimo Profile</span>
            <dl>
              <div><dt>Stage</dt><dd>{stageLabel(entry.stage)}</dd></div>
              <div><dt>Form</dt><dd>{entry.form}</dd></div>
              <div><dt>Element</dt><dd>{entry.elements.map(titleCase).join(" / ")}</dd></div>
              <div><dt>Role</dt><dd>{role}</dd></div>
              {entry.gender.length > 0 && <div><dt>Gender</dt><dd>{entry.gender.map(titleCase).join(" / ")}</dd></div>}
              <div><dt>Skills</dt><dd>{entry.skills.length} listed</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {illustrationOpen && entry.illustrationUrl && <div className={styles.illustrationDialog} role="dialog" aria-modal="true" aria-label={`${entry.name} illustration`}>
        <div>
          <button type="button" onClick={() => setIllustrationOpen(false)} aria-label="Close illustration"><Icon name="close" /></button>
          <video controls autoPlay playsInline preload="metadata"><source src={entry.illustrationUrl} type="video/mp4" /></video>
        </div>
      </div>}

      <section className={styles.detailBody}>
        <div className="container">
          {entry.formRecords.length > 1 && <section className={styles.formComparison} aria-label={`${entry.name} form comparison`}>
            <header><div><span className={styles.sectionEyebrow}>Forms</span><h2>Forms and Differences</h2></div><p>Compare each form’s elements, role, base fields and combat kit at a glance.</p></header>
            <div className={styles.formComparisonRows}>{entry.formRecords.map((record) => {
              const baseTotal = entry.formRecords[0]?.stats?.attributeValue ?? 0;
              const total = record.stats?.attributeValue ?? 0;
              const delta = total - baseTotal;
              const baseFields = record.stats ? [["HP", record.stats.hp], ["P. ATK", record.stats.physicalAttack], ["M. ATK", record.stats.magicAttack], ["P. DEF", record.stats.physicalDefense], ["M. DEF", record.stats.magicDefense], ["REGEN", record.stats.haste]] : [];
              return <article className={record.id === entry.id ? styles.currentFormComparison : undefined} key={record.id}>
                <header><span className={styles.formPortrait}><Image src={record.image} alt={`${entry.name} ${record.form}`} fill sizes="112px" /></span><div><strong>{record.form}</strong><small>{stageLabel(record.stage)} stage</small></div></header>
                <div className={styles.formIdentity}><span>{record.elements.map(titleCase).join(" / ")}</span><span>{record.roles.map((value) => roleLabels[value] || titleCase(value)).join(" / ")}</span></div>
                <div className={styles.formTotals}><b>{total}<small> Base total</small></b><em>{delta === 0 ? "Base form" : `${delta > 0 ? "+" : ""}${delta} vs base`}</em></div>
                <dl>{baseFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                <footer>{record.skills.length} skills <span /> {record.traits.length} trait{record.traits.length === 1 ? "" : "s"}</footer>
              </article>;
            })}</div>
          </section>}

          <div className={styles.overviewGrid}>
            <section className={`${styles.panel} ${styles.ratingsPanel}`}>
              <header><div><span className={styles.sectionEyebrow}>At a glance</span><h2>Stat Ratings at a Glance</h2></div><small>Compared with this roster</small></header>
              <div className={styles.ratings}>{ratings.map(([name, grade, icon]) => <div key={name}><i aria-hidden>{icon}</i><span>{name}</span><b>{grade}</b></div>)}</div>
              <p>These letters compare base fields across the current roster. They do not settle every matchup or replace the skill descriptions.</p>
            </section>
            <section className={`${styles.panel} ${styles.statsPanel}`}>
              <header><div><span className={styles.sectionEyebrow}>Base fields</span><h2>Base Stats</h2></div>{stats && <strong className={styles.totalStat}>{stats.attributeValue}<small>Total</small></strong>}</header>
              {stats ? <StatRadar stats={stats} /> : <p>Base stats are not available for this form yet.</p>}
            </section>
          </div>

          <div className={styles.recordStrip} aria-label={`${entry.name} record summary`}>
            <div><strong>{entry.skills.length}</strong><span>Skills</span></div>
            <div><strong>{entry.traits.length}</strong><span>Traits</span></div>
            <div><strong>{entry.evolution.length}</strong><span>Evolution Nodes</span></div>
            <div><strong>{entry.habitats.length}</strong><span>Habitats</span></div>
            <div><strong>{entry.mobility.length || entry.pathfinding.length}</strong><span>Mobility Skills</span></div>
          </div>

          <div className={styles.abilityGrid}>
            <section className={styles.panel}>
              <header><div><span className={styles.sectionEyebrow}>Combat Kit</span><h2>Skills, Element Types and Power</h2></div><Link href="/database/skills">Browse Skills <Icon name="arrow" /></Link></header>
              {entry.skills.length ? <div className={styles.skillList}>{entry.skills.map((skill, index) => <article key={`${skill.name}-${index}`}>
                <span className={styles.abilityIcon}>{skill.iconUrl ? <Image src={skill.iconUrl} alt="" width={52} height={52} /> : <span aria-hidden>✦</span>}</span>
                <div><h3>{skill.name}</h3><small>{[skill.category, ...skill.elements.map(titleCase), ...skill.types, skill.cost !== "0" ? `Cost ${skill.cost}` : "", skill.power !== "0" ? `Power ${skill.power}` : ""].filter(Boolean).join(" · ")}</small><p>{skill.description}</p></div>
              </article>)}</div> : <p>Skills are not listed for this Aniimo yet.</p>}
            </section>

          </div>

          {entry.evolutionTree && evolution.length > 0 && <section className={`${styles.recordSection} ${styles.evolutionSection}`}>
            <header className={styles.recordHeader}><h2>Evolution Path</h2></header>
            <div className={styles.evolutionTree}><EvolutionNode node={entry.evolutionTree} currentName={entry.name} /></div>
          </section>}

          <div className={styles.fieldDataGrid}>
            {entry.habitats.length > 0 && <section className={styles.recordSection}>
              <header className={styles.recordHeader}><h2>Habitats</h2></header>
              <div className={styles.habitatLinks}>{habitatLinks.map(({ name, href }) => <Link href={href} key={name}><Icon name="pin" />{name}</Link>)}</div>
            </section>}
            {entry.homelandAbilities.length > 0 && <section className={styles.recordSection}>
              <header className={styles.recordHeader}><h2>Homeland Abilities</h2></header>
              <div className={styles.homelandAbilities}>{entry.homelandAbilities.map((ability) => <span className={styles.homelandAbility} data-ability={ability.key} key={ability.key}><i aria-hidden /><b>{ability.value}</b></span>)}</div>
            </section>}
            {(entry.mobility.length > 0 || entry.pathfinding.length > 0) && <section className={`${styles.recordSection} ${styles.mobilitySection}`}>
              <header className={styles.recordHeader}><h2>Mobility and Pathfinding</h2></header>
              <div className={styles.mobilityList}>{entry.mobility.map((ability) => <article key={ability.name}><span className={styles.mobilityIcon}>{ability.iconUrl ? <Image src={ability.iconUrl} alt="" width={42} height={42} /> : <Icon name="map" />}</span><div><h3>{ability.name}</h3><p>{ability.description}</p></div></article>)}</div>
              {entry.pathfinding.length > 0 && <div className={styles.pathfindingTags}>{entry.pathfinding.map((ability) => <span key={ability}>{ability}</span>)}</div>}
            </section>}
          </div>

          {entry.traits.length > 0 && <section className={styles.recordSection}>
            <header className={styles.recordHeader}><h2>Trait</h2></header>
            <div className={styles.traitRecords}>{entry.traits.map((trait) => <article key={trait.name}>
              <span className={`${styles.abilityIcon} ${styles.traitIcon}`}>{trait.iconUrl ? <Image src={trait.iconUrl} alt="" width={52} height={52} /> : <span aria-hidden>✧</span>}</span>
              <div><h3>{trait.name}</h3><p>{trait.description}</p></div>
            </article>)}</div>
          </section>}

        </div>
      </section>
    </>
  );
}
