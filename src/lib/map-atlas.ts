import astraData from "@/data/map/astra.json";
import breezyData from "@/data/map/breezy-plains.json";
import indexData from "@/data/map/index.json";
import lostData from "@/data/map/lost-islets.json";
import whisperData from "@/data/map/whisperwake-isles.json";

export type MapPoi = {
  c: string;
  t: string;
  x: number;
  y: number;
  ic: number;
  n: number;
  d?: number;
  ug?: boolean;
  ar?: string;
  fm?: string;
  tm?: string;
  rs?: string;
  entity?: {
    kind: string;
    slug: string;
    name: string;
    image?: string;
    description?: string;
    categoryLabel?: string;
    metaLabel?: string;
    elements?: string[];
  };
};

export type MapRegion = {
  name: string;
  slug: string;
  lvlMin?: number;
  lvlMax?: number;
  desc?: string;
  poly: number[][];
};

export type MapType = {
  slug: string;
  label: string;
  count: number;
  ic: number;
  ring?: string;
  entity?: MapPoi["entity"];
};

export type MapCategory = {
  slug: string;
  label: string;
  count: number;
  ic: number;
  color?: string;
  group: string;
  types: MapType[];
};

export type MapAtlas = {
  id: string;
  name: string;
  tagline: string;
  backdrop: string;
  blurb: string;
  meta: { tiles: { template: string; cols: number; rows: number; tileSize: number }; width: number; height: number };
  view: number[];
  icons: string[];
  labels: string[];
  descriptions: string[];
  categories: MapCategory[];
  groups: Array<{ id: string; label: string; categories: string[] }>;
  pois: MapPoi[];
  regions: MapRegion[];
  total: number;
  underground: number;
};

export type AtlasIndexEntry = {
  id: string;
  name: string;
  tagline: string;
  total: number;
  href: string;
  thumb: string;
};

type Payload = { atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } };

const files: Record<string, Payload> = {
  "breezy-plains": breezyData as Payload,
  astra: astraData as Payload,
  "whisperwake-isles": whisperData as Payload,
  "lost-islets": lostData as Payload,
};

const essentialCategories = new Set(["bosses", "teleport", "teleports", "temple", "landmark"]);
const essentialTypes = new Set(["gold-chest"]);

export const atlasIndex = (indexData as { index: AtlasIndexEntry[] }).index;

export function getAtlas(id?: string) {
  return files[id || ""] ?? files["breezy-plains"];
}

export function essentialsFor(atlas: MapAtlas) {
  return new Set(atlas.categories.flatMap((category) => category.types.filter((type) => essentialCategories.has(category.slug) || essentialTypes.has(type.slug)).map((type) => type.slug)));
}

export function atlasFrame(atlas: MapAtlas) {
  const width = atlas.meta.width;
  const height = atlas.meta.height;
  const toLatLng = (x: number, y: number): [number, number] => [-y * height, x * width];
  const [west, north, east, south] = atlas.view;
  return {
    width,
    height,
    toLatLng,
    imageBounds: [[-height, 0], [0, width]] as [[number, number], [number, number]],
    maxBounds: [[-(1.3 * height), -(0.5 * width)], [0.3 * height, 1.3 * width]] as [[number, number], [number, number]],
    contentBounds: [toLatLng(west, north), toLatLng(east, south)] as [[number, number], [number, number]],
  };
}

export function regionColor(min?: number) {
  if (min == null) return "#7eb8d8";
  const t = Math.min(1, Math.max(0, (min - 5) / 45));
  return `hsl(${205 - t * 95} 52% 48%)`;
}

function token(value: string) {
  return value.replace(/[.]$/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type MapFocus = {
  atlasId: string;
  typeSlug: string;
  categorySlug: string;
};

const regionIndex = new Map<string, { atlasId: string; slug: string }>();
const typeIndex = new Map<string, MapFocus[]>();

function addTypeHit(key: string | undefined, hit: MapFocus) {
  if (!key) return;
  const list = typeIndex.get(key) || [];
  if (!list.some((entry) => entry.atlasId === hit.atlasId && entry.typeSlug === hit.typeSlug)) {
    list.push(hit);
    typeIndex.set(key, list);
  }
}

for (const [atlasId, payload] of Object.entries(files)) {
  for (const region of payload.atlas.regions) {
    const hit = { atlasId, slug: region.slug };
    regionIndex.set(region.slug, hit);
    regionIndex.set(token(region.name), hit);
  }
  for (const category of payload.atlas.categories) {
    for (const type of category.types) {
      const hit = { atlasId, typeSlug: type.slug, categorySlug: category.slug };
      addTypeHit(type.slug, hit);
      addTypeHit(token(type.slug), hit);
      addTypeHit(type.entity?.slug, hit);
      addTypeHit(token(type.entity?.slug || ""), hit);
    }
  }
  for (const poi of payload.atlas.pois) {
    if (!poi.entity?.slug) continue;
    const hit = { atlasId, typeSlug: poi.t, categorySlug: poi.c };
    addTypeHit(poi.entity.slug, hit);
    addTypeHit(token(poi.entity.slug), hit);
  }
}

export function resolveMapFocus(query?: string, atlasHint?: string): MapFocus | undefined {
  if (!query) return undefined;
  const list = typeIndex.get(query) || typeIndex.get(token(query));
  if (!list?.length) return undefined;
  if (atlasHint) return list.find((entry) => entry.atlasId === atlasHint) || list[0];
  return list[0];
}

export function resolveMapRegion(query?: string): { atlasId: string; slug: string } | undefined {
  if (!query) return undefined;
  return regionIndex.get(query) || regionIndex.get(token(query));
}

export function mapHref(input: { marker?: string; region?: string }) {
  const regionHit = resolveMapRegion(input.region);
  const typeHit = resolveMapFocus(input.marker, regionHit?.atlasId) || resolveMapFocus(input.marker);
  const legacyRegion = !typeHit ? resolveMapRegion(input.marker) : undefined;
  const region = regionHit || legacyRegion;
  const params = new URLSearchParams();
  const atlasId = typeHit?.atlasId || region?.atlasId;
  if (atlasId && atlasId !== "breezy-plains") params.set("atlas", atlasId);
  if (typeHit && input.marker) params.set("marker", input.marker);
  if (region) params.set("region", region.slug);
  const query = params.toString();
  return query ? `/map?${query}#atlas` : "/map";
}

export function areaMatches(area: string | undefined, regionName: string) {
  if (!area) return false;
  const left = area.toLowerCase().split("/")[0]?.trim() || "";
  const right = regionName.toLowerCase();
  return left === right || left.startsWith(right) || right.startsWith(left);
}

export function findFocusPoi(atlas: MapAtlas, marker?: string, regionSlug?: string) {
  if (!marker) return undefined;
  const focus = resolveMapFocus(marker, atlas.id);
  const region = atlas.regions.find((entry) => entry.slug === regionSlug || entry.name === regionSlug);
  const needle = token(marker);
  const named = (poi: MapPoi) => poi.entity?.slug === marker || token(poi.entity?.slug || "") === needle;
  let list = atlas.pois.filter((poi) => named(poi) || poi.t === marker || token(poi.t) === needle || poi.t === focus?.typeSlug);
  if (focus) {
    const typed = list.filter((poi) => poi.t === focus.typeSlug);
    if (typed.length) list = typed;
  }
  const exact = list.filter(named);
  if (exact.length) list = exact;
  if (region) {
    const inArea = list.filter((poi) => areaMatches(poi.ar, region.name));
    if (inArea.length) list = inArea;
  }
  return list[0];
}
