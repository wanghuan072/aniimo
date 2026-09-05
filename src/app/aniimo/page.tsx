import { connection } from "next/server";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import AniimoIndexPage from "@/page/AniimoIndexPage";

export const metadata = createMetadata(tdk.aniimo);

export default async function Page() {
  await connection();
  return <AniimoIndexPage />;
}
