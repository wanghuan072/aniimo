import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import TeamBuilderPage from "@/page/TeamBuilderPage";

export const metadata = createMetadata(tdk.teamBuilder);

export default async function Page({ searchParams }: { searchParams: Promise<{ team?: string | string[] }> }) {
  const value = (await searchParams).team;
  const team = (Array.isArray(value) ? value[0] : value || "").split(",").filter(Boolean);
  return <TeamBuilderPage initialTeam={team} />;
}
