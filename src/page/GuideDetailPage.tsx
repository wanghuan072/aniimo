import { notFound } from "next/navigation";
import type { Guide } from "@/types/content";
import { getGuideDossier } from "@/data/editorial/guide-dossiers";
import GuideDossierPage from "@/page/GuideDossierPage";

export default function GuideDetailPage({ guide }: { guide: Guide }) {
  const dossier = getGuideDossier(guide.slug);
  if (!dossier) notFound();
  return <GuideDossierPage guide={guide} dossier={dossier} />;
}
