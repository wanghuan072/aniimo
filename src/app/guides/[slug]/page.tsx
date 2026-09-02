import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides,getGuide } from "@/lib/data";
import { createMetadata } from "@/seo/metadata";
import { guideTdk } from "@/seo/tdk";
import GuideDetailPage from "@/page/GuideDetailPage";
export const dynamicParams=false;
export function generateStaticParams(){return guides.map((guide)=>({slug:guide.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const guide=getGuide(slug);if(!guide)return{};return createMetadata(guideTdk(guide));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const guide=getGuide(slug);if(!guide)notFound();return <GuideDetailPage guide={guide}/>;}
