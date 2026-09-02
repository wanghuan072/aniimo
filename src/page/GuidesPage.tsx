import Image from "next/image";
import Link from "next/link";
import { guides } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export default function GuidesPage() {
  return <>
    <section className={styles.guideLibraryHero}><div className="container">
      <Breadcrumb items={[{ label: "Guides" }]} />
      <span className={styles.kicker}><Icon name="book" /> Practical player guides</span>
      <h1>Aniimo Guides — From First Catch to Smarter Teams</h1>
      <p>Three focused reads for choosing a first route, understanding forms and building a team around the way you want to play.</p>
    </div></section>
    <section className={styles.guideLibrary}><div className="container">
      <div className={styles.guideLibraryHeading}><span>Start with your next question</span><p>Read them in any order. Each guide ends with a small action you can take in the roster, map or Team Builder.</p></div>
      <div className={styles.guideFeatureGrid}>{guides.map((guide, index) => <article className={styles.guideFeatureCard} key={guide.slug}>
        <Link href={`/guides/${guide.slug}`} className={styles.guideFeatureImage} aria-label={`Read ${guide.title}`}>
          <Image src={guide.coverImage} alt={guide.coverAlt} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 33vw" />
          <span>{guide.category}</span>
        </Link>
        <div className={styles.guideFeatureBody}><div className={styles.guideFeatureMeta}><span>{guide.readTime} read</span><span>Updated {new Date(guide.updated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div><h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.excerpt}</p><Link href={`/guides/${guide.slug}`} className={styles.guideFeatureLink}>Read guide <Icon name="arrow" /></Link></div>
      </article>)}</div>
    </div></section>
  </>;
}
