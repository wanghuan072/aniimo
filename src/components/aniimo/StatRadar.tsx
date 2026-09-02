import type { AniimoStats } from "@/types/content";
import styles from "@/style/page/detail.module.css";

export function StatRadar({ stats }: { stats: AniimoStats }) {
  const axes = [
    ["HP", stats.hp, "♥"],
    ["P. ATK", stats.physicalAttack, "⚔"],
    ["M. ATK", stats.magicAttack, "◆"],
    ["P. DEF", stats.physicalDefense, "⬟"],
    ["M. DEF", stats.magicDefense, "◈"],
    ["REGEN", stats.haste, "ϟ"],
  ] as const;
  const max = 100;
  const points = axes.map(([, value], index) => { const angle = -Math.PI / 2 + index * Math.PI / 3; const radius = 69 * (Math.min(value, max) / max); return `${90 + Math.cos(angle) * radius},${90 + Math.sin(angle) * radius}`; }).join(" ");
  const grid = [0.33, 0.66, 1].map((scale) => axes.map((_, index) => { const angle = -Math.PI / 2 + index * Math.PI / 3; return `${90 + Math.cos(angle) * 69 * scale},${90 + Math.sin(angle) * 69 * scale}`; }).join(" "));
  return (
    <div className={styles.radarWrap}>
      <svg viewBox="0 0 180 180" role="img" aria-label="Radar visualization of official base stat fields">
        {grid.map((polygon) => <polygon key={polygon} points={polygon} className={styles.radarGrid} />)}
        {axes.map((_, index) => { const angle = -Math.PI / 2 + index * Math.PI / 3; return <line key={index} x1="90" y1="90" x2={90 + Math.cos(angle)*69} y2={90 + Math.sin(angle)*69} className={styles.radarAxis} />; })}
        <polygon points={points} className={styles.radarValue} />
      </svg>
      <div className={styles.statBars}>{axes.map(([label, value, icon]) => <div className={styles.statRow} key={label}>
        <i aria-hidden>{icon}</i>
        <span>{label}</span>
        <progress max="100" value={Math.min(value, 100)} aria-label={`${label}: ${value}`} />
        <strong>{value}</strong>
      </div>)}</div>
    </div>
  );
}
