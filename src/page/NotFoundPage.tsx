import Link from "next/link";
import styles from "@/style/page/content.module.css";
export default function NotFoundPage(){return <section className="section"><div className={`container surface ${styles.notFound}`}><p>404 · LOST IN ILYA</p><h1>That path is not in the index</h1><span>Try the complete Aniimo database, the site search or the map.</span><Link href="/aniimo" className="button-primary">Browse all Aniimo</Link></div></section>}
