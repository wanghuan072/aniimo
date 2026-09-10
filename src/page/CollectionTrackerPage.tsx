import { aniimo } from "@/lib/data";
import { Breadcrumb, GuideCue } from "@/components/ui/Content";
import { pageGuideCues } from "@/lib/guide-hub";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { CollectionTracker } from "@/components/tools/CollectionTracker";
import styles from "@/style/page/tools.module.css";
export default function CollectionTrackerPage(){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Tools",href:"/tools"},{label:"Collection Tracker"}]} /><h1>Aniimo Collection Tracker</h1><p>Mark the Aniimo you have found, filter what is still missing and keep a personal checklist for your next route.</p><HeroPanel label="Keep it simple" items={["Mark what you have found", "Filter the missing ones", "Turn the list into a route"]} /><GuideCue title="How to use the tracker" items={pageGuideCues.collection} /></div></section><section className={styles.toolContent}><div className="container"><div className={styles.appSpacing}><CollectionTracker entries={aniimo} /></div></div></section></>}
