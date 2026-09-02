import { aniimo } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { CompareTool } from "@/components/tools/CompareTool";
import styles from "@/style/page/tools.module.css";
export default function ComparePage(){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Tools",href:"/tools"},{label:"Compare"}]} /><h1>Compare Aniimo</h1><p>Put up to three Aniimo side by side when you are choosing a role, skill set or element for a team slot.</p><HeroPanel label="Compare with purpose" items={["Choose up to three Aniimo", "Read roles and base fields", "Open the one that fits"]} /></div></section><section className={styles.toolContent}><div className="container"><div className={styles.appSpacing}><CompareTool entries={aniimo} /></div></div></section></>}
