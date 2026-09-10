import Image from "next/image";
import Link from "next/link";
import { guides } from "@/lib/data";
import { getGuideDossier } from "@/data/editorial/guide-dossiers";
import { guideJourney } from "@/lib/guide-hub";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export default function GuidesPage() {
  return <>
    <section className={styles.guideLibraryHero}><div className="container">
      <Breadcrumb items={[{ label: "Guides" }]} />
      <span className={styles.kicker}><Icon name="book" /> Practical player guides</span>
      <h1>Aniimo Guides — Catching, Teams, Maps, and Progression</h1>
      <p>Nine field guides. Each one answers a decision you make in Idyll, then links to the roster, map, or Team Builder you need next.</p>
      <ol className={styles.guideJourney} aria-label="Suggested reading path">
        {guideJourney.map((item, index) => (
          <li key={item.href}>
            <Link href={item.href}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <strong>{item.label}</strong>
              <span>{item.blurb}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div></section>
    <section className={styles.guideLibrary}><div className="container">
      <div className={styles.guideLibraryHeading}><span>Start with the next decision</span><p>Open the guide for the system in front of you. Catching, combat, evolution, eggs, and the map all stay linked from the same pages.</p></div>
      <div className={styles.guideFeatureGrid}>{guides.map((guide, index) => {
        const dossier = getGuideDossier(guide.slug);
        const title = dossier?.title || guide.title;
        const excerpt = dossier?.deck || guide.excerpt;
        const readTime = dossier?.readTime || `${guide.readTime} read`;
        const coverImage = dossier?.heroImage || guide.coverImage;
        const coverAlt = dossier?.heroAlt || guide.coverAlt;
        const category = dossier?.category || guide.category;
        return <article className={styles.guideFeatureCard} key={guide.slug}>
        <Link href={`/guides/${guide.slug}`} className={styles.guideFeatureImage} aria-label={`Read ${title}`}>
          <Image src={coverImage} alt={coverAlt} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 33vw" />
          <span>{category}</span>
        </Link>
        <div className={styles.guideFeatureBody}><div className={styles.guideFeatureMeta}><span>{readTime}</span><span>Updated {new Date(guide.updated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div><h2><Link href={`/guides/${guide.slug}`}>{title}</Link></h2><p>{excerpt}</p><Link href={`/guides/${guide.slug}`} className={styles.guideFeatureLink}>Read guide <Icon name="arrow" /></Link></div>
      </article>})}</div>
    </div></section>
  </>;
}
