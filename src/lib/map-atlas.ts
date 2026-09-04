import astraData from "@/data/map/astra.json";
import breezyData from "@/data/map/breezy-plains.json";
import lostData from "@/data/map/lost-islets.json";
import whisperData from "@/data/map/whisperwake-isles.json";
import { areaMatches, token } from "@/lib/map-runtime";
import type { AniimoSpawnAtlas, AniimoSpawnArea, AtlasFile, MapFocus } from "@/lib/map-types";

export type { AniimoSpawnArea, AniimoSpawnAtlas, AniimoSpawnPoint, AniimoSpawnRegion, AtlasFile, AtlasIndexEntry, MapAtlas, MapCategory, MapFocus, MapPoi, MapRegion, MapType } from "@/lib/map-types";
export { areaMatches, atlasFrame, atlasIndex, essentialsFor, findFocusPoi, regionColor } from "@/lib/map-runtime";

const files: Record<string, AtlasFile> = {
  "breezy-plains": breezyData as AtlasFile,
  astra: astraData as AtlasFile,
  "whisperwake-isles": whisperData as AtlasFile,
  "lost-islets": lostData as AtlasFile,
};

export function getAtlas(id?: string) {
  return files[id || ""] ?? files["breezy-plains"];
}

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

export function mapHref(input: { marker?: string; region?: string; atlas?: string }) {
  const regionHit = resolveMapRegion(input.region);
  const typeHit = resolveMapFocus(input.marker, input.atlas || regionHit?.atlasId) || resolveMapFocus(input.marker);
  const legacyRegion = !typeHit ? resolveMapRegion(input.marker) : undefined;
  const region = regionHit || legacyRegion;
  const params = new URLSearchParams();
  const atlasId = input.atlas || typeHit?.atlasId || region?.atlasId;
  if (atlasId && atlasId !== "breezy-plains") params.set("atlas", atlasId);
  if (typeHit && input.marker) params.set("marker", input.marker);
  if (region) params.set("region", region.slug);
  const query = params.toString();
  return query ? `/map?${query}#atlas` : "/map";
}

function entitySlug(entity: unknown) {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  if (typeof entity === "object" && "slug" in entity && typeof entity.slug === "string") return entity.slug;
  return "";
}

export function getAniimoSpawns(slug: string): AniimoSpawnAtlas[] {
  const needle = token(slug);
  const atlases: AniimoSpawnAtlas[] = [];
  for (const payload of Object.values(files)) {
    const atlas = payload.atlas;
    const type = atlas.categories.flatMap((category) => category.types).find((entry) => {
      const entity = entitySlug(entry.entity);
      return entry.slug === slug || token(entry.slug) === needle || entity === slug || token(entity) === needle;
    });
    const points = atlas.pois.filter((poi) => {
      if (poi.c === "eggs") return false;
      const entity = entitySlug(poi.entity);
      return poi.t === slug || token(poi.t) === needle || entity === slug || token(entity) === needle;
    });
    if (!points.length) continue;
    const areaMap = new Map<string, AniimoSpawnArea>();
    for (const poi of points) {
      const name = poi.ar?.trim() || "Unlisted area";
      const area = areaMap.get(name) || { name, count: 0, forms: [], times: [] };
      area.count += 1;
      if (poi.fm && !area.forms.includes(poi.fm)) area.forms.push(poi.fm);
      if (poi.tm && !area.times.includes(poi.tm)) area.times.push(poi.tm);
      areaMap.set(name, area);
    }
    const areas = [...areaMap.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
    const regions = atlas.regions
      .filter((region) => points.some((poi) => areaMatches(poi.ar, region.name)))
      .map((region) => ({ name: region.name, slug: region.slug, lvlMin: region.lvlMin, lvlMax: region.lvlMax, poly: region.poly }));
    const iconIndex = type?.ic ?? points[0]?.ic ?? 0;
    atlases.push({
      atlasId: atlas.id,
      atlasName: atlas.name,
      backdrop: atlas.backdrop,
      view: atlas.view,
      tiles: { template: atlas.meta.tiles.template, tileSize: atlas.meta.tiles.tileSize },
      width: atlas.meta.width,
      height: atlas.meta.height,
      icon: atlas.icons[iconIndex] || "",
      count: points.length,
      href: mapHref({ marker: slug, atlas: atlas.id, region: regions[0]?.slug }),
      areas,
      regions,
      points: points.map((poi) => ({
        x: poi.x,
        y: poi.y,
        area: poi.ar?.trim() || "Unlisted area",
        form: poi.fm,
        time: poi.tm,
        underground: poi.ug || undefined,
      })),
    });
  }
  return atlases.sort((left, right) => right.count - left.count);
}
