import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Content";
import { HeroPanel } from "@/components/ui/HeroPanel";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";
import updatesStyles from "@/style/page/updates.module.css";

const latestUpdate = {
  date: "August 26, 2026",
  label: "Launch announcement",
  title: "Aniimo global launch dates announced",
  body: "PC and console are scheduled for September 16, followed by mobile on September 23. The same announcement introduced the limited pre-launch Time to Aniimo web event.",
  href: "https://aniimo.com/newslist/detail/100051",
};

const updates = [
  {
    date: "February 4, 2026",
    type: "Balance & co-op",
    title: "Egg Heist team rewards and evolution guidance",
    body: "Team-submitted Aniimo Eggs became shareable on successful evacuation, and several evolution requirement descriptions gained clearer wording and location guidance.",
    href: "https://aniimo.com/newslist/detail/100019",
    image: "/images/aniimo/fenrier.png",
    tone: "blue",
  },
  {
    date: "February 2, 2026",
    type: "Progression update",
    title: "Progression pacing and PvP adjustments",
    body: "The update addressed Dewdrop Crystal acquisition, vendor limits and Egg Heist PvP rules, alongside fixes for Island Area and skill-related issues.",
    href: "https://aniimo.com/newslist/detail/100017",
    image: "/images/aniimo/emberpup.png",
    tone: "gold",
  },
  {
    date: "January 31, 2026",
    type: "Update notice",
    title: "Egg Heist preview and stability fixes",
    body: "This notice outlined the upcoming Egg Heist mode and resolved issues affecting skills, matchmaking, Holo-Battle Interlink and alternate-form unlocks.",
    href: "https://aniimo.com/newslist/detail/100015",
    image: "/images/aniimo/flameruff.png",
    tone: "coral",
  },
  {
    date: "January 29, 2026",
    type: "Gameplay update",
    title: "Egg Heist and Holo-Battle Interlink arrive",
    body: "The update made both modes available, then detailed accompanying Homeland, encounter, platform and performance fixes.",
    href: "https://aniimo.com/newslist/detail/100013",
    image: "/images/aniimo/inferlupa.png",
    tone: "violet",
  },
];

export default function UpdatesPage() {
  return (
    <>
      <section className={`${styles.compactHero} ${updatesStyles.updatesHero}`}>
        <div className="container">
          <Breadcrumb items={[{ label: "Updates" }]} />
          <span className={styles.kicker}><Icon name="spark" /> Newsroom</span>
          <h1>Aniimo Updates</h1>
          <p>Release milestones, feature changes and live-event notices—arranged as a readable record instead of a wall of announcements.</p>
          <div className={updatesStyles.updatesHeroFacts} aria-label="Updates page summary">
            <span><b>01</b> launch announcement</span>
            <span><b>04</b> update records</span>
            <span>last reviewed Sep 1, 2026</span>
          </div>
          <HeroPanel label="In this timeline" items={["Launch milestones", "Feature changes", "Events and update notes"]} />
        </div>
      </section>

      <main className={updatesStyles.updatesPage}>
        <div className="container">
          <section className={updatesStyles.updatesLead}>
            <div className={updatesStyles.updatesLeadArtwork}>
              <Image src="/images/home/aniimo-world-hero.png" alt="Aniimo world landscape" fill sizes="(max-width: 760px) 100vw, 52vw" priority />
              <span>Latest</span>
            </div>
            <article className={updatesStyles.updatesLeadCopy}>
              <div><span>{latestUpdate.label}</span><time dateTime="2026-08-26">{latestUpdate.date}</time></div>
              <h2>{latestUpdate.title}</h2>
              <p>{latestUpdate.body}</p>
              <span className={updatesStyles.updatesReadLink}>Launch dates and event window recorded here <Icon name="arrow" /></span>
            </article>
          </section>

          <section className={updatesStyles.updatesTimeline} aria-labelledby="update-history-title">
            <header>
              <div><span>Release ledger</span><h2 id="update-history-title">Earlier Aniimo Updates</h2></div>
              <p>Feature changes, events and release notes arranged by date.</p>
            </header>
            <div>
              {updates.map((update) => (
                <article className={updatesStyles.updateRecord} data-tone={update.tone} key={update.href}>
                  <time dateTime={new Date(update.date).toISOString().slice(0, 10)}>{update.date}</time>
                  <div className={updatesStyles.updateRecordMarker} aria-hidden="true" />
                  <div className={updatesStyles.updateRecordArtwork}><Image src={update.image} alt="" fill sizes="70px" /></div>
                  <div className={updatesStyles.updateRecordCopy}>
                    <span>{update.type}</span>
                    <h3>{update.title}</h3>
                    <p>{update.body}</p>
                  </div>
                  <span aria-label={update.title} className={updatesStyles.updateRecordLink}><Icon name="arrow" /></span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
