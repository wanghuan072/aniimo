"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Aniimo, AniimoEvolutionView, AniimoSkill } from "@/types/content";
import { Breadcrumb, ElementBadge } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { AniimoSpawnMap } from "@/components/aniimo/AniimoSpawnMap";
import { StatRadar } from "@/components/aniimo/StatRadar";
import { elementMeta, homelandAbilityMeta, roleLabels } from "@/config/site";
import { applyAniimoForm } from "@/lib/aniimo-form";
import { skillStatChips } from "@/lib/skill-display";
import type { AniimoSpawnAtlas } from "@/lib/map-types";
import styles from "@/style/page/detail.module.css";

export type AniimoFormView = {
  id: string;
  ratings: Array<[string, string, string]>;
  strongestStat: [string, number] | null;
  matchups: { weak: string[]; resists: string[]; strong: string[] };
  habitatLinks: Array<{ name: string; href: string }>;
  habitatNote: { text: string; href: string; label: string } | null;
  findOnMapHref?: string;
};

export type RelatedAniimoCard = {
  slug: string;
  name: string;
  image: string;
  caption: string;
};

const titleCase = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());
const recordSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const stageLabel = (stage: number) => stage === 1 ? "Lumin" : stage === 2 ? "Gamma" : stage === 3 ? "Nova" : "Special";
const formatWeight = (weight: Aniimo["weight"]) => {
  if (weight.min == null && weight.max == null) return "";
  if (weight.min != null && weight.max != null && weight.min !== weight.max) return `${weight.min}–${weight.max} kg`;
  return `${weight.min ?? weight.max} kg`;
};
const leadingAttack = (stats: Aniimo["stats"]) => {
  if (!stats) return null;
  const physical = stats.physicalAttack >= stats.magicAttack;
  return { label: physical ? "Physical Attack" : "Magic Attack", value: physical ? stats.physicalAttack : stats.magicAttack };
};

function TypeOrb({ element }: { element: string }) {
  const meta = elementMeta[element];
  return (
    <Link
      href={`/database/elements#${element}`}
      className={styles.typeOrb}
      title={meta?.label || element}
      aria-label={meta?.label || element}
      style={{ "--element-color": meta?.color || "#4d83d9", "--element-sprite-index": String(meta?.spriteIndex ?? 0) } as React.CSSProperties}
    />
  );
}

function countLineage(node: AniimoEvolutionView): number {
  return 1 + node.children.reduce((total, child) => total + countLineage(child), 0);
}

function targetingParts(skill: AniimoSkill) {
  const targeting = skill.targeting;
  if (!targeting) return [];
  return [
    targeting.range ? { label: "Range", value: targeting.range } : null,
    targeting.hitCap ? { label: "Hit", value: targeting.hitCap } : null,
    targeting.interval ? { label: "Interval", value: targeting.interval } : null,
  ].filter((part): part is { label: string; value: string } => Boolean(part));
}

