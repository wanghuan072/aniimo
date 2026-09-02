import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import MapPage from "@/page/MapPage";

export const metadata = createMetadata(tdk.map);

export default async function Page({ searchParams }: { searchParams: Promise<{ atlas?: string; marker?: string; region?: string }> }) {
  const { atlas, marker, region } = await searchParams;
  return <MapPage atlas={atlas} region={region} marker={marker} />;
}
