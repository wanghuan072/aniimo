export type DossierLink = { label: string; href: string };

export type DossierTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type DossierFaq = {
  question: string;
  answer: string;
};

export type DossierChapter = {
  id: string;
  label: string;
  title: string;
  lead?: string;
  paragraphs: string[];
  image?: { src: string; alt: string; caption: string };
  table?: DossierTable;
  steps?: Array<{ title: string; body: string }>;
  note?: { title: string; body: string };
  link?: DossierLink;
};

export type GuideDossier = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  readTime: string;
  heroImage: string;
  heroAlt: string;
  theme: "sky" | "ember" | "violet" | "moss" | "gold" | "tide";
  deck: string;
  thesis: string;
  chapters: DossierChapter[];
  faq: DossierFaq[];
};

export const guideDossiers: GuideDossier[] = [
  {
    slug: "aniimo-catching-guide",
    title: "Catching Aniimo: which Aniipod to throw",
    seoTitle: "Aniimo Catching Guide — Which Aniipod Should You Use?",
    seoDescription: "Use a basic Aniipod first, then step up only for low odds, long throws, moving targets, Wild Surges, or a catch you cannot afford to miss.",
    category: "Catching",
    readTime: "10 min read",
    heroImage: "/images/database/items/aniipod.webp",
    heroAlt: "Aniipod item artwork",
    theme: "sky",
    deck: "Start with a basic Aniipod. Spend a better pod only when you can name the problem: low odds, a long throw, a moving target, a Wild Surge, or a catch you cannot lose.",
    thesis: "Throw the cheapest Aniipod that fixes the reason this catch might fail.",
    chapters: [
      { id: "catch-choice", label: "01 · Encounter", title: "Read the encounter first", paragraphs: [] },
      { id: "catch-pods", label: "02 · Catalogue", title: "What each Aniipod is for", paragraphs: [] },
      { id: "catch-aim", label: "03 · 2× pods", title: "Mega, Hyper, and Trace", paragraphs: [] },
      { id: "catch-nurture", label: "04 · Tumbler", title: "When to throw a Tumbler", paragraphs: [] },
      { id: "catch-legendary", label: "05 · Irisalis", title: "How to catch Irisalis", paragraphs: [] },
      { id: "catch-guarantees", label: "06 · Guarantees", title: "When to spend a guaranteed catch", paragraphs: [] },
      { id: "catch-restock", label: "07 · Restock", title: "How to restock Aniipods", paragraphs: [] },
      { id: "catch-live", label: "Live notes", title: "Catching changes in the live game", paragraphs: [] },
      { id: "catch-faq", label: "Questions", title: "Quick answers", paragraphs: [] }
    ],
    faq: []
  },
  {
    slug: "aniimo-beginners-guide",
    title: "First hours in Aniimo",
    seoTitle: "Aniimo Beginner Guide — Starter, Catching & First Team",
    seoDescription: "Follow the opening in order, choose Helion or Lunara by fight style, then catch one Aniimo in Nimbus Fields that covers a job your starter does not have.",
    category: "Getting started",
    readTime: "10 min read",
    heroImage: "/images/aniimo/emberpup.png",
    heroAlt: "Emberpup Aniimo artwork",
    theme: "sky",
    deck: "Stay on the opening until Command, Twining, and Nimbus Fields are unlocked. Then catch one Aniimo that covers a job Helion or Lunara does not do.",
    thesis: "Follow the story until Nimbus Fields opens. Your first wild catch should add a job, not a second Holy attacker.",
    chapters: [
      {
        id: "first-hours",
        label: "Opening",
        title: "What to do in the first hours",
        lead: "The tutorial hands you one system at a time. Finish that sequence before you start clearing the map.",
        paragraphs: [
          "Create your Wayfarer, land the tutorial catch, then pick [[Helion|/aniimo/helion]] or Lunara. After that the game asks you to Command an Aniimo and Twine with one. Keep following the objective through the Institute scenes; the function menu appears there, not in the cavern.",
          "Once the transporter drops you in Nimbus Fields, the [[map|/map]] opens up. Use the story marker as a spine and take short detours for a catch, a chest, or a material you already need. If a path asks for a field skill you have not seen yet, turn around and come back later."
        ],
        steps: [
          { title: "Create the Wayfarer", body: "This screen is about the explorer, not the team. Combat stats come from Aniimo you catch later." },
          { title: "Land the first catch", body: "Read the percentage beside the target before you throw. That habit matters more than the tutorial Aniipod. See [[Catching|/guides/aniimo-catching-guide]]." },
          { title: "Pick Helion or Lunara", body: "Both are Holy. Choose close-range pressure ([[Helion|/aniimo/helion]]) or a longer, self-sustaining fight ([[Fennelun|/aniimo/fennelun]] is the later moon-side record)." },
          { title: "Use Command, then Twine", body: "Command keeps you on the field while an Aniimo attacks. Twining puts you in the creature’s kit and is also how you cross later terrain." },
          { title: "Finish Institute initiation", body: "Membership, the first badge beat, and the function-menu prompt happen here. Then the transporter sends you into Idyll." },
          { title: "Enter Nimbus Fields", body: "Keep one extra catch in mind. [[Emberpup|/aniimo/emberpup]], [[Chirpi|/aniimo/chirpi]], and [[Skippy|/aniimo/skippy]] are close enough to compare without emptying the region." }
        ],
        image: { src: "/images/aniimo/helion.png", alt: "Helion Aniimo artwork", caption: "Helion is the close-range Holy starter. Lunara covers the same element from farther away." },
        link: { label: "Open Helion’s profile", href: "/aniimo/helion" }
      },
      {
        id: "starter-choice",
        label: "Starter",
        title: "Choose Helion or Lunara",
        paragraphs: [
          "The opening screen puts Helion and Lunara side by side. Both use Holy, so the choice is how the first fights feel, not which element you ‘should’ main.",
          "[[Helion|/aniimo/helion]] stays close. Light Bombardment costs 20 EP and hits for 62 power; Solar Grace adds 20% damage when the attack is not already super-effective, and every four basic attacks charge the next skill. Pick Helion if you like committing to one target.",
          "Lunara fights at range and can recover during longer encounters. This index lists [[Fennelun|/aniimo/fennelun]] as the moon-side record: Moon Impact is a 15 EP magic hit, and Moon-Washed restores 20 EP. Lunara’s Ultimate temporarily becomes Fennelun; Helion’s matching Ultimate becomes Soleon. You are not picking Fennelun on the opening screen.",
          "Your next catches should cover what the starter does not: another element, a Heal or BREAK job, or a field skill. Two Holy DPS records do not make a team. See [[Catching|/guides/aniimo-catching-guide]] when the first wild target appears."
        ],
        table: {
          caption: "Starter records currently stored in this index.",
          columns: ["Record", "Element / role", "What it is good at", "What to catch next"],
          rows: [
            ["Helion", "Holy / DPS", "Close-range burst; Light Bombardment 20 EP, 62 power", "A ranged option, Heal, or a second element"],
            ["Lunara → Fennelun", "Holy / DPS", "Ranged magic and EP recovery; Moon Impact 15 EP, Moon-Washed restores 20 EP", "A close fighter, BREAK, or a different element"]
          ]
        },
        link: { label: "Compare Fennelun", href: "/aniimo/fennelun" }
      },
      {
        id: "twining",
        label: "Control",
        title: "Command and Twining",
        paragraphs: [
          "Command leaves the Wayfarer on the field and sends attack orders to an Aniimo. Twining puts you inside one creature: its skills, stamina, and movement become yours. The tutorial makes you use both before the wider map opens.",
          "Outside combat, Twining is how you travel. [[Emberpup|/aniimo/emberpup]]’s Hustle spends stamina to run faster. [[Bolty|/aniimo/bolty]]’s High Jump solves a different problem: vertical reach. If a chest or gap looks placed on purpose, stop jumping as the Wayfarer and check the [[mobility records|/database/mobility]].",
          "You do not have to build the whole party around the Aniimo you like to Twine with. One record can be the travel tool; another can be the fight you actually enjoy."
        ],
        note: { title: "A quick field test", body: "Run a short stretch with your starter, then repeat it Twined with a new catch. If the second pass does not change how you move or fight, keep the catch as a team candidate instead of forcing it into a travel job." },
        link: { label: "Browse movement abilities", href: "/database/mobility" }
      },
      {
        id: "first-team",
        label: "Team",
        title: "Build a three-job team",
        paragraphs: [
          "Early on, three different jobs are enough: someone who deals damage, someone who recovers, and one slot still on trial. [[Emberpup|/aniimo/emberpup]] (Fire DPS), [[Skippy|/aniimo/skippy]] (Water Heal), and [[Leafy|/aniimo/leafy]] (Grass energy support) are a readable set, not a ranking.",
          "After a slow or lost fight, name the failure. Resisted element, no BREAK pressure, no heal, or a route that felt awkward each point to a different search. Change one slot and run the same activity again. [[Combat|/guides/aniimo-combat-guide]] covers the fight; [[Team Builder|/team-builder]] is where you test the swap.",
          "Put the Aniimo you already like into Team Builder first. Add candidates only to test the missing job. If a lineup looks complete on paper but you do not want to take it out, keep looking."
        ],
        table: {
          caption: "Turn a bad fight into a search, not a full rebuild.",
          columns: ["What happened", "Look for", "Where to start"],
          rows: [
            ["The fight took too long", "A better element or a clearer DPS skill", "[[Type chart|/tools/type-chart]] and creature profiles"],
            ["The target never opened", "A BREAK role or a high BREAK skill", "[[Skills|/database/skills?q=break]] and [[Team Builder|/team-builder]]"],
            ["You kept backing off", "Heal, Regen, or a safer range", "[[Skippy|/aniimo/skippy]], [[Leafy|/aniimo/leafy]], or another support record"],
            ["The route felt awkward", "A mobility ability that matches the terrain", "[[Mobility records|/database/mobility]] and the [[map|/map]]"]
          ]
        },
        link: { label: "Open Team Builder", href: "/team-builder" }
      }
    ],
    faq: [
      { question: "What should I do first in Aniimo?", answer: "Follow the opening through character creation, the first catch, the Helion or Lunara choice, Command and Twining, and Institute initiation. Start taking map detours after you reach Nimbus Fields." },
      { question: "Should I pick Helion or Lunara?", answer: "Pick Helion for close-range burst or Lunara for ranged fights with recovery. Both are Holy, so your first wild catches should add other elements and jobs." },
      { question: "When does the function menu unlock?", answer: "After the cavern, join the Polaris Institute and continue through the membership and first-badge scenes. The HUD prompts you to open the function menu before the transporter to Idyll." },
      { question: "Who should I catch after the starter?", answer: "Catch for a job you do not have. In Nimbus Fields, Emberpup is a Fire attacker, Chirpi is Wind support, and Skippy is Water healing. You do not need all three on day one." }
    ],
  },
  {
    slug: "aniimo-forms-and-evolution",
    title: "Forms and evolution",
    seoTitle: "Aniimo Forms & Evolution — Emberpup Branches and Requirements",
    seoDescription: "Compare Emberpup’s Basic, Highland, and Mountain Woods forms, then choose Scorchhowl or Inferlupa before you spend evolution materials.",
    category: "Growth",
    readTime: "9 min read",
    heroImage: "/images/aniimo/emberpup.png",
    heroAlt: "Emberpup Aniimo artwork",
    theme: "ember",
    deck: "A family name is not a plan. Pick the form you want and the later record it should become, then farm. Scorchhowl and Inferlupa do not finish the same team.",
    thesis: "Name the form and the later record first. Materials come after that choice.",
    chapters: [
      {
        id: "three-things",
        label: "Terms",
        title: "Form, stage, and evolution",
        paragraphs: [
          "Form is the version in front of you: Basic Emberpup, Highland Emberpup, Mountain Woods Emberpup. Stage is how far that family has grown. Evolution is the path that connects those records. Start on the [[evolution directory|/database/evolutions]].",
          "A new portrait can change more than looks. Highland [[Emberpup|/aniimo/emberpup]] adds Rock and lives in Zephyrus Landbridge and Russet Highlands. Mountain Woods Emberpup stays Fire/DPS and is listed only in Beast Fang Ridge. Those are different hunts.",
          "Open the base profile and the later records before you spend stones. You are choosing a job, not finishing a sticker book."
        ],
        table: {
          caption: "Use the record that matches the question.",
          columns: ["You want to know", "Open this", "Do not assume"],
          rows: [
            ["Which version am I hunting?", "Form and habitat", "The base name covers every variation"],
            ["What can this family become?", "Evolution path", "There is only one endpoint"],
            ["What changes in a fight?", "Element, role, trait, skills", "A new portrait is cosmetic"],
            ["What do I spend?", "The live evolution screen", "A material name is the full recipe"]
          ]
        },
        link: { label: "Browse evolution paths", href: "/database/evolutions" }
      },
      {
        id: "family-read",
        label: "Emberpup",
        title: "Scorchhowl or Inferlupa",
        paragraphs: [
          "[[Emberpup|/aniimo/emberpup]] grows into [[Flameruff|/aniimo/flameruff]], then splits. [[Scorchhowl|/aniimo/scorchhowl]] stays Fire DPS (physical attack 115). [[Inferlupa|/aniimo/inferlupa]] is Fire/Dark BREAK, with magic attack 113 and the Full Energy trait: after eight basic attacks, the next skill counts as basic-attack damage and Unbroken Flameruff Spirit ricochets more times.",
          "If you kept the family for direct Fire damage, Scorchhowl is the continuation. If the party already hits hard and cannot open a target, Inferlupa is the record to test. Compare both profiles before you farm.",
          "Skippy’s family splits the same way: Glacy and [[Leafy|/aniimo/leafy]] are different jobs, not two skins of Pranky."
        ],
        image: { src: "/images/aniimo/flameruff.png", alt: "Flameruff Aniimo artwork", caption: "Flameruff is the shared middle. The stage-three choice is where the team question actually starts." },
        link: { label: "Open Emberpup’s family", href: "/aniimo/emberpup" }
      },
      {
        id: "three-gates",
        label: "Before you spend",
        title: "What an evolution can require",
        paragraphs: [
          "Most evolutions mix three kinds of requirement. The destination may need a boss, Journey, or Sanctum to exist. The copy you evolve may need a level, form, weather, personality, or Pathfinder talent. Then there is the material payment, often elemental stones, sometimes a species item. [[Material records|/database/materials]] help you recognize names; they are not a complete recipe.",
          "Unlocking a branch does not evolve the Aniimo. Beating the boss only makes the destination available. The copy still has to meet its own conditions and pay the listed cost.",
          "If a gate is missing from this site’s records, stop there. Keep the candidate in the team and confirm the live screen before a long farm."
        ],
        steps: [
          { title: "Name the destination", body: "Write Scorchhowl or Inferlupa — not ‘finish Emberpup’." },
          { title: "Check the copy you have", body: "Form, level, and any personality or talent the screen names." },
          { title: "Clear the world unlock", body: "Boss, Journey, or Sanctum listed on that branch." },
          { title: "Farm the payment last", body: "Stones and unique items only after the other two gates are real." }
        ],
        link: { label: "Check material records", href: "/database/materials" }
      },
      {
        id: "team-fit",
        label: "Team",
        title: "Does this branch help the team?",
        paragraphs: [
          "Evolving looks like progress. It only helps if the later record solves a problem you already have: a resisted element, weak BREAK, or a trait that never fires. [[Combat|/guides/aniimo-combat-guide]] is the test, not the portrait.",
          "Drop your current four into [[Team Builder|/team-builder]], add the later record, and ask what it covers that is not covered now. If the answer is only ‘it is stage 3’, that is a collection choice. Both are fine. Name which one you are doing.",
          "Keep a short note: destination, why, and what is still missing. When you come back in a few sessions, you will know whether the branch still fits the team you actually play."
        ],
        note: { title: "Collection vs combat", body: "A form you want for the roster can be farmed on purpose. A combat branch should change a fight you already run. Mixing the two is how inventories fill up while the party stays the same." },
        link: { label: "Test the later record", href: "/team-builder" }
      }
    ],
    faq: [
      { question: "Does Emberpup have more than one final form?", answer: "Yes. After Flameruff it splits into Scorchhowl (Fire DPS) and Inferlupa (Fire/Dark BREAK). Compare both before spending materials." },
      { question: "Does beating a boss automatically evolve an Aniimo?", answer: "No. A boss or Journey unlocks the destination. The copy you evolve still needs its own level, form, and materials." },
      { question: "Are regional forms just cosmetic?", answer: "Not always. Highland Emberpup is Fire/Rock and uses different habitats from the Basic and Mountain Woods records. Check the form page before you hunt." },
      { question: "Where do evolution stones come from?", answer: "Confirm the live evolution screen for the exact stones. This site’s material records can name items; they should not replace the current in-game cost." }
    ],
  },
  {
    slug: "aniimo-combat-guide",
    title: "Combat: BREAK, EP, and matchups",
    seoTitle: "Aniimo Combat Guide — BREAK Windows, EP & Type Matchups",
    seoDescription: "Deal more damage by hitting a 1.6× matchup, building BREAK, and spending expensive skills during the window. Includes Emberpup, Blazen, Skippy, and Leafy skill costs.",
    category: "Combat",
    readTime: "10 min read",
    heroImage: "/images/aniimo/tubster.png",
    heroAlt: "Tubster Aniimo artwork",
    theme: "violet",
    deck: "Hit a 1.6× matchup, pressure BREAK with cheap actions, then spend the expensive skills while the target is open. Emptying EP at the start of a fight usually wastes the window.",
    thesis: "Create the BREAK window first. Spend EP inside it, not as soon as a skill lights up.",
    chapters: [
      {
        id: "matchup",
        label: "Matchup",
        title: "Start with a 1.6× matchup",
        paragraphs: [
          "The chart on this site uses 1.6× for a super-effective hit, 1× for neutral, and 0.625× for a resist. Moving the same attack from resisted to super-effective is a 2.56× swing. Fix that before you swap gear or rewrite the party. Open the [[type chart|/tools/type-chart]] first.",
          "Read the skill’s element, not only the portrait. [[Leafy|/aniimo/leafy]] is Grass/Water; Blooms of Vigor is a Grass support field. [[Coraliz|/aniimo/coraliz]]’s Rainstorm form drops Water from the base Rock/Water record, so the chart answer changes even if the name stays familiar.",
          "This matrix is a community Closed Beta 3 snapshot stored on the site. If the live fight disagrees, trust the fight and recheck the form."
        ],
        table: {
          caption: "Damage multiplier on the same hit.",
          columns: ["Result", "Multiplier"],
          rows: [
            ["Resisted", "0.625×"],
            ["Neutral", "1×"],
            ["Super-effective", "1.6×"],
            ["Two advantages", "2.56× (1.6 × 1.6)"]
          ]
        },
        link: { label: "Open the type chart", href: "/tools/type-chart" }
      },
      {
        id: "break-loop",
        label: "BREAK",
        title: "How to open a BREAK window",
        lead: "BREAK is the cue to cash in. The rest of the fight is setup.",
        paragraphs: [
          "Decide which actions build the meter and which actions spend the opening. If those jobs blur, the team looks busy and never converts.",
          "Hold the carry’s expensive skill and Ultimate until the target is about to open. Drop short buffs and EP fields close to that moment, not at the start of a long fight."
        ],
        steps: [
          { title: "Check the matchup", body: "If your main element is resisted, swap the attacker before you worry about rotation." },
          { title: "Pressure with cheap actions", body: "Use BREAK-tagged skills and basic attacks. Fire Bolt is 10 EP with 100% recorded BREAK; save the 20 EP buttons. Filter [[BREAK skills|/database/skills?q=break]] if you need a dedicated opener." },
          { title: "Hold the payoff", body: "Keep one real damage skill and the Ultimate for the window." },
          { title: "Open BREAK, then spend", body: "Swap the carry in with EP already banked. Dump the planned sequence, then go back to setup." },
          { title: "Reset", body: "The next window starts with the first cheap action, not with waiting." }
        ],
        note: { title: "After a loss", body: "Did you fail to open BREAK, fail to keep EP for it, or fail to survive long enough to use it? Those are three different swaps." },
        link: { label: "Find BREAK skills", href: "/database/skills?q=break" }
      },
      {
        id: "ep-choice",
        label: "EP",
        title: "Save EP for the burst",
        paragraphs: [
          "EP is a timing resource. Entering BREAK on an empty bar turns the carry into basic attacks. Stop spending when the remaining EP covers the burst you already decided on.",
          "[[Skippy|/aniimo/skippy]]’s Healing Water costs 20 EP and has a 20s cooldown — press it to keep someone alive, not because the bar is full. [[Leafy|/aniimo/leafy]]’s Blooms of Vigor costs 10 EP, lasts 12 seconds, and restores 1 EP a second to Grass teammates in the field. Drop it so the carry is standing in it during BREAK, not a minute earlier.",
          "If you always arrive at the opening broke, the finisher is probably not too expensive. Earlier casts had nowhere to go."
        ],
        table: {
          caption: "Ask this before you press an expensive skill.",
          columns: ["Question", "If yes", "If no"],
          rows: [
            ["Does this build BREAK?", "Use it in setup", "Save the EP"],
            ["Does this keep someone alive?", "Spend it", "Do not drain a safe moment"],
            ["Does this exploit an opening you already have?", "Stack it with the carry", "Build the opening first"],
            ["Is the skill the wrong element?", "Swap the attacker", "Forcing it will not help"]
          ]
        },
        link: { label: "Compare two Aniimo", href: "/tools/compare" }
      },
      {
        id: "small-rebuild",
        label: "Rebuild",
        title: "If damage is still low",
        paragraphs: [
          "Watch one full cycle and fix the first break in the plan. Another level will not hide a resisted hit or an empty EP bar.",
          "Change one slot, repeat the same encounter, and keep the rest of the team still. [[Team Builder|/team-builder]] shows roles and elements; it cannot tell you whether you spent Lotus Bloom a minute too early. Use [[Compare|/tools/compare]] when two candidates look similar on paper.",
          "A usable team has jobs you can say out loud: who opens BREAK, who holds EP, who covers the bad matchup, who keeps the loop from collapsing."
        ],
        table: {
          caption: "Fast combat troubleshooting.",
          columns: ["Symptom", "Likely cause", "First fix"],
          rows: [
            ["Hits show a resist", "0.625× into the current form", "Switch to a 1.6× attacker"],
            ["BREAK opens with no EP", "Setup skills emptied the carry", "Add Regen or stop earlier"],
            ["Buffs expire before BREAK", "Support was cast too soon", "Pressure first, shortest buff last"],
            ["The meter barely moves", "No BREAK slot", "Add a BREAK Aniimo and let the carry save resources"],
            ["The carry spends the window dodging", "Position or sustain failed", "Move the field, or add Heal"]
          ]
        },
        image: { src: "/images/aniimo/stellarys.png", alt: "Stellarys Aniimo artwork", caption: "A lineup is easier to play when pressure and payoff are not fighting for the same button." },
        link: { label: "Test the roster", href: "/team-builder" }
      }
    ],
    faq: [
      { question: "How do I deal more damage in Aniimo?", answer: "Use a 1.6× matchup, build BREAK with cheaper skills, restore EP during setup, then spend the carry’s strong skill and Ultimate inside the window." },
      { question: "What does BREAK do?", answer: "BREAK is a short opening. Some kits pay extra during it; the shared lesson is timing. Open it when the carry has EP and cooldowns ready." },
      { question: "How much does elemental advantage matter?", answer: "Super-effective is 1.6×, resisted is 0.625×. Swapping from a resist to an advantage on the same hit is a 2.56× change, so matchup is usually the first thing to fix." },
      { question: "What should a four-Aniimo team include?", answer: "A damage carry, a way to open BREAK, and sustain from Heal or Regen. Use the fourth slot for matching Support or the encounter’s worst threat." }
    ],
  },
  {
    slug: "aniimo-elements-guide",
    title: "Type matchups",
    seoTitle: "Aniimo Type Chart — 1.6× Strengths and 0.625× Resists",
    seoDescription: "Read Aniimo’s nine-element chart, then fix one bad matchup with a single team swap instead of rebuilding the whole party.",
    category: "Matchups",
    readTime: "8 min read",
    heroImage: "/images/aniimo/leafy.png",
    heroAlt: "Leafy Aniimo artwork",
    theme: "moss",
    deck: "Use the chart to fix the fight that keeps going badly. One extra attacker is usually enough. You do not need one of every element.",
    thesis: "Coverage is a spare answer in the roster, not a reason to collect all nine elements.",
    chapters: [
      {
        id: "matrix",
        label: "Chart",
        title: "How to read the type chart",
        paragraphs: [
          "Start from the attacking skill’s element and read across that row. Fire is 1.6× into Grass and Ice, and 0.625× into Fire, Water, Rock, and Holy. Reversing the row gives the wrong answer. Use the [[type chart|/tools/type-chart]] or the [[element directory|/database/elements]].",
          "Dual forms multiply both checks. Two advantages become 2.56×; an advantage and a resist cancel to 1×.",
          "Memorizing the whole grid is optional. The useful question is smaller: when this element shows up again, do I have a button for it?"
        ],
        link: { label: "Open the element directory", href: "/database/elements" }
      },
      {
        id: "coverage-test",
        label: "Team",
        title: "Fix one matchup",
        paragraphs: [
          "List the elements you actually take on a route. Circle the one fight that feels slow or unsafe. Add one candidate with the missing attack type and a job the party can use. Filter the [[roster|/aniimo]], then check coverage in [[Team Builder|/team-builder]].",
          "A Grass attacker into Water is a real change. Another Fire DPS next to [[Emberpup|/aniimo/emberpup]] is not, even if its stats look higher.",
          "Test on the same route. A coverage plan that never leaves Team Builder is just a color puzzle."
        ],
        steps: [
          { title: "Name the fight that hurts", body: "Use a recent encounter, not a hypothetical endgame target." },
          { title: "Separate matchup from other failures", body: "Missing Heal or BREAK is not an element problem." },
          { title: "Add one contrasting candidate", body: "Filter by the element you need, then read role and skills." },
          { title: "Replay the same route", body: "Keep the rest of the team still so you can tell what changed." }
        ],
        link: { label: "Check coverage in Team Builder", href: "/team-builder" }
      },
      {
        id: "forms",
        label: "Forms",
        title: "When a form changes the matchup",
        paragraphs: [
          "A form can change element, habitat, or skills. Highland [[Emberpup|/aniimo/emberpup]] is Fire/Rock; the Basic record is Fire only. Rainstorm [[Coraliz|/aniimo/coraliz]] is Rock-only; the base record is Rock/Water. Hunt and team plans both shift.",
          "Compare the specific form page before you travel. A family name is not enough to assume the typing. See [[Forms and evolution|/guides/aniimo-forms-and-evolution]]."
        ],
        image: { src: "/images/aniimo/forms/10002727.png", alt: "Aniimo form artwork", caption: "Check the form’s element line before you apply the chart." },
        link: { label: "Forms and evolution", href: "/guides/aniimo-forms-and-evolution" }
      },
      {
        id: "no-overreaction",
        label: "Keep the team",
        title: "Keep the Aniimo you like",
        paragraphs: [
          "A coverage fix is usually one swap. Keep the creature whose range or movement you already like. Park a flexible slot for the awkward matchup and see if it earns a permanent place.",
          "Elements set the first multiplier. Skills, BREAK, [[traits|/guides/aniimo-traits-guide]], and whether you enjoy the roster still decide the fight.",
          "After a hard encounter, write the element that caused it and the role you wished you had. That pair is a better search than copying a full team."
        ],
        note: { title: "Badge vs button", body: "An Aniimo having two elements does not guarantee the skill you need. Open the skill and confirm what it actually deals." },
        link: { label: "Combat: BREAK and EP", href: "/guides/aniimo-combat-guide" }
      }
    ],
    faq: [
      { question: "What are Aniimo’s type multipliers?", answer: "On this site’s chart, super-effective is 1.6×, neutral is 1×, and resisted is 0.625×. Two advantages stack to 2.56×." },
      { question: "Do I need every element on my team?", answer: "No. Carry a spare answer for the matchup that keeps going badly. Four slots cannot cover nine elements anyway." },
      { question: "Why did the chart disagree with a fight?", answer: "Check the current form. Regional forms can drop or add an element, and the skill’s element can differ from the portrait." },
      { question: "Fire into Water feels terrible. What should I add?", answer: "Fire is resisted by Water. Test one Grass or Electric attacker and keep Emberpup for Grass and Ice targets." }
    ],
  },
  {
    slug: "aniimo-traits-guide",
    title: "Traits that actually fire",
    seoTitle: "Aniimo Traits Guide — Triggers, Uptime & Team Fit",
    seoDescription: "Read a trait’s trigger, who it helps, and how often it fires. Compare Scorching Flames, Victory Concerto, Water Spirit, and other named passives.",
    category: "Traits",
    readTime: "9 min read",
    heroImage: "/images/aniimo/stellarys.png",
    heroAlt: "Stellarys Aniimo artwork",
    theme: "gold",
    deck: "A trait is useful when you can point to the moment it fires. Read the trigger, who it hits, and whether your team creates that condition on purpose.",
    thesis: "If you cannot say when a trait fires in the next hard fight, do not rebuild the party around it.",
    chapters: [
      {
        id: "three-parts",
        label: "How to read",
        title: "Trigger, target, and timing",
        paragraphs: [
          "Ignore the largest number in the tooltip until the sentence around it is clear. What starts it? Who receives it? How often can this team make that happen? Open the [[trait directory|/database/traits]] next to the profile.",
          "[[Emberpup|/aniimo/emberpup]]’s Scorching Flames is simple: +15% damage against enemies weak to its element. If you rarely attack a weakness, the trait is idle. [[Tubster|/aniimo/tubster]]’s Victory Concerto wants shields, BREAK, and Movement buffs — that is a rotation, not a sticker.",
          "Read the trait on the profile, then check whether the creature’s skills make the trigger natural."
        ],
        table: {
          caption: "Three questions before the number matters.",
          columns: ["Ask", "You are checking", "Why"],
          rows: [
            ["What starts it?", "A skill, state, swap, terrain, or timer", "A rare trigger is not a plan"],
            ["Who receives it?", "Holder, ally, team, or target", "The recipient tells you which slot benefits"],
            ["How long is it relevant?", "Window, cooldown, or repeat chance", "Short power still needs a timing plan"]
          ]
        },
        link: { label: "Browse trait records", href: "/database/traits" }
      },
      {
        id: "trait-fit",
        label: "Fit",
        title: "Fit the trait to your rotation",
        paragraphs: [
          "Start from what the team already does: BREAK pressure, protecting a carry, or holding a recovery field. Look for a trait whose trigger happens inside that loop. [[Combat|/guides/aniimo-combat-guide]] is the context.",
          "If the holder has to stop doing its real job to fire the trait, the synergy is worse than the tooltip. [[Leafy|/aniimo/leafy]]’s Power of Nature works from off field after a teammate casts three skills — it wants a busy active attacker, not a second Leafy.",
          "Rate traits with the roster you take out, not in isolation."
        ],
        image: { src: "/images/database/traits/stellarys-1.png", alt: "Stellarys trait artwork", caption: "Read a trait next to the skills that make its trigger happen." },
        link: { label: "Put the holder in Team Builder", href: "/team-builder" }
      },
      {
        id: "trait-mistakes",
        label: "Mistakes",
        title: "Common trait mistakes",
        paragraphs: [
          "Chasing a large effect nobody on the team cares about. Treating a conditional bonus as permanent. Replacing a creature you play well with one whose trait looks better but whose range you dislike. [[Compare|/tools/compare]] two holders before you swap.",
          "After you read a trait, say when it will fire in the next hard fight and who benefits. If both answers are fuzzy, leave it in the test column."
        ],
        steps: [
          { title: "Read the exact condition", body: "Do not shorten it. The wording is usually the boundary." },
          { title: "Name the recipient", body: "Holder, ally, target, or whole team." },
          { title: "Place it in one rotation", body: "Use a sequence this roster already runs." },
          { title: "Compare against the old slot", body: "Does the trait change the encounter you struggled with?" }
        ],
        link: { label: "Compare two Aniimo", href: "/tools/compare" }
      },
      {
        id: "trait-note",
        label: "Notes",
        title: "Keep a one-line field note",
        paragraphs: [
          "A good trait creates a moment you notice: BREAK opens cleaner, the carry lives through a spike, or EP is there for the burst. If it disappears into the noise, it can still be fine — it should not be why you dropped a role you needed.",
          "Write ‘fired during BREAK setup’ or ‘never showed on this route’. That is enough to decide whether the passive gets another session."
        ],
        note: { title: "One line is enough", body: "‘Saved EP on the water route’ beats ‘strong passive’." },
        link: { label: "See roles across the roster", href: "/aniimo" }
      }
    ],
    faq: [
      { question: "How should I read an Aniimo trait?", answer: "Find the trigger, who receives the effect, and how often your team can create that condition. The headline number comes last." },
      { question: "Is Scorching Flames always good on Emberpup?", answer: "It adds 15% damage against enemies weak to Fire. In a resisted matchup it does not do that job, so keep a coverage swap ready." },
      { question: "Should I rebuild a team around a trait?", answer: "Usually no. Use a trait to break a tie between two Aniimo you already want to play." },
      { question: "Why did a trait never fire?", answer: "The condition may need terrain, a shield, off-field time, or a crit count your current route does not produce. Test it in the fights you actually run." }
    ],
  },
  {
    slug: "aniimo-materials-guide",
    title: "Material routes in Breezy Plains",
    seoTitle: "Aniimo Materials Guide — Breezy Plains Farming Routes",
    seoDescription: "Farm from a named shortfall. Use Beast Fang Ridge, Blitzwood, Zephyrus Landbridge, and Mistwoods pin counts to pick a Breezy Plains loop.",
    category: "Materials",
    readTime: "9 min read",
    heroImage: "/images/database/items/semi-finished-emberpup-dewdrop-crystal.webp",
    heroAlt: "Emberpup Dewdrop Crystal material artwork",
    theme: "ember",
    deck: "Write the upgrade and the missing item first. Then run one Breezy Plains loop that also has a catch or chest so the trip is still useful if drops are slow.",
    thesis: "Start from a named shortfall. Stop when that upgrade is funded.",
    chapters: [
      {
        id: "shortfall",
        label: "Start",
        title: "Start from the upgrade you want",
        paragraphs: [
          "Open the evolution, craft, or upgrade screen and write the missing item and how many you still need. That sentence is the route. ‘Stock up’ is not. See [[Forms and evolution|/guides/aniimo-forms-and-evolution]] if the destination is still vague.",
          "The [[materials directory|/database/materials]] helps you recognize names. It is not a complete recipe book. If a quantity is missing here, copy it from the live screen.",
          "Keep the shortfall small. One branch, one item, one region."
        ],
        link: { label: "Browse material records", href: "/database/materials" }
      },
      {
        id: "route-value",
        label: "Loop",
        title: "How to run a farming loop",
        paragraphs: [
          "Turn on one material layer and one backup objective: a catch, a chest line, or a habitat you wanted to learn anyway. Then a dry pass still teaches the region. Start on the [[map|/map]].",
          "After one loop, cut the slow detours. The best route is the one you will run again, not the one that touches the most pins on a screenshot."
        ],
        steps: [
          { title: "Name the missing item", body: "Tie it to a branch or craft you already chose." },
          { title: "Pick one region", body: "Beast Fang Ridge, Blitzwood, Zephyrus, or Mistwoods — not all four." },
          { title: "Add a second objective", body: "A creature, chest, or egg layer in the same place." },
          { title: "Update the count", body: "The route ends when the live screen is funded." }
        ],
        link: { label: "Open the map", href: "/map" }
      },
      {
        id: "craft-boundary",
        label: "Records",
        title: "A listed material is not a full recipe",
        paragraphs: [
          "A name in the directory means the item exists in the snapshot. It does not always prove drop chance, respawn, or every craft input.",
          "Use the record to recognize the icon. Use the current game screen for the amount. Pin counts on this map are planning data, not guaranteed bag fills."
        ],
        table: {
          caption: "What each source can support.",
          columns: ["You know", "You can plan", "Do not invent"],
          rows: [
            ["The item is named here", "Watch for it on a relevant loop", "A universal recipe"],
            ["The live screen shows a cost", "Farm that gap", "That every branch needs the same stones"],
            ["The map has clustered pins", "Start in that region", "A guaranteed yield per pin"],
            ["You picked a destination", "Farm for that copy", "That the family name settles the cost"]
          ]
        },
        link: { label: "Recheck an evolution path", href: "/database/evolutions" }
      },
      {
        id: "inventory",
        label: "Stop",
        title: "Stop when the upgrade is funded",
        paragraphs: [
          "When the shortfall hits zero, go back to the upgrade screen and spend. Extra stock is convenient; it is not automatically progress.",
          "If another upgrade becomes interesting, write a new shortfall. The map feels larger when it answers a changing question. [[Collection|/guides/aniimo-collection-guide]] is the other reason to keep walking."
        ],
        image: { src: "/images/aniimo/emberpup.png", alt: "Emberpup Aniimo artwork", caption: "A material is most useful when it closes a branch you already chose." },
        link: { label: "Forms and evolution", href: "/guides/aniimo-forms-and-evolution" }
      }
    ],
    faq: [
      { question: "Where should I farm in Breezy Plains?", answer: "Match the item to a cluster. Beast Fang Ridge is strong for Sunny Daisy, Lunar Daisy, and Azur Grass. Blitzwood is better for Orange Cap. Zephyrus Landbridge has the densest Red Cap pins in the current snapshot." },
      { question: "Do map pins guarantee drops?", answer: "No. Counts are placed points in the current atlas. Confirm live yield and respawn in the game." },
      { question: "Should I farm every material I see?", answer: "No. Farm the item blocking the next upgrade, with one backup objective on the same loop." },
      { question: "Are Dewdrop Crystals evolution stones?", answer: "Dewdrop Crystals belong to Resonance in the current records. Check the evolution screen for elemental stones, and keep Dewdrop farming on the Resonance path." }
    ],
  },
  {
    slug: "aniimo-eggs-guide",
    title: "Eggs and hatching",
    seoTitle: "Aniimo Eggs Guide — Hatching, Alpha Eggs & Map Locations",
    seoDescription: "Hatch at an Outpost or Homeland Hatchinator, read what Alpha and Elite labels actually promise, and use Breezy Plains egg pins to pick a region.",
    category: "Eggs",
    readTime: "9 min read",
    heroImage: "/images/database/items/alpha-egg.webp",
    heroAlt: "Alpha Egg item artwork",
    theme: "gold",
    deck: "Hatch at a Hatchinator, then read the shell as a lead. Alpha and named Elite eggs make a narrow promise. Biome eggs do not publish a full species list on this site.",
    thesis: "Hatch the egg, then believe only what the item text and the reveal screen actually say.",
    chapters: [
      {
        id: "hatch",
        label: "Hatchinator",
        title: "How hatching works",
        paragraphs: [
          "Outpost Hatchinators and the Homeland Hatchinator both take eggs. Most records list both; a few special eggs say Outpost only, so read the [[item|/database/items?q=egg]] before you carry it home.",
          "Incubation is a real-time timer. When it hits zero the slot shows ready — that is not the same as claimed. You still confirm an Aniipod, pet through the reveal, and press Claim.",
          "The hatch flow asks you to pick an Aniipod. Ultra and Sparkling Cube guarantees in the item catalogue are written for [[wild catches|/guides/aniimo-catching-guide]]. Use any ordinary pod for a hatch and keep those two for the field."
        ],
        steps: [
          { title: "Open a Hatchinator", body: "Homeland or Outpost. Check the egg text if it names one." },
          { title: "Place the egg", body: "Read element and quality labels before you commit a scarce guaranteed egg." },
          { title: "Wait out the timer", body: "A finished slot is marked ready. Missing the popup does not ruin the egg." },
          { title: "Confirm and Claim", body: "Select the ready egg, confirm the Aniipod, pet the reveal, then Claim. Details is optional before Claim." }
        ],
        link: { label: "Search egg items", href: "/database/items?q=egg" }
      },
      {
        id: "label",
        label: "Labels",
        title: "What the shell can promise",
        paragraphs: [
          "Alpha Egg’s stored text points at a guaranteed Alpha trait. Elite Emberpup Egg names Emberpup and Elite-or-better potential. Those are usable leads because the promise is attached to a specific record.",
          "Elite Egg is broader. Beach, Forest, Grassland, and Blossom eggs mostly confirm that something is inside. Treat biome names as route clues, not as a published hatch table.",
          "Custom Egg Boxes that name BREAK, DPS, Heal, Regen, or Support should be read from that box’s description. Dreamy Egg points at a breeding mutation; Egg Gifted from Flowers starts with a ten-color offering. Both are acquisition leads, not complete odds."
        ],
        table: {
          caption: "What selected egg records on this site currently support.",
          columns: ["Record", "Stored promise", "Still needs the live screen"],
          rows: [
            ["Alpha Egg", "Alpha trait", "Source loop and other hatch details"],
            ["Elite Emberpup Egg", "Emberpup, Elite potential or higher", "Exact acquisition"],
            ["Elite Egg", "Elite-or-higher potential", "Full species pool"],
            ["Beach / Forest / Grassland / Blossom", "Named rare egg", "Guaranteed species or trait"],
            ["Dreamy Egg", "Breeding mutation lead", "Complete breeding rules"]
          ]
        },
        link: { label: "Open egg item records", href: "/database/items?q=egg" }
      },
      {
        id: "plan",
        label: "Map",
        title: "Where to look for eggs",
        paragraphs: [
          "Eggs show up from Stella showers, role-tuned boxes, Institute gifts, Egg Heist, RV dispatches, events, and rare breeding mutations. Most of the useful ones can be aimed at; a few are luck.",
          "On the [[atlas|/map]], pick one label. Breezy Plains currently stores 60 Elite Egg points. Running every layer at once is not a route.",
          "Pair the egg layer with a creature or material you already wanted. Then a miss is still a useful walk. [[Collection|/guides/aniimo-collection-guide]] and [[materials|/guides/aniimo-materials-guide]] are the usual partners."
        ],
        steps: [
          { title: "Pick one egg label", body: "Alpha, Elite, or a named family egg — not every icon." },
          { title: "Add a normal field goal", body: "A habitat, chest line, or material shortfall in the same region." },
          { title: "Record what hatched", body: "Keep the confirmed result. Leave unpublished pools unpublished." },
          { title: "Choose the next collection question", body: "A form, a family branch, or another map layer." }
        ],
        link: { label: "Egg layers on the map", href: "/map" }
      },
      {
        id: "unknowns",
        label: "Limits",
        title: "What this page does not guess",
        paragraphs: [
          "This site does not publish hatch percentages for generic biome eggs. An absent pool in the catalogue means unknown, not empty.",
          "When the live Hatchinator or Egg Handbook shows a condition, that screen outranks an older note. Update the plan from what you see.",
          "Sparkling Cube is a wild-catch device. It does not apply Cube odds to a hatch."
        ],
        note: { title: "Keep the claim small", body: "Quote the egg’s own description. Everything else waits for the reveal." },
        link: { label: "Collection routes", href: "/guides/aniimo-collection-guide" }
      }
    ],
    faq: [
      { question: "Can I hatch at both Outpost and Homeland Hatchinators?", answer: "Yes for most eggs. Some special eggs name an Outpost. Read the item’s use text before you take it home." },
      { question: "Why is a ready egg still in the machine?", answer: "The timer ending is not Claim. Select the ready slot, confirm an Aniipod, pet the reveal, and press Claim." },
      { question: "Does the Aniipod I pick change the hatch?", answer: "The flow asks for a pod, but Ultra and Sparkling Cube guarantees are written for wild catches. Use an ordinary pod and keep the expensive ones for the field." },
      { question: "Does an Alpha Egg always hatch an Alpha?", answer: "The stored Alpha Egg text points at a guaranteed Alpha trait. Confirm the current item description before you spend one." }
    ],
  },
  {
    slug: "aniimo-collection-guide",
    title: "Tracking your collection",
    seoTitle: "Aniimo Collection Guide — Tracker, Forms & Map Routes",
    seoDescription: "Mark missing Aniimo in the local Collection Tracker, verify the exact form, and turn one target into a two-purpose map route.",
    category: "Collection",
    readTime: "9 min read",
    heroImage: "/images/aniimo/helgon.png",
    heroAlt: "Helgon Aniimo artwork",
    theme: "tide",
    deck: "Pick one missing record, check its form and habitat, then run a route that still has a second job if the catch does not appear.",
    thesis: "One missing Aniimo plus a backup objective is a session. A list of 94 blanks is not.",
    chapters: [
      {
        id: "one-target",
        label: "Pick",
        title: "Pick one missing Aniimo",
        paragraphs: [
          "Filter the [[tracker|/tools/collection-tracker]] until you can name one creature, form, or family you actually want. A favorite is a good reason. So is a Wind BREAK gap. A biome-sized backlog is not a route.",
          "Open Details before you travel. [[Helgon|/aniimo/helgon]] is Wind BREAK in Russet Highlands, with Basic and Mountain forms. The tracker’s single checkbox cannot store that split for you."
        ],
        link: { label: "Open Collection Tracker", href: "/tools/collection-tracker" }
      },
      {
        id: "exact-version",
        label: "Verify",
        title: "Check the exact form",
        paragraphs: [
          "Say the full name: Aniimo, form, and stage. That stops the common detour of walking toward a family while meaning a different version. [[Forms and evolution|/guides/aniimo-forms-and-evolution]] is the check.",
          "Collection, evolution, and team use can all be valid. They point at different pages. A base checkbox for the tracker is not the same as a Highland hunt or a stage-three branch."
        ],
        image: { src: "/images/aniimo/helgon.png", alt: "Helgon Aniimo artwork", caption: "Helgon’s profile turns a family-level mark into a Wind/BREAK target in Russet Highlands." },
        link: { label: "Forms and evolution", href: "/guides/aniimo-forms-and-evolution" }
      },
      {
        id: "two-purpose-route",
        label: "Route",
        title: "Pair the hunt with a second goal",
        paragraphs: [
          "Add a material, chest line, egg layer, or mobility test in the same region. Russet Highlands currently stores 51 Sunny Daisy points — a clean partner for a Helgon pass. Open the [[map|/map]] with one creature layer and one backup layer.",
          "Keep the second objective small. You are giving the route a floor, not building a second checklist."
        ],
        steps: [
          { title: "Choose the missing record", body: "Tracker first, then the profile for form and habitat." },
          { title: "Open that region", body: "One creature layer and one backup layer." },
          { title: "Run the loop once", body: "Learn the terrain before optimizing every pin." },
          { title: "Mark the result", body: "A miss can still leave a material count and a better next question." }
        ],
        link: { label: "Open the map", href: "/map" }
      },
      {
        id: "completion",
        label: "After",
        title: "After you find it",
        paragraphs: [
          "Stay on the profile for a minute. Does the element cover a recurring weakness? Does the role give you another way to open BREAK? Does its movement make the route easier? Collection can become a play win. If it looks useful, drop it into [[Team Builder|/team-builder]].",
          "If it never earns a team slot, that is still a complete reason to keep it. Just do not pretend a pretty form is a combat upgrade.",
          "Marks live in this browser. If the list matters, keep a separate note before you clear site data."
        ],
        table: {
          caption: "Let the reason for the target pick the next page.",
          columns: ["You found", "Ask", "Go next"],
          rows: [
            ["A base Aniimo", "Does it add an element, role, or trait?", "Profile and Team Builder"],
            ["A regional form", "What changed besides the look?", "Forms and evolution"],
            ["An egg lead", "What does the item text confirm?", "Eggs guide"],
            ["A family branch", "Collection or planned evolution?", "Evolution records"]
          ]
        },
        link: { label: "Try it in Team Builder", href: "/team-builder" }
      }
    ],
    faq: [
      { question: "Does the Collection Tracker need an account?", answer: "No. Marks are stored in this browser’s local storage. Clearing site data or switching devices can remove them." },
      { question: "Can it track each form separately?", answer: "No. The plus button stores the Aniimo’s base slug. Use the profile for Basic vs Mountain or Highland versions." },
      { question: "How should I pick the next target?", answer: "One record you care about, with a habitat you can open on the map, plus a backup objective in the same region." },
      { question: "Should every catch go on the team?", answer: "No. Collection can be personal. If a new record also fills a job, test it in Team Builder; if not, mark it and move on." }
    ],
  }
];

export function getGuideDossier(slug: string) {
  return guideDossiers.find((guide) => guide.slug === slug);
}
