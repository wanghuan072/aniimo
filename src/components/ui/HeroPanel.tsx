import styles from "@/style/components/hero-panel.module.css";

export function HeroPanel({ label, items }: { label: string; items: string[] }) {
  return <aside className={styles.heroPanel} aria-label={label}>
    <span>{label}</span>
    <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
  </aside>;
}
