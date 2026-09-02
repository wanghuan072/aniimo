import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export type EvolutionLineage = {
  id: string;
  nodes: Array<{ name: string; stage: number; image?: string; href?: string }>;
};

export function EvolutionAtlas({ records }: { records: EvolutionLineage[] }) {
  const creatureCount = new Set(records.flatMap((record) => record.nodes.map((node) => node.href || node.name))).size;

  return <>
    <div className={styles.evolutionDirectory}>
      <p><strong>{records.length}</strong> published lineages <span /> <strong>{creatureCount}</strong> Aniimo forms connected</p>
      <span>Each panel groups published forms by stage.</span>
    </div>
    <div className={styles.evolutionAtlas}>
      {records.map((record) => {
        const stages = [...new Map(record.nodes.map((node) => [node.stage, record.nodes.filter((candidate) => candidate.stage === node.stage)])).entries()];
        const root = stages[0]?.[1][0];
        return <article className={styles.evolutionLineage} key={record.id}>
          <header>
            <span>Evolution lineage</span>
            <h2>{root?.name || "Aniimo lineage"}</h2>
            <p>{stages.length} published stage{stages.length === 1 ? "" : "s"}{record.nodes.length > stages.length ? " · branching form recorded" : ""}</p>
          </header>
          <div className={styles.evolutionFlow} aria-label={`${root?.name || "Aniimo"} evolution path`}>
            {stages.map(([stage, nodes], index) => <div className={styles.evolutionStep} key={stage}>
              {index > 0 && <span className={styles.evolutionArrow} aria-hidden><Icon name="arrow" /></span>}
              <div className={styles.evolutionStage}>
                <span>Stage {stage}</span>
                <div>{nodes.map((node) => {
                  const body = <><span className={styles.evolutionPortrait}>{node.image ? <Image src={node.image} alt="" fill sizes="58px" /> : "✦"}</span><b>{node.name}</b></>;
                  return node.href ? <Link href={node.href} key={`${stage}-${node.name}`} aria-label={`Open ${node.name}`}>{body}</Link> : <span className={styles.evolutionNode} key={`${stage}-${node.name}`}>{body}</span>;
                })}</div>
              </div>
            </div>)}
          </div>
        </article>;
      })}
    </div>
  </>;
}
