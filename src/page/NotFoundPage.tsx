import Link from "next/link";
import styles from "@/style/page/content.module.css";
export default function NotFoundPage(){return <section className="section"><div className={`container surface ${styles.notFound}`}><p>404 · LOST IN IDYLL</p><h1>That path is not in the index</h1><span>Try the roster, the map, or a guide for the next decision.</span><div className={styles.notFoundActions}><Link href="/aniimo" className="button-primary">Browse all Aniimo</Link><Link href="/guides" className="button-secondary">Read a guide</Link></div></div></section>}
