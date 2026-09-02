import Image from "next/image";
import Link from "next/link";
import { aniimo, databaseCategories, getAniimo, guides, habitats, officialVote } from "@/lib/data";
import { FaqList } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { elementMeta, roleLabels } from "@/config/site";
import { JsonLd, faqJsonLd } from "@/seo/JsonLd";
import styles from "@/style/page/home.module.css";

const pick = (slug: string) => getAniimo(slug)!;

export default function HomePage() {
  const showcase = [pick("emberpup"), pick("celestis"), pick("leafy")];
  const topVote = officialVote.records.slice(0, 3).map((record) => ({ ...record, entry: record.slug ? getAniimo(record.slug) : undefined })).filter((record) => record.entry);
  const trending = [...aniimo].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
  const teamChoices = [pick("stellarys"), pick("emberpup"), pick("eklue")];
  const uniqueTraits = new Set(aniimo.flatMap((entry) => entry.traits.map((trait) => trait.name))).size;
  const totalSkills = aniimo.reduce((sum, entry) => sum + entry.skills.length, 0);
  const databaseShowcase = ["skills", "items", "traits", "bosses"].map((slug) => databaseCategories.find((category) => category.slug === slug)!);
  const homepageStats: Array<{ value: number; label: string; tone: string; image?: string; icon?: "spark" | "water" | "trait" | "pin" }> = [
    { value: aniimo.length, label: "Aniimo", tone: "creature", image: pick("glacy").image },
    { value: totalSkills, label: "Skills", tone: "gold", icon: "spark" },
    { value: 9, label: "Elements", tone: "water", icon: "water" },
    { value: uniqueTraits, label: "Traits", tone: "purple", icon: "trait" },
    { value: habitats.length, label: "Habitats", tone: "green", icon: "pin" },
  ];
  const faq = [
    { question: "What can I look up on Aniimo?", answer: "Use the roster and database to explore Aniimo, skills, traits, forms, habitats, items and progression records. Each collection links back to the Aniimo it relates to." },
    { question: "Is the Global Vote a strength ranking?", answer: "No. It reflects player votes. Use profiles and the comparison tool when you want to look at roles, elements and base fields for a specific choice." },
    { question: "How do I start building a team?", answer: "Choose up to four Aniimo in Team Builder, then review the roles and elements already covered before deciding which slot you want to change." },
    { question: "Can I keep track of my own collection?", answer: "Yes. The Collection Tracker lets you mark found Aniimo in this browser and filter what you still want to find." },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <section className={styles.hero}>
        <Image src="/images/home/aniimo-world-hero-v2.png" alt="An explorer and fantasy companions overlooking the world of Aniimo" fill preload sizes="(max-width: 1440px) 100vw, 1440px" />
        <div className={styles.heroWash} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1><span className={styles.worldLine}>Explore the world of <i aria-hidden="true">✦</i></span><span className={styles.aniimoTitle}>Aniimo</span></h1>
            <p className={styles.heroText}>Find the Aniimo you are looking for, see what they can do, and plan what to try next in Idyll.</p>
            <div className={styles.heroActions}>
              <Link href="/aniimo" className="button-primary">Explore Aniimo <Icon name="arrow" /></Link>
              <Link href="/map" className="button-secondary"><Icon name="map" /> Open Map</Link>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.statStrip}`}>
        {homepageStats.map((stat) => (
          <div key={stat.label} className={styles.statItem} data-tone={stat.tone}>
            <i className={styles.statIcon}>{stat.image ? <Image src={stat.image} alt="" fill sizes="58px" /> : <Icon name={stat.icon!} />}</i>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <section className={styles.homeBody}>
        <div className="container">
          <div className={styles.dashboardGrid}>
            <article className={`${styles.featureCard} ${styles.aniimoFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>🐾 Aniimo</h2><p>Browse the roster by element, role and stage, then open the details that matter to your next choice.</p><Link href="/aniimo">Browse Aniimo <Icon name="arrow" /></Link></div>
              <div className={styles.creatureFan}>{showcase.map((entry, index) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug} style={{ "--fan-index": index } as React.CSSProperties}><Image src={entry.image} alt={entry.name} fill sizes="150px" /><span>{entry.name}</span></Link>)}</div>
            </article>

            <article className={`${styles.featureCard} ${styles.databaseFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>▣ Database</h2><p>Check {totalSkills} skills, {uniqueTraits} traits, items, forms and habitats without losing the link to the Aniimo that use them.</p><Link href="/database">Open database <Icon name="arrow" /></Link></div>
              <div className={styles.iconTiles}>{databaseShowcase.map((category, index) => <Link href={`/database/${category.slug}`} key={category.slug}><i><Icon name={(["spark", "item", "trait", "boss"] as const)[index]} /></i><span>{category.name}</span></Link>)}</div>
            </article>

            <article className={`${styles.featureCard} ${styles.tierFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>♛ Global Vote</h2><p>See the 2026 player-vote leaderboard. It records popularity, not a universal power verdict.</p><Link href="/tier-list/global-vote">See all results <Icon name="arrow" /></Link></div>
              <div className={styles.votePreview}>{topVote.map(({ rank, votes, entry }) => entry && <Link href={`/aniimo/${entry.slug}`} key={entry.slug}><b>#{rank}</b><span><Image src={`/images/aniimo/vote/${entry.slug}.png`} alt={entry.name} fill sizes="54px" /></span><div><strong>{entry.name}</strong><small>{votes.toLocaleString("en-US")} votes</small></div></Link>)}</div>
            </article>

            <article className={`${styles.featureCard} ${styles.buildFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>⚔ Team Builder</h2><p>Choose four Aniimo and review role and element coverage for your next team.</p><Link href="/team-builder">Build a Team <Icon name="arrow" /></Link></div>
              <div className={styles.buildPreview}>{teamChoices.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}><span><Image src={entry.image} alt={entry.name} fill sizes="110px" /></span><strong>{entry.name}</strong><small>{elementMeta[entry.elements[0]]?.symbol} {roleLabels[entry.roles[0]] || entry.roles[0]}</small></Link>)}</div>
            </article>

            <article className={`${styles.featureCard} ${styles.mapFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>⌖ Map</h2><p>Use {habitats.length} habitat areas to choose a route, see related Aniimo and keep your next outing focused.</p><Link href="/map">Open map <Icon name="arrow" /></Link></div>
              <Link className={styles.mapArt} href="/map"><Image src="/images/maps/ilya-world-map.png" alt="Aniimo habitat planning map" fill sizes="500px" /></Link>
            </article>

            <section className={styles.guideFeature} aria-labelledby="home-guides-title">
              <header><div><span>Guides</span><h2 id="home-guides-title">Aniimo Guides for Teams, Forms &amp; Exploration</h2><p>Three short routes for the questions most players meet first: building a first team, understanding forms and choosing roles that work together.</p></div><Link href="/guides">Browse all guides <Icon name="arrow" /></Link></header>
              <div className={styles.homeGuideCards}>{guides.map((guide) => <Link href={`/guides/${guide.slug}`} key={guide.slug}><span><Image src={guide.coverImage} alt={guide.coverAlt} fill sizes="(max-width: 760px) 100vw, 33vw" /></span><div><small>{guide.category} · {guide.readTime}</small><strong>{guide.title}</strong><p>{guide.excerpt}</p><em>Read guide <Icon name="arrow" /></em></div></Link>)}</div>
            </section>

            <article className={`${styles.featureCard} ${styles.toolsFeature}`}>
              <div className={styles.cardCopy}><h2 className={styles.cardKicker}>⚒ Tools</h2><p>Build a team, compare candidates or keep a short list of the Aniimo you still want to find.</p></div>
              <div className={styles.toolLinks}>
                {[
                  ["Team Builder", "Build a four-Aniimo squad", "/team-builder", pick("leafy").image],
                  ["Compare", "Put your candidates side by side", "/tools/compare", pick("stellarys").image],
                  ["Collection Tracker", `Track all ${aniimo.length} entries`, "/tools/collection-tracker", pick("emberpup").image],
                ].map(([title, text, href, image]) => <Link href={href} key={href}><i className={styles.toolArt}><Image src={image} alt="" fill sizes="100px" /></i><span><strong>{title}</strong><small>{text}</small></span><Icon name="arrow" /></Link>)}
              </div>
            </article>
          </div>

          <div className={styles.lowerGrid}>
            <article><p className={styles.cardKicker}>🔥 Popular right now</p>{trending.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}><span><Image src={entry.image} alt="" fill sizes="30px" /></span><strong>{entry.name}</strong><em>{entry.viewCount?.toLocaleString("en-US")}</em></Link>)}</article>
            <article className={styles.updateCard}><p className={styles.cardKicker}>✦ What changed</p><div><strong>Global launch dates</strong><small>PC & console: September 16 · Mobile: September 23</small></div><div><strong>Player vote results</strong><small>See the 2026 ranking and vote counts</small></div><div><strong>Plan your own team</strong><small>Build, compare and adjust a four-Aniimo party</small></div><Link href="/updates">Open updates <Icon name="arrow" /></Link></article>
            <article className={styles.sourceCard}><div className={styles.sourceMascot}><Image src={pick("leafy").image} alt="" fill sizes="170px" /></div><p className={styles.cardKicker}>◉ About Aniimo</p><h2>What Is Aniimo?</h2><p>Use the roster, map and tools together when you need to decide what to catch, bring or explore next.</p><Link href="/legal/about-us">How Aniimo works <Icon name="arrow" /></Link></article>
          </div>
          <section className={styles.homeGuide} aria-labelledby="home-guide-title"><div><span>Choose your next route</span><h2 id="home-guide-title">Plan Your Next Aniimo Session</h2><p>Looking for a teammate, a form or a habitat? Begin there, follow the connected Aniimo and use the tools only when you have a real shortlist in front of you.</p><div className={styles.homeGuideLinks}><Link href="/aniimo">Find an Aniimo <Icon name="arrow" /></Link><Link href="/guides">Read the first guide <Icon name="arrow" /></Link><Link href="/team-builder">Build a team <Icon name="arrow" /></Link></div></div><div className={styles.homeFaq}><span>Aniimo FAQ</span><FaqList items={faq} /></div></section>
        </div>
      </section>
    </>
  );
}
