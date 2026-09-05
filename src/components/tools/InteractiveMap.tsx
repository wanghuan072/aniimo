"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, MarkerClusterGroup } from "leaflet";
import { Icon } from "@/components/ui/Icon";
import { elementMeta, roleLabels } from "@/config/site";
import { atlasFrame, atlasIndex, atlasLoaders, essentialsFor, findFocusPoi, regionColor, resolveFocusInAtlas, token } from "@/lib/map-runtime";
import type { AtlasFile, MapAniimoProfile, MapAtlas, MapPoi } from "@/lib/map-types";
import styles from "@/style/components/map.module.css";
import "leaflet/dist/leaflet.css";

type Depth = "all" | "surface" | "underground";
type ClusterSet = Map<string, {
  group: MarkerClusterGroup;
  byType: Map<string, MapPoi[]>;
  markers: Map<string, Marker[]>;
  active: Set<string>;
  createMarker: (poi: MapPoi) => Marker;
}>;

const ATLAS_SHORT: Record<string, string> = {
  "breezy-plains": "Breezy",
  astra: "Astra",
  "whisperwake-isles": "Isles",
  "lost-islets": "Lost",
};

function syncClusters(map: LeafletMap, atlas: MapAtlas, clusters: ClusterSet, enabled: Set<string>, depth: Depth) {
  for (const category of atlas.categories) {
    const bucket = clusters.get(category.slug);
    if (!bucket) continue;
    let visible = false;
    for (const type of category.types) {
      for (const plane of ["s", "u"] as const) {
        const key = `${type.slug}|${plane}`;
        const points = bucket.byType.get(key);
        const on = Boolean(points?.length) && enabled.has(type.slug) && (depth === "all" || (depth === "underground" ? plane === "u" : plane === "s"));
        if (on) visible = true;
        if (on && !bucket.active.has(key) && points) {
          let markers = bucket.markers.get(key);
          if (!markers) {
            markers = points.map(bucket.createMarker);
            bucket.markers.set(key, markers);
          }
          bucket.group.addLayers(markers);
          bucket.active.add(key);
        }
        if (!on && bucket.active.has(key)) {
          const markers = bucket.markers.get(key);
          if (markers) bucket.group.removeLayers(markers);
          bucket.active.delete(key);
        }
      }
    }
    if (visible && !map.hasLayer(bucket.group)) map.addLayer(bucket.group);
    if (!visible && map.hasLayer(bucket.group)) map.removeLayer(bucket.group);
  }
}

