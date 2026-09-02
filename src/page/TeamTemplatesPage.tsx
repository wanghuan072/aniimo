import Image from "next/image";
import Link from "next/link";
import { aniimo } from "@/lib/data";
import { playerTeamTemplates } from "@/data/editorial/team-templates";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { elementMeta, roleLabels } from "@/config/site";
import type { Aniimo } from "@/types/content";
import styles from "@/style/page/tools.module.css";

export default function TeamTemplatesPage() {
  const recordsBySlug = new Map(aniimo.map((entry) => [entry.slug, entry]));
  return <>
    <section className={styles.toolHeader}>
      <div className="container">
        <Breadcrumb items={[{ label: "Team Builder", href: "/team-builder" }, { label: "Player Templates" }]} />
        <span className={styles.kicker}><Icon name="team" /> Player-made starting points</span>
        <h1>Aniimo Player Team Templates</h1>
        <p>Browse six four-Aniimo team shapes, then load one into Team Builder and change it around the activity you have in mind.</p>
      </div>
    </section>
    <section className={styles.toolContent}>
      <div className="container">
        <aside className={styles.templateDisclosure}><Icon name="spark" /><div><strong>These are player-made starting points, not fixed answers.</strong><p>Use the role and element coverage as a first draft, then swap a slot when your route, encounter or own roster asks for something different.</p></div></aside>
        <div className={styles.playerTemplateList}>
          {playerTeamTemplates.map((template) => {
            const team = template.slugs.map((slug) => recordsBySlug.get(slug)).filter((entry): entry is Aniimo => Boolean(entry));
            const elements = [...new Set(team.flatMap((entry) => entry.elements))];
            return <article key={template.slug} className={styles.playerTemplateCard}>
              <div className={styles.playerTemplateRoster}><span>{template.useCase}</span><div>{team.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug} title={`Open ${entry.name}`} aria-label={`Open ${entry.name}`}><Image src={entry.image} alt="" fill sizes="72px" /></Link>)}</div></div>
              <div className={styles.playerTemplateCopy}><h2>{template.name}</h2><p>{template.summary}</p><div className={styles.playerTemplateMembers}>{team.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}>{entry.name}<small>{entry.roles.map((role) => roleLabels[role] || role).join(" / ")}</small></Link>)}</div></div>
              <div className={styles.playerTemplateReasons}><strong>Why this shape</strong><ul>{template.notes.map((note) => <li key={note}>{note}</li>)}</ul><div>{elements.map((element) => <span key={element} style={{ "--template-element": elementMeta[element]?.color || "#4b89c4" } as React.CSSProperties}>{elementMeta[element]?.symbol} {elementMeta[element]?.label}</span>)}</div><Link href={`/team-builder?team=${template.slugs.join(",")}`}>Use this team <Icon name="arrow" /></Link></div>
            </article>;
          })}
        </div>
      </div>
    </section>
  </>;
}
