import Link from "next/link";
import { aniimo } from "@/lib/data";
import { AniimoExplorer } from "@/components/aniimo/AniimoExplorer";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

const explorerEntries = aniimo.map((entry) => ({
  slug: entry.slug,
  name: entry.name,
  description: entry.description,
  image: entry.image,
  voteImage: entry.voteImage,
  entryId: entry.entryId,
  stage: entry.stage,
  elements: entry.elements,
  roles: entry.roles,
  form: entry.form,
  viewCount: entry.viewCount,
}));

export default function AniimoIndexPage() {
  const novaCount = aniimo.filter((entry) => entry.stage === 3).length;
  const electricCount = aniimo.filter((entry) => entry.elements.includes("electric")).length;
  const newest = [...aniimo].sort((a, b) => Number(b.entryId) - Number(a.entryId)).slice(0, 4);
  return (
    <>
      <section className={styles.listHero}>
        <div className={`container ${styles.listHeroInner}`}>
          <div className={styles.listHeroCopy}>
            <Breadcrumb items={[{ label: "Aniimo" }]} />
            <h1><span>✦</span> All Aniimo Creatures — Browse the Full Roster <span>✦</span></h1>
            <p>Filter by element, role and stage, then open a profile to see skills, traits, forms, habitats and evolution paths in one place.</p>
          </div>
          <HeroPanel label="Find an Aniimo" items={["Filter by role or element", "Open forms and evolution paths", "Compare a real shortlist"]} />
          <div className={styles.countBubble}><i>✦</i><strong>{aniimo.length}</strong><span>Aniimo to explore</span></div>
        </div>
      </section>
      <section className={styles.listContent}>
        <div className="container">
          <div className={styles.listExplorer}>
            <AniimoExplorer entries={explorerEntries} />
          </div>
          <div className={styles.popularBand}>
            <div className={styles.popularCategories}><h2>✣ Browse Aniimo by Element, Role or Stage</h2><div><Link href="/tier-list/global-vote"><b>★</b><span><strong>Global Vote</strong><small>2026 player results</small></span></Link><Link href="/aniimo?element=electric"><b>ϟ</b><span><strong>Electric</strong><small>{electricCount} Aniimo</small></span></Link><Link href="/aniimo?stage=3"><b>★</b><span><strong>Nova Stage</strong><small>{novaCount} Aniimo</small></span></Link><Link href={`/aniimo/${newest[0]?.slug}`}><b>NEW</b><span><strong>Newer profiles</strong><small>{newest.length} quick links</small></span></Link></div></div>
            <aside><span>✦ Choosing between two?</span><p>Filter by the job your team needs first, then compare the skills and fields that affect that choice.</p><Link href="/tools/compare">Compare Aniimo <Icon name="arrow" /></Link></aside>
          </div>
        </div>
      </section>
    </>
  );
}
