import Link from "next/link";
import { aniimo } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { PlayerTierBoard } from "@/components/aniimo/PlayerTierBoard";
import styles from "@/style/page/content.module.css";

export default function TierListPage() {
  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "Tier List" }]} /><span className={styles.kicker}><Icon name="spark" /> Player team choices</span><h1>Aniimo Tier List</h1><p>Browse all 94 Aniimo by role and tier, then open the profiles that fit the job your team still needs. This is a player guide, not a popularity chart or official ranking.</p><HeroPanel label="Use the tier list" items={["Compare like-for-like roles", "See all 94 Aniimo", "Open profiles before you commit"]} /></div></section>
    <section className={styles.contentSection}><div className="container">
      <PlayerTierBoard entries={aniimo} />
      <section className={styles.tierDecisionNote}><div><span>How to read this page</span><h2>Use a tier as a starting point, not a substitute for your team</h2><p>Placements compare role, skills, elements, traits and form potential. A pick can move when its role fits your other three Aniimo better than a higher tier does.</p></div><Link href="/tier-list/global-vote"><span>Looking for player favorites?</span><strong>Open Global Vote 2026 <Icon name="arrow" /></strong></Link></section>
    </div></section>
  </>;
}
