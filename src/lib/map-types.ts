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

export type MapFocus = {
  atlasId: string;
  typeSlug: string;
  categorySlug: string;
};

export type MapAniimoProfile = {
  slug: string;
  name: string;
  description: string;
  image: string;
  stage: number;
  form: string;
  elements: string[];
  roles: string[];
  stats: { hp: number; physicalAttack: number; magicAttack: number } | null;
  skills: string[];
  evolution: string[];
};

export type AniimoSpawnPoint = {
  x: number;
  y: number;
  area: string;
  form?: string;
  time?: string;
  underground?: boolean;
};

export type AniimoSpawnArea = {
  name: string;
  count: number;
  forms: string[];
  times: string[];
};

export type AniimoSpawnRegion = {
  name: string;
  slug: string;
  lvlMin?: number;
  lvlMax?: number;
  poly: number[][];
};

export type AniimoSpawnAtlas = {
  atlasId: string;
  atlasName: string;
  backdrop: string;
  view: number[];
  tiles: { template: string; tileSize: number };
  width: number;
  height: number;
  icon: string;
  count: number;
  href: string;
  areas: AniimoSpawnArea[];
  regions: AniimoSpawnRegion[];
  points: AniimoSpawnPoint[];
};

export type AtlasFile = {
  atlas: MapAtlas;
  vocabulary?: { times?: Record<string, { label: string }> };
};
