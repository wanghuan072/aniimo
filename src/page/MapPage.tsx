import Link from "next/link";
import { mapLocations } from "@/lib/data";
import { atlasIndex, mapHref, resolveMapFocus, resolveMapRegion } from "@/lib/map-atlas";
import { InteractiveMap } from "@/components/tools/InteractiveMap";
import { Breadcrumb, FaqList } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/tools.module.css";

const faq = [
  { question: "Which parts of Idyll are on this map?", answer: "Four atlases are stored on this site: Breezy Plains, Astra, Whisperwake Isles and The Lost Islets. Switch maps from the sidebar or the atlas cards below." },
  { question: "Why are most markers hidden at first?", answer: "Breezy Plains alone has thousands of points. The map opens on key markers — bosses, teleporters, temples, landmarks and gold chests — so you can add creature, chest or gathering layers when you need them." },
  { question: "How do profile and habitat links open a marker?", answer: "Aniimo profiles, habitat cards and boss encounters pass a marker or region in the URL. The atlas switches maps if needed, turns that layer on, and flies to the matching spawn or area outline." },
];

const guides = [
  { icon: "pin" as const, title: "Start with key markers", body: "Bosses, teleporters, temples and landmarks stay on by default so the first view stays readable." },
  { icon: "search" as const, title: "Search, then zoom", body: "Type a chest, shop or landmark name to jump to it. The atlas keeps that marker type visible." },
  { icon: "filter" as const, title: "Open layers as you go", body: "Use All only when you are ready for the full scatter. Depth filters separate surface points from caves on Breezy Plains." },
];

export default function MapPage({ atlas, region, marker }: { atlas?: string; region?: string; marker?: string }) {
  const typeHit = resolveMapFocus(marker);
  const regionHit = resolveMapRegion(region) || (!typeHit ? resolveMapRegion(marker) : undefined);
  const atlasId = atlas || typeHit?.atlasId || regionHit?.atlasId;
  const regionSlug = regionHit?.slug;
  const markerSlug = typeHit ? marker : undefined;
  const points = atlasIndex.reduce((total, entry) => total + entry.total, 0);
  return (
    <>
      <section className={styles.toolHeader}>
        <div className="container">
          <Breadcrumb items={[{ label: "Map" }]} />
          <span className={styles.kicker}><Icon name="map" /> Idyll atlas</span>
          <h1>Aniimo Interactive Map</h1>
          <p>Explore chests, spawns, puzzles and transporters across Breezy Plains, Astra, Whisperwake Isles and The Lost Islets. The basemap and marker data live on this site.</p>
          <div className={styles.mapHeroActions}>
            <a href="#atlas" className="button-primary">Open the atlas <Icon name="arrow" /></a>
            <Link href="/database/habitats" className="button-secondary">Habitat list</Link>
          </div>
          <HeroPanel label="Use the atlas" items={["Pick a region map", "Start with key markers", "Search or filter before zooming in"]} />
        </div>
      </section>
      <section className={styles.toolContent}>
        <div className="container">
          <div id="atlas" className={styles.mapStage}>
            <InteractiveMap key={atlasId || "breezy-plains"} atlasId={atlasId} regionSlug={regionSlug} marker={markerSlug} />
          </div>
          <div className={styles.mapStats}>
            <div><strong>{atlasIndex.length}</strong><span>Atlases</span></div>
            <div><strong>{points.toLocaleString()}</strong><span>Mapped points</span></div>
            <div><strong>{mapLocations.length}</strong><span>Habitat areas</span></div>
            <div><strong>Local</strong><span>Tiles and markers</span></div>
          </div>
          <div className={styles.mapGuideGrid}>
            {guides.map((guide) => (
              <section key={guide.title}>
                <span className={styles.toolIcon}><Icon name={guide.icon} /></span>
                <h2>{guide.title}</h2>
                <p>{guide.body}</p>
              </section>
            ))}
          </div>
          <div className={styles.atlasBoard}>
            {atlasIndex.map((entry) => (
              <Link key={entry.id} href={entry.href} aria-current={(atlasId || "breezy-plains") === entry.id ? "page" : undefined}>
                <img src={entry.thumb} alt="" width={280} height={168} />
                <span>
                  <strong>{entry.name}</strong>
                  <small>{entry.tagline} · {entry.total.toLocaleString()} points</small>
                </span>
              </Link>
            ))}
          </div>
          <div className={styles.regionList}>
            <h2>Jump to a habitat</h2>
            <p>Open a habitat from an Aniimo profile, a boss card, or the list below. The atlas switches maps when needed and flies to the matching outline or spawn.</p>
            <div>
              {mapLocations.map((location) => (
                <Link key={location.id} href={mapHref({ region: location.id })}>{location.name}</Link>
              ))}
            </div>
          </div>
          <div className={styles.toolSeoCopy}>
            <h2>Plan a route on Idyll without leaving Aniimo</h2>
            <p>Use the interactive map when you want a chest run, a spawn check, or a teleport hop. Aniimo profiles, habitats and boss encounters link to the same markers; opening a creature pin still returns to this site's profile.</p>
          </div>
          <div className={styles.mapFaq}>
            <FaqList items={faq} />
          </div>
        </div>
      </section>
    </>
  );
}
