import type { ReactNode } from "react";
import Link from "next/link";
import type { Guide } from "@/types/content";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/guide-shell.module.css";

type TocItem = {
  href: string;
  label: string;
};

type RelatedGuide = {
  href: string;
  title: string;
  description?: string;
};

type GuideArticleShellProps = {
  guide: Guide;
  title: string;
  description: string;
  kicker: string;
  kickerIcon?: "book" | "item";
  heroVisual: ReactNode;
  heroNote: string;
  theme?: "sky" | "ember" | "violet" | "moss" | "gold" | "tide";
  outline?: TocItem[];
  toc: TocItem[];
  tools?: Array<{ href: string; label: string }>;
  relatedLabel?: string;
  related: RelatedGuide[];
  articleClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export default function GuideArticleShell({
  guide,
  title,
  description,
  kicker,
  kickerIcon = "book",
  heroVisual,
  heroNote,
  theme = "sky",
  outline,
  toc,
  tools = [],
  relatedLabel = "Open next",
  related,
  articleClassName,
  bodyClassName,
  children,
}: GuideArticleShellProps) {
  const updated = new Date(guide.updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const path = outline?.length ? outline : toc.slice(0, 4);

  return <article className={[styles.article, articleClassName].filter(Boolean).join(" ")} data-guide={guide.slug} data-theme={theme}>
    <header className={styles.hero}>
      <div className={`container ${styles.breadcrumbRow}`}>
        <Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: title }]} />
      </div>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}><Icon name={kickerIcon} /> Player guide · {kicker}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className={styles.metaRow}>
            <small>By <Link href={guide.author.href}>{guide.author.label}</Link> · Updated <time dateTime={guide.updated}>{updated}</time></small>
            {path[0] ? <a className={styles.startLink} href={path[0].href}>Start with {path[0].label}<Icon name="arrow" /></a> : null}
          </div>
        </div>
        <div className={styles.heroFieldCard}>
          <div className={styles.heroVisual}>{heroVisual}</div>
          <div className={styles.heroNote}><span>Field answer</span><p>{heroNote}</p></div>
        </div>
      </div>
    </header>

    <div className={`container ${styles.wrap}`}>
      <main className={[styles.body, bodyClassName].filter(Boolean).join(" ")}>
        {path.length > 0 ? (
          <ol className={styles.outline} aria-label="How this guide is organized">
            {path.map((item, index) => (
              <li key={item.href}>
                <a href={item.href}><b>{String(index + 1).padStart(2, "0")}</b>{item.label}</a>
              </li>
            ))}
          </ol>
        ) : null}
        {children}
        <nav className={styles.related} aria-label="Continue with related pages">
          <span>{relatedLabel}</span>
          <div>
            {related.map((item) => <Link href={item.href} key={item.href}>
              <b>{item.title}</b>
              {item.description ? <small>{item.description}</small> : null}
              <Icon name="arrow" />
            </Link>)}
          </div>
        </nav>
      </main>

      <aside className={styles.aside}>
        <span>On this page</span>
        {toc.map((item, index) => <a href={item.href} key={item.href}>{String(index + 1).padStart(2, "0")} · {item.label}</a>)}
        {tools.length > 0 ? (
          <div className={styles.asideTools}>
            <span>Open a record</span>
            {tools.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </div>
        ) : null}
      </aside>
    </div>
  </article>;
}
