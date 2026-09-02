import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { databaseCategories,getDatabaseCategory } from "@/lib/data";
import { createMetadata } from "@/seo/metadata";
import { categoryTdk } from "@/seo/tdk";
import DatabaseCategoryPage from "@/page/DatabaseCategoryPage";
export const dynamicParams=false;
export function generateStaticParams(){return databaseCategories.map((category)=>({category:category.slug}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}):Promise<Metadata>{const{category:slug}=await params;const category=getDatabaseCategory(slug);if(!category)return{};return createMetadata(categoryTdk(category));}
export default async function Page({params}:{params:Promise<{category:string}>}){const{category:slug}=await params;const category=getDatabaseCategory(slug);if(!category)notFound();return <DatabaseCategoryPage slug={slug}/>;}
