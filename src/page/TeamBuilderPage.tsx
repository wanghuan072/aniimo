import { aniimo } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { TeamBuilder, type TeamBuilderEntry } from "@/components/tools/TeamBuilder";
import styles from "@/style/page/tools.module.css";

const teamBuilderEntries: TeamBuilderEntry[] = aniimo.map((entry) => ({
  slug: entry.slug,
  name: entry.name,
  image: entry.voteImage || entry.image,
  elements: entry.elements,
  roles: entry.roles,
  stats: entry.stats ? {
    hp: entry.stats.hp,
    physicalAttack: entry.stats.physicalAttack,
    magicAttack: entry.stats.magicAttack,
    physicalDefense: entry.stats.physicalDefense,
    magicDefense: entry.stats.magicDefense,
  } : null,
}));

const teamSlugs = new Set(teamBuilderEntries.map((entry) => entry.slug));

export default function TeamBuilderPage({ initialTeam = [] }: { initialTeam?: string[] }) {
  const cleanTeam = [...new Set(initialTeam.filter((slug) => teamSlugs.has(slug)))].slice(0, 4);
  return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Team Builder"}]} /><span className={styles.kicker}><Icon name="team" /> Team planning</span><h1>Aniimo Team Builder — Build Your Four-Aniimo Team</h1><p>Choose a party, adjust the order, then use role, element and base-field coverage to decide what to try next.</p><HeroPanel label="Build in four slots" items={["Choose a first Aniimo", "Fill the jobs you are missing", "Review each member's base fields"]} /></div></section><section className={styles.toolContent}><div className="container"><div className={styles.appSpacing}><TeamBuilder key={cleanTeam.join(",") || "empty"} entries={teamBuilderEntries} initialTeam={cleanTeam} /></div></div></section></>;
}
