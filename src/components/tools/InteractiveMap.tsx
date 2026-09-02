"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { MapLocation } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/components/tools.module.css";

const markerSymbols: Record<string,string> = { "Official habitat":"✦" };

export function InteractiveMap({ locations }: { locations: MapLocation[] }) {
  const allCategories = [...new Set(locations.map((location) => location.category))];
  const [active, setActive] = useState(() => new Set(allCategories));
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [query, setQuery] = useState("");
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem("aniimo-map-collected") || "[]") as string[];
      setCollected(new Set(stored));
      const marker = new URL(window.location.href).searchParams.get("marker");
      if (marker) setSelected(locations.find((location) => location.id === marker) || null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locations]);
  const visible = useMemo(() => { const needle=query.trim().toLowerCase(); return locations.filter((location)=>active.has(location.category)&&(!needle||`${location.name} ${location.region} ${location.category}`.toLowerCase().includes(needle))); },[locations,active,query]);
  const toggleCategory=(category:string)=>setActive((current)=>{const next=new Set(current);if(next.has(category))next.delete(category);else next.add(category);return next;});
  const choose=(location:MapLocation)=>{setSelected(location);const url=new URL(window.location.href);url.searchParams.set("marker",location.id);window.history.replaceState({},"",url);};
  const toggleCollected=(id:string)=>setCollected((current)=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);localStorage.setItem("aniimo-map-collected",JSON.stringify([...next]));return next;});
  const share=async()=>{const url=new URL(window.location.href);if(selected)url.searchParams.set("marker",selected.id);await navigator.clipboard.writeText(url.toString());setToast("Share link copied");window.setTimeout(()=>setToast(""),1800);};
  return <div className={styles.mapApp}>
    <aside className={styles.mapSidebar}><div className={styles.mapSearch}><Icon name="search" /><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search official habitat…" /></div><div className={styles.mapSummary}><strong>{visible.length}</strong><span>official habitat labels</span><b>{collected.size} checked</b></div><div className={styles.layerHeader}><h2>Map layers</h2><button type="button" onClick={()=>setActive(active.size?new Set():new Set(allCategories))}>{active.size?"Hide all":"Show all"}</button></div><div className={styles.layerList}>{allCategories.map((category)=><button type="button" key={category} className={active.has(category)?styles.layerActive:""} onClick={()=>toggleCategory(category)}><span>{markerSymbols[category]}</span><strong>{category}</strong><b>{locations.filter((location)=>location.category===category).length}</b></button>)}</div><div className={styles.mapDisclosure}><strong>Map data policy</strong><p>Names and Aniimo associations come from official records. Pins are schematic region anchors, not exact spawn coordinates.</p></div></aside>
    <div className={styles.mapCanvas}><Image src="/images/maps/ilya-world-map.png" alt="Original illustrated island used as an interactive planning map" fill priority sizes="(max-width: 900px) 100vw, 1000px" />{visible.map((location)=><button type="button" key={location.id} className={`${styles.marker} ${selected?.id===location.id?styles.markerSelected:""} ${collected.has(location.id)?styles.markerCollected:""}`} style={{left:`${location.x}%`,top:`${location.y}%`}} onClick={()=>choose(location)} aria-label={`${location.name}, ${location.category}`}><span>{collected.has(location.id)?"✓":markerSymbols[location.category]||"•"}</span></button>)}<div className={styles.mapTopbar}><span><Icon name="map" /> Ilya planning map</span><button type="button" onClick={share}><Icon name="share" /> Share view</button></div>{selected&&<aside className={styles.markerPanel}><button type="button" className={styles.panelClose} onClick={()=>setSelected(null)} aria-label="Close"><Icon name="close" /></button><span className={styles.markerType}>{markerSymbols[selected.category]} {selected.category}</span><h2>{selected.name}</h2><p className={styles.markerRegion}><Icon name="pin" /> {selected.region}</p><p>{selected.description}</p><button type="button" className={collected.has(selected.id)?styles.collectedButton:styles.collectButton} onClick={()=>toggleCollected(selected.id)}><Icon name="check" /> {collected.has(selected.id)?"Collected — undo":"Mark collected"}</button></aside>}{toast&&<div className={styles.toast}>{toast}</div>}</div>
  </div>;
}
