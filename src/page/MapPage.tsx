import Image from "next/image";
import Link from "next/link";
import { aniimo, mapLocations } from "@/lib/data";
import { mapAtlasGuides } from "@/data/editorial/map-guides";
import { atlasIndex, mapHref, resolveMapFocus, resolveMapRegion } from "@/lib/map-atlas";
import { InteractiveMap } from "@/components/tools/InteractiveMap";
import { Breadcrumb, FaqList } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { JsonLd, mapJsonLd } from "@/seo/JsonLd";
import { tdk } from "@/seo/tdk";
import type { MapAniimoProfile } from "@/lib/map-types";
import styles from "@/style/page/tools.module.css";

const faq = [
  { question: "Which maps can I use here?", answer: "Breezy Plains covers the mainland, Astra covers the city hub, Whisperwake Isles covers Crescent Bay, and The Lost Islets covers the outer islands. Use the atlas switcher without leaving the map." },
  { question: "Why doesn't the map show every marker when it opens?", answer: "A full Breezy Plains view would bury the route under thousands of pins. The map starts with bosses, teleporters, temples, landmarks, and gold chests; turn on the Aniimo, chest, or gathering layer when you need it." },
  { question: "Can I open a spawn from an Aniimo profile?", answer: "Yes. Location links on Aniimo profiles open the right atlas, enable the matching spawn layer, and move the map to that Aniimo or habitat." },
];

export default function MapPage({ atlas, region, marker }: { atlas?: string; region?: string; marker?: string }) {
  const typeHit = resolveMapFocus(marker);
  const regionHit = resolveMapRegion(region) || (!typeHit ? resolveMapRegion(marker) : undefined);
  const requestedAtlasId = atlas || typeHit?.atlasId || regionHit?.atlasId;
  const atlasId = atlasIndex.some((entry) => entry.id === requestedAtlasId) ? requestedAtlasId! : "breezy-plains";
  const regionSlug = regionHit?.slug;
  const markerSlug = typeHit ? marker : undefined;
  const points = atlasIndex.reduce((total, entry) => total + entry.total, 0);
  const activeGuide = mapAtlasGuides[atlasId];
  const profiles = Object.fromEntries(aniimo.map((entry) => [entry.slug, {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    image: entry.image,
    stage: entry.stage,
    form: entry.form,
    elements: entry.elements,
    roles: entry.roles,
    stats: entry.stats ? {
      hp: entry.stats.hp,
      physicalAttack: entry.stats.physicalAttack,
      magicAttack: entry.stats.magicAttack,
    } : null,
    skills: entry.skills.slice(0, 2).map((skill) => skill.name),
    evolution: [...new Set(entry.evolution.map((step) => step.name))],
  }])) as Record<string, MapAniimoProfile>;
  const mapUrl = new URL("/map", siteConfig.url).toString();
  return (
    <>
      <JsonLd data={mapJsonLd({
        name: "Aniimo Interactive Map",
        description: tdk.map.description,
        url: mapUrl,
        parts: atlasIndex.map((entry) => ({
          name: `${entry.name} Aniimo Map`,
          description: mapAtlasGuides[entry.id].card,
          href: entry.href,
          image: entry.thumb,
        })),
      })} />
      <section className={styles.toolHeader}>
        <div className="container">
          <Breadcrumb items={[{ label: "Map" }]} />
          <span className={styles.kicker}><Icon name="map" /> Idyll field atlas</span>
          <h1>Aniimo Interactive Map</h1>
          <p>Looking for one stubborn spawn, a clean chest loop, or the cave entrance behind a pin? Pick an atlas, turn on the layer you need, and leave the rest of the map quiet.</p>
          <div className={styles.mapHeroActions}>
            <a href="#atlas" className="button-primary">Start searching <Icon name="arrow" /></a>
            <Link href="/database/habitats" className="button-secondary">Browse habitats</Link>
          </div>
          <HeroPanel label="Before you set out" items={["Search an Aniimo by name", "Open only the layer you need", "Check Surface or Cave before rerouting"]} />
        </div>
      </section>
      <section className={styles.toolContent}>
        <div className="container">
          <div id="atlas" className={styles.mapStage}>
            <InteractiveMap key={atlasId} atlasId={atlasId} regionSlug={regionSlug} marker={markerSlug} profiles={profiles} />
          </div>
          <section className={styles.atlasSection} aria-labelledby="aniimo-map-regions">
            <header className={styles.atlasHeading}>
              <div><span>Four local atlases</span><h2 id="aniimo-map-regions">Explore the Aniimo Map by Region</h2></div>
              <p>Choose the part of Idyll you are actually playing. Each atlas keeps its own layers, counts, and route notes.</p>
            </header>
            <div className={styles.atlasBoard}>
              {atlasIndex.map((entry) => (
                <Link key={entry.id} href={entry.href} aria-current={atlasId === entry.id ? "page" : undefined}>
                  <Image src={entry.thumb} alt="" width={280} height={168} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px" />
                  <div className={styles.atlasCardCopy}>
                    <h3>{entry.name}</h3>
                    <small>{entry.tagline} · {entry.total.toLocaleString()} points</small>
                    <p>{mapAtlasGuides[entry.id].card}</p>
                  </div>
                </Link>
              ))}
            </div>
            <article className={styles.atlasBrief}>
              <div>
                <span>{atlasIndex.find((entry) => entry.id === atlasId)?.name} field notes</span>
                <h2>{activeGuide.heading}</h2>
                <p>{activeGuide.overview}</p>
              </div>
              <aside>
                {activeGuide.featuredAniimo.length > 0 && (
                  <div><strong>Worth checking</strong><p>{activeGuide.featuredAniimo.map((entry) => <Link key={entry.slug} href={`/aniimo/${entry.slug}`}>{entry.name}</Link>)}</p></div>
                )}
                <div><strong>Treasure on this map</strong><p>{activeGuide.treasure}</p></div>
              </aside>
            </article>
          </section>
          <div className={styles.mapStats}>
            <div><strong>{atlasIndex.length}</strong><span>Atlases</span></div>
            <div><strong>{points.toLocaleString()}</strong><span>Mapped points</span></div>
            <div><strong>{mapLocations.length}</strong><span>Habitat areas</span></div>
            <div><strong>Local</strong><span>Tiles and markers</span></div>
          </div>
          <div className={styles.regionList}>
            <h2>Jump to a named habitat</h2>
            <p>Already know the area? Pick it below and the atlas will move to its outline. The same links also work from Aniimo profiles and boss records.</p>
            <div>
              {mapLocations.map((location) => (
                <Link key={location.id} href={mapHref({ region: location.id })}>{location.name}</Link>
              ))}
            </div>
          </div>
          <div className={styles.mapFaq}>
            <FaqList items={faq} />
          </div>
        </div>
      </section>
    </>
  );
}
