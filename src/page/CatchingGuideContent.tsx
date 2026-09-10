import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "@/style/page/content.module.css";

type Pod = {
  slug: string;
  name: string;
  image: string;
  rarity: string;
  signal: string;
  use: string;
  save?: string;
  routes: string;
  listedCost: string;
};

const pods: Pod[] = [
  { slug: "aniipod", name: "Aniipod", image: "/images/database/items/aniipod.webp", rarity: "Routine", signal: "Baseline catch", use: "This is the workhorse. If the target is easy to reach and the shown chance is fine, throw it and keep moving.", routes: "Credit Shop, quests, Adventure Token shops, Homeland production, and Adventure Rank chests", listedCost: "200 Credits" },
  { slug: "aniipod-pro", name: "Aniipod Pro", image: "/images/database/items/aniipod-pro.webp", rarity: "Epic", signal: "1.5× catch rate", use: "Use the small bump when one ordinary throw feels needlessly risky, not because the pod is rarer.", routes: "Elite Training, quests, Adventure Token shops, Homeland production, and chests", listedCost: "800 Credits or 2 Aniipods at Lumen" },
  { slug: "aniipod-mega", name: "Aniipod Mega", image: "/images/database/items/aniipod-mega.webp", rarity: "Epic", signal: "2× catch rate", use: "Choose Mega when aim is already solved and the percentage is the only thing holding the catch back.", routes: "Elite Training, quests, Adventure Token shops, Homeland production, limited events, and chests", listedCost: "60 Training Points or 2 Aniipod Pros at Lumen" },
  { slug: "aniipod-hyper", name: "Aniipod Hyper", image: "/images/database/items/aniipod-hyper.webp", rarity: "Epic", signal: "2× + faster, longer throw", use: "This is the reach tool. Spend it when a normal toss cannot comfortably touch the target.", routes: "Companion Handbook, Adventure Token shops, and the regular shop", listedCost: "2,500 Credits" },
  { slug: "aniipod-trace", name: "Aniipod Trace", image: "/images/database/items/aniipod-trace.webp", rarity: "Epic", signal: "2× + tracking", use: "This is for a target that turns or runs after release; do not waste it on something standing still.", routes: "Companion Handbook, Adventure Token shops, and the regular shop", listedCost: "5,000 Credits" },
  { slug: "tumbler", name: "Tumbler", image: "/images/database/items/tumbler.webp", rarity: "Epic", signal: "2× field / 6× Nurture", use: "It becomes exceptional only in a gathered Wild Surge, where one rolling catch can work through the group.", save: "Carry ten free Aniimo slots before using it.", routes: "Elite Training, Glimmer Purchase, Nurture Branch, Adventure Token shops, quests, and chests", listedCost: "5,000 Credits" },
  { slug: "aniipod-ultra", name: "Aniipod Ultra", image: "/images/database/items/aniipod-ultra.webp", rarity: "Legendary", signal: "Guaranteed catch", use: "Use it when the individual target matters enough that a miss would end the session badly.", save: "Its current configuration also sets an Elite-or-better Acquired Potential floor.", routes: "Elite Training, Glimmer Purchase, shops, item exchanges, and chests", listedCost: "20 Aniipod Ultra Vouchers at Lumen" },
  { slug: "sparkling-cube", name: "Sparkling Cube", image: "/images/database/items/sparkling-cube.webp", rarity: "Prismatic", signal: "Guaranteed Sparkling catch", use: "Reserve it for the one species or form you are sure you want to keep as a Sparkling.", save: "Launch notes confirm the catch also has Perfect Potential.", routes: "Elite Training, Fun Stamp Collection Shop, Companion Handbook, shops, and item exchanges", listedCost: "100 Sparkling Crystals at Lumen" },
  { slug: "legendary-aniipod", name: "Legendary Aniipod", image: "/images/database/items/legendary-aniipod.webp", rarity: "Special", signal: "Irisalis encounter item", use: "Craft it for Irisalis after collecting Legendary Tokens; it is a story-catch key, not a field pod.", routes: "Crevice Exploration Shop after earning Legendary Tokens through exploration and story progress", listedCost: "No listed currency price" },
];

