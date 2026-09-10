"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { guides } from "@/lib/data";
import { getGuideDossier } from "@/data/editorial/guide-dossiers";
import { guideTopics } from "@/lib/guide-topics";
import { Breadcrumb } from "@/components/ui/Content";
import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/types/content";
import styles from "@/style/page/content.module.css";

function topicFromHash() {
  if (typeof window === "undefined") return "all";
  const id = window.location.hash.replace(/^#/, "");
  return guideTopics.some((topic) => topic.id === id) ? id : "all";
}

function GuideCard({ guide }: { guide: Guide }) {
  const dossier = getGuideDossier(guide.slug);
  const title = dossier?.title || guide.title;
  const excerpt = dossier?.deck || guide.excerpt;
  const readTime = dossier?.readTime || `${guide.readTime} read`;
  const coverImage = dossier?.heroImage || guide.coverImage;
  const coverAlt = dossier?.heroAlt || guide.coverAlt;
  const topic = guideTopics.find((item) => item.id === guide.topic);

  return (
    <article className={`${styles.guideFeatureCard} ${guide.slug === "aniimo-beginners-guide" ? styles.guideFeatureCover : ""}`}>
      <Link href={`/guides/${guide.slug}`} className={styles.guideFeatureImage} aria-label={`Read ${title}`}>
        <Image src={coverImage} alt={coverAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
        <span>{topic?.label || guide.category}</span>
      </Link>
      <div className={styles.guideFeatureBody}>
        <div className={styles.guideFeatureMeta}>
          <span>{readTime}</span>
          <span>Updated {new Date(guide.updated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        <h2><Link href={`/guides/${guide.slug}`}>{title}</Link></h2>
        <p>{excerpt}</p>
        <Link href={`/guides/${guide.slug}`} className={styles.guideFeatureLink}>Read guide <Icon name="arrow" /></Link>
      </div>
    </article>
  );
}

export default function GuidesPage() {
  const [topic, setTopic] = useState("all");
  const visible = topic === "all" ? guides : guides.filter((guide) => guide.topic === topic);

  useEffect(() => {
    const sync = () => setTopic(topicFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (id: string) => {
    setTopic(id);
    const next = id === "all" ? "/guides" : `/guides#${id}`;
    window.history.replaceState(null, "", next);
  };

  return <>
    <section className={styles.guideLibraryHero}><div className="container">
      <Breadcrumb items={[{ label: "Guides" }]} />
      <span className={styles.kicker}><Icon name="book" /> Practical player guides</span>
      <h1>Aniimo Guides — Catching, Teams, Maps, and Progression</h1>
      <p>Nine field guides. Use a tag to narrow the list, or leave All selected to keep every page in view.</p>
    </div></section>
    <section className={styles.guideLibrary}><div className="container">
      <div className={styles.guideLibraryHeading}>
        <span>{visible.length} {visible.length === 1 ? "guide" : "guides"}</span>
        <p>Click a tag to switch the list. All keeps every guide on the page.</p>
      </div>
      <div className={styles.guideTopicTags} aria-label="Guide categories">
        <button type="button" aria-pressed={topic === "all"} onClick={() => select("all")}>All</button>
        {guideTopics.map((item) => (
          <button
            type="button"
            id={item.id}
            key={item.id}
            aria-pressed={topic === item.id}
            onClick={() => select(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.guideFeatureGrid}>
        {visible.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
      </div>
    </div></section>
  </>;
}
