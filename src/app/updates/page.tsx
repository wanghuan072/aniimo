import type { Metadata } from "next";
import UpdatesPage from "@/page/UpdatesPage";
import { createMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
export const metadata:Metadata=createMetadata(tdk.updates);
export default function Page(){return <UpdatesPage/>}
