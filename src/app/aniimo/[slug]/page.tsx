import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aniimo, getAniimo } from "@/lib/data";
import { createMetadata } from "@/seo/metadata";
import { aniimoTdk } from "@/seo/tdk";
import AniimoDetailPage from "@/page/AniimoDetailPage";
export const dynamicParams = false;
export function generateStaticParams(){return aniimo.map((entry)=>({slug:entry.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const entry=getAniimo(slug);if(!entry)return{};return createMetadata(aniimoTdk(entry));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const entry=getAniimo(slug);if(!entry)notFound();return <AniimoDetailPage entry={entry}/>;}
