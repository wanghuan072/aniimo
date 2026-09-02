import { aniimo } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { TeamBuilder } from "@/components/tools/TeamBuilder";
import styles from "@/style/page/tools.module.css";

export default function TeamBuilderPage(){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Team Builder"}]} /><span className={styles.kicker}><Icon name="team" /> Team planning</span><h1>Build a four-Aniimo team</h1><p>Choose a party, adjust the order, then use role, element and base-field coverage to decide what to try next.</p><HeroPanel label="Build in four slots" items={["Choose a first Aniimo", "Fill the jobs you are missing", "Review each member's base fields"]} /></div></section><section className={styles.toolContent}><div className="container"><div className={styles.appSpacing}><TeamBuilder entries={aniimo} /></div></div></section></>}
