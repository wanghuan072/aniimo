"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { Brand } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import type { SearchRecord } from "@/types/content";
import styles from "@/style/components/layout.module.css";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchRecords, setSearchRecords] = useState<SearchRecord[] | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const records = searchRecords || [];
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return records.slice(0, 8);
    return records
      .filter((record) => `${record.title} ${record.subtitle} ${record.type}`.toLowerCase().includes(needle))
      .slice(0, 10);
  }, [query, records]);

  useEffect(() => {
    if (!searchOpen || searchRecords) return;
    import("@/lib/search-index").then((mod) => setSearchRecords(mod.searchRecords));
  }, [searchOpen, searchRecords]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && !searchOpen) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") { setSearchOpen(false); setOpenMenu(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);
  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => { if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null); };
    window.addEventListener("pointerdown", closeOnOutside);
    return () => window.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Brand compact />
          <nav className={styles.desktopNav} aria-label="Primary navigation" ref={navRef}>
            {navigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <div className={styles.navItem} key={item.label} onMouseEnter={() => item.children && setOpenMenu(item.label)} onMouseLeave={() => setOpenMenu(null)} onFocus={() => item.children && setOpenMenu(item.label)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenMenu(null); }}>
                  <Link href={item.href} className={active ? styles.active : ""} aria-expanded={item.children ? openMenu === item.label : undefined}>
                    {item.label}{item.children && <Icon name="chevron" />}
                  </Link>
                  {item.children && (
                    <div className={`${styles.dropdown} ${openMenu === item.label ? styles.dropdownOpen : ""} ${item.children.length > 6 ? styles.megaDropdown : ""}`}>
                      {item.children.map((child) => <Link key={child.href} href={child.href}>{child.label}<Icon name="arrow" /></Link>)}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className={styles.headerActions}>
            <button className={styles.searchButton} type="button" onClick={() => setSearchOpen(true)}><Icon name="search" /><span>Search</span><kbd>/</kbd></button>
            <button className={styles.menuButton} type="button" aria-expanded={mobileOpen} aria-label="Toggle navigation" onClick={() => setMobileOpen((value) => !value)}><Icon name={mobileOpen ? "close" : "menu"} /></button>
          </div>
        </div>
        {mobileOpen && (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {navigation.map((item) => <div className={styles.mobileGroup} key={item.label}><Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}<Icon name="arrow" /></Link>{item.children && <div>{item.children.map((child) => <Link href={child.href} key={child.href} onClick={() => setMobileOpen(false)}>{child.label}</Link>)}</div>}</div>)}
          </nav>
        )}
      </header>
      {searchOpen && (
        <div className={styles.searchOverlay} role="dialog" aria-modal="true" aria-label="Site search" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <div className={styles.searchPanel}>
            <div className={styles.searchInputWrap}><Icon name="search" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Aniimo, skills, items or habitats…" aria-label="Search" /><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close" /></button></div>
            <div className={styles.searchCaption}><span>{query ? `${results.length} best matches` : "Popular destinations"}</span><span>Press Esc to close</span></div>
            <div className={styles.searchResults}>
              {!searchRecords && <p className={styles.emptySearch}>Loading search…</p>}
              {searchRecords && results.map((record) => (
                <Link href={record.href} key={`${record.type}-${record.href}-${record.title}`} onClick={() => setSearchOpen(false)}>
                  {record.image ? <span className={styles.searchThumb}><Image src={record.image} alt="" fill sizes="48px" /></span> : <span className={styles.searchThumbFallback}><Icon name="book" /></span>}
                  <span><strong>{record.title}</strong><small>{record.subtitle}</small></span><em>{record.type}</em>
                </Link>
              ))}
              {searchRecords && results.length === 0 && <p className={styles.emptySearch}>No match yet. Try a creature, skill, item or habitat name.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
