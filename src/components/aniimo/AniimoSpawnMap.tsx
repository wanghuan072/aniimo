"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { Icon } from "@/components/ui/Icon";
import { regionColor } from "@/lib/map-runtime";
import type { AniimoSpawnArea, AniimoSpawnAtlas } from "@/lib/map-types";
import detail from "@/style/page/detail.module.css";
import styles from "@/style/components/spawn-map.module.css";
import "leaflet/dist/leaflet.css";

const timeLabel = (value: string) => value === "day" ? "Day" : value === "night" ? "Night" : value;

function withTime(atlas: AniimoSpawnAtlas, time: string | null): AniimoSpawnAtlas {
  if (!time) return atlas;
  const points = atlas.points.filter((point) => !point.time || point.time === time);
  const areaMap = new Map<string, AniimoSpawnArea>();
  for (const point of points) {
    const area = areaMap.get(point.area) || { name: point.area, count: 0, forms: [], times: [] };
    area.count += 1;
    if (point.form && !area.forms.includes(point.form)) area.forms.push(point.form);
    if (point.time && !area.times.includes(point.time)) area.times.push(point.time);
    areaMap.set(point.area, area);
  }
  const areas = [...areaMap.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
  return { ...atlas, count: points.length, points, areas };
}

function spawnFrame(atlas: AniimoSpawnAtlas) {
  const width = atlas.width;
  const height = atlas.height;
  const toLatLng = (x: number, y: number): [number, number] => [-y * height, x * width];
  const [west, north, east, south] = atlas.view;
  return {
    toLatLng,
    imageBounds: [[-height, 0], [0, width]] as [[number, number], [number, number]],
    maxBounds: [[-(1.3 * height), -(0.5 * width)], [0.3 * height, 1.3 * width]] as [[number, number], [number, number]],
    contentBounds: [toLatLng(west, north), toLatLng(east, south)] as [[number, number], [number, number]],
  };
}

export function AniimoSpawnMap({ name, atlases }: { name: string; atlases: AniimoSpawnAtlas[] }) {
  const [atlasId, setAtlasId] = useState(atlases[0]?.atlasId || "");
  const [area, setArea] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const times = useMemo(() => {
    const found = new Set<string>();
    for (const atlas of atlases) {
      for (const point of atlas.points) {
        if (point.time) found.add(point.time);
      }
    }
    return [...found].sort();
  }, [atlases]);
  const filtered = useMemo(() => atlases.map((atlas) => withTime(atlas, time)), [atlases, time]);
  const visible = filtered.filter((atlas) => atlas.count > 0);
  const atlas = visible.find((entry) => entry.atlasId === atlasId) || visible[0] || filtered[0];
  const total = (visible.length ? visible : filtered).reduce((sum, entry) => sum + entry.count, 0);
  if (!atlas) return null;
  const mapTabs = visible.length ? visible : filtered;

  return (
    <section id="locations" className={detail.spawnSection} aria-label={`${name} field locations`}>
      <header>
        <div>
          <span className={detail.sectionEyebrow}>Field locations</span>
          <h2>Where {name} Appears</h2>
        </div>
        <p>{total} published spawn{total === 1 ? "" : "s"}{time ? ` at ${timeLabel(time).toLowerCase()}` : ""} across {mapTabs.length === 1 ? atlas.atlasName : `${mapTabs.length} maps`}. Pins mark wild encounters; outlines are the named areas they sit in.</p>
      </header>
      {(mapTabs.length > 1 || times.length > 0) && (
        <div className={detail.spawnFilters}>
          {mapTabs.length > 1 && (
            <nav className={detail.spawnAtlases} aria-label="Spawn maps">
              {mapTabs.map((entry) => (
                <button
                  type="button"
                  key={entry.atlasId}
                  aria-pressed={entry.atlasId === atlas.atlasId}
                  onClick={() => { setAtlasId(entry.atlasId); setArea(null); }}
                >
                  {entry.atlasName}<small>{entry.count}</small>
                </button>
              ))}
            </nav>
          )}
          {times.length > 0 && (
            <nav className={detail.spawnAtlases} aria-label="Time of day">
              <button type="button" aria-pressed={time === null} onClick={() => { setTime(null); setArea(null); }}>All hours</button>
              {times.map((value) => (
                <button type="button" key={value} aria-pressed={time === value} onClick={() => { setTime(value); setArea(null); }}>
                  {timeLabel(value)}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}
      <div className={detail.spawnLayout}>
        {atlas.count > 0 ? (
          <SpawnStage key={`${atlas.atlasId}-${time || "all"}`} atlas={atlas} area={area} />
        ) : (
          <p className={detail.habitatNote}>No published pins for this hour.</p>
        )}
        <aside className={detail.spawnAreas}>
          <p>{atlas.atlasName} · {atlas.count} pin{atlas.count === 1 ? "" : "s"} · {atlas.areas.length} area{atlas.areas.length === 1 ? "" : "s"}</p>
          <ul>
            {atlas.areas.map((entry) => (
              <li key={entry.name}>
                <button type="button" aria-pressed={area === entry.name} onClick={() => setArea((current) => current === entry.name ? null : entry.name)}>
                  <strong>{entry.name.replace(/ \/ /g, " · ")}</strong>
                  <span>{entry.count}</span>
                  {(entry.forms.length > 0 || entry.times.length > 0) && (
                    <small>{[...entry.forms, ...entry.times.map(timeLabel)].join(" · ")}</small>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <Link href={atlas.href}>Open {atlas.atlasName} atlas <Icon name="arrow" /></Link>
        </aside>
      </div>
    </section>
  );
}

function SpawnStage({ atlas, area }: { atlas: AniimoSpawnAtlas; area: string | null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={styles.stage} style={{ background: atlas.backdrop }}>
      {ready ? <SpawnLeaflet atlas={atlas} area={area} /> : null}
    </div>
  );
}

function SpawnLeaflet({ atlas, area }: { atlas: AniimoSpawnAtlas; area: string | null }) {
  const frame = useMemo(() => spawnFrame(atlas), [atlas]);
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const fitRef = useRef<(areaName: string | null) => void>(() => undefined);
  const areaRef = useRef(area);
  areaRef.current = area;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const el = document.createElement("div");
    el.style.width = "100%";
    el.style.height = "100%";
    host.replaceChildren(el);

    let cancelled = false;
    let destroyed = false;
    let map: LeafletMap | undefined;
    let sizeTimer = 0;
    const discard = () => {
      if (destroyed) return;
      destroyed = true;
      mapRef.current = null;
      fitRef.current = () => undefined;
      if (map) {
        try {
          map.remove();
        } catch {
          /* Leaflet may already have detached the pane tree. */
        }
        map = undefined;
      }
      el.remove();
    };

    void (async () => {
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
      if (cancelled) {
        try {
          map.remove();
        } catch {
          /* Leaflet may already have detached the pane tree. */
        }
        map = undefined;
        return;
      }
      mapRef.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer(atlas.tiles.template, {
        tileSize: atlas.tiles.tileSize,
        minZoom: -3,
        maxZoom: 5,
        minNativeZoom: 0,
        maxNativeZoom: 0,
        bounds: frame.imageBounds,
        noWrap: true,
      }).addTo(map);
      for (const region of atlas.regions) {
        if (!region.poly.length) continue;
        const color = regionColor(region.lvlMin);
        L.polygon(region.poly.map(([x, y]) => frame.toLatLng(x, y)), { color, weight: 1.5, fillColor: color, fillOpacity: 0.1 })
          .bindTooltip(region.lvlMin != null ? `${region.name} · Lv ${region.lvlMin}–${region.lvlMax}` : region.name)
          .addTo(map);
      }
      const group = L.markerClusterGroup({
        chunkedLoading: true,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: (zoom) => (zoom >= 3 ? 1 : 36),
        iconCreateFunction: (cluster) => L.divIcon({ html: `<span class="spawn-cluster">${cluster.getChildCount()}</span>`, className: "", iconSize: [32, 32] }),
      });
      const icon = L.divIcon({
        className: "",
        html: `<span class="spawn-pin">${atlas.icon ? `<img src="${atlas.icon}" alt="" width="26" height="26">` : ""}</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      for (const point of atlas.points) {
        const marker = L.marker(frame.toLatLng(point.x, point.y), { icon, title: point.area, keyboard: true });
        const bits = [point.area.replace(/ \/ /g, " · "), point.form, point.time ? timeLabel(point.time) : "", point.underground ? "Underground" : ""].filter(Boolean);
        marker.bindTooltip(bits.join(" · "), { direction: "top", offset: [0, -12] });
        group.addLayer(marker);
      }
      group.addTo(map);
      const fit = (areaName: string | null) => {
        const current = mapRef.current;
        const points = areaName ? atlas.points.filter((point) => point.area === areaName) : atlas.points;
        if (!current || !points.length) return;
        const bounds = L.latLngBounds(points.map((point) => frame.toLatLng(point.x, point.y)));
        if (bounds.isValid()) current.fitBounds(bounds.pad(areaName ? 0.22 : 0.18), { maxZoom: areaName ? 3.25 : 2.25, padding: [18, 18] });
      };
      fitRef.current = fit;
      fit(areaRef.current);
      requestAnimationFrame(() => mapRef.current?.invalidateSize());
      sizeTimer = window.setTimeout(() => mapRef.current?.invalidateSize(), 250);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(sizeTimer);
      discard();
    };
  }, [atlas, frame]);

  useEffect(() => {
    fitRef.current(area);
  }, [area]);

  return <div ref={hostRef} />;
}
