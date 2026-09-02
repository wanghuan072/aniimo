import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
export const metadata=createMetadata(tdk.database);
export { default } from "@/page/DatabasePage";
