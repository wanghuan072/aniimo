import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/tools.module.css";

const actions = [
  { title: "Compare Aniimo", body: "Put two records together when you need to choose a role, skill set, or element match.", href: "/tools/compare", icon: "database", label: "Compare records" },
  { title: "Track collection", body: "Mark the Aniimo you have discovered. Your checklist stays in this browser.", href: "/tools/collection-tracker", icon: "check", label: "Open checklist" },
] as const;

export default function ToolsPage() {
  return <>
    <section className={styles.toolHeader}>
      <div className="container">
        <Breadcrumb items={[{ label: "Tools" }]} />
        <span className={styles.kicker}><Icon name="tools" /> Player tools</span>
        <h1>Aniimo Planning Tools</h1>
        <p>Choose the tool that answers the question in front of you: compare a shortlist or track your own roster.</p>
        <HeroPanel label="Choose a tool" items={["Compare a real shortlist", "Track your own collection"]} />
      </div>
    </section>
    <section className={styles.toolContent}>
      <div className="container">
        <div className={styles.toolConsole}>
          <div className={styles.consoleHeader}>
            <div><span>ANIIMO FIELD KIT</span><h2>Aniimo Tools for Comparing and Collection Tracking</h2></div>
            <p>Two focused tools for comparing a shortlist and keeping track of what you have found.</p>
          </div>
          <div className={styles.toolStations}>
            {actions.map((tool) => <Link href={tool.href} key={tool.href} className={styles.toolStation}>
              <span className={styles.stationIcon}><Icon name={tool.icon} /></span>
              <div className={styles.stationCopy}>
                <h2>{tool.title}</h2>
                <p>{tool.body}</p>
              </div>
              <span className={styles.stationAction}>{tool.label} <Icon name="arrow" /></span>
            </Link>)}
          </div>
        </div>
      </div>
    </section>
  </>;
}
