import { mapLocations } from "@/lib/data";
import { Breadcrumb, SourceNote } from "@/components/ui/Content";
import { InteractiveMap } from "@/components/tools/InteractiveMap";
import styles from "@/style/page/tools.module.css";

export default function InteractiveMapPage(){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:"Map",href:"/map"},{label:"Interactive Map"}]} /><h1>Interactive Aniimo Map</h1><p>Filter research layers, inspect region notes, mark locations collected and copy a shareable marker URL.</p></div></section><section className={styles.mapAppSection}><div className="container"><SourceNote>Coordinates on this illustrated map are editorial planning positions. They are not presented as exact in-game spawn coordinates.</SourceNote><div className={styles.appSpacing}><InteractiveMap locations={mapLocations} /></div></div></section></>}
