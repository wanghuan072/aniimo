export type MapAtlasGuide = {
  id: string;
  card: string;
  heading: string;
  overview: string;
  featuredAniimo: Array<{ name: string; slug: string }>;
  treasure: string;
};

export const mapAtlasGuides: Record<string, MapAtlasGuide> = {
  "breezy-plains": {
    id: "breezy-plains",
    card: "Use Breezy Plains for the long mainland hunt: 14 named habitats, 70 mapped Aniimo species, and 767 chest locations running from Nimbus Fields to the level 50 coast. Switch to Cave whenever a spawn pin seems buried inside the ridge.",
    heading: "Breezy Plains is bigger than the starting fields",
    overview: "Keep this atlas open while you work through the mainland. Nimbus Fields is an easy place to learn the map, but the same route eventually reaches Beast Fang Ridge, Mistwoods, Driftwise Meadow, and the late-game coast. Search the Aniimo you want before opening every creature layer, and check Surface or Cave when a pin seems to sit inside a cliff. Chest markers are grouped by level band, so you can follow the part of the map that matches your current route instead of sweeping all 767 locations at once.",
    featuredAniimo: [
      { name: "Emberpup", slug: "emberpup" },
      { name: "Celestis", slug: "celestis" },
      { name: "Glacy", slug: "glacy" },
      { name: "Magmarex", slug: "magmarex" },
    ],
    treasure: "767 chest locations, separated into level bands rather than rarity colors.",
  },
  astra: {
    id: "astra",
    card: "Astra is the quick city reference for Horizon Square, the Polaris Institute, Northside, Phoebe Street, shops, cafés, arcades, and the central teleporter. It has no wild Aniimo or chest route, so only practical town stops stay on the map.",
    heading: "Use Astra when the objective sends you back to town",
    overview: "Astra is a city map, not a wild spawn route. Its 26 points cover the places that are easy to forget after a quest drops you back in the hub: the Horizon Square teleporter, the Polaris Institute, Northside, Phoebe Street, shops, cafés, and arcades. Open it when a task names a building or service and you want the shortest walk through town. There are no wild Aniimo or chest routes in the current Astra data, so the map stays deliberately small and focused on facilities.",
    featuredAniimo: [],
    treasure: "No wild Aniimo or chest locations are currently mapped in Astra.",
  },
  "whisperwake-isles": {
    id: "whisperwake-isles",
    card: "Run Whisperwake Isles as a focused late-game loop around Crescent Bay. The atlas tracks water-side spawns, 41 chests, and weather-sensitive catches: Coraliz needs rain, while Glameep appears during the Prismana Flow.",
    heading: "Check the weather before circling Whisperwake",
    overview: "Whisperwake Isles is small enough to plan as one focused run, but several catches are easy to miss if you ignore their conditions. Crescent Bay holds most of the action, with Reefish, Bubbeep, and Popapus appearing far more often than the rarer evolutions. Coraliz is tied to rain, while Glameep appears under the Prismana Flow. Turn on the Aniimo layer you actually need, then add the level 46–50 chest layer once your spawn route is set; otherwise the shoreline quickly becomes harder to read than it needs to be.",
    featuredAniimo: [
      { name: "Reefish", slug: "reefish" },
      { name: "Coraliz", slug: "coraliz" },
      { name: "Glameep", slug: "glameep" },
    ],
    treasure: "41 chest locations, including 39 marked for the level 46–50 route.",
  },
  "lost-islets": {
    id: "lost-islets",
    card: "The Lost Islets reward a layer-by-layer sweep across separate island groups. Plan around 849 Aniimo spawn pins and 441 colored chests—198 purple, 192 blue, and 51 gold—then open a creature profile before deciding whether a detour is worth the trip.",
    heading: "Build one Lost Islets route at a time",
    overview: "The Lost Islets scatter useful stops across separate pieces of land, so turning on everything at once is rarely the fastest way to clear them. Start with one Aniimo or one chest color, finish that loop, then switch layers before moving to the next island group. The atlas currently holds 849 spawn pins and 441 chest locations, including 51 gold chests. Spawn names link back to the Aniimo database, which makes this the better map for deciding whether a detour is worth adding to your collection route.",
    featuredAniimo: [
      { name: "Pomegg", slug: "pomegg" },
      { name: "Stellarys", slug: "stellarys" },
      { name: "Emberpup", slug: "emberpup" },
      { name: "Scorchhowl", slug: "scorchhowl" },
    ],
    treasure: "441 chests: 198 purple, 192 blue, and 51 gold.",
  },
};
