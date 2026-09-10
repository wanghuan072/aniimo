import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import type { Guide } from "@/types/content";
import type { DossierChapter, GuideDossier } from "@/data/editorial/guide-dossiers";
import { getGuideFieldNotes, type GuideFieldSection } from "@/data/editorial/guide-field-notes";
import { getGuideConnections, mergeGuideLinks } from "@/lib/guide-hub";
import GuideArticleShell from "@/page/GuideArticleShell";
import CatchingGuideContent, { catchingFaq } from "@/page/CatchingGuideContent";
import styles from "@/style/page/guide-dossier.module.css";
import fieldStyles from "@/style/page/guide-field.module.css";
import contentStyles from "@/style/page/content.module.css";

type PageProps = { guide: Guide; dossier: GuideDossier };

const MARKUP = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(MARKUP)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(<Link href={match[2]} key={key++}>{match[1]}</Link>);
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function Copy({ paragraphs }: { paragraphs: string[] }) {
  return <>{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}><RichText text={paragraph} /></p>)}</>;
}

function SectionLinks({ id, own }: { id: string; own?: { label: string; href: string } }) {
  const items = mergeGuideLinks(id, own);
  if (!items.length) return null;
  return <div className={styles.sectionLinks}>{items.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden>→</span></Link>)}</div>;
}

function Artwork({ chapter }: { chapter: DossierChapter }) {
  if (!chapter.image) return null;
  return <figure className={styles.artwork}><Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(max-width: 768px) 100vw, 310px" /><figcaption>{chapter.image.caption}</figcaption></figure>;
}

