import Image from "next/image";
import Link from "next/link";
import styles from "@/style/page/content.module.css";

export function CatalogStamps({ entries }: { entries: Array<{ slug: string; name: string; image: string }> }) {
  return (
    <div className={styles.stampSheet}>
      {entries.map((entry) => (
        <Link href={`/aniimo/${entry.slug}`} key={entry.slug} title={entry.name} aria-label={`Open ${entry.name}`}>
          <Image src={entry.image} alt="" fill sizes="44px" />
        </Link>
      ))}
    </div>
  );
}
