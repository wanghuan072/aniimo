import Image from "next/image";
import Link from "next/link";
import { aniimo, officialVote } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { TierListExplorer } from "@/components/aniimo/TierListExplorer";
import styles from "@/style/page/content.module.css";

export default function GlobalVotePage() {
  const topThree = officialVote.records.slice(0, 3).map((record) => ({ ...record, entry: record.slug ? aniimo.find((entry) => entry.slug === record.slug) : undefined }));
  const podium = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  const topTen = officialVote.records.slice(3, 10).map((record) => ({ ...record, entry: record.slug ? aniimo.find((entry) => entry.slug === record.slug) : undefined }));

  return <>
    <section className={styles.compactHero}><div className="container"><Breadcrumb items={[{ label: "Tier List", href: "/tier-list" }, { label: "Global Vote 2026" }]} /><span className={styles.kicker}><Icon name="spark" /> Global Vote 2026</span><h1>Aniimo Global Vote 2026</h1><p>See the Aniimo players chose most often in the 2026 vote. This is a popularity ranking, so use the Tier List when you are choosing a team role.</p><HeroPanel label="Read the vote" items={["Vote count sets the order", "Top 3 lead the podium", "Open a profile for team details"]} /></div></section>
    <section className={styles.contentSection}><div className="container">
      <section className={styles.voteStage}>
        <header><div><span>Global Vote 2026</span><h2>Player favorites: the top 3</h2></div><p>{officialVote.records.length} Aniimo received a place in this vote.</p></header>
        <div className={styles.votePodium}>{podium.map(({ entry, rank, votes, name }) => entry && <Link href={`/aniimo/${entry.slug}`} key={rank} className={rank === 1 ? styles.voteWinner : styles.votePodiumCard}>
          <span className={styles.votePodiumRank}>#{rank}</span><span className={styles.votePodiumImage}><Image src={`/images/aniimo/vote/${entry.slug}.png`} alt="" fill sizes="210px" /></span><strong>{name}</strong><small>{votes.toLocaleString("en-US")} votes</small>
        </Link>)}</div>
      </section>
      <section className={styles.voteTopTen}>
        <header><span>Global Vote 2026</span><h2>Player favorites: ranks 4–10</h2></header>
        <div>{topTen.map(({ entry, rank, votes, name }) => entry && <Link href={`/aniimo/${entry.slug}`} key={rank}><span><b>#{rank}</b><Image src={`/images/aniimo/vote/${entry.slug}.png`} alt="" fill sizes="104px" /></span><strong>{name}</strong><small>{votes.toLocaleString("en-US")} votes</small></Link>)}</div>
      </section>
      <TierListExplorer entries={aniimo} records={officialVote.records.slice(10)} rangeLabel="Ranks 11–88" />
      <p className={styles.tierSourceLine}>The ranking keeps the published 2026 vote order. Momand (#29) is listed here, but its profile is not available yet.</p>
    </div></section>
  </>;
}
