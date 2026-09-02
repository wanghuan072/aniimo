import { Breadcrumb } from "@/components/ui/Content";
import styles from "@/style/page/content.module.css";

const pagePrinciples = [
  { label: "Game fields", title: "Profiles stay close to the game", body: "Profiles focus on elements, roles, skills, traits, forms, habitats and evolution paths. When a field is not clear enough to show, it is left blank instead of guessed.", items: ["Creature profiles", "Skill and trait links", "Forms and evolution paths"] },
  { label: "Player guidance", title: "Guides explain a choice, not a script", body: "Guides and team templates are written as starting points for a real player decision. They show the trade-off, then leave room for your own roster and activity.", items: ["Guides", "Team templates", "Route planning"] },
  { label: "Ongoing review", title: "A page can be updated without pretending it is final", body: "Updates are dated, rankings are labeled for what they measure, and unclear connections are kept out until they can be matched with confidence.", items: ["Update timeline", "Player vote results", "Correction requests"] },
];

export default function SourcesPage() {
  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "How this site works" }]} /><span className={styles.kicker}>Clear labels, fewer guesses</span><h1>How Aniimo Keeps Pages Useful</h1><p>Game fields, player-made tools and incomplete connections are handled differently, so you can tell what a page is actually helping you decide.</p></div></section>
    <section className={styles.contentSection}><div className="container"><div className={styles.sourceDirectory}>{pagePrinciples.map((principle) => <article key={principle.label}><span className={styles.status}>{principle.label}</span><h2>{principle.title}</h2><p>{principle.body}</p><ul>{principle.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div><div className={styles.seoCopy}><div><span className={styles.kicker}>Our editorial rule</span><h2>Do not turn a gap into a claim</h2><p>Game fields stay separate from player suggestions. If information conflicts, belongs to an older test build or cannot be matched to a current profile, the page states less rather than pretending to know more.</p></div><aside><h2>What you will see</h2><p><strong>Game fields</strong> for profiles and relationships</p><p><strong>Player guidance</strong> for guides and team templates</p><p><strong>Clear limits</strong> when information is incomplete</p></aside></div></div></section>
  </>;
}