export const catchingFaq = [
  { question: "Which Aniipod should I throw for a normal catch?", answer: "Start with Aniipod. Move to Pro or Mega only when the displayed chance needs help. The stronger pod is a response to a visible problem, not the default button." },
  { question: "Do Mega, Hyper, and Trace have the same catch multiplier?", answer: "Their catch multiplier is the same at 2×. Pick Mega for a straight odds increase, Hyper when range or toss speed is the problem, and Trace when a moving target needs tracking." },
  { question: "When is Tumbler worth using?", answer: "Tumbler earns its place in a Wild Surge or Nurture group, where it receives its 6× group-catch benefit. It is only a normal 2× option in an ordinary field catch, and the current game requires ten free Aniimo slots before it can be thrown." },
  { question: "What should I save Ultra and Sparkling Cube for?", answer: "Use Ultra when the individual target is too valuable to lose. Use Sparkling Cube only when you want that exact catch as a Sparkling with its Perfect Potential guarantee." },
];

function ItemLink({ pod, children }: { pod: Pod; children: ReactNode }) {
  return <Link href={`/database/items?q=${pod.slug}`}>{children}</Link>;
}

export default function CatchingGuideContent() {
  return <>
        <section id="catch-choice" className={styles.catchingChoice}>
          <header><span>01 · Encounter</span><h2>Read the encounter first</h2></header>
          <p>When the target appears, do not start by cycling to the rarest item. Make the attempt cheaper first: approach without alerting it when the route allows, create a BREAK opening when you are fighting — see <Link href="/guides/aniimo-combat-guide">Combat: BREAK and EP</Link> — then read the chance the game presents. Only after that do you decide whether the miss is about odds or about landing the throw.</p>
          <ol>
            <li><b>1</b><div><h3>Prepare the target</h3><p>An unaware approach or a BREAK opening increases the value of the attempt before an item leaves your hand.</p></div></li>
            <li><b>2</b><div><h3>Separate odds from aim</h3><p>A low percentage calls for a catch multiplier. A distant or erratic target calls for a delivery assist.</p></div></li>
            <li><b>3</b><div><h3>Spend the smallest answer</h3><p>Stay on Aniipod for routine work; step up only when the visible problem has not been solved.</p></div></li>
            <li><b>4</b><div><h3>Reset after a special throw</h3><p>Move off a guarantee immediately. The next ordinary target should not inherit an expensive selection.</p></div></li>
          </ol>
          <div className={styles.catchingSectionLinks}>
            <Link href="/guides/aniimo-combat-guide">Create a BREAK window first <span aria-hidden>→</span></Link>
            <Link href="/map">Find the encounter on the map <span aria-hidden>→</span></Link>
            <Link href="/database/items?q=aniipod">Aniipod item records <span aria-hidden>→</span></Link>
          </div>
        </section>

        <figure className={styles.catchingGameplayScene}>
          <div><Image src="/images/guides/official/catching-evolution.avif" alt="Pathfinder aiming an Aniipod at Aniimo in a grassy field" fill sizes="(max-width: 1024px) 100vw, 855px" /></div>
          <figcaption><span>The item choice comes after the approach: get close enough to read the encounter, then use the Aniipod that solves the visible problem.</span><small>Official Aniimo gameplay media</small></figcaption>
        </figure>

        <section id="catch-pods" className={styles.catchingCatalogue}>
          <header><span>02 · Catalogue</span><h2>What each Aniipod is for</h2><p>Each model belongs to a different kind of catch. A higher tier only matters when its extra effect solves the obstacle in front of you.</p></header>
          <div className={styles.catchingPodGrid}>
            {pods.map((pod) => <ItemLink pod={pod} key={pod.slug}>
              <article data-rarity={pod.rarity.toLowerCase()}>
                <figure><Image src={pod.image} alt={`${pod.name} item artwork`} fill sizes="72px" /></figure>
                <div className={styles.catchingPodName}><span>{pod.rarity}</span><h3>{pod.name}</h3></div>
                <strong>{pod.signal}</strong>
                <p>{pod.use}</p>
                {pod.save && <small>{pod.save}</small>}
                <i aria-hidden>→</i>
              </article>
            </ItemLink>)}
          </div>
          <p className={styles.catchingDataLine}>The quick read: ordinary catches begin with Aniipod; Pro is the modest bump; Mega, Hyper, and Trace share 2× odds but solve three different throw situations.</p>
        </section>

        <section id="catch-aim" className={styles.catchingAim}>
          <header><span>03 · 2× pods</span><h2>Mega, Hyper, and Trace</h2></header>
          <div className={styles.catchingAimGrid}>
            {pods.slice(2, 5).map((pod) => <ItemLink pod={pod} key={pod.slug}>
              <article>
                <Image src={pod.image} alt={`${pod.name} item artwork`} width={58} height={58} />
                <h3>{pod.name}</h3><strong>{pod.signal}</strong><p>{pod.use}</p>
                <span>Use it when this is the actual failure.</span>
              </article>
            </ItemLink>)}
          </div>
          <p className={styles.catchingPlainNote}><b>Easy target, low chance?</b> Mega. <b>Target is outside your throw?</b> Hyper. <b>Target changes direction mid-release?</b> Trace. A delivery assist is not an excuse to spend one when the target is standing still.</p>
        </section>

        <section id="catch-nurture" className={styles.catchingNurture}>
          <div className={styles.catchingNurtureImage}><Image src="/images/database/items/tumbler.webp" alt="Tumbler item artwork" fill sizes="(max-width: 768px) 100vw, 280px" /></div>
          <div><span>04 · Tumbler</span><h2>When to throw a Tumbler</h2>
            <p>In a regular field catch, Tumbler is another 2× option. Its value appears when the Nurture loop gathers a Wild Surge: its group-catch effect reaches 6×. That is a different job from Mega, even though both can look like a plain multiplier in the item list.</p>
            <p>Use the ordinary 2× choice for an ordinary target. Keep Tumbler in reserve until the encounter lets it roll through the group it was designed for.</p>
            <Link href="/database/items?q=tumbler">Open the Tumbler record <span aria-hidden>→</span></Link>
          </div>
        </section>

        <section id="catch-legendary" className={styles.catchingLegendary}>
          <div>
            <span>05 · Irisalis</span>
            <h2>How to catch Irisalis</h2>
            <p>The launch version changed the Irisalis loop so players are not expected to replay the same challenge and throw indefinitely. Collect Legendary Tokens while exploring and progressing through the story, craft a <Link href="/database/items?q=legendary-aniipod">Legendary Aniipod</Link>, then open Irisalis&apos;s dedicated encounter from the map.</p>
            <p>That changes the prep completely. Bring the finished item to the one encounter, clear the battle, follow the story sequence, and use the crafted pod to seal the bond. Do not put Legendary Aniipod in the same mental category as Pro, Mega, or Trace—it is a key for a named objective.</p>
            <div className={styles.catchingLegendaryLinks}><Link href="/map"><Icon name="map" /> Find the encounter route</Link><Link href="/database/items?q=legendary-aniipod"><Icon name="item" /> Inspect the crafted item</Link></div>
          </div>
          <figure><Image src="/images/database/items/legendary-aniipod.webp" alt="Legendary Aniipod item artwork" fill sizes="(max-width: 768px) 100vw, 250px" /><figcaption>Legendary Tokens → crafted Aniipod → one dedicated Irisalis encounter.</figcaption></figure>
        </section>

        <section id="catch-guarantees" className={styles.catchingGuarantees}>
          <header><span>06 · Guarantees</span><h2>When to spend a guaranteed catch</h2><p>Save Ultra and Sparkling Cube for a catch you have already decided matters. The question is whether this exact Aniimo, form, or Sparkling is worth consuming the item.</p></header>
          <div>
            {pods.slice(6, 8).map((pod) => <ItemLink pod={pod} key={pod.slug}>
              <article>
                <Image src={pod.image} alt={`${pod.name} item artwork`} width={86} height={86} />
                <span>{pod.rarity}</span><h3>{pod.name}</h3><strong>{pod.signal}</strong><p>{pod.use}</p><small>{pod.save}</small>
              </article>
            </ItemLink>)}
          </div>
        </section>

        <section id="catch-restock" className={styles.catchingRestock}>
          <header><span>07 · Restock</span><h2>How to restock Aniipods</h2>
            <p>Item rarity does not tell you how painful a replacement will be. The table below separates ordinary catch stock from niche tools and one-off insurance, so a long hunt does not quietly drain the part of your pouch you meant to protect.</p>
          </header>
          <div className={styles.catchingRestockTableWrap}>
            <table className={styles.catchingRestockTable}>
              <thead><tr><th scope="col">Pod</th><th scope="col">Where it returns to your pouch</th><th scope="col">Listed shop / exchange cost</th><th scope="col">Field rule</th></tr></thead>
              <tbody>{pods.map((pod) => <tr key={pod.slug}>
                <th scope="row"><ItemLink pod={pod}><Image src={pod.image} alt="" width={34} height={34} /><span>{pod.name}</span></ItemLink></th>
                <td>{pod.routes}</td><td>{pod.listedCost}</td><td>{pod.save ?? pod.use}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className={styles.catchingRestockNote}>A practical split: let <ItemLink pod={pods[0]}>Aniipod</ItemLink>, <ItemLink pod={pods[1]}>Pro</ItemLink>, and <ItemLink pod={pods[2]}>Mega</ItemLink> absorb routine attempts. Pack <ItemLink pod={pods[3]}>Hyper</ItemLink>, <ItemLink pod={pods[4]}>Trace</ItemLink>, and <ItemLink pod={pods[5]}>Tumbler</ItemLink> for a route that calls for them. Do not carry a guarantee as if it were just the next upgrade.</p>
          <div className={styles.catchingSectionLinks}>
            <Link href="/map">Restock while you walk a map loop <span aria-hidden>→</span></Link>
            <Link href="/guides/aniimo-collection-guide">Turn a named miss into a route <span aria-hidden>→</span></Link>
            <Link href="/tools/collection-tracker">Open Collection Tracker <span aria-hidden>→</span></Link>
          </div>
        </section>

        <section id="catch-live" className={styles.catchingLiveFacts}>
          <header><span>Live notes</span><h2>Catching changes in the live game</h2></header>
          <div>
            <article><b>High-level areas are less punishing to approach</b><p>Official updates reduced alert range and increased base catch success in high-level regions. If an old route tells you to assume every late-area catch is hostile, test the live encounter first.</p></article>
            <article><b>Tumbler now rewards density, not single targets</b><p>The base capture multiplier for Tumbler was raised to 6× in high-density areas. That makes it a planned group tool; keep the 10-free-slot requirement in mind before throwing it.</p></article>
            <article><b>Sparkling Cube now protects the right kind of catch</b><p>Launch notes confirm that an Aniimo caught with Sparkling Cube has Perfect Potential. Save it for the exact target you want to keep, instead of spending it just because an encounter is rare.</p></article>
          </div>
        </section>

        <section id="catch-faq" className={styles.catchingFaq}>
          <header><span>Questions</span><h2>Quick answers</h2></header>
          {catchingFaq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </section>
  </>;
}