function Ledger({ chapter }: { chapter: DossierChapter }) {
  if (!chapter.table) return null;
  return <div className={styles.ledgerWrap}><table className={styles.ledger}>
    <caption>{chapter.table.caption}</caption>
    <thead><tr>{chapter.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
    <tbody>{chapter.table.rows.map((row) => <tr key={row.join("-")}>{row.map((value, index) => index === 0 ? <th key={value} scope="row"><RichText text={value} /></th> : <td key={value}><RichText text={value} /></td>)}</tr>)}</tbody>
  </table></div>;
}

function SectionHead({ chapter }: { chapter: DossierChapter }) {
  return <header><span>{chapter.label}</span><h2>{chapter.title}</h2>{chapter.lead ? <p><RichText text={chapter.lead} /></p> : null}</header>;
}

function Steps({ chapter }: { chapter: DossierChapter }) {
  return chapter.steps ? <ol className={styles.steps}>{chapter.steps.map((step, index) => <li key={step.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{step.title}</h3><p><RichText text={step.body} /></p></div></li>)}</ol> : null;
}

function Note({ chapter }: { chapter: DossierChapter }) {
  return chapter.note ? <aside className={styles.note}><b>{chapter.note.title}</b><p><RichText text={chapter.note.body} /></p></aside> : null;
}

function ChapterLinks({ chapter }: { chapter: DossierChapter }) {
  return <SectionLinks id={chapter.id} own={chapter.link} />;
}

const fieldToneClass = {
  route: fieldStyles.fieldRoute,
  records: fieldStyles.fieldRecords,
  matchup: fieldStyles.fieldMatchup,
  workbench: fieldStyles.fieldWorkbench,
} satisfies Record<GuideFieldSection["tone"], string>;

function FieldSection({ section, after }: { section: GuideFieldSection; after: string }) {
  return <section id={section.id} className={`${fieldStyles.fieldSection} ${fieldToneClass[section.tone]}`}>
    <header>
      <span>Example</span>
      <h2>{section.title}</h2>
      <p className={fieldStyles.exampleLead}>{section.label}. A worked example of “{after}”, not a new plan.</p>
    </header>
    {section.scene ? <figure className={fieldStyles.scene}>
      <div><Image src={section.scene.src} alt={section.scene.alt} fill sizes="(max-width: 1024px) 100vw, 860px" /></div>
      <figcaption>{section.scene.caption}<small>Official Aniimo gameplay media</small></figcaption>
    </figure> : null}
    <div className={section.image ? fieldStyles.fieldLead : undefined}>
      <div><Copy paragraphs={section.paragraphs} /></div>
      <Artwork chapter={section} />
    </div>
    <Ledger chapter={section} />
    <Note chapter={section} />
    <SectionLinks id={section.id} own={section.link} />
  </section>;
}

function BeginnerBody({ dossier }: { dossier: GuideDossier }) {
  const [hours, starter, twining, team] = dossier.chapters;
  const [fieldRoute, fieldRoster] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={hours.id} className={styles.storySplit}><div><SectionHead chapter={hours} /><Copy paragraphs={hours.paragraphs} /><Steps chapter={hours} /><ChapterLinks chapter={hours} /></div><Artwork chapter={hours} /></section>
    <FieldSection section={fieldRoute} after={hours.title} />
    <section id={starter.id} className={styles.routeBlock}><SectionHead chapter={starter} /><Copy paragraphs={starter.paragraphs} /><Ledger chapter={starter} /><ChapterLinks chapter={starter} /></section>
    <section id={twining.id} className={styles.darkNote}><SectionHead chapter={twining} /><Copy paragraphs={twining.paragraphs} /><Note chapter={twining} /><ChapterLinks chapter={twining} /></section>
    <section id={team.id}><SectionHead chapter={team} /><Copy paragraphs={team.paragraphs} /><Ledger chapter={team} /><ChapterLinks chapter={team} /></section>
    <FieldSection section={fieldRoster} after={team.title} />
  </>;
}

function EvolutionBody({ dossier }: { dossier: GuideDossier }) {
  const [terms, family, gates, fit] = dossier.chapters;
  const [forms, branches] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={terms.id}><div className={styles.branchLine}><span>Emberpup</span><i>→</i><span>Flameruff</span><i>→</i><b>Scorchhowl</b><b>Inferlupa</b></div><SectionHead chapter={terms} /><Copy paragraphs={terms.paragraphs} /><Ledger chapter={terms} /><ChapterLinks chapter={terms} /></section>
    <FieldSection section={forms} after={terms.title} />
    <section id={family.id} className={styles.storySplit}><Artwork chapter={family} /><div><SectionHead chapter={family} /><Copy paragraphs={family.paragraphs} /><ChapterLinks chapter={family} /></div></section>
    <FieldSection section={branches} after={family.title} />
    <section id={gates.id} className={styles.gateBlock}><SectionHead chapter={gates} /><Copy paragraphs={gates.paragraphs} /><Steps chapter={gates} /><ChapterLinks chapter={gates} /></section>
    <section id={fit.id}><SectionHead chapter={fit} /><Copy paragraphs={fit.paragraphs} /><Note chapter={fit} /><ChapterLinks chapter={fit} /></section>
  </>;
}

function CombatBody({ dossier }: { dossier: GuideDossier }) {
  const [matchup, loop, ep, rebuild] = dossier.chapters;
  const [skills, rotation] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={matchup.id}><SectionHead chapter={matchup} /><Copy paragraphs={matchup.paragraphs} /><Ledger chapter={matchup} /><ChapterLinks chapter={matchup} /></section>
    <FieldSection section={skills} after={matchup.title} />
    <section id={loop.id} className={styles.pressureBlock}><SectionHead chapter={loop} /><Copy paragraphs={loop.paragraphs} /><Steps chapter={loop} /><Note chapter={loop} /><ChapterLinks chapter={loop} /></section>
    <section id={ep.id}><SectionHead chapter={ep} /><Copy paragraphs={ep.paragraphs} /><Ledger chapter={ep} /><ChapterLinks chapter={ep} /></section>
    <FieldSection section={rotation} after={ep.title} />
    <section id={rebuild.id}><SectionHead chapter={rebuild} /><Copy paragraphs={rebuild.paragraphs} /><Ledger chapter={rebuild} /><Artwork chapter={rebuild} /><ChapterLinks chapter={rebuild} /></section>
  </>;
}

function ElementsBody({ dossier }: { dossier: GuideDossier }) {
  const [matrix, audit, forms, favorite] = dossier.chapters;
  const [chart, swaps] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={matrix.id}><SectionHead chapter={matrix} /><Copy paragraphs={matrix.paragraphs} /><ChapterLinks chapter={matrix} /></section>
    <FieldSection section={chart} after={matrix.title} />
    <section id={audit.id} className={styles.coverageBlock}><SectionHead chapter={audit} /><Copy paragraphs={audit.paragraphs} /><Steps chapter={audit} /><ChapterLinks chapter={audit} /></section>
    <section id={forms.id} className={styles.storySplit}><div><SectionHead chapter={forms} /><Copy paragraphs={forms.paragraphs} /><ChapterLinks chapter={forms} /></div><Artwork chapter={forms} /></section>
    <FieldSection section={swaps} after={audit.title} />
    <section id={favorite.id}><SectionHead chapter={favorite} /><Copy paragraphs={favorite.paragraphs} /><Note chapter={favorite} /><ChapterLinks chapter={favorite} /></section>
  </>;
}

function TraitsBody({ dossier }: { dossier: GuideDossier }) {
  const [read, fit, mistakes, closing] = dossier.chapters;
  const [records, test] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={read.id}><SectionHead chapter={read} /><Copy paragraphs={read.paragraphs} /><Ledger chapter={read} /><ChapterLinks chapter={read} /></section>
    <FieldSection section={records} after={read.title} />
    <section id={fit.id} className={styles.storySplit}><Artwork chapter={fit} /><div><SectionHead chapter={fit} /><Copy paragraphs={fit.paragraphs} /><ChapterLinks chapter={fit} /></div></section>
    <section id={mistakes.id} className={styles.auditBlock}><SectionHead chapter={mistakes} /><Copy paragraphs={mistakes.paragraphs} /><Steps chapter={mistakes} /><ChapterLinks chapter={mistakes} /></section>
    <FieldSection section={test} after={mistakes.title} />
    <section id={closing.id}><SectionHead chapter={closing} /><Copy paragraphs={closing.paragraphs} /><Note chapter={closing} /><ChapterLinks chapter={closing} /></section>
  </>;
}

function MaterialsBody({ dossier }: { dossier: GuideDossier }) {
  const [shortfall, route, boundary, inventory] = dossier.chapters;
  const [loops, ledger] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={shortfall.id}><p className={styles.shortfallRule}>{dossier.thesis}</p><SectionHead chapter={shortfall} /><Copy paragraphs={shortfall.paragraphs} /><ChapterLinks chapter={shortfall} /></section>
    <FieldSection section={loops} after={shortfall.title} />
    <section id={route.id} className={styles.routeBlock}><SectionHead chapter={route} /><Copy paragraphs={route.paragraphs} /><Steps chapter={route} /><ChapterLinks chapter={route} /></section>
    <section id={boundary.id}><SectionHead chapter={boundary} /><Copy paragraphs={boundary.paragraphs} /><Ledger chapter={boundary} /><ChapterLinks chapter={boundary} /></section>
    <FieldSection section={ledger} after={boundary.title} />
    <section id={inventory.id} className={styles.storySplit}><Artwork chapter={inventory} /><div><SectionHead chapter={inventory} /><Copy paragraphs={inventory.paragraphs} /><ChapterLinks chapter={inventory} /></div></section>
  </>;
}

function EggsBody({ dossier }: { dossier: GuideDossier }) {
  const [hatch, label, plan, unknowns] = dossier.chapters;
  const [records, map] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={hatch.id}><div className={styles.eggStrip}><Image src="/images/database/items/alpha-egg.webp" alt="" width={72} height={72} /><Image src="/images/database/items/elite-egg.webp" alt="" width={72} height={72} /><Image src="/images/database/items/beach-egg.webp" alt="" width={72} height={72} /></div><SectionHead chapter={hatch} /><Copy paragraphs={hatch.paragraphs} /><Steps chapter={hatch} /><ChapterLinks chapter={hatch} /></section>
    <FieldSection section={records} after={hatch.title} />
    <section id={label.id}><SectionHead chapter={label} /><Copy paragraphs={label.paragraphs} /><Ledger chapter={label} /><ChapterLinks chapter={label} /></section>
    <section id={plan.id} className={styles.eggRoute}><SectionHead chapter={plan} /><Copy paragraphs={plan.paragraphs} /><Steps chapter={plan} /><ChapterLinks chapter={plan} /></section>
    <FieldSection section={map} after={plan.title} />
    <section id={unknowns.id} className={styles.unknownBlock}><SectionHead chapter={unknowns} /><Copy paragraphs={unknowns.paragraphs} /><Note chapter={unknowns} /><ChapterLinks chapter={unknowns} /></section>
  </>;
}

function CollectionBody({ dossier }: { dossier: GuideDossier }) {
  const [target, exact, route, complete] = dossier.chapters;
  const [controls, session] = getGuideFieldNotes(dossier.slug);
  return <>
    <section id={target.id}><div className={styles.collectionFlow}><span>Missing record</span><i>→</i><span>Verify version</span><i>→</i><span>Build route</span><i>→</i><span>Mark result</span></div><SectionHead chapter={target} /><Copy paragraphs={target.paragraphs} /><ChapterLinks chapter={target} /></section>
    <FieldSection section={controls} after={target.title} />
    <section id={exact.id} className={styles.storySplit}><Artwork chapter={exact} /><div><SectionHead chapter={exact} /><Copy paragraphs={exact.paragraphs} /><ChapterLinks chapter={exact} /></div></section>
    <section id={route.id} className={styles.routeBlock}><SectionHead chapter={route} /><Copy paragraphs={route.paragraphs} /><Steps chapter={route} /><ChapterLinks chapter={route} /></section>
    <FieldSection section={session} after={route.title} />
    <section id={complete.id}><SectionHead chapter={complete} /><Copy paragraphs={complete.paragraphs} /><Ledger chapter={complete} /><ChapterLinks chapter={complete} /></section>
  </>;
}

function GuideFaq({ items }: { items: Array<{ question: string; answer: string }> }) {
  if (!items.length) return null;
  return <section id="questions" className={styles.faq}>
    <header><span>Questions</span><h2>Quick answers</h2></header>
    {items.map((item) => <details key={item.question}><summary>{item.question}</summary><p><RichText text={item.answer} /></p></details>)}
  </section>;
}

function GuideBody({ dossier }: { dossier: GuideDossier }) {
  switch (dossier.slug) {
    case "aniimo-catching-guide": return <CatchingGuideContent />;
    case "aniimo-beginners-guide": return <BeginnerBody dossier={dossier} />;
    case "aniimo-forms-and-evolution": return <EvolutionBody dossier={dossier} />;
    case "aniimo-combat-guide": return <CombatBody dossier={dossier} />;
    case "aniimo-elements-guide": return <ElementsBody dossier={dossier} />;
    case "aniimo-traits-guide": return <TraitsBody dossier={dossier} />;
    case "aniimo-materials-guide": return <MaterialsBody dossier={dossier} />;
    case "aniimo-eggs-guide": return <EggsBody dossier={dossier} />;
    case "aniimo-collection-guide": return <CollectionBody dossier={dossier} />;
    default: return null;
  }
}

export default function GuideDossierPage({ guide, dossier }: PageProps) {
  const guideUrl = new URL("/guides/" + guide.slug, siteConfig.url).toString();
  const articleSchema = articleJsonLd({ title: dossier.title, description: dossier.deck, url: guideUrl, image: new URL("/guides/" + guide.slug + "/opengraph-image", siteConfig.url).toString(), datePublished: guide.published, dateModified: guide.updated, author: { name: guide.author.label, url: new URL(guide.author.href, siteConfig.url).toString() } });
  const isCatchingGuide = dossier.slug === "aniimo-catching-guide";
  const fieldSections = getGuideFieldNotes(dossier.slug);
  const connections = getGuideConnections(dossier.slug);
  const tocChapters = (() => {
    if (!fieldSections.length) return dossier.chapters;
    const [opening, second, third, last] = dossier.chapters;
    const [firstExample, secondExample] = fieldSections;
    if (dossier.slug === "aniimo-beginners-guide") return [opening, firstExample, second, third, last, secondExample];
    if (dossier.slug === "aniimo-forms-and-evolution") return [opening, firstExample, second, secondExample, third, last];
    return [opening, firstExample, second, third, secondExample, last];
  })();
  const schemas = [
    articleSchema,
    breadcrumbJsonLd([
      { name: "Home", href: "/" },
      { name: "Guides", href: "/guides" },
      { name: dossier.title, href: `/guides/${guide.slug}` },
    ], siteConfig.url),
    ...(isCatchingGuide ? [faqJsonLd(catchingFaq)] : dossier.faq.length ? [faqJsonLd(dossier.faq)] : []),
  ];
  const toc = [
    ...tocChapters.map((chapter) => ({
      href: `#${chapter.id}`,
      label: fieldSections.some((section) => section.id === chapter.id) ? `Example: ${chapter.title}` : chapter.title,
    })),
    ...(!isCatchingGuide && dossier.faq.length ? [{ href: "#questions", label: "Quick answers" }] : []),
  ];
  return <>
    <JsonLd data={schemas} />
    <GuideArticleShell
      guide={guide}
      title={dossier.title}
      description={dossier.deck}
      kicker={`${dossier.category} · ${dossier.readTime}`}
      heroVisual={<Image className={styles.guideHeroImage} src={dossier.heroImage} alt={dossier.heroAlt} fill priority sizes="(max-width: 1024px) 100vw, 430px" />}
      heroNote={dossier.thesis}
      theme={dossier.theme}
      outline={connections?.outline}
      toc={toc}
      tools={connections?.tools}
      related={connections?.related || []}
      articleClassName={`${styles.guideArticle} ${isCatchingGuide ? contentStyles.catchingArticle : ""}`}
      bodyClassName={`${styles.guideBody} ${isCatchingGuide ? contentStyles.catchingBody : ""}`}
    >
      <GuideBody dossier={dossier} />
      {!isCatchingGuide ? <GuideFaq items={dossier.faq} /> : null}
    </GuideArticleShell>
  </>;
}
