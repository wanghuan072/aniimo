import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { alphaBossSlugs, omegaBosses } from "@/data/editorial/encounters";
import { aniimo, communityDatabase, getDatabaseCategory, mapLocations } from "@/lib/data";
import { groupedSkills, groupedTraits } from "@/lib/database-relations";
import { mapHref } from "@/lib/map-atlas";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { CommunityRecordList } from "@/components/database/CommunityRecordList";
import { SkillRecordList } from "@/components/database/SkillRecordList";
import { ProgressiveRecordList } from "@/components/database/ProgressiveRecordList";
import { EvolutionAtlas, type EvolutionLineage } from "@/components/database/EvolutionAtlas";
import { BossEncounterAtlas, type BossEncounter } from "@/components/database/BossEncounterAtlas";
import { elementMeta } from "@/config/site";
import styles from "@/style/page/content.module.css";

export default function DatabaseCategoryPage({ slug }: { slug: string }) {
  const category = getDatabaseCategory(slug)!;
  const skillRecords = groupedSkills;
  const traitRecords = groupedTraits.map((trait) => ({ id: trait.id, name: trait.name, description: trait.description, meta: trait.owners.length > 1 ? `Shared by ${trait.owners.length} Aniimo` : "Used by 1 Aniimo", image: trait.iconUrl, href: `/aniimo/${trait.owners[0].slug}`, linkLabel: trait.owners[0].name, relatedLinks: trait.owners.map((owner) => ({ label: owner.name, href: `/aniimo/${owner.slug}`, image: owner.image })) }));
  const habitatRecords = [...new Set(aniimo.flatMap((entry) => entry.habitats))].sort().map((habitat) => {
    const name = habitat.replace(/[.]$/, "");
    return { habitat: name, location: mapLocations.find((location) => location.name.replace(/[.]$/, "").toLowerCase() === name.toLowerCase()), entries: aniimo.filter((entry) => entry.habitats.includes(habitat)) };
  });
  const aniimoByName = new Map(aniimo.map((entry) => [entry.name.replace(/[.]/g, "").toLowerCase(), entry]));
  const evolutionRecords = [...new Map(aniimo.filter((entry) => entry.evolution.length > 1).map((entry) => {
    const nodes = entry.evolution.map((node) => {
      const linked = aniimoByName.get(node.name.replace(/[.]/g, "").toLowerCase());
      return { name: node.name, stage: node.stage, image: linked?.image, href: linked ? `/aniimo/${linked.slug}` : undefined };
    });
    const id = nodes.map((node) => `${node.stage}:${node.name}`).join("|");
    return [id, { id, nodes } satisfies EvolutionLineage];
  })).values()];
  const elementRecords = [...new Set(aniimo.flatMap((entry) => entry.elements))].sort().map((element) => ({ element, entries: aniimo.filter((entry) => entry.elements.includes(element)) }));
  const formRecords = aniimo.map((entry) => ({ id: entry.slug, name: entry.name, description: entry.description, meta: `${entry.form} · ${entry.elements.join(" / ")}`, image: entry.image, href: `/aniimo/${entry.slug}`, linkLabel: "Open record" }));
  const mobilityRecords = [...new Set(aniimo.flatMap((entry) => [...entry.mobility.map((ability) => ability.name), ...entry.pathfinding]))].sort().map((ability) => ({ ability, entries: aniimo.filter((entry) => entry.mobility.some((item) => item.name === ability) || entry.pathfinding.includes(ability)), description: aniimo.flatMap((entry) => entry.mobility.filter((item) => item.name === ability).map((item) => item.description))[0] || "Published pathfinding ability." }));
  const communityRecords = communityDatabase[slug] || [];
  const bossRecords: BossEncounter[] = [
    ...omegaBosses.map((boss) => { const entry = aniimo.find((record) => record.slug === boss.slug)!; return { slug: entry.slug, name: entry.name, image: entry.image, elements: entry.elements, habitats: entry.habitats, description: entry.description, rank: "Omega" as const, primegy: 50, region: boss.region, unlock: boss.unlock }; }),
    ...alphaBossSlugs.map((bossSlug) => { const entry = aniimo.find((record) => record.slug === bossSlug)!; return { slug: entry.slug, name: entry.name, image: entry.image, elements: entry.elements, habitats: entry.habitats, description: entry.description, rank: "Alpha" as const, primegy: 30 }; }),
  ];
  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "Database", href: "/database" }, { label: category.name }]} /><span className={styles.kicker}><Icon name="database" /> Explore connections</span><h1>Aniimo {category.name}</h1><p>{category.description}</p><HeroPanel label="Use this page" items={["Scan the entries", "Open connected Aniimo", "Keep your next choice focused"]} /></div></section>
    <section className={styles.contentSection}><div className="container">
      {slug === "skills" && <SkillRecordList records={skillRecords} />}
      {slug === "traits" && <ProgressiveRecordList records={traitRecords} noun="traits" fallback="◇" />}
      {slug === "elements" && <>
        <div className={styles.elementDirectoryBar}>
          <p><strong>{elementRecords.length}</strong> elements <span /> <strong>{aniimo.length}</strong> Aniimo to explore</p>
          <Link href="/aniimo">Find Aniimo by element <Icon name="arrow" /></Link>
        </div>
        <div className={styles.elementGrid}>{elementRecords.map((record) => {
          const meta = elementMeta[record.element];
          const label = meta?.label || record.element;
          return <article className={styles.elementCard} key={record.element} style={{ "--element-sprite-index": meta?.spriteIndex ?? 0, "--element-color": meta?.color ?? "#4d83d9" } as React.CSSProperties}>
            <header className={styles.elementCardHeader}>
              <span className={styles.elementSprite} aria-hidden />
              <div><span className={styles.elementEyebrow}>Element group</span><h2>{label}</h2><p><strong>{record.entries.length}</strong> Aniimo</p></div>
            </header>
            <div className={styles.elementRoster}><p>Explore these Aniimo</p><div>{record.entries.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug} title={entry.name} aria-label={`Open ${entry.name}`}><Image src={entry.image} alt="" fill sizes="32px" /></Link>)}</div></div>
            <Link className={styles.elementBrowse} href={`/aniimo?element=${record.element}`}>See {label} Aniimo <Icon name="arrow" /></Link>
          </article>;
        })}</div>
      </>}
      {slug === "habitats" && <>
        <div className={styles.habitatDirectoryBar}><p><strong>{habitatRecords.length}</strong> habitat areas with <strong>{habitatRecords.reduce((total, record) => total + record.entries.length, 0)}</strong> Aniimo connections</p><Link href="/map">Open map <Icon name="arrow" /></Link></div>
        <div className={styles.habitatAtlas}>{habitatRecords.map((record) => <article className={styles.habitatCard} key={record.habitat}>
          <div className={styles.habitatMapPanel}>
            <div className={styles.habitatMapStage}>
              <Image src="/images/maps/ilya-world-map.png" alt={`Ilya world map showing ${record.habitat}`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 46vw, 420px" />
            </div>
            <span className={styles.habitatMapCaption}>Ilya field map</span>
          </div>
          <div className={styles.habitatCardBody}>
            <header><div><span className={styles.habitatEyebrow}>Habitat area</span><h2>{record.habitat}</h2></div><span className={styles.habitatCount}>{record.entries.length}<small>Aniimo</small></span></header>
            <div className={styles.habitatRoster}><p>Aniimo to look for</p><div>{record.entries.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug} title={entry.name} aria-label={`Open ${entry.name}`}><Image src={entry.image} alt="" fill sizes="32px" /></Link>)}</div></div>
            <Link className={styles.habitatBrowse} href={mapHref({ region: record.location?.id || record.habitat })}>View {record.habitat} on map <Icon name="arrow" /></Link>
          </div>
        </article>)}</div>
      </>}
      {slug === "evolutions" && <EvolutionAtlas records={evolutionRecords} />}
      {slug === "forms" && <ProgressiveRecordList records={formRecords} noun="forms" />}
      {slug === "mobility" && <div className={styles.habitatGrid}>{mobilityRecords.map((record) => <article key={record.ability}><span className={styles.recordIcon}><Icon name="map" /></span><h2>{record.ability}</h2><p>{record.description}</p><div>{record.entries.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}>{entry.name}</Link>)}</div></article>)}</div>}
      {(slug === "items" || slug === "materials" || slug === "achievements") && <Suspense fallback={<div className={styles.explorerFallback}>Preparing records…</div>}><CommunityRecordList records={communityRecords} categorySlug={slug} /></Suspense>}
      {slug === "bosses" && <BossEncounterAtlas records={bossRecords} />}
    </div></section>
  </>;
}
