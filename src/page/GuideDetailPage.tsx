import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/types/content";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { JsonLd, articleJsonLd } from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import styles from "@/style/page/content.module.css";

export default function GuideDetailPage({ guide }: { guide: Guide }) {
  const updated = new Date(guide.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return <article className={styles.guideArticle}>
    <JsonLd data={articleJsonLd({ title: guide.title, description: guide.excerpt, url: new URL(`/guides/${guide.slug}`, siteConfig.url).toString(), image: new URL(guide.coverImage, siteConfig.url).toString(), dateModified: guide.updated })} />
    <header className={styles.guideArticleHero}><div className={`container ${styles.guideArticleHeroInner}`}>
      <div><Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} /><span className={styles.kicker}><Icon name="book" /> {guide.category} · {guide.readTime} read</span><h1>{guide.title}</h1><p>{guide.excerpt}</p><span className={styles.guideUpdated}>Edited by Aniimo · reviewed {updated}</span></div>
      <figure><Image src={guide.coverImage} alt={guide.coverAlt} fill priority sizes="(max-width: 760px) 100vw, 43vw" /></figure>
    </div></header>
    <div className={`container ${styles.guideArticleWrap}`}>
      <main className={styles.guideArticleBody}>
        <p className={styles.guideLead}>{guide.intro}</p>
        <section className={styles.guideTakeaways}><span>Before you begin</span><h2>What You’ll Learn</h2><ul>{guide.takeaways.map((item) => <li key={item}><i aria-hidden>✦</i>{item}</li>)}</ul></section>
        <section className={styles.guideStory}><div className={styles.guideStoryHeading}><span>Use it in your next session</span><h2>Guide Steps</h2></div>{guide.sections.map((section, index) => <section className={`${styles.guideStoryRow} ${index % 2 ? styles.guideStoryReverse : ""}`} key={section.title}>
          <figure><Image src={section.image} alt={section.imageAlt} fill sizes="(max-width: 760px) 100vw, 44vw" /></figure><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{section.title}</h3><p>{section.body}</p>{section.link && <Link href={section.link.href}>{section.link.label} <Icon name="arrow" /></Link>}</div>
        </section>)}</section>
        <section className={styles.guideActionPlan}><span>Try this next</span><h2>Next-Session Checklist</h2><ol>{guide.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><p>{step}</p></li>)}</ol></section>
      </main>
      <aside className={styles.guideArticleAside}><span>Keep exploring</span><Link href="/aniimo"><Icon name="spark" /> All Aniimo <Icon name="arrow" /></Link><Link href="/team-builder"><Icon name="team" /> Team Builder <Icon name="arrow" /></Link><Link href="/map"><Icon name="map" /> Interactive Map <Icon name="arrow" /></Link></aside>
    </div>
  </article>;
}
