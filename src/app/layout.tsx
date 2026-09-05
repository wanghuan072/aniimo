import type { Metadata } from "next";
import Script from "next/script";
import { Baloo_2, Nunito_Sans, Oxanium } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { tdk } from "@/seo/tdk";
import { JsonLd, websiteJsonLd } from "@/seo/JsonLd";
import "@/style/globals.css";

const gameDisplay = Baloo_2({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-game-display",
  display: "swap",
});

const gameBody = Nunito_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-game-body",
  display: "swap",
});

const gameUi = Oxanium({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-game-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: tdk.home.title, template: "%s" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "games",
  keywords: ["Aniimo", "Aniimo wiki", "Aniimo database", "Aniimo tier list", "Aniimo map", "Aniimo guides"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" className={`${gameDisplay.variable} ${gameBody.variable} ${gameUi.variable}`}><body><JsonLd data={websiteJsonLd(siteConfig.name, siteConfig.url, siteConfig.description)} /><Script async src="https://www.googletagmanager.com/gtag/js?id=G-E01MQKVEZ4" strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', 'G-E01MQKVEZ4');`}</Script><a className="skip-link" href="#main-content">Skip to content</a><div className="site-frame"><Header /><main id="main-content" className="page-main">{children}</main><Footer /></div></body></html>;
}