export function InteractiveMap({ atlasId, regionSlug, marker, profiles }: { atlasId?: string; regionSlug?: string; marker?: string; profiles: Record<string, MapAniimoProfile> }) {
  const id = atlasId && atlasLoaders[atlasId] ? atlasId : "breezy-plains";
  const [payload, setPayload] = useState<AtlasFile | null>(null);

  useEffect(() => {
    let cancelled = false;
    atlasLoaders[id]().then((file) => {
      if (!cancelled) setPayload(file);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!payload) {
    return (
      <div className={styles.shell}>
        <div className={styles.stage}>
          <p className={styles.credit}>Loading atlas…</p>
        </div>
      </div>
    );
  }

  return <AtlasView payload={payload} regionSlug={regionSlug} marker={marker} profiles={profiles} />;
}

function AtlasView({ payload, regionSlug, marker, profiles }: { payload: AtlasFile; regionSlug?: string; marker?: string; profiles: Record<string, MapAniimoProfile> }) {
  const atlas = payload.atlas;
  const frame = useMemo(() => atlasFrame(atlas), [atlas]);
  const categoryBySlug = useMemo(() => new Map(atlas.categories.map((category) => [category.slug, category])), [atlas]);
  const typeBySlug = useMemo(() => new Map(atlas.categories.flatMap((category) => category.types.map((type) => [type.slug, type]))), [atlas]);
  const essentialSlugs = useMemo(() => essentialsFor(atlas), [atlas]);
  const [enabled, setEnabled] = useState(() => essentialsFor(atlas));
  const [depth, setDepth] = useState<Depth>("all");
  const [openGroups, setOpenGroups] = useState(() => new Set<string>());
  const [showRegions, setShowRegions] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MapPoi | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mapTick, setMapTick] = useState(0);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const clustersRef = useRef<ClusterSet>(new Map());
  const focusedRef = useRef("");
  const onSelect = useCallback((poi: MapPoi) => {
    setSelected(poi);
    mapRef.current?.flyTo(frame.toLatLng(poi.x, poi.y), Math.max(mapRef.current.getZoom(), 3.5), { duration: 0.5 });
  }, [frame]);

  useEffect(() => {
    const el = mapEl.current;
    if (!el) return;
    let cancelled = false;
    let map: LeafletMap | undefined;
    let regionsLayer: import("leaflet").LayerGroup | undefined;
    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default;
      (globalThis as typeof globalThis & { L: typeof L }).L = L;
      await import("leaflet.markercluster");
      if (cancelled || !el.isConnected) return;
      map = L.map(el, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 5,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        maxBounds: frame.maxBounds,
        maxBoundsViscosity: 0.35,
      });
      mapRef.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer(atlas.meta.tiles.template, {
        tileSize: atlas.meta.tiles.tileSize,
        minZoom: -3,
        maxZoom: 5,
        minNativeZoom: 0,
        maxNativeZoom: 0,
        bounds: frame.imageBounds,
        noWrap: true,
      }).addTo(map);
      const regionTarget = atlas.regions.find((region) => region.slug === regionSlug || region.name === regionSlug);
      if (regionTarget?.poly.length) map.fitBounds(L.latLngBounds(regionTarget.poly.map(([x, y]) => frame.toLatLng(x, y))), { maxZoom: 1.75, padding: [24, 24] });
      else map.fitBounds(frame.contentBounds, { padding: [12, 12] });
      requestAnimationFrame(() => map?.invalidateSize());
      regionsLayer = L.layerGroup();
      for (const region of atlas.regions) {
        const color = regionColor(region.lvlMin);
        L.polygon(region.poly.map(([x, y]) => frame.toLatLng(x, y)), { color, weight: 2, fillColor: color, fillOpacity: 0.12 })
          .bindTooltip(`${region.name}${region.lvlMin != null ? ` · Lv ${region.lvlMin}–${region.lvlMax}` : ""}`)
          .on("click", () => map?.fitBounds(L.latLngBounds(region.poly.map(([x, y]) => frame.toLatLng(x, y))), { maxZoom: 1.75 }))
          .addTo(regionsLayer);
      }
      (map as LeafletMap & { __regions?: import("leaflet").LayerGroup }).__regions = regionsLayer;
      const icons = new Map<string, import("leaflet").DivIcon>();
      const iconFor = (poi: MapPoi) => {
        const boss = poi.c === "bosses";
        const ring = typeBySlug.get(poi.t)?.ring;
        const key = `${poi.ic}|${boss ? "b" : ""}|${ring ?? ""}`;
        const cached = icons.get(key);
        if (cached) return cached;
        const size = boss ? 32 : 26;
        const created = L.divIcon({
          className: "",
          html: `<span class="map-poi${boss ? " map-poi-boss" : ""}">${ring ? `<span style="position:absolute;inset:-2px;border:2px solid ${ring};border-radius:50%"></span>` : ""}<img src="${atlas.icons[poi.ic] || ""}" alt="" width="${size}" height="${size}"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
        icons.set(key, created);
        return created;
      };
      const createMarker = (poi: MapPoi) => {
        const title = atlas.labels[poi.n] || "Map point";
        const created = L.marker(frame.toLatLng(poi.x, poi.y), { icon: iconFor(poi), title, keyboard: true });
        created.bindTooltip(title, { direction: "top", offset: [0, -12] });
        created.on("click", () => onSelect(poi));
        return created;
      };
      const clusters: ClusterSet = new Map();
      for (const category of atlas.categories) {
        const group = L.markerClusterGroup({
          chunkedLoading: true,
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          removeOutsideVisibleBounds: true,
          maxClusterRadius: (zoom) => (zoom >= 3 ? 1 : 44),
          iconCreateFunction: (cluster) => L.divIcon({ html: `<span class="map-cluster">${cluster.getChildCount()}</span>`, className: "", iconSize: [36, 36] }),
        });
        clusters.set(category.slug, { group, byType: new Map(), markers: new Map(), active: new Set(), createMarker });
      }
      for (const poi of atlas.pois) {
        const bucket = clusters.get(poi.c);
        if (!bucket) continue;
        const key = `${poi.t}|${poi.ug ? "u" : "s"}`;
        const list = bucket.byType.get(key) || [];
        list.push(poi);
        bucket.byType.set(key, list);
      }
      clustersRef.current = clusters;
      syncClusters(map, atlas, clusters, essentialsFor(atlas), "all");
      const regionLayer = (map as LeafletMap & { __regions?: import("leaflet").LayerGroup }).__regions;
      if (regionLayer) regionLayer.addTo(map);
      setMapTick((value) => value + 1);
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      clustersRef.current = new Map();
    };
  }, [atlas, frame, onSelect, regionSlug, typeBySlug]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapTick) return;
    syncClusters(map, atlas, clustersRef.current, enabled, depth);
  }, [atlas, enabled, depth, mapTick]);

  useEffect(() => {
    const map = mapRef.current as (LeafletMap & { __regions?: import("leaflet").LayerGroup }) | null;
    const layer = map?.__regions;
    if (!map || !layer) return;
    if (showRegions) layer.addTo(map);
    else map.removeLayer(layer);
  }, [showRegions, atlas, mapTick]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => mapRef.current?.invalidateSize());
    return () => cancelAnimationFrame(frameId);
  }, [panelOpen, mapTick]);

  useEffect(() => {
    if (!mapTick) return;
    const focus = resolveFocusInAtlas(atlas, marker);
    const poi = findFocusPoi(atlas, marker, regionSlug);
    if (!focus || !poi) return;
    const frameId = requestAnimationFrame(() => {
      setEnabled((current) => {
        const next = new Set(essentialsFor(atlas));
        next.add(poi.t);
        if (current.size === next.size && [...next].every((slug) => current.has(slug))) return current;
        return next;
      });
      const groupId = atlas.groups.find((group) => group.categories.includes(focus.categorySlug))?.id;
      if (groupId) {
        setOpenGroups((current) => {
          if (current.has(groupId)) return current;
          const next = new Set(current);
          next.add(groupId);
          return next;
        });
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [atlas, marker, regionSlug, mapTick]);

  useEffect(() => {
    if (!mapTick || !marker) return;
    const poi = findFocusPoi(atlas, marker, regionSlug);
    if (!poi || !enabled.has(poi.t)) return;
    const key = `${atlas.id}:${poi.t}:${poi.x}:${poi.y}:${regionSlug || ""}`;
    if (focusedRef.current === key) return;
    focusedRef.current = key;
    onSelect(poi);
  }, [atlas, enabled, mapTick, marker, onSelect, regionSlug]);

  useEffect(() => {
    if (!regionSlug && !marker) return;
    document.getElementById("atlas")?.scrollIntoView({ block: "start" });
  }, [marker, regionSlug]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const found: MapPoi[] = [];
    for (const poi of atlas.pois) {
      const type = typeBySlug.get(poi.t);
      const haystack = `${atlas.labels[poi.n] || ""} ${type?.label || ""} ${type?.entity?.name || ""} ${poi.entity?.name || ""} ${poi.ar || ""}`.toLowerCase();
      if (!haystack.includes(needle)) continue;
      found.push(poi);
      if (found.length >= 8) break;
    }
    return found;
  }, [atlas, query, typeBySlug]);

  const categoryState = (slug: string) => {
    const category = categoryBySlug.get(slug);
    if (!category) return "none";
    const on = category.types.filter((type) => enabled.has(type.slug)).length;
    return on === 0 ? "none" : on === category.types.length ? "all" : "some";
  };

  const toggleCategory = (slug: string) => {
    const category = categoryBySlug.get(slug);
    if (!category) return;
    const turnOn = categoryState(slug) !== "all";
    setEnabled((current) => {
      const next = new Set(current);
      for (const type of category.types) {
        if (turnOn) next.add(type.slug);
        else next.delete(type.slug);
      }
      return next;
    });
  };

  const applyPreset = (preset: "essentials" | "all" | "none") => {
    if (preset === "none") setEnabled(new Set());
    else if (preset === "all") setEnabled(new Set(atlas.categories.flatMap((category) => category.types.map((type) => type.slug))));
    else setEnabled(essentialsFor(atlas));
  };

  const selectedType = selected ? typeBySlug.get(selected.t) : undefined;
  const selectedProfile = selected?.entity || selectedType?.entity;
  const selectedLabel = selected ? atlas.labels[selected.n] : "";
  const selectedAniimoSlug = selected && (selected.c === "creatures" || selected.c === "aniimo")
    ? token(selectedProfile?.slug || selectedType?.label || selectedLabel)
    : "";
  const selectedAniimo = profiles[selectedAniimoSlug];
  const selectedDesc = selected?.d != null ? atlas.descriptions[selected.d] : selectedAniimo?.description || selectedProfile?.description;
  const selectedIcon = selected ? atlas.icons[selected.ic] || "" : "";
  const selectedArt = selectedAniimo?.image
    ? selectedAniimo.image
    : selectedProfile?.image?.startsWith("/images/")
      ? selectedProfile.image
      : selectedIcon;
  const allTypeCount = atlas.categories.reduce((total, category) => total + category.types.length, 0);
  const activePreset = enabled.size === 0 ? "none" : enabled.size === allTypeCount ? "all" : enabled.size === essentialSlugs.size && [...essentialSlugs].every((slug) => enabled.has(slug)) ? "essentials" : "";
  const toggleGroup = (id: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={`${styles.shell} ${panelOpen ? "" : styles.closed}`} style={{ background: atlas.backdrop }}>
      <aside className={styles.panel}>
        <div className={styles.chrome}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.kicker}>Field atlas</p>
              <h2>{atlas.name}</h2>
              <p className={styles.meta}>{atlas.tagline} · {atlas.total.toLocaleString()} points</p>
            </div>
            <div className={styles.headActions}>
              <button type="button" className={styles.ghost} onClick={() => { applyPreset("essentials"); setDepth("all"); setQuery(""); setSelected(null); setOpenGroups(new Set()); mapRef.current?.fitBounds(frame.contentBounds); }}>Reset</button>
              <button type="button" className={styles.iconBtn} onClick={() => setPanelOpen(false)} aria-label="Hide sidebar"><Icon name="close" /></button>
            </div>
          </div>
          <nav className={styles.atlases} aria-label="Map atlases">
            {atlasIndex.map((entry) => (
              <Link key={entry.id} href={entry.href} title={entry.name} aria-current={entry.id === atlas.id ? "page" : undefined}>
                <img src={entry.thumb} alt="" width={72} height={54} />
                <strong>{ATLAS_SHORT[entry.id] || entry.name}</strong>
              </Link>
            ))}
          </nav>
          <label className={styles.searchWrap}>
            <Icon name="search" />
            <input className={styles.search} name="map-search" autoComplete="off" spellCheck={false} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Aniimo, chests, or landmarks…" aria-label="Search map markers" />
          </label>
          {hits.length > 0 && (
            <div className={styles.hits}>
              {hits.map((poi, index) => (
                <button type="button" key={`${poi.t}-${index}`} onClick={() => { setEnabled((current) => new Set(current).add(poi.t)); onSelect(poi); }}>
                  <img src={atlas.icons[poi.ic]} alt="" width={24} height={24} />
                  <span>{atlas.labels[poi.n]}</span>
                </button>
              ))}
            </div>
          )}
          <div className={styles.controls}>
            <div className={styles.control}>
              <span>Markers</span>
              <div className={styles.seg} aria-label="Marker visibility">
                {([["essentials", "Key"], ["all", "All"], ["none", "Off"]] as const).map(([id, label]) => (
                  <button type="button" key={id} aria-pressed={activePreset === id} onClick={() => applyPreset(id)}>{label}</button>
                ))}
              </div>
            </div>
            {atlas.underground > 0 && (
              <div className={styles.control}>
                <span>Depth</span>
                <div className={styles.seg} role="radiogroup" aria-label="Depth">
                  {([["all", "Both"], ["surface", "Surface"], ["underground", "Cave"]] as const).map(([id, label]) => (
                    <button type="button" key={id} role="radio" aria-checked={depth === id} onClick={() => setDepth(id)}>{label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.scroll}>
          {atlas.groups.map((group) => {
            const categories = group.categories.map((slug) => categoryBySlug.get(slug)).filter((category): category is NonNullable<typeof category> => Boolean(category));
            const open = openGroups.has(group.id);
            const onCount = categories.filter((category) => categoryState(category.slug) !== "none").length;
            return (
              <section key={group.id} className={styles.block}>
                <button type="button" className={styles.groupHead} aria-expanded={open} onClick={() => toggleGroup(group.id)}>
                  <Icon name="chevron" className={open ? styles.chevronOpen : styles.chevron} />
                  <strong>{group.label}</strong>
                  <b>{onCount}/{categories.length}</b>
                </button>
                {open && (
                  <div className={styles.catList}>
                    {categories.map((category) => {
                      const state = categoryState(category.slug);
                      return (
                        <button type="button" key={category.slug} className={`${styles.cat} ${state === "none" ? styles.off : ""}`} aria-pressed={state !== "none"} onClick={() => toggleCategory(category.slug)}>
                          <img src={atlas.icons[category.ic]} alt="" />
                          <strong>{category.label}</strong>
                          <small>{category.count.toLocaleString()}</small>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {atlas.regions.length > 0 && (
            <section className={styles.block}>
              <div className={styles.groupRow}>
                <button type="button" className={styles.groupHead} aria-expanded={openGroups.has("regions")} onClick={() => toggleGroup("regions")}>
                  <Icon name="chevron" className={openGroups.has("regions") ? styles.chevronOpen : styles.chevron} />
                  <strong>Regions</strong>
                  <b>{atlas.regions.length}</b>
                </button>
                <button type="button" className={styles.iconBtn} aria-pressed={showRegions} aria-label={showRegions ? "Hide region outlines" : "Show region outlines"} onClick={() => setShowRegions((value) => !value)}>
                  <Icon name={showRegions ? "eye" : "eyeOff"} />
                </button>
              </div>
              {openGroups.has("regions") && (
                <div className={styles.catList}>
                  {atlas.regions.map((region) => (
                    <button type="button" key={region.slug} className={styles.cat} onClick={() => mapRef.current?.fitBounds(region.poly.map(([x, y]) => frame.toLatLng(x, y)) as [[number, number], [number, number]], { maxZoom: 1.75 })}>
                      <span className={styles.swatch} style={{ background: regionColor(region.lvlMin) }} />
                      <strong>{region.name}</strong>
                      {region.lvlMin != null ? <small>Lv {region.lvlMin}–{region.lvlMax}</small> : null}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
          <p className={styles.credit}>Basemap and markers from AniimoVerse, stored on this site.</p>
        </div>
      </aside>
      <div className={styles.stage}>
        <button type="button" className={styles.toggle} onClick={() => setPanelOpen(true)}>
          <Icon name="list" /> Layers
        </button>
        <div ref={mapEl} />
        {selected && (
          <aside className={styles.card} aria-live="polite" aria-label={`${selectedAniimo?.name || selectedLabel} map details`}>
            <button type="button" className={styles.close} onClick={() => setSelected(null)} aria-label="Close map details"><Icon name="close" /></button>
            {selectedArt ? (
              selectedAniimo ? (
                <Link className={styles.cardArt} href={`/aniimo/${selectedAniimo.slug}`} aria-label={`Open ${selectedAniimo.name}`}>
                  <img src={selectedArt} alt="" width={280} height={196} onError={(event) => { if (selectedIcon) event.currentTarget.src = selectedIcon; }} />
                </Link>
              ) : (
                <div className={styles.cardArt}>
                  <img src={selectedArt} alt="" width={280} height={196} onError={(event) => { if (selectedIcon) event.currentTarget.src = selectedIcon; }} />
                </div>
              )
            ) : null}
            <h2>{selectedAniimo?.name || selectedLabel}</h2>
            {selectedAniimo && (
              <div className={styles.cardTags}>
                {selectedAniimo.elements.map((element) => <span key={element}>{elementMeta[element]?.symbol} {elementMeta[element]?.label || element}</span>)}
                {selectedAniimo.roles.map((role) => <span key={role}>{roleLabels[role] || role}</span>)}
                <span>{selectedAniimo.form} · Stage {selectedAniimo.stage}</span>
              </div>
            )}
            {selectedDesc ? <p>{selectedDesc}</p> : null}
            {selected.ar ? <p>{selected.ar}{selected.tm ? ` · ${payload.vocabulary?.times?.[selected.tm]?.label || selected.tm}` : ""}{selected.ug ? " · Underground" : ""}</p> : null}
            {selectedAniimo?.stats && (
              <div className={styles.cardStats}>
                <span><small>HP</small><strong>{selectedAniimo.stats.hp}</strong></span>
                <span><small>P. ATK</small><strong>{selectedAniimo.stats.physicalAttack}</strong></span>
                <span><small>M. ATK</small><strong>{selectedAniimo.stats.magicAttack}</strong></span>
              </div>
            )}
            {selectedAniimo && (selectedAniimo.skills.length > 0 || selectedAniimo.evolution.length > 1) && (
              <div className={styles.cardRecord}>
                {selectedAniimo.skills.length > 0 && <p><strong>Skills</strong>{selectedAniimo.skills.join(" · ")}</p>}
                {selectedAniimo.evolution.length > 1 && <p><strong>Evolution</strong>{selectedAniimo.evolution.join(" → ")}</p>}
              </div>
            )}
            {selectedAniimo ? <Link className={styles.cardLink} href={`/aniimo/${selectedAniimo.slug}`}>Open full {selectedAniimo.name} profile <Icon name="arrow" /></Link> : null}
          </aside>
        )}
      </div>
    </div>
  );
}
