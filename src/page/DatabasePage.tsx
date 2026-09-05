import Image from "next/image";
import Link from "next/link";
import { alphaBossSlugs, omegaBosses } from "@/data/editorial/encounters";
import { aniimo, communityDatabase, databaseCategories, habitats } from "@/lib/data";
import { Breadcrumb, SectionHeading } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export default function DatabasePage() {
  const counts: Record<string, number | string> = {
    skills: new Set(aniimo.flatMap((entry) => entry.skills.map((skill) => skill.name))).size,
    traits: new Set(aniimo.flatMap((entry) => entry.traits.map((trait) => trait.name))).size,
    elements: new Set(aniimo.flatMap((entry) => entry.elements)).size,
    habitats: habitats.length,
    evolutions: aniimo.filter((entry) => entry.evolution.length > 1).length,
    mobility: new Set(aniimo.flatMap((entry) => entry.mobility.map((ability) => ability.name))).size,
    items: communityDatabase.items?.length || 0,
    materials: communityDatabase.materials?.length || 0,
    bosses: alphaBossSlugs.length + omegaBosses.length,
    achievements: communityDatabase.achievements?.length || 0,
  };
  const categoryArt: Record<string, { src: string; alt: string; tone: string }> = {
    skills: { src: "/images/database/skills/emberpup-1.png", alt: "Emberpup skill icon", tone: "blue" },
    traits: { src: "/images/database/traits/emberpup-1.png", alt: "Emberpup trait icon", tone: "rose" },
    elements: { src: "/images/aniimo/blazen.png", alt: "Blazen representing elements", tone: "gold" },
    habitats: { src: "/images/maps/ilya-world-map.png", alt: "Map of Aniimo habitats", tone: "green" },
    evolutions: { src: "/images/aniimo/flameruff.png", alt: "Flameruff evolution form", tone: "violet" },
    mobility: { src: "/images/aniimo/turbo.png", alt: "Turbo representing mobility", tone: "blue" },
    items: { src: "/images/database/items/a-new-journey.webp", alt: "Aniimo item collection", tone: "blue" },
    materials: { src: "/images/aniimo/geoclaw.png", alt: "Geoclaw representing materials", tone: "earth" },
    bosses: { src: "/images/aniimo/infergon.png", alt: "Infergon world boss", tone: "fire" },
    achievements: { src: "/images/database/achievements/starbound-journey.webp", alt: "Starbound Journey achievement", tone: "violet" },
  };
  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "Database" }]} /><span className={styles.kicker}><Icon name="database" /> Find what connects</span><h1>Aniimo Database — Skills, Items, Habitats &amp; More</h1><p>Look up an item, ability or place, then follow it back to the Aniimo and activities it connects to.</p><div className={styles.heroButtons}><Link href="/aniimo" className="button-primary">Browse Aniimo <Icon name="arrow" /></Link></div><HeroPanel label="Start with a question" items={["What can this skill do?", "Which Aniimo use this trait?", "Where does this evolution lead?"]} /></div></section>
    <section className={styles.contentSection}><div className="container"><SectionHeading eyebrow="Explore by topic" title="Explore Aniimo Skills, Items & Habitats" description="Choose a collection, then move between the records that answer the next part of your question." /><div className={styles.databaseGrid}>{databaseCategories.map((category) => { const art = categoryArt[category.slug]; return <Link key={category.slug} href={`/database/${category.slug}`} className={styles.databaseCard} data-tone={art.tone}><span className={styles.databaseArtwork}><Image src={art.src} alt={art.alt} fill sizes="(max-width: 680px) 122px, 150px" /></span><span className={styles.databaseCardBody}><span className={styles.status}>Explore</span><h2>{category.name}</h2><p>{category.description}</p><span className={styles.databaseCardFooter}><b>{counts[category.slug]} entries</b><em>Open <Icon name="arrow" /></em></span></span></Link>; })}</div><div className={styles.seoCopy}><div><span className={styles.kicker}>How to use it</span><h2>Find Connected Aniimo Game Data</h2><p>Looking for a teammate? Begin with roles and skills. Planning a route? Start with habitats, evolution paths or materials. Each page keeps related Aniimo close at hand.</p></div><aside><h2>At a glance</h2><p><strong>{aniimo.length}</strong> Aniimo</p><p><strong>{counts.skills}</strong> unique skills</p><p><strong>{counts.traits}</strong> traits</p><p><strong>{habitats.length}</strong> habitat areas</p></aside></div></div></section>
  </>;
}
