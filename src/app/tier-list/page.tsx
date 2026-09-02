import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
export const metadata=createMetadata(tdk.tierList);
export { default } from "@/page/TierListPage";
