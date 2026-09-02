import type { SVGProps } from "react";

type IconName =
  | "search"
  | "chevron"
  | "spark"
  | "water"
  | "trait"
  | "item"
  | "boss"
  | "database"
  | "map"
  | "team"
  | "book"
  | "tools"
  | "arrow"
  | "grid"
  | "list"
  | "filter"
  | "check"
  | "close"
  | "menu"
  | "pin"
  | "share"
  | "external"
  | "eye"
  | "eyeOff";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    spark: <><path d="M12 2 10 9l-7 3 7 2 2 8 2-8 7-2-7-3-2-7Z" /><path d="m19 3-.6 2.2L16 6l2.4.8L19 9l.7-2.2L22 6l-2.3-.8L19 3Z" /></>,
    water: <><path d="M12 2S5.5 9.2 5.5 14a6.5 6.5 0 0 0 13 0C18.5 9.2 12 2 12 2Z" /><path d="M9 15.2a3.3 3.3 0 0 0 3.2 2.3" /></>,
    trait: <><path d="M12 3 14.6 9.4 21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" /><path d="m19 3 .7 1.8L22 5.5l-2.3.7L19 8l-.7-1.8-2.3-.7 2.3-.7L19 3Z" /></>,
    item: <><path d="M9 3h6" /><path d="M10 3v6l-4.8 8.2A2.5 2.5 0 0 0 7.4 21h9.2a2.5 2.5 0 0 0 2.2-3.8L14 9V3" /><path d="M7.7 15h8.6" /></>,
    boss: <><path d="m6 8-2-4 5 2M18 8l2-4-5 2" /><path d="M5 11c0-4 3-6 7-6s7 2 7 6v4c0 3.3-3 6-7 6s-7-2.7-7-6v-4Z" /><path d="M9 13h.01M15 13h.01M9 17c2 1 4 1 6 0" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z" /><path d="M8 3v15M16 6v15" /></>,
    team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" /><path d="M15 14c3 0 5 1.8 5.5 5" /></>,
    book: <><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z" /><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4V4Z" /></>,
    tools: <><path d="m14 6 4-4 4 4-4 4" /><path d="m17 7-7 7" /><path d="m3 12 9 9" /><path d="m3 16 4-4" /></>,
    arrow: <><path d="M5 12h14" /><path d="m15 8 4 4-4 4" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
    filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    pin: <><path d="M12 22s7-6.3 7-13A7 7 0 0 0 5 9c0 6.7 7 13 7 13Z" /><circle cx="12" cy="9" r="2.4" /></>,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    eye: <><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></>,
    eyeOff: <><path d="M6.5 6.5 17.5 17.5" /><path d="M9.2 9.1A3.2 3.2 0 0 0 12 15.2" /><path d="M4.2 8.4C2.7 10 2.5 12 2.5 12S6 18 12 18c1.4 0 2.7-.3 3.8-.8" /><path d="M10.2 6.2C10.8 6.1 11.4 6 12 6c6 0 9.5 6 9.5 6a12 12 0 0 1-2.2 2.7" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}
