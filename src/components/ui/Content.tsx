import Image from "next/image";
import Link from "next/link";
import { elementMeta, roleLabels } from "@/config/site";
import type { Aniimo, Guide } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/components/content.module.css";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={styles.brand} aria-label="Aniimo home">
      <span className={styles.brandMark}><Image src="/images/logo.png" alt="" width={34} height={34} priority /></span>
      <span>{compact ? "ANIIMO" : "ANIIMO"}</span>
    </Link>
  );
}

export function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href || "current"}`}>
          <span aria-hidden>›</span>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <Link className={styles.textLink} href={action.href}>{action.label}<Icon name="arrow" /></Link>}
    </div>
  );
}

export function ElementBadge({ element }: { element: string }) {
  const meta = elementMeta[element] || { label: element, symbol: "✦", color: "#4d83d9" };
  return (
    <span className={styles.elementBadge} style={{ "--element-color": meta.color } as React.CSSProperties}>
      <span aria-hidden>{meta.symbol}</span>{meta.label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: number }) {
  const label = stage === 1 ? "Lumin" : stage === 2 ? "Gamma" : stage === 3 ? "Nova" : "Special";
  return <span className={`${styles.stageBadge} ${styles[`stage${stage}`]}`}>{label}</span>;
}

export function AniimoCard({ entry, compact = false, list = false }: { entry: Aniimo; compact?: boolean; list?: boolean }) {
  const primaryElement = entry.elements[0];
  const cardColor = elementMeta[primaryElement]?.color || "#4d83d9";
  return (
    <article
      className={`${styles.aniimoCard} ${compact ? styles.compactCard : ""} ${list ? styles.listCard : ""}`}
      style={{ "--element-color": cardColor } as React.CSSProperties}
    >
      <Link prefetch={false} href={`/aniimo/${entry.slug}`} className={styles.cardShell} aria-label={`View ${entry.name} profile`}>
        <span className={styles.cardImage}>
          <Image src={entry.voteImage || entry.image} alt={`${entry.name}, a ${entry.elements.join(" and ")} Aniimo`} fill sizes={compact ? "180px" : "(max-width: 650px) 50vw, (max-width: 1180px) 25vw, 220px"} />
          <span className={styles.cardNumber}>NO. {entry.entryId}</span>
          <StageBadge stage={entry.stage} />
          <span className={styles.cardElements}>{entry.elements.map((element) => {
            const meta = elementMeta[element];
            return <i key={element} title={meta?.label || element} style={{ "--badge-color": meta?.color || cardColor } as React.CSSProperties}>{meta?.symbol || "✦"}</i>;
          })}</span>
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitleRow}>
            <h3>{entry.name}</h3>
            <Icon name="arrow" />
          </span>
          <span className={styles.cardMeta}>
            <strong>{entry.roles.map((role) => roleLabels[role] || role).join(" · ")}</strong>
            <span>{entry.form}</span>
          </span>
          {list && <span className={styles.cardDescription}>{entry.description}</span>}
        </span>
      </Link>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className={styles.guideCard}>
      <span className={styles.guideIcon}><Icon name="book" /></span>
      <div>
        <span className={styles.eyebrow}>{guide.category} · {guide.readTime}</span>
        <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
        <p>{guide.excerpt}</p>
        <Link className={styles.textLink} href={`/guides/${guide.slug}`}>Read guide <Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

export function SourceNote({ children }: { children?: React.ReactNode }) {
  void children;
  return null;
}

export function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className={styles.faqList}>
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}<span aria-hidden>＋</span></summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
