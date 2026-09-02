import { mapLocations } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { InteractiveMap } from "@/components/tools/InteractiveMap";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/tools.module.css";

export default function MapPage(){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Map"}]} /><span className={styles.kicker}><Icon name="map" /> Explore Idyll</span><h1>Aniimo Interactive Map</h1><p>Choose a habitat area, see the Aniimo connected to it and keep a simple route checklist for your next session.</p><HeroPanel label="Plan a route" items={["Pick a habitat area", "Check related Aniimo", "Mark a route for later"]} /></div></section><section className={styles.mapAppSection}><div className="container"><div className={styles.appSpacing}><InteractiveMap locations={mapLocations} /></div></div></section></>}
