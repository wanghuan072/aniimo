import type { CSSProperties } from "react";
import { typeChart } from "@/lib/data";
import { elementMeta } from "@/config/site";
import styles from "@/style/page/content.module.css";

function ChartOrb({ element }: { element: string }) {
  const meta = elementMeta[element];
  return (
    <span
      className={styles.chartOrb}
      style={{ "--element-color": meta?.color || "#4d83d9", "--element-sprite-index": String(meta?.spriteIndex ?? 0) } as CSSProperties}
      aria-hidden
    />
  );
}

function cellClass(value: number) {
  if (value === typeChart.superEffective) return styles.chartStrong;
  if (value === typeChart.resisted) return styles.chartResist;
  return styles.chartNeutral;
}

function cellLabel(value: number) {
  return value === typeChart.resisted ? ".625" : String(value);
}

export function TypeMatchupTable() {
  return (
    <section id="matchups" className={styles.matchupSection} aria-labelledby="matchups-title">
      <header>
        <div>
          <span className={styles.elementEyebrow}>Matchups</span>
          <h2 id="matchups-title">Type Chart</h2>
        </div>
        <p>Rows attack, columns defend. 1.6 is a strong hit, 1 is neutral, .625 is resisted.</p>
      </header>
      <div className={styles.chartLegend} aria-label="Matchup legend">
        <span className={styles.chartStrong}>1.6 Super effective</span>
        <span className={styles.chartNeutral}>1 Neutral</span>
        <span className={styles.chartResist}>.625 Resisted</span>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.chartScroller}>
          <table className={styles.typeTable}>
            <caption>Attacker rows versus defender columns</caption>
            <thead>
              <tr>
                <th scope="col"><span className={styles.chartCorner}><b>ATK ↓</b><i>DEF →</i></span></th>
                {typeChart.elements.map((element) => (
                  <th key={element} scope="col" title={elementMeta[element]?.label || element}>
                    <ChartOrb element={element} />
                    <span className={styles.chartVisuallyHidden}>{elementMeta[element]?.label || element}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {typeChart.elements.map((attacker, row) => (
                <tr key={attacker}>
                  <th scope="row">
                    <span className={styles.chartRowHead}>
                      <ChartOrb element={attacker} />
                      <span>{elementMeta[attacker]?.label || attacker}</span>
                    </span>
                  </th>
                  {typeChart.matrix[row].map((value, column) => (
                    <td key={`${attacker}-${typeChart.elements[column]}`} className={cellClass(value)}>
                      {cellLabel(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={styles.matchupNote}>Closed Beta 3 matchup table · checked {typeChart.verifiedAt}. Values can change between game versions.</p>
    </section>
  );
}
