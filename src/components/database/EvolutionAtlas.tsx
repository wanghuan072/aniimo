import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

export type EvolutionLineage = {
  id: string;
  nodes: Array<{ name: string; stage: number; image?: string; href?: string }>;
};

const stageLabel = (stage: number) => (stage === 1 ? "Lumin" : stage === 2 ? "Gamma" : stage === 3 ? "Nova" : "Special");

export function EvolutionAtlas({ records }: { records: EvolutionLineage[] }) {
  const creatureCount = new Set(records.flatMap((record) => record.nodes.map((node) => node.href || node.name))).size;

  return (
    <>
      <div className={styles.catalogBar}>
        <p><strong>{records.length}</strong> lineages <span /> <strong>{creatureCount}</strong> Aniimo on a path</p>
        <span>Read each line left to right. A stage with two medals is a real branch.</span>
      </div>
      <div className={styles.lineageIndex}>
        {records.map((record) => {
          const stages = [...new Map(record.nodes.map((node) => [node.stage, record.nodes.filter((candidate) => candidate.stage === node.stage)])).entries()];
          const root = stages[0]?.[1][0];
          const branches = record.nodes.length > stages.length;
          return (
            <article className={styles.lineageRow} key={record.id}>
              <header>
                <h2>{root?.name || "Aniimo"} line</h2>
                <p>{stages.length} stage{stages.length === 1 ? "" : "s"}{branches ? " · branches" : ""}</p>
              </header>
              <ol className={styles.lineageFlow} aria-label={`${root?.name || "Aniimo"} evolution path`}>
                {stages.map(([stage, nodes], index) => (
                  <li className={styles.lineageStep} key={stage}>
                    {index > 0 && <span className={styles.lineageArrow} aria-hidden><Icon name="arrow" /></span>}
                    <div>
                      <span>{stageLabel(stage)}</span>
                      <div className={styles.lineageMedals}>
                        {nodes.map((node) => {
                          const body = (
                            <>
                              <span className={styles.lineageMedal}>{node.image ? <Image src={node.image} alt="" fill sizes="72px" /> : "✦"}</span>
                              <b>{node.name}</b>
                            </>
                          );
                          return node.href
                            ? <Link href={node.href} key={`${stage}-${node.name}`} aria-label={`Open ${node.name}`}>{body}</Link>
                            : <span key={`${stage}-${node.name}`}>{body}</span>;
                        })}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </>
  );
}
