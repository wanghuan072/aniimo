import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { TdkEntry } from "@/seo/tdk";

type MetadataOptions = {
  noIndex?: boolean;
  image?: string;
};

export function createMetadata(
  entry: Pick<TdkEntry, "title" | "description" | "pathname" | "image" | "noIndex">,
  options: MetadataOptions = {},
): Metadata {
  const canonical = new URL(entry.pathname, siteConfig.url).toString();
  const image = options.image || entry.image || "/images/og-image.png";
  const title = entry.title;
  const description = entry.description;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: options.noIndex || entry.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