function SkillKitCard({ skill }: { skill: AniimoSkill }) {
  const extraEffects = (skill.effects || []).filter((effect) => !skill.description.includes(effect.text));
  const range = targetingParts(skill);
  const shape = skill.targeting?.shape;
  return (
    <article className={styles.skillCard}>
      <header className={styles.skillHead}>
        <span className={styles.abilityIcon}>{skill.iconUrl ? <Image src={skill.iconUrl} alt="" width={52} height={52} /> : <span aria-hidden>✦</span>}</span>
        <div className={styles.skillIdentity}>
          <h3>{skill.name}</h3>
          <div className={styles.skillTags}>
            {skill.category ? <span>{skill.category}</span> : null}
            {skill.elements.map((item) => <span key={item}>{titleCase(item)}</span>)}
            {skill.types.map((type) => <span key={type}>{type}</span>)}
            {skill.teamRole ? <span>{skill.teamRole}</span> : null}
            {shape ? <span>{shape}</span> : null}
          </div>
        </div>
      </header>
      <dl className={styles.skillHud}>
        {skillStatChips(skill).map((chip) => (
          <div key={chip.label}><dd>{chip.value}</dd><dt>{chip.label}</dt></div>
        ))}
        {range.map((part) => (
          <div key={part.label}><dd>{part.value}</dd><dt>{part.label}</dt></div>
        ))}
      </dl>
      <p>{skill.description}</p>
      {extraEffects.length ? (
        <ul className={styles.skillEffects}>
          {extraEffects.map((effect, index) => (
            <li key={`${effect.kind}-${index}`}><em>{effect.kind}</em>{effect.text}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function EvolutionCard({ node, currentName }: { node: AniimoEvolutionView; currentName: string }) {
  const current = node.name === currentName;
  const portraitSrc = node.portrait || node.imageUrl;
  const portrait = portraitSrc ? <Image src={portraitSrc} alt="" fill sizes="88px" /> : null;
  const body = (
    <>
      <span className={styles.evoMedal}>{portrait}</span>
      <strong>{node.name}</strong>
      <small data-stage={node.stage}>{stageLabel(node.stage)}</small>
      {current && <em>This profile</em>}
    </>
  );
  const className = `${styles.evoCard} ${current ? styles.evoCurrent : ""}`;
  return node.slug
    ? <Link href={`/aniimo/${node.slug}`} className={className} aria-current={current ? "page" : undefined} aria-label={`${node.name}, ${stageLabel(node.stage)}${current ? ", this profile" : ""}`}>{body}</Link>
    : <div className={className}>{body}</div>;
}

function EvolutionNode({ node, currentName }: { node: AniimoEvolutionView; currentName: string }) {
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

export default function AniimoDetailPage({
  entry,
  formViews,
  spawnAtlases,
  evolutionTree,
  neighbors,
  related,
  author,
  updated,
}: {
  entry: Aniimo;
  formViews: AniimoFormView[];
  spawnAtlases: AniimoSpawnAtlas[];
  evolutionTree: AniimoEvolutionView | null;
  neighbors: { prev: { slug: string; name: string; entryId: string }; next: { slug: string; name: string; entryId: string } };
  related: RelatedAniimoCard[];
  author: string;
  updated: string;
}) {
  const [formId, setFormId] = useState(entry.id);
  const view = formViews.find((item) => item.id === formId) || formViews[0];
  const displayed = useMemo(() => applyAniimoForm(entry, view?.id || entry.id), [entry, view?.id]);
  const role = displayed.roles.map((value) => roleLabels[value] || titleCase(value)).join(" / ");
  const stats = displayed.stats;
  const attack = leadingAttack(stats);
  const weight = formatWeight(displayed.weight);
  const hasFieldData = displayed.traits.length > 0 || displayed.mobility.length > 0 || displayed.roles.length > 0 || Boolean(weight);
  const primary = elementMeta[displayed.elements[0]] || { label: "Aniimo", color: "#4d83d9" };
  const defendingAs = displayed.elements.map((element) => elementMeta[element]?.label || titleCase(element)).join(" / ");
  const matchups = view?.matchups || { weak: [], resists: [], strong: [] };
  const ratings = view?.ratings || [];
  const strongestStat = view?.strongestStat || null;
  const habitatLinks = view?.habitatLinks || [];
  const habitatNote = view?.habitatNote || null;
  const findOnMapHref = view?.findOnMapHref;
  const canSwitchForms = displayed.formRecords.length > 1;

  return (
    <>
      <section className={styles.detailHero} style={{ "--hero-element": primary.color } as React.CSSProperties}>
        <div className="container">
          <div className={styles.heroTop}>
            <Breadcrumb items={[{ label: "Aniimo", href: "/aniimo" }, { label: entry.name }]} />
            <nav className={styles.dexNav} aria-label="Roster navigation">
              <Link href={`/aniimo/${neighbors.prev.slug}`} aria-label={`Previous, ${neighbors.prev.name}`}><Icon name="chevron" /></Link>
              <span>No. {entry.entryId}</span>
              <Link href={`/aniimo/${neighbors.next.slug}`} aria-label={`Next, ${neighbors.next.name}`}><Icon name="chevron" /></Link>
            </nav>
          </div>

          <article className={styles.dossier}>
            <figure className={styles.portrait}>
              <Image key={displayed.id} src={displayed.voteImage || displayed.image} alt={`${entry.name} ${displayed.form} official artwork`} fill priority sizes="(max-width: 760px) 88vw, 420px" />
              {displayed.homelandAbilities.length > 0 && (
                <ul className={styles.heroAbilities} aria-label="Homeland abilities">
                  {displayed.homelandAbilities.map((ability) => {
                    const meta = homelandAbilityMeta[ability.key];
                    const label = meta?.label || "Homeland ability";
                    return (
                      <li key={ability.key}>
                        <span className={styles.heroAbility} data-ability={ability.key} title={`${label} Lv ${ability.value}`} aria-label={`${label}, level ${ability.value}`}>
                          <i />
                          <b>{ability.value}</b>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </figure>

            <div className={styles.dossierCopy}>
              <small className={styles.entryNo}>{entry.entryId}</small>
              <div className={styles.nameRow}>
                <h1>{entry.name}</h1>
                <div className={styles.heroPills}>
                  {displayed.elements.map((element) => (
                    <Link href={`/database/elements#${element}`} key={element} className={styles.elementPill}>
                      <ElementBadge element={element} />
                    </Link>
                  ))}
                  <span className={styles.stagePill} data-stage={displayed.stage}>{stageLabel(displayed.stage)} stage</span>
                  <span className={styles.formPill}>{displayed.form}</span>
                  <Link href={`/aniimo?role=${displayed.roles[0] || "all"}`} className={styles.rolePill}><Icon name="team" />{role}</Link>
                </div>
              </div>
              <p className={styles.description}>{displayed.description}</p>

              <div className={styles.matchups} aria-label="Element matchups">
                <span className={styles.matchCaption}>Defending as {defendingAs}</span>
                {matchups.weak.length > 0 && (
                  <div className={styles.weakBar}>
                    <b><Icon name="boss" /> Weak</b>
                    <div>{matchups.weak.map((element) => <TypeOrb element={element} key={`weak-${element}`} />)}</div>
                  </div>
                )}
                {matchups.resists.length > 0 && (
                  <div className={styles.resistBar}>
                    <b><Icon name="check" /> Resists</b>
                    <div>{matchups.resists.map((element) => <TypeOrb element={element} key={`resist-${element}`} />)}</div>
                  </div>
                )}
                {matchups.strong.length > 0 && (
                  <div className={styles.strongBar}>
                    <b><Icon name="spark" /> Strong vs</b>
                    <div>{matchups.strong.map((element) => <TypeOrb element={element} key={`strong-${element}`} />)}</div>
                  </div>
                )}
              </div>

              <p className={styles.byline}><span>Author: {author}</span><span>Updated {updated}</span></p>

              <div className={styles.heroActions}>
                <Link href="/team-builder" className="button-primary">Build a Team <Icon name="arrow" /></Link>
                {findOnMapHref && <Link href={findOnMapHref} className="button-secondary"><Icon name="pin" /> Find on Map</Link>}
                <Link href={`/tools/compare?first=${entry.slug}`} className="button-secondary">Compare</Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.detailBody}>
        <div className="container">
          <div className={styles.overviewGrid}>
            <section className={`${styles.panel} ${styles.ratingsPanel}`}>
              <header><div><span className={styles.sectionEyebrow}>At a glance</span><h2>Stat Ratings at a Glance</h2></div><small>Compared with this roster</small></header>
              <div className={styles.ratings}>{ratings.map(([name, grade, icon]) => <div key={name}><i aria-hidden>{icon}</i><span>{name}</span><b>{grade}</b></div>)}</div>
              <p>These letters compare base fields across the current roster. They do not settle every matchup or replace the skill descriptions.{strongestStat ? ` Highest listed field: ${strongestStat[0]} ${strongestStat[1]}.` : ""}</p>
            </section>
            <section className={`${styles.panel} ${styles.statsPanel}`}>
              <header><div><span className={styles.sectionEyebrow}>Base fields</span><h2>Base Stats</h2></div>{stats && <strong className={styles.totalStat}>{stats.attributeValue}<small>Total</small></strong>}</header>
              {stats ? <StatRadar stats={stats} /> : <p>Base stats are not available for this form yet.</p>}
            </section>
          </div>

          <div className={styles.recordStrip} aria-label={`${entry.name} record summary`}>
            <div><strong>{displayed.skills.length}</strong><span>Skills</span></div>
            <div><strong>{displayed.traits.length}</strong><span>Traits</span></div>
            <div><strong>{entry.evolution.length}</strong><span>Evolution Nodes</span></div>
            <div><strong>{displayed.habitats.length}</strong><span>Habitats</span></div>
            <div><strong>{displayed.mobility.length || displayed.pathfinding.length}</strong><span>Mobility Skills</span></div>
          </div>

          <div className={styles.abilityGrid}>
            <section className={styles.panel}>
              <header><div><span className={styles.sectionEyebrow}>Combat Kit</span><h2>Skills, Element Types and Power</h2></div><Link href="/database/skills">Browse Skills <Icon name="arrow" /></Link></header>
              {displayed.skills.length ? <div className={styles.skillList}>{displayed.skills.map((skill, index) => <SkillKitCard key={`${skill.name}-${index}`} skill={skill} />)}</div> : <p>Skills are not listed for this Aniimo yet.</p>}
            </section>
          </div>

          {spawnAtlases.length > 0 && <AniimoSpawnMap name={entry.name} atlases={spawnAtlases} />}

          {evolutionTree && entry.evolution.length > 0 && <section id="lineage" className={styles.evolutionSection} style={{ "--hero-element": primary.color } as React.CSSProperties}>
            <header>
              <div>
                <span className={styles.sectionEyebrow}>Lineage</span>
                <h2>Evolution Path</h2>
              </div>
              <p>{countLineage(evolutionTree)} published stages. The highlighted medal is this profile.</p>
            </header>
            <div className={styles.evolutionTree}><EvolutionNode node={evolutionTree} currentName={entry.name} /></div>
          </section>}

          {canSwitchForms && <section id="forms" className={styles.formComparison} aria-label={`${entry.name} form comparison`}>
            <header><div><span className={styles.sectionEyebrow}>Forms</span><h2>Forms and Differences</h2></div><p>Compare each form’s elements, role, base fields and combat kit at a glance.</p></header>
            <div className={styles.formComparisonRows}>{displayed.formRecords.map((record) => {
              const baseTotal = displayed.formRecords[0]?.stats?.attributeValue ?? 0;
              const total = record.stats?.attributeValue ?? 0;
              const delta = total - baseTotal;
              const baseFields = record.stats ? [["HP", record.stats.hp], ["P. ATK", record.stats.physicalAttack], ["M. ATK", record.stats.magicAttack], ["P. DEF", record.stats.physicalDefense], ["M. DEF", record.stats.magicDefense], ["REGEN", record.stats.haste]] : [];
              return <button type="button" className={record.id === displayed.id ? styles.currentFormComparison : undefined} aria-pressed={record.id === displayed.id} onClick={() => setFormId(record.id)} key={record.id}>
                <header><span className={styles.formPortrait}><Image src={record.image} alt={`${entry.name} ${record.form}`} fill sizes="112px" /></span><div><strong>{record.form}</strong><small>{stageLabel(record.stage)} stage</small></div></header>
                <div className={styles.formIdentity}><span>{record.elements.map(titleCase).join(" / ")}</span><span>{record.roles.map((value) => roleLabels[value] || titleCase(value)).join(" / ")}</span></div>
                <div className={styles.formTotals}><b>{total}<small> Base total</small></b><em>{delta === 0 ? "Base form" : `${delta > 0 ? "+" : ""}${delta} vs base`}</em></div>
                <dl>{baseFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                <footer>{record.skills.length} skills <span /> {record.traits.length} trait{record.traits.length === 1 ? "" : "s"}</footer>
              </button>;
            })}</div>
          </section>}

          {hasFieldData && <section className={styles.fieldData} aria-label={`${entry.name} field data`}>
            <header>
              <div>
                <span>Trait · Mobility · Role · Size</span>
                <h2>Field data</h2>
              </div>
              <Link href="/database/traits">Browse Traits <Icon name="arrow" /></Link>
            </header>
            {(displayed.traits.length > 0 || displayed.mobility.length > 0) && (
              <div className={styles.fieldFacts}>
                {displayed.traits.map((trait) => (
                  <Link href={`/database/traits#trait-${recordSlug(trait.name)}`} key={trait.name} aria-label={`Open ${trait.name} in the traits database`}>
                    <span className={styles.fieldFactIcon}>{trait.iconUrl ? <Image src={trait.iconUrl} alt="" width={44} height={44} /> : <span aria-hidden>✧</span>}</span>
                    <div>
                      <h3>{trait.name}</h3>
                      <b>Trait</b>
                      <p>{trait.description}</p>
                    </div>
                  </Link>
                ))}
                {displayed.mobility.map((ability) => (
                  <Link href={`/database/mobility#${recordSlug(ability.name)}`} key={ability.name} aria-label={`Open ${ability.name} in the mobility database`}>
                    <span className={`${styles.fieldFactIcon} ${styles.fieldMobilityIcon}`}>{ability.iconUrl ? <Image src={ability.iconUrl} alt="" width={44} height={44} /> : <Icon name="map" />}</span>
                    <div>
                      <h3>{ability.name}</h3>
                      <b>Mobility</b>
                      <p>{ability.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {displayed.pathfinding.length > 0 && <div className={styles.pathfindingTags}>{displayed.pathfinding.map((ability) => <span key={ability}>{ability}</span>)}</div>}
            {(displayed.roles.length > 0 || attack || weight) && (
              <div className={styles.fieldPills}>
                {displayed.roles.map((value) => <span data-kind="role" key={value}>{roleLabels[value] || titleCase(value)}</span>)}
                {attack ? <span data-kind="attack">{attack.label} {attack.value}</span> : null}
                {weight ? <span data-kind="size">Weight {weight}</span> : null}
              </div>
            )}
          </section>}

          <div className={styles.fieldDataGrid}>
            <section className={styles.recordSection}>
              <header className={styles.recordHeader}><h2>Habitats</h2></header>
              {habitatLinks.length > 0 ? (
                <div className={styles.habitatLinks}>{habitatLinks.map(({ name, href }) => <Link href={href} key={name}><Icon name="pin" />{name}</Link>)}</div>
              ) : (
                <p className={styles.habitatNote}>
                  {habitatNote?.text || "No published wild habitat."}
                  {habitatNote ? <> <Link href={habitatNote.href}>{habitatNote.label}</Link></> : null}
                </p>
              )}
            </section>
          </div>

          {related.length > 0 && (
            <section className={styles.relatedSection} aria-label={`Aniimo related to ${entry.name}`}>
              <header>
                <div>
                  <span className={styles.sectionEyebrow}>Nearby records</span>
                  <h2>Related Aniimo</h2>
                </div>
                <p>Family first, then shared elements or roles.</p>
              </header>
              <div className={styles.relatedCards}>
                {related.map((item) => (
                  <Link href={`/aniimo/${item.slug}`} key={item.slug}>
                    <span><Image src={item.image} alt="" fill sizes="120px" /></span>
                    <strong>{item.name}</strong>
                    <small>{item.caption}</small>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
