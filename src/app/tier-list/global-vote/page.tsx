import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

export const metadata = createMetadata(tdk.globalVote);
export { default } from "@/page/GlobalVotePage";
