export const guideTopics = [
  {
    id: "getting-started",
    label: "Getting Started",
    blurb: "Starter, Command, first catch, and the right Aniipod",
  },
  {
    id: "combat",
    label: "Combat",
    blurb: "BREAK, EP, type matchups, and traits that actually fire",
  },
  {
    id: "growth",
    label: "Forms & Growth",
    blurb: "Forms, later records, and material routes",
  },
  {
    id: "collection",
    label: "Collection",
    blurb: "Eggs, hatching, and the local tracker",
  },
] as const;

export type GuideTopicId = (typeof guideTopics)[number]["id"];

export function getGuideTopic(id: string) {
  return guideTopics.find((topic) => topic.id === id);
}
