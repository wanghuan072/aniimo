import indexData from "@/data/map/index.json";
import type { AtlasIndexEntry, MapAtlas, MapFocus, MapPoi } from "@/lib/map-types";

const essentialCategories = new Set(["bosses", "teleport", "teleports", "temple", "landmark"]);
const essentialTypes = new Set(["gold-chest"]);

export const atlasIndex = (indexData as { index: AtlasIndexEntry[] }).index;

export function token(value: string) {
  return value.replace(/[.]$/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  return `hsl(${205 - t * 95} 52% ${48}%)`;
}

export function areaMatches(area: string | undefined, regionName: string) {
  if (!area) return false;
  const left = area.toLowerCase().split("/")[0]?.trim() || "";
  const right = regionName.toLowerCase();
  return left === right || left.startsWith(right) || right.startsWith(left);
}

export function resolveFocusInAtlas(atlas: MapAtlas, query?: string): MapFocus | undefined {
  if (!query) return undefined;
  const needle = token(query);
  for (const category of atlas.categories) {
    for (const type of category.types) {
      if (type.slug === query || token(type.slug) === needle || type.entity?.slug === query || token(type.entity?.slug || "") === needle) {
        return { atlasId: atlas.id, typeSlug: type.slug, categorySlug: category.slug };
      }
    }
  }
  for (const poi of atlas.pois) {
    if (!poi.entity?.slug) continue;
    if (poi.entity.slug === query || token(poi.entity.slug) === needle) {
      return { atlasId: atlas.id, typeSlug: poi.t, categorySlug: poi.c };
    }
  }
  return undefined;
}

export function findFocusPoi(atlas: MapAtlas, marker?: string, regionSlug?: string) {
  if (!marker) return undefined;
  const focus = resolveFocusInAtlas(atlas, marker);
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

export const atlasLoaders: Record<string, () => Promise<{ atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } }>> = {
  "breezy-plains": () => import("@/data/map/breezy-plains.json").then((mod) => (mod.default ?? mod) as { atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } }),
  astra: () => import("@/data/map/astra.json").then((mod) => (mod.default ?? mod) as { atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } }),
  "whisperwake-isles": () => import("@/data/map/whisperwake-isles.json").then((mod) => (mod.default ?? mod) as { atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } }),
  "lost-islets": () => import("@/data/map/lost-islets.json").then((mod) => (mod.default ?? mod) as { atlas: MapAtlas; vocabulary?: { times?: Record<string, { label: string }> } }),
};
