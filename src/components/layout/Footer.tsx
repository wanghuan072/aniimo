import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/ui/Content";
import styles from "@/style/components/layout.module.css";

const columns = [
  { title: "Explore", links: [["All Aniimo", "/aniimo"], ["Database", "/database"], ["Tier List", "/tier-list"], ["Map", "/map"]] },
  { title: "Resources", links: [["Guides", "/guides"], ["Tools", "/tools"], ["Team Builder", "/team-builder"], ["Compare", "/tools/compare"], ["Collection", "/tools/collection-tracker"]] },
  { title: "Legal", links: [["Privacy Policy", "/legal/privacy-policy"], ["Terms of Service", "/legal/terms-of-service"], ["Copyright", "/legal/copyright"], ["About Us", "/legal/about-us"], ["Contact Us", "/legal/contact-us"]] },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerMascot} ${styles.footerMascotLeft}`}><Image src="/images/aniimo/celestis.png" alt="" fill sizes="130px" /></div>
      <div className={`${styles.footerMascot} ${styles.footerMascotRight}`}><Image src="/images/aniimo/leafy.png" alt="" fill sizes="150px" /></div>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}><Brand compact label="aniimo.cc" /><p>Find Aniimo, plan a team and choose a route with fewer loose ends.</p></div>
        <div className={styles.footerLinks}>{columns.map((column) => <div key={column.title} className={styles.footerColumn}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}</div>
        <div className={styles.footerSource}><span>Start with a question</span><h2>Find the right next step</h2><p>Browse the roster, compare a short list or build a team from the Aniimo you already have.</p><Link href="/database">Explore the database →</Link></div>
      </div>
      <div className={`container ${styles.footerBottom}`}><span>Copyright © {new Date().getFullYear()} aniimo.cc. All rights reserved.<small>aniimo.cc is an independent fan-made site and is not affiliated with, endorsed by, or connected to the game&apos;s owners.</small></span><div><Link href="/legal/privacy-policy">Privacy</Link><Link href="/legal/terms-of-service">Terms</Link><Link href="/legal/contact-us">Contact</Link></div></div>
    </footer>
  );
}
