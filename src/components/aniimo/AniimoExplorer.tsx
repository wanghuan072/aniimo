"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AniimoCard, type AniimoCardEntry } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import { elementMeta, roleLabels } from "@/config/site";
import styles from "@/style/components/explorer.module.css";

const stageOptions = [
  { value: "all", label: "All", symbol: "✦" },
  { value: "1", label: "Lumin", symbol: "●" },
  { value: "2", label: "Gamma", symbol: "◆" },
  { value: "3", label: "Nova", symbol: "✹" },
  { value: "0", label: "Special", symbol: "◇" },
];

const roleSymbols: Record<string, string> = {
  dps: "⚔",
  heal: "✚",
  sup: "♥",
  break: "✊",
  regen: "◉",
  energy: "ϟ",
};

const sortOptions = [
  { value: "number", label: "Official No." },
  { value: "name", label: "A–Z" },
  { value: "views", label: "Most Viewed" },
];

export function AniimoExplorer({ entries }: { entries: AniimoCardEntry[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const element = searchParams.get("element") || "all";
  const role = searchParams.get("role") || "all";
  const stage = searchParams.get("stage") || "all";
  const sort = searchParams.get("sort") || "number";
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const batchSize = 100;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const autoLoadLocked = useRef(false);

  const preferredElements = ["holy", "fire", "ice", "dark", "electric", "grass", "water", "rock", "wind"];
  const elements = preferredElements.filter((value) => entries.some((entry) => entry.elements.includes(value)));
  const roles = [...new Set(entries.flatMap((entry) => entry.roles))].sort();

  const updateFilters = (patch: Record<string, string>) => {
    setVisibleCount(batchSize);
    autoLoadLocked.current = false;
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "number") || (key === "view" && value === "grid")) params.delete(key);
      else params.set(key, value);
    });
    const next = params.toString();
    window.history.replaceState(null, "", next ? `/aniimo?${next}` : "/aniimo");
  };

  const countBy = (type: "element" | "role" | "stage", value: string) => entries.filter((entry) => {
    if (type === "element") return entry.elements.includes(value);
    if (type === "role") return entry.roles.includes(value);
    return entry.stage === Number(value);
  }).length;

  const needle = query.trim().toLowerCase();
  const filtered = entries
    .filter((entry) => !needle || `${entry.name} ${entry.description} ${entry.elements.join(" ")} ${entry.roles.join(" ")}`.toLowerCase().includes(needle))
    .filter((entry) => element === "all" || entry.elements.includes(element))
    .filter((entry) => role === "all" || entry.roles.includes(role))
    .filter((entry) => stage === "all" || entry.stage === Number(stage))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "views") return (b.viewCount || 0) - (a.viewCount || 0);
      return a.entryId.localeCompare(b.entryId);
    });

  const hasMore = visibleCount < filtered.length;
  const loadMore = useCallback(() => setVisibleCount((current) => Math.min(current + batchSize, filtered.length)), [filtered.length]);

  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      const root = document.documentElement;
      const atEnd = root.scrollTop + window.innerHeight >= root.scrollHeight - 280;
      if (!atEnd) {
        autoLoadLocked.current = false;
      } else if (!autoLoadLocked.current) {
        autoLoadLocked.current = true;
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loadMore]);

  const reset = () => updateFilters({ q: "", element: "all", role: "all", stage: "all", sort: "number" });

  return (
    <div className={styles.explorer}>
      <section className={styles.filterDeck} aria-label="Filter Aniimo">
        <div className={styles.filterTopline}>
          <label className={styles.searchField}>
            <span className="sr-only">Search Aniimo</span>
            <Icon name="search" />
            <input
              type="search"
              name="aniimo-search"
              value={query}
              onChange={(event) => updateFilters({ q: event.target.value })}
              placeholder="Search Aniimo…"
              autoComplete="off"
            />
          </label>
          <div className={styles.sortGroup} aria-label="Sort Aniimo">
            <span>Sort</span>
            {sortOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                aria-pressed={sort === option.value}
                className={sort === option.value ? styles.sortActive : ""}
                onClick={() => updateFilters({ sort: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterRows}>
          <fieldset className={styles.filterGroup}>
            <legend>Elements</legend>
            <div>
              <button type="button" aria-pressed={element === "all"} className={element === "all" ? styles.chipActive : ""} onClick={() => updateFilters({ element: "all" })}>
                <i className={styles.allIcon} aria-hidden>✦</i><span>All</span><small>{entries.length}</small>
              </button>
              {elements.map((value) => {
                const meta = elementMeta[value];
                return (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={element === value}
                    className={element === value ? styles.chipActive : ""}
                    style={{ "--chip-color": meta?.color || "#4d83d9" } as React.CSSProperties}
                    onClick={() => updateFilters({ element: value })}
                  >
                    <i aria-hidden>{meta?.symbol || "✦"}</i><span>{meta?.label || value}</span><small>{countBy("element", value)}</small>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className={styles.filterGroup}>
            <legend>Roles</legend>
            <div>
              <button type="button" aria-pressed={role === "all"} className={role === "all" ? styles.chipActive : ""} onClick={() => updateFilters({ role: "all" })}>
                <i className={styles.roleIcon} aria-hidden>✦</i><span>All</span><small>{entries.length}</small>
              </button>
              {roles.map((value) => (
                <button type="button" key={value} aria-pressed={role === value} className={role === value ? styles.chipActive : ""} onClick={() => updateFilters({ role: value })}>
                  <i className={styles.roleIcon} aria-hidden>{roleSymbols[value] || "◆"}</i><span>{roleLabels[value] || value}</span><small>{countBy("role", value)}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.filterGroup}>
            <legend>Stage</legend>
            <div>
              {stageOptions.map((option) => (
                <button type="button" key={option.value} aria-pressed={stage === option.value} className={stage === option.value ? styles.chipActive : ""} onClick={() => updateFilters({ stage: option.value })}>
                  <i className={styles.stageIcon} aria-hidden>{option.symbol}</i><span>{option.label}</span><small>{option.value === "all" ? entries.length : countBy("stage", option.value)}</small>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <div className={styles.results}>
        <div className={styles.resultsTop}>
          <div>
            <span className={styles.resultCount}>{filtered.length}</span>
            <p><strong>Matching Aniimo</strong><small>More records load as you scroll</small></p>
          </div>
          <div className={styles.resultActions}>
            {(query || element !== "all" || role !== "all" || stage !== "all" || sort !== "number") && <button type="button" className={styles.resetButton} onClick={reset}>Reset Filters</button>}
            <button type="button" className={view === "grid" ? styles.viewActive : ""} onClick={() => updateFilters({ view: "grid" })} aria-label="Grid view" aria-pressed={view === "grid"}><Icon name="grid" /></button>
            <button type="button" className={view === "list" ? styles.viewActive : ""} onClick={() => updateFilters({ view: "list" })} aria-label="List view" aria-pressed={view === "list"}><Icon name="list" /></button>
          </div>
        </div>
        {filtered.length ? (
          <div className={view === "grid" ? styles.cardGrid : styles.cardList}>
            {filtered.slice(0, visibleCount).map((entry) => <AniimoCard key={entry.slug} entry={entry} list={view === "list"} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <Icon name="search" />
            <h2>No Aniimo Matched</h2>
            <p>Clear a filter or search by another name, element, or role.</p>
            <button type="button" className="button-primary" onClick={reset}>Reset Filters</button>
          </div>
        )}
        {filtered.length > 0 && <div className={styles.loadMore} aria-live="polite"><span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} Aniimo</span>{hasMore && <button type="button" onClick={loadMore}>Load more <Icon name="arrow" /></button>}</div>}
      </div>
    </div>
  );
}
