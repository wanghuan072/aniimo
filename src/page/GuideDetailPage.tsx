import Image from "next/image";
import Link from "next/link";
import type { Guide, GuideBlock, GuideLink } from "@/types/content";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { JsonLd, articleJsonLd } from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import styles from "@/style/page/content.module.css";

function EditorialLink({ item, className }: { item: GuideLink; className?: string }) {
  const content = <>{item.label} <span aria-hidden>↗</span></>;
  if (/^https?:\/\//.test(item.href)) {
    return <a className={className} href={item.href} target="_blank" rel="noreferrer">{content}</a>;
  }
  return <Link className={className} href={item.href}>{content}</Link>;
}

function BlockHeader({ block }: { block: Exclude<GuideBlock, { type: "callout" }> }) {
  return <header className={styles.guideBlockHeader}>
    <span>{block.eyebrow}</span>
    <h2>{block.title}</h2>
    {block.intro && <p>{block.intro}</p>}
  </header>;
}

function GuideContentBlock({ block, index }: { block: GuideBlock; index: number }) {
  if (block.type === "route") {
    return <section className={`${styles.guideBlock} ${styles.guideRoute}`}>
      <BlockHeader block={block} />
      <ol className={styles.guideRouteList}>
        {block.steps.map((step, stepIndex) => <li key={step.title}>
          <b>{String(stepIndex + 1).padStart(2, "0")}</b>
          <div><h3>{step.title}</h3><p>{step.body}</p>{step.link && <EditorialLink item={step.link} />}</div>
        </li>)}
      </ol>
    </section>;
  }

  if (block.type === "story") {
    return <section className={`${styles.guideBlock} ${styles.guideStoryBlock} ${index % 2 ? styles.guideStoryBlockReverse : ""}`}>
      <figure>
        <Image src={block.image} alt={block.imageAlt} fill sizes="(max-width: 768px) 100vw, 38vw" />
        <figcaption>{block.caption}</figcaption>
      </figure>
      <div>
        <span>{block.eyebrow}</span>
        <h2>{block.title}</h2>
        {block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {block.link && <EditorialLink item={block.link} />}
      </div>
    </section>;
  }

  if (block.type === "table") {
    return <section className={`${styles.guideBlock} ${styles.guideTableBlock}`}>
      <BlockHeader block={block} />
      <div className={styles.guideTableScroll}>
        <table>
          <thead><tr>{block.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={`${index}-${rowIndex}`}>{row.map((cell, cellIndex) => cellIndex === 0
            ? <th key={cellIndex} scope="row">{cell}</th>
            : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {block.note && <p className={styles.guideDataNote}>{block.note}</p>}
    </section>;
  }

  if (block.type === "lineage") {
    return <section className={`${styles.guideBlock} ${styles.guideLineage}`}>
      <BlockHeader block={block} />
      <div className={styles.guideLineagePaths}>{block.paths.map((path) => <div key={path.label}>
        <strong>{path.label}</strong>
        <div className={styles.guideLineageTrack}>{path.nodes.map((node, nodeIndex) => <div className={styles.guideLineageStep} key={`${path.label}-${node.name}`}>
          {nodeIndex > 0 && <i aria-hidden>→</i>}
          {node.href
            ? <Link href={node.href}><b>{node.name}</b><small>{node.stage}</small></Link>
            : <span><b>{node.name}</b><small>{node.stage}</small></span>}
        </div>)}</div>
      </div>)}</div>
      {block.note && <p className={styles.guideDataNote}>{block.note}</p>}
    </section>;
  }

  if (block.type === "terms") {
    return <section className={`${styles.guideBlock} ${styles.guideTerms}`}>
      <BlockHeader block={block} />
      <dl>{block.items.map((item) => <div key={item.term}>
        <dt><b>{item.term}</b>{item.value && <span>{item.value}</span>}</dt>
        <dd><p>{item.body}</p>{item.link && <EditorialLink item={item.link} />}</dd>
      </div>)}</dl>
    </section>;
  }

  if (block.type === "notes") {
    return <section className={`${styles.guideBlock} ${styles.guideNotes}`}>
      <BlockHeader block={block} />
      <div>{block.items.map((item) => <section key={item.title}>
        <h3>{item.title}</h3><p>{item.body}</p>{item.link && <EditorialLink item={item.link} />}
      </section>)}</div>
    </section>;
  }

  if (block.type === "checklist") {
    return <section className={`${styles.guideBlock} ${styles.guideChecklist}`}>
      <BlockHeader block={block} />
      <ul>{block.items.map((item) => <li key={item}><span aria-hidden>✓</span>{item}</li>)}</ul>
    </section>;
  }

  return <aside className={styles.guideCallout} data-tone={block.tone}>
    <span>{block.tone === "caution" ? "Known limit" : "Source note"}</span>
    <h2>{block.title}</h2>
    <p>{block.body}</p>
    {block.links?.length ? <div>{block.links.map((item) => <EditorialLink item={item} key={item.href} />)}</div> : null}
  </aside>;
}

export default function GuideDetailPage({ guide }: { guide: Guide }) {
  const updated = new Date(guide.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const guideUrl = new URL(`/guides/${guide.slug}`, siteConfig.url).toString();

  return <article className={styles.guideArticle} data-guide={guide.slug}>
    <JsonLd data={articleJsonLd({
      title: guide.title,
      description: guide.excerpt,
      url: guideUrl,
      image: new URL(`/guides/${guide.slug}/opengraph-image`, siteConfig.url).toString(),
      datePublished: guide.published,
      dateModified: guide.updated,
      author: { name: guide.author.label, url: new URL(guide.author.href, siteConfig.url).toString() },
    })} />
    <header className={styles.guideArticleHero}><div className={`container ${styles.guideArticleHeroInner}`}>
      <div>
        <Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
        <span className={styles.kicker}><Icon name="book" /> {guide.category} · {guide.readTime} read</span>
        <h1>{guide.title}</h1>
        <p>{guide.excerpt}</p>
        <span className={styles.guideUpdated}>By <Link href={guide.author.href}>{guide.author.label}</Link> · <time dateTime={guide.updated}>Updated {updated}</time></span>
      </div>
      <figure><Image src={guide.coverImage} alt={guide.coverAlt} fill priority sizes="(max-width: 760px) 100vw, 43vw" /></figure>
    </div></header>
    <div className={`container ${styles.guideArticleWrap}`}>
      <main className={styles.guideArticleBody}>
        <p className={styles.guideLead}>{guide.intro}</p>
        {guide.blocks.map((block, index) => <GuideContentBlock block={block} index={index} key={`${block.type}-${index}`} />)}
      </main>
      <aside className={styles.guideArticleAside}>
        <span>Keep exploring</span>
        <Link href="/aniimo"><Icon name="spark" /> All Aniimo <Icon name="arrow" /></Link>
        <Link href="/database/skills"><Icon name="book" /> Skill Records <Icon name="arrow" /></Link>
        <Link href="/map"><Icon name="map" /> Map <Icon name="arrow" /></Link>
      </aside>
    </div>
  </article>;
}
