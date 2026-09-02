import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { omegaBosses } from "@/data/editorial/encounters";
import { aniimo, getAniimo, mapLocations } from "@/lib/data";
import { mapHref } from "@/lib/map-atlas";
import { createMetadata } from "@/seo/metadata";
import { aniimoTdk } from "@/seo/tdk";
import AniimoDetailPage from "@/page/AniimoDetailPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return aniimo.map((entry) => ({ slug: entry.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAniimo(slug);
  if (!entry) return {};
  return createMetadata(aniimoTdk(entry));
}

const normalizeLocation = (value: string) => value.replace(/[.]$/, "").trim().toLowerCase();

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getAniimo(slug);
  if (!entry) notFound();
  const habitatLinks = entry.habitats.map((habitat) => {
    const name = habitat.replace(/[.]$/, "");
    const location = mapLocations.find((candidate) => normalizeLocation(candidate.name) === normalizeLocation(habitat));
    const href = mapHref({ marker: entry.slug, region: location?.id || name });
    return { name, href: href.includes("?") ? href : "/database/habitats" };
  });
  const firstHabitat = entry.habitats[0] || omegaBosses.find((boss) => boss.slug === entry.slug)?.region;
  const findOnMapHref = mapHref({
    marker: entry.slug,
    region: firstHabitat ? mapLocations.find((candidate) => normalizeLocation(candidate.name) === normalizeLocation(firstHabitat))?.id || firstHabitat : undefined,
  });
  return <AniimoDetailPage entry={entry} findOnMapHref={findOnMapHref.includes("?") ? findOnMapHref : undefined} habitatLinks={habitatLinks} />;
}
