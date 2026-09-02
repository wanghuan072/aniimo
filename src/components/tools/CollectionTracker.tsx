"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Aniimo } from "@/types/content";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/components/tools.module.css";

export function CollectionTracker({ entries }: { entries: Aniimo[] }) {
  const [owned,setOwned]=useState<Set<string>>(new Set());const[query,setQuery]=useState("");const[mode,setMode]=useState("all");
  useEffect(()=>{const timer=window.setTimeout(()=>setOwned(new Set(JSON.parse(localStorage.getItem("aniimo-collection")||"[]") as string[])),0);return()=>window.clearTimeout(timer);},[]);
  const toggle=(slug:string)=>setOwned((current)=>{const next=new Set(current);if(next.has(slug))next.delete(slug);else next.add(slug);localStorage.setItem("aniimo-collection",JSON.stringify([...next]));return next;});
  const visible=useMemo(()=>entries.filter((entry)=>entry.name.toLowerCase().includes(query.toLowerCase())).filter((entry)=>mode==="all"||(mode==="owned"?owned.has(entry.slug):!owned.has(entry.slug))),[entries,query,mode,owned]);
  return <div className={styles.collectionApp}><div className={styles.collectionTop}><div><strong>{owned.size}</strong><span>of {entries.length} collected</span><div><i style={{width:`${owned.size/entries.length*100}%`}} /></div></div><label><Icon name="search" /><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search collection…" /></label><div>{["all","owned","missing"].map((value)=><button type="button" className={mode===value?styles.modeActive:""} onClick={()=>setMode(value)} key={value}>{value}</button>)}</div></div><div className={styles.collectionGrid}>{visible.map((entry)=><article key={entry.slug} className={owned.has(entry.slug)?styles.ownedCard:""}><button type="button" onClick={()=>toggle(entry.slug)} aria-label={`${owned.has(entry.slug)?"Remove":"Add"} ${entry.name} ${owned.has(entry.slug)?"from":"to"} collection`}><span>{owned.has(entry.slug)?"✓":"＋"}</span></button><div><Image src={entry.image} alt="" fill sizes="130px" /></div><strong>{entry.name}</strong><small>NO. {entry.entryId}</small><Link href={`/aniimo/${entry.slug}`}>Details</Link></article>)}</div>{visible.length===0&&<p className={styles.collectionEmpty}>No collection entries match this view.</p>}</div>;
}
