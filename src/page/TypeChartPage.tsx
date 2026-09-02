import Link from "next/link";
import { aniimo, typeChart } from "@/lib/data";
import { elementMeta } from "@/config/site";
import { Breadcrumb } from "@/components/ui/Content";
import styles from "@/style/page/tools.module.css";

export default function TypeChartPage() {
  return <>
    <section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Type Chart" }]} /><h1>Aniimo Type Chart</h1><p>Explore element matchups from a Closed Beta 3 table, then use it as a prompt to check how your own team is covered.</p></div></section>
    <section className={styles.toolContent}><div className="container">
      <aside className={styles.communitySource}><strong>Closed Beta 3 matchup table · checked {typeChart.verifiedAt}</strong><p>Matchups can change between game versions. Treat the matrix as a planning aid, not a fixed answer for every future patch.</p></aside>
      <div className={styles.chartLegend}><span className={styles.strongHit}>×1.6 Super effective</span><span>×1 Neutral</span><span className={styles.weakHit}>×0.625 Resisted</span></div>
      <div className={styles.chartScroller}><table className={styles.typeTable}><caption>Attacker rows versus defender columns</caption><thead><tr><th>ATK ↓ · DEF →</th>{typeChart.elements.map((element) => <th key={element} style={{ "--element": elementMeta[element].color } as React.CSSProperties}><i>{elementMeta[element].symbol}</i><span>{elementMeta[element].label}</span></th>)}</tr></thead><tbody>{typeChart.elements.map((attacker, row) => <tr key={attacker}><th style={{ "--element": elementMeta[attacker].color } as React.CSSProperties}><i>{elementMeta[attacker].symbol}</i><span>{elementMeta[attacker].label}</span></th>{typeChart.matrix[row].map((value, column) => <td key={`${attacker}-${typeChart.elements[column]}`} className={value === 1.6 ? styles.strongHit : value === .625 ? styles.weakHit : ""}>{value === .625 ? ".625" : value}</td>)}</tr>)}</tbody></table></div>
      <div className={styles.elementGrid}>{typeChart.elements.map((element) => { const matching = aniimo.filter((entry) => entry.elements.includes(element)); return <section key={element} style={{ "--element": elementMeta[element].color } as React.CSSProperties}><span>{elementMeta[element].symbol}</span><h2>{elementMeta[element].label}</h2><strong>{matching.length} Aniimo</strong><div>{matching.map((entry) => <Link href={`/aniimo/${entry.slug}`} key={entry.slug}>{entry.name}</Link>)}</div><Link href="/aniimo" className={styles.elementAction}>Browse roster →</Link></section>; })}</div>
    </div></section>
  </>;
}
