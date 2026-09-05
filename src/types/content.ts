export type AniimoStats = {
  hp: number;
  physicalAttack: number;
  magicAttack: number;
  physicalDefense: number;
  magicDefense: number;
  haste: number;
  attributeValue: number;
};

export type AniimoSkillEffect = {
  kind: string;
  text: string;
};

export type AniimoSkillTargeting = {
  shape?: string;
  range?: string;
  hitCap?: string;
  interval?: string;
};

export type AniimoSkill = {
  name: string;
  description: string;
  category: string;
  elements: string[];
  types: string[];
  iconUrl: string;
  cost: string;
  power: string;
  cooldown?: string;
  breakValue?: string;
  teamRole?: string;
  effects?: AniimoSkillEffect[];
  targeting?: AniimoSkillTargeting | null;
};

export type AniimoEvolutionNode = {
  name: string;
  stage: number;
  imageUrl: string;
  isVariant: boolean;
  children: AniimoEvolutionNode[];
};

export type AniimoEvolutionView = AniimoEvolutionNode & {
  slug?: string;
  portrait?: string;
  children: AniimoEvolutionView[];
};

export type AniimoForm = {
  id: string;
  label: string;
  isCurrent: boolean;
};

export type AniimoHomelandAbility = {
  key: string;
  value: string;
};

export type AniimoMobility = {
  name: string;
  description: string;
  iconUrl: string;
};

export type AniimoFormRecord = {
  id: string;
  description: string;
  image: string;
  officialImageUrl: string;
  illustrationUrl: string;
  form: string;
  stage: number;
  roles: string[];
  elements: string[];
  gender: string[];
  weight: { min: number | null; max: number | null };
  stats: AniimoStats | null;
  habitats: string[];
  homelandAbilities: AniimoHomelandAbility[];
  mobility: AniimoMobility[];
  pathfinding: string[];
  evolution: Array<{ name: string; stage: number; imageUrl: string; isVariant: boolean }>;
  evolutionTree: AniimoEvolutionNode | null;
  traits: Array<{ name: string; description: string; iconUrl: string }>;
  skills: AniimoSkill[];
  viewCount: number | null;
};

export type Aniimo = {
  id: string;
  entryId: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  voteImage?: string;
  officialImageUrl: string;
  illustrationUrl: string;
  form: string;
  stage: number;
  roles: string[];
  elements: string[];
  gender: string[];
  weight: { min: number | null; max: number | null };
  stats: AniimoStats | null;
  forms: AniimoForm[];
  formRecords: AniimoFormRecord[];
  habitats: string[];
  homelandAbilities: AniimoHomelandAbility[];
  mobility: AniimoMobility[];
  pathfinding: string[];
  evolution: Array<{ name: string; stage: number; imageUrl: string; isVariant: boolean }>;
  evolutionTree: AniimoEvolutionNode | null;
  traits: Array<{ name: string; description: string; iconUrl: string }>;
  skills: AniimoSkill[];
  viewCount: number | null;
};

export type GuideLink = {
  label: string;
  href: string;
};

export type GuideBlock =
  | {
      type: "route";
      eyebrow: string;
      title: string;
      intro?: string;
      steps: Array<{ title: string; body: string; link?: GuideLink }>;
    }
  | {
      type: "notes";
      eyebrow: string;
      title: string;
      intro?: string;
      items: Array<{ title: string; body: string; link?: GuideLink }>;
    }
  | {
      type: "story";
      eyebrow: string;
      title: string;
      intro?: string;
      paragraphs: string[];
      image: string;
      imageAlt: string;
      caption: string;
      link?: GuideLink;
    }
  | {
      type: "table";
      eyebrow: string;
      title: string;
      intro?: string;
      columns: string[];
      rows: string[][];
      note?: string;
    }
  | {
      type: "lineage";
      eyebrow: string;
      title: string;
      intro?: string;
      paths: Array<{
        label: string;
        nodes: Array<{ name: string; stage: string; href?: string }>;
      }>;
      note?: string;
    }
  | {
      type: "terms";
      eyebrow: string;
      title: string;
      intro?: string;
      items: Array<{ term: string; value?: string; body: string; link?: GuideLink }>;
    }
  | {
      type: "checklist";
      eyebrow: string;
      title: string;
      intro?: string;
      items: string[];
    }
  | {
      type: "callout";
      tone: "source" | "caution";
      title: string;
      body: string;
      links?: GuideLink[];
    };

export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  published: string;
  updated: string;
  author: GuideLink;
  coverImage: string;
  coverAlt: string;
  intro: string;
  blocks: GuideBlock[];
};

export type DatabaseCategory = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  status: "verified" | "community" | "tracking";
};

export type MapLocation = {
  id: string;
  name: string;
  region: string;
  category: string;
  x: number;
  y: number;
  description: string;
};

export type CommunityRecord = {
  slug: string;
  name: string;
  description: string;
  rarity: string;
  category: string;
  image?: string;
};

export type SearchRecord = {
  title: string;
  subtitle: string;
  href: string;
  type: string;
  image: string;
};
