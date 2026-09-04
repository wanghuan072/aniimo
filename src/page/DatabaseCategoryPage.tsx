import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { alphaBossSlugs, omegaBosses } from "@/data/editorial/encounters";
import { aniimo, communityDatabase, getDatabaseCategory, mapLocations } from "@/lib/data";
import { groupedSkills, groupedTraits, recordSlug } from "@/lib/database-relations";
import { mapHref } from "@/lib/map-atlas";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { CommunityRecordList } from "@/components/database/CommunityRecordList";
import { SkillRecordList } from "@/components/database/SkillRecordList";
import { ProgressiveRecordList } from "@/components/database/ProgressiveRecordList";
import { EvolutionAtlas, type EvolutionLineage } from "@/components/database/EvolutionAtlas";
import { BossEncounterAtlas, type BossEncounter } from "@/components/database/BossEncounterAtlas";
import { CatalogStamps } from "@/components/database/CatalogStamps";
import { TypeMatchupTable } from "@/components/database/TypeMatchupTable";
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
      return { name: node.name, stage: node.stage, image: linked?.voteImage || linked?.image, href: linked ? `/aniimo/${linked.slug}` : undefined };
    });
    const id = nodes.map((node) => `${node.stage}:${node.name}`).join("|");
    return [id, { id, nodes } satisfies EvolutionLineage];
  })).values()];
  const elementRecords = [...new Set(aniimo.flatMap((entry) => entry.elements))].sort().map((element) => ({ element, entries: aniimo.filter((entry) => entry.elements.includes(element)) }));
  const mobilityRecords = [...new Set(aniimo.flatMap((entry) => [...entry.mobility.map((ability) => ability.name), ...entry.pathfinding]))].sort().map((ability) => ({
    ability,
    entries: aniimo.filter((entry) => entry.mobility.some((item) => item.name === ability) || entry.pathfinding.includes(ability)),
    description: aniimo.flatMap((entry) => entry.mobility.filter((item) => item.name === ability).map((item) => item.description))[0] || "Published pathfinding ability.",
    iconUrl: aniimo.flatMap((entry) => entry.mobility.filter((item) => item.name === ability).map((item) => item.iconUrl))[0] || "",
  }));
  const communityRecords = communityDatabase[slug] || [];
  const bossRecords: BossEncounter[] = [
    ...omegaBosses.map((boss) => { const entry = aniimo.find((record) => record.slug === boss.slug)!; return { slug: entry.slug, name: entry.name, image: entry.voteImage || entry.image, elements: entry.elements, habitats: entry.habitats, description: entry.description, rank: "Omega" as const, primegy: 50, region: boss.region, unlock: boss.unlock }; }),
    ...alphaBossSlugs.map((bossSlug) => { const entry = aniimo.find((record) => record.slug === bossSlug)!; return { slug: entry.slug, name: entry.name, image: entry.voteImage || entry.image, elements: entry.elements, habitats: entry.habitats, description: entry.description, rank: "Alpha" as const, primegy: 30 }; }),
  ];
  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "Database", href: "/database" }, { label: category.name }]} /><span className={styles.kicker}><Icon name="database" /> Explore connections</span><h1>Aniimo {category.name}</h1><p>{category.description}</p><HeroPanel label="Use this page" items={["Scan the entries", "Open connected Aniimo", "Keep your next choice focused"]} /></div></section>
    <section className={styles.contentSection}><div className="container">
      {slug === "skills" && <SkillRecordList records={skillRecords} />}
      {slug === "traits" && <ProgressiveRecordList records={traitRecords} noun="traits" fallback="◇" />}
      {slug === "elements" && <>
        <nav className={styles.typeJump} aria-label="Jump to element">
          {elementRecords.map((record) => {
            const meta = elementMeta[record.element];
            return (
              <a href={`#${record.element}`} key={record.element} style={{ "--element-color": meta?.color || "#4d83d9", "--element-sprite-index": String(meta?.spriteIndex ?? 0) } as React.CSSProperties}>
                <span className={styles.elementSprite} aria-hidden />
                {meta?.label || record.element}
              </a>
            );
          })}
        </nav>
        <div className={styles.catalogBar}>
          <p><strong>{elementRecords.length}</strong> elements <span /> <strong>{aniimo.length}</strong> Aniimo to explore</p>
          <span className={styles.catalogLinks}>
            <Link href="#matchups">Type chart <Icon name="arrow" /></Link>
            <Link href="/aniimo">Find Aniimo by element <Icon name="arrow" /></Link>
          </span>
        </div>
        <div className={styles.typeIndex}>{elementRecords.map((record) => {
          const meta = elementMeta[record.element];
          const label = meta?.label || record.element;
          return (
            <article id={record.element} className={styles.typePlate} key={record.element} style={{ "--element-color": meta?.color || "#4d83d9", "--element-sprite-index": String(meta?.spriteIndex ?? 0) } as React.CSSProperties}>
              <header>
                <span className={styles.elementSprite} aria-hidden />
                <div>
                  <h2>{label}</h2>
                  <p>{record.entries.length} Aniimo</p>
                </div>
              </header>
              <CatalogStamps entries={record.entries.map((entry) => ({ slug: entry.slug, name: entry.name, image: entry.voteImage || entry.image }))} />
              <Link className={styles.catalogFollow} href={`/aniimo?element=${record.element}`}>See {label} Aniimo <Icon name="arrow" /></Link>
            </article>
          );
        })}</div>
        <TypeMatchupTable />
      </>}
      {slug === "habitats" && <>
        <div className={styles.catalogBar}>
          <p><strong>{habitatRecords.length}</strong> habitat areas <span /> <strong>{habitatRecords.reduce((total, record) => total + record.entries.length, 0)}</strong> connections</p>
          <Link href="/map">Open map <Icon name="arrow" /></Link>
        </div>
        <div className={styles.placeIndex}>{habitatRecords.map((record) => (
          <article id={record.location?.id || record.habitat} className={styles.placePlate} key={record.habitat}>
            <header>
              <span className={styles.placeMark} aria-hidden>
                <Image src={record.entries[0].voteImage || record.entries[0].image} alt="" fill sizes="52px" />
              </span>
              <div>
                <h2>{record.habitat}</h2>
                <p>{record.entries.length} Aniimo recorded here</p>
              </div>
            </header>
            <CatalogStamps entries={record.entries.map((entry) => ({ slug: entry.slug, name: entry.name, image: entry.voteImage || entry.image }))} />
            <Link className={styles.catalogFollow} href={mapHref({ region: record.location?.id || record.habitat })}>View {record.habitat} on map <Icon name="arrow" /></Link>
          </article>
        ))}</div>
      </>}
      {slug === "evolutions" && <EvolutionAtlas records={evolutionRecords} />}
      {slug === "mobility" && <>
        <div className={styles.catalogBar}>
          <p><strong>{mobilityRecords.length}</strong> mobility records</p>
          <span>Icons and owners come from published Aniimo kits.</span>
        </div>
        <div className={styles.moveIndex}>{mobilityRecords.map((record) => (
          <article id={recordSlug(record.ability)} className={styles.movePlate} key={record.ability}>
            <span className={`${styles.moveIcon} ${record.iconUrl ? styles.moveGlyph : ""}`}>
              {record.iconUrl
                ? <Image src={record.iconUrl} alt="" width={44} height={44} />
                : <Image src={record.entries[0].voteImage || record.entries[0].image} alt="" fill sizes="56px" />}
            </span>
            <div>
              <h2>{record.ability}</h2>
              <p>{record.description}</p>
              <CatalogStamps entries={record.entries.map((entry) => ({ slug: entry.slug, name: entry.name, image: entry.voteImage || entry.image }))} />
            </div>
          </article>
        ))}</div>
      </>}
      {(slug === "items" || slug === "materials" || slug === "achievements") && <Suspense fallback={<div className={styles.explorerFallback}>Preparing records…</div>}><CommunityRecordList records={communityRecords} categorySlug={slug} /></Suspense>}
      {slug === "bosses" && <BossEncounterAtlas records={bossRecords} />}
    </div></section>
  </>;
}
