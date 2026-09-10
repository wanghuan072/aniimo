export type GuideFieldSection = {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  tone: "route" | "records" | "matchup" | "workbench";
  scene?: { src: string; alt: string; caption: string };
  image?: { src: string; alt: string; caption: string };
  table?: { caption: string; columns: string[]; rows: string[][] };
  note?: { title: string; body: string };
  link?: { label: string; href: string };
};

export const guideFieldNotes: Record<string, [GuideFieldSection, GuideFieldSection]> = {
  "aniimo-beginners-guide": [
    {
      id: "first-hour-route",
      label: "A route you can actually run",
      title: "A first route in Nimbus Fields",
      tone: "route",
      scene: { src: "/images/guides/official/beginner-field.avif", alt: "Pathfinder travelling through an open field with a small Aniimo team", caption: "Keep the first route readable: one familiar companion, one new team question, and enough open ground to notice how each Aniimo changes the trip." },
      paragraphs: [
        "This is the first-hour route, not a new checklist. Start in Nimbus Fields with [[Emberpup|/aniimo/emberpup]] as the familiar anchor, then look for one catch that changes the way the party works. [[Chirpi|/aniimo/chirpi]] gives you a Wind support profile to inspect, while [[Skippy|/aniimo/skippy]] introduces Water and healing. You do not need both immediately.",
        "Before leaving the area, make one short material pass rather than clearing every icon. The current Breezy Plains [[map|/map]] records 36 Lunar Daisy, 16 Orange Cap, 16 Azur Grass, and 6 Turtleback Ore points in Nimbus Field. Pick one layer, follow it until the route is familiar, then turn it off.",
        "Finish by repeating a piece of the route while Twined. Emberpup's Hustle consumes stamina to increase movement speed; [[Bolty|/aniimo/bolty]]'s High Jump solves a different problem by creating vertical reach. If the second pass does not make travel easier, keep the new catch as a team candidate instead of forcing it into a traversal job."
      ],
      image: { src: "/images/aniimo/chirpi.png", alt: "Chirpi Aniimo artwork", caption: "Chirpi and Skippy are useful early comparisons because they add different elements and jobs instead of duplicating Emberpup." },
      table: {
        caption: "A compact first-session route built from current profile and Breezy Plains map records.",
        columns: ["Stop", "What to do", "What the stop teaches"],
        rows: [
          ["Emberpup profile", "Read Fire, DPS, Fire Bolt, Hustle, and the listed habitats", "How profile fields connect combat, movement, and location"],
          ["Nimbus Fields", "Compare Chirpi and Skippy before choosing one catch target", "Why a new role matters more than another portrait"],
          ["One material layer", "Run Lunar Daisy, Orange Cap, Azur Grass, or Turtleback Ore—not all four", "How to turn the map into a route instead of a wall of pins"],
          ["Repeat while Twined", "Compare Emberpup's speed with a movement tool such as Bolty's High Jump", "Whether the field ability solves the terrain you are actually crossing"]
        ]
      },
      link: { label: "Open the Breezy Plains map", href: "/map" }
    },
    {
      id: "first-roster",
      label: "Three early jobs",
      title: "Emberpup, Skippy, and Leafy",
      tone: "records",
      paragraphs: [
        "Use these three records as a readable test, not a recommended party. Keep [[Emberpup|/aniimo/emberpup]] as the direct attacker, add [[Skippy|/aniimo/skippy]] when you want a recovery button, and study [[Leafy|/aniimo/leafy]] when energy support becomes the issue. Fire Bolt costs 10 EP and applies Fire Debuff; Healing Water costs 20 EP and heals the party; Blooms of Vigor creates a field that restores EP to Grass teammates.",
        "Take that trio into an ordinary encounter and watch what you actually press. If Healing Water sits unused, sustain may not be the missing job yet. If you constantly wait for EP, Leafy's field becomes worth testing. If Emberpup handles the encounter but the route feels slow, the next catch should probably solve movement rather than replace your attacker.",
        "This is the habit worth carrying beyond the tutorial: change one job, replay one familiar situation, and keep the change only if you can feel the difference. [[Team Builder|/team-builder]] can show roles and elements, but the field tells you whether the plan belongs to the way you play."
      ],
      image: { src: "/images/aniimo/skippy.png", alt: "Skippy Aniimo artwork", caption: "Skippy's Healing Water is a clear early example of a catch adding a new job rather than another copy of the same role." },
      table: {
        caption: "Three records that expose different team questions without pretending to be a final composition.",
        columns: ["Aniimo", "Visible job", "Concrete record", "Question to test"],
        rows: [
          ["Emberpup", "Fire DPS", "Fire Bolt: 10 EP, 30 Power, 1s cooldown, 100% recorded BREAK", "Can the anchor handle ordinary pressure reliably?"],
          ["Skippy", "Water healing", "Healing Water: 20 EP, 20s cooldown, party heal based on caster max HP", "Do you use recovery often enough to reserve a slot for it?"],
          ["Leafy", "Grass/Water energy support", "Blooms of Vigor: 10 EP, 20s cooldown, restores EP to Grass teammates in its field", "Does your actual rotation benefit from the field condition?"]
        ]
      },
      note: { title: "Do not copy this trio blindly", body: "The records are used because their jobs are easy to read. Keep your favorite anchor and use the same comparison method with the Aniimo you have." },
      link: { label: "Test the three jobs in Team Builder", href: "/team-builder" }
    }
  ],
  "aniimo-forms-and-evolution": [
    {
      id: "emberpup-forms",
      label: "One name, three field records",
      title: "Emberpup's three forms",
      tone: "records",
      scene: { src: "/images/guides/official/forms-roster.avif", alt: "Aniimo roster screen showing multiple creatures and progression records", caption: "A family is easier to plan when its records are visible together. Compare the version, element, and future job before committing materials to a branch." },
      paragraphs: [
        "The base [[Emberpup|/aniimo/emberpup]] record is Fire/DPS and appears across Nimbus Fields, Mistwoods, The Argent Strait, Echoback Landing, and Beast Fang Ridge. The Highland record adds Rock to the element line and points to Zephyrus Landbridge and Russet Highlands. The Mountain Woods record stays Fire/DPS but narrows the listed habitat to Beast Fang Ridge. Those differences are already enough to change a hunt.",
        "If you want the Highland version, searching every Emberpup marker is wasted effort. Start from its two listed regions and compare the Fire/Rock profile with the Fire-only base record before deciding that the rarer-looking form is automatically better. Added coverage can help one matchup while adding another resistance problem elsewhere.",
        "The Mountain Woods version is a different decision again. Its value may be the exact form you want or the Beast Fang Ridge route it gives you, not an extra element. Treating all three as one checkbox hides the part of collection and planning that is actually interesting."
      ],
      image: { src: "/images/aniimo/forms/10002771.png", alt: "Highland Emberpup form artwork", caption: "Highland Emberpup is listed as Fire/Rock and has a different habitat record from the base and Mountain Woods versions." },
      table: {
        caption: "Current Emberpup form records in the site database.",
        columns: ["Record", "Element / role", "Listed habitat", "Player decision"],
        rows: [
          ["Emberpup · Basic", "Fire / DPS", "Nimbus Fields, Mistwoods, Argent Strait, Echoback Landing, Beast Fang Ridge", "The broadest starting hunt and the cleanest Fire comparison"],
          ["Emberpup · Highland", "Fire + Rock / DPS", "Zephyrus Landbridge, Russet Highlands", "A separate route and matchup profile"],
          ["Emberpup · Mountain Woods", "Fire / DPS", "Beast Fang Ridge", "A form-specific collection target in one listed habitat"]
        ]
      },
      link: { label: "Compare Emberpup form records", href: "/aniimo/emberpup" }
    },
    {
      id: "emberpup-branches",
      label: "The later branch is the real commitment",
      title: "Stage-three records",
      tone: "workbench",
      paragraphs: [
        "The published family line begins Emberpup → Flameruff, then reaches two stage-three records: [[Scorchhowl|/aniimo/scorchhowl]] and [[Inferlupa|/aniimo/inferlupa]]. Scorchhowl remains a Fire DPS record. Inferlupa is Fire/Dark, carries a BREAK role, and lists Full Energy as its trait. That is not a cosmetic fork; it is a choice between continuing the family's familiar job and moving the slot toward another team function.",
        "Open both destinations before farming. If the party already has dependable damage but struggles to create an opening, Inferlupa's BREAK label deserves a test. If the reason you kept the family was its direct Fire damage, Scorchhowl is the cleaner continuation to inspect. The correct branch is the one that answers the party you actually use, not the one that looks furthest from the starting portrait.",
        "Material records should come after that decision. The database can show the items and evolution links currently stored, but a name in a catalogue is not proof of a complete live recipe. Confirm the final quantities in the current game screen before spending or committing to a long route."
      ],
      image: { src: "/images/aniimo/inferlupa.png", alt: "Inferlupa Aniimo artwork", caption: "Inferlupa changes the family question by adding Dark and a BREAK role instead of simply extending the Fire DPS line." },
      table: {
        caption: "Read the two stage-three records as team destinations, not as interchangeable endpoints.",
        columns: ["Destination", "Stored identity", "Choose it when…", "Verify before investing"],
        rows: [
          ["Scorchhowl", "Stage 3 · Fire · DPS", "You want to continue the family's direct Fire job", "Current evolution requirements and the skills you plan to use"],
          ["Inferlupa", "Stage 3 · Fire/Dark · BREAK · Full Energy", "The party needs a different element line or more BREAK pressure", "Current branch condition, materials, and how Full Energy fits the rotation"]
        ]
      },
      note: { title: "Decide the destination first", body: "A material route is useful only after the branch has a job. Otherwise the inventory grows while the actual team question stays unanswered." },
      link: { label: "Open evolution records", href: "/database/evolutions" }
    }
  ],
  "aniimo-combat-guide": [
    {
      id: "skill-ledger",
      label: "Read the numbers that change timing",
      title: "Skill cost, cooldown, and BREAK",
      tone: "records",
      scene: { src: "/images/guides/official/combat-alpha.avif", alt: "Aniimo team fighting a large Alpha creature in real-time combat", caption: "In a live fight, BREAK pressure, survival, and the action saved for the opening all compete for the same few seconds." },
      paragraphs: [
        "A skill with a large BREAK value is not automatically the button you should press first. Electrified Impact and Lightning Cross both carry a recorded 150% BREAK value on [[Blazen|/aniimo/blazen]]'s profile, but they spend 20 EP in different ways: one is a dash that restores EP on a critical hit, while the other can hit up to three times and gains critical chance. The same headline number creates two different decisions.",
        "Support skills move the timing again. Skippy's Healing Water spends 20 EP on party recovery and has a 20-second cooldown. Leafy's Blooms of Vigor costs 10 EP, also has a 20-second cooldown, and creates an energy-support field for Grass teammates. If you press either just because the gauge is full, it may be unavailable when its actual condition arrives.",
        "Treat the database values as a ledger, not a solved rotation. The BREAK percentages below are the values stored on the skill records; they are not a claim about a universal enemy gauge formula. What the ledger does tell you is which buttons deserve a controlled test and which resource conflict you need to watch."
      ],
      image: { src: "/images/aniimo/blazen.png", alt: "Blazen Aniimo artwork", caption: "Blazen's two 150% BREAK records still ask different questions because their targeting and critical effects are different." },
      table: {
        caption: "Selected current skill records. Values describe the stored skill fields, not a universal combat formula.",
        columns: ["Skill", "Owner", "EP / cooldown", "Power / BREAK", "What changes the timing"],
        rows: [
          ["Fire Bolt", "Emberpup family", "10 EP / 1s", "30 / 100%", "Applies two Fire Debuff stacks for five seconds"],
          ["Electrified Impact", "Blazen", "20 EP / 0s", "33 / 150%", "Dash; restores 5 EP on a critical hit"],
          ["Lightning Cross", "Blazen", "20 EP / 1s", "45 / 150%", "Up to three hits; +50% critical chance"],
          ["Pause Gust", "Tubster", "15 EP / 1s", "48 / 150%", "Two whirlwinds pull, then explode"],
          ["Healing Water", "Skippy / Pranky / Glacy", "20 EP / 20s", "Healing / —", "Party heal plus recovery over five seconds"],
          ["Blooms of Vigor", "Leafy", "10 EP / 20s", "Support / —", "Field restores EP to Grass teammates"]
        ]
      },
      link: { label: "Browse all skill records", href: "/database/skills" }
    },
    {
      id: "rotation-example",
      label: "One controlled combat test",
      title: "A 30-second test rotation",
      tone: "workbench",
      paragraphs: [
        "Use a familiar encounter and enter with one question: can [[Tubster|/aniimo/tubster]] help create a cleaner opening for the damage slot? Start with Pause Gust when the pull can gather the target, note the gauge movement, and keep Gale Guard for the moment incoming pressure would otherwise force you out.",
        "When the opening appears, spend the damage action you deliberately saved. If Blazen is the finisher, compare Electrified Impact with Lightning Cross instead of pressing both on cooldown. The first can pay back EP on a critical hit; the second leans harder into a multi-hit critical attempt. After the fight, the useful note is not ‘Blazen felt strong’. It is ‘the dash kept the rotation moving’ or ‘the cross was easier to place inside the window’.",
        "Run the same test twice before changing another slot. A bad first attempt may be positioning, unfamiliar targeting, or a missed window rather than a roster failure. Only replace the Aniimo when you can name the repeated problem the replacement is supposed to solve."
      ],
      image: { src: "/images/aniimo/tubster.png", alt: "Tubster Aniimo artwork", caption: "Tubster gives the test a clear question: can control and defensive timing create a better window for the team's damage action?" },
      table: {
        caption: "A field note should record the decision, not only the result.",
        columns: ["Moment", "Button to watch", "Question after the attempt"],
        rows: [
          ["Approach", "Pause Gust", "Did the pull make the target easier to pressure or only move it?"],
          ["Incoming threat", "Gale Guard", "Did the stance and shield preserve position long enough to keep pressure?"],
          ["Opening", "Electrified Impact or Lightning Cross", "Which action fit the available window and EP state?"],
          ["Review", "No new button", "Was the failure timing, targeting, resistance, survival, or missing BREAK?"]
        ]
      },
      note: { title: "Change one variable", body: "Use the same encounter, same core team, and one swapped skill or Aniimo. Otherwise the result cannot tell you what fixed the problem." },
      link: { label: "Compare the tested profiles", href: "/tools/compare" }
    }
  ],
  "aniimo-elements-guide": [
    {
      id: "type-chart-snapshot",
      label: "Current matchup snapshot",
      title: "Strong and resisted matchups",
      tone: "matchup",
      paragraphs: [
        "The chart stored on this site uses 1.6× for a super-effective matchup and 0.625× for a resisted matchup. Start with the element of the skill you plan to press, then move across that row to the target element. Fire, for example, is strong into Grass and Ice, but resisted by Fire, Water, Rock, and Holy. Open the [[type chart|/tools/type-chart]] or the [[element directory|/database/elements]].",
        "Forms need a second check. [[Coraliz|/aniimo/coraliz]]'s base record is Rock/Water, while its Rainstorm form is Rock-only; both list Crescent Bay as the habitat. Removing Water changes the matchup questions even though the creature name and route stay familiar. Check the form first, then the skill's actual element; do not infer the action from the portrait. See [[Forms and evolution|/guides/aniimo-forms-and-evolution]].",
        "This matrix is a current database snapshot and can change with the live game. Use it to pick a sensible test, then let the current combat result override an older saved assumption."
      ],
      image: { src: "/images/aniimo/forms/10002810.png", alt: "Rainstorm Coraliz Rock form artwork", caption: "Rainstorm Coraliz drops Water from the base Rock/Water record, so verify the exact form before applying the chart." },
      table: {
        caption: "Attacking element → current strong and resisted targets. Neutral targets are omitted for faster reading.",
        columns: ["Attack", "1.6× into", "0.625× into"],
        rows: [
          ["Fire", "Grass, Ice", "Fire, Water, Rock, Holy"],
          ["Water", "Fire, Rock", "Water, Grass, Ice, Holy"],
          ["Grass", "Water, Rock", "Fire, Grass, Holy"],
          ["Electric", "Water, Wind", "Electric, Ice, Rock"],
          ["Ice", "Water, Electric", "Fire, Ice, Rock, Wind"],
          ["Rock", "Electric, Ice", "Water, Grass, Rock, Dark"],
          ["Wind", "Grass, Dark", "Electric, Wind"],
          ["Holy", "Wind, Dark", "Electric, Holy"],
          ["Dark", "Fire, Grass, Holy", "Water, Wind"]
        ]
      },
      link: { label: "Use the interactive type chart", href: "/tools/type-chart" }
    },
    {
      id: "matchup-swaps",
      label: "Keep the team, change the answer",
      title: "One swap for a bad matchup",
      tone: "workbench",
      scene: { src: "/images/guides/official/elements-battle.avif", alt: "Two Aniimo using contrasting elemental attacks in battle", caption: "Element coverage matters when two attacks meet in a real encounter—not only as colored icons in a builder." },
      paragraphs: [
        "Suppose [[Emberpup|/aniimo/emberpup]] is your favorite attacker and a Water target keeps slowing the run. Fire is resisted by Water in the current chart, so replacing the entire party is an overreaction. A Grass or Electric attacking option gives you the 1.6× route into Water while Emberpup stays available for Grass and Ice targets later in the session. [[Leafy|/aniimo/leafy]] is a readable Grass test; [[Team Builder|/team-builder]] is where the swap happens.",
        "Now take an Ice target. Fire is strong into Ice, but an Electric attack is resisted. That means an Electric specialist who solved the previous problem should not automatically lead every fight. The player's job is to carry a second answer and recognize when to use it, not to declare one element universally superior.",
        "When a form changes elements, run this check again. Compare the exact form record, the skill element, and the target. Three quick reads prevent most ‘the chart is wrong’ moments that are really a mismatch between the base profile and the version on screen."
      ],
      image: { src: "/images/aniimo/leafy.png", alt: "Leafy Grass and Water Aniimo artwork", caption: "Leafy can be studied as a Grass route into Water targets, but the skill element still matters more than the portrait alone." },
      table: {
        caption: "Examples of solving the matchup while preserving the team's identity.",
        columns: ["Recurring target", "Current attack problem", "Smallest useful test"],
        rows: [
          ["Water", "Fire is resisted", "Keep the core; test one Grass or Electric attacking option"],
          ["Ice", "Electric is resisted", "Return to a Fire or Rock attack instead of replacing every Electric teammate"],
          ["Dark", "Rock is resisted", "Test Wind or Holy coverage in the slot that already feels flexible"],
          ["Holy", "Fire, Water, and Grass are resisted", "Look for a Dark attack and verify the exact skill element"]
        ]
      },
      note: { title: "Coverage is a button, not a badge", body: "An Aniimo having two elements does not guarantee the skill you need. Open the skill record and confirm what the action actually deals." },
      link: { label: "Compare candidate Aniimo", href: "/tools/compare" }
    }
  ],
  "aniimo-traits-guide": [
    {
      id: "named-traits",
      label: "Read six real triggers",
      title: "Six traits and their triggers",
      tone: "records",
      paragraphs: [
        "[[Emberpup|/aniimo/emberpup]]'s Scorching Flames is easy to test: it grants 15% more damage against enemies weak to the element. The [[chart|/tools/type-chart]] tells you where the condition exists, and a familiar target tells you whether the bonus supports the fights you run. If you rarely attack a weakness, the trait is not giving you its headline value consistently.",
        "Other traits ask for a team habit. [[Tubster|/aniimo/tubster]]'s Victory Concerto improves BREAK efficiency while shielded and adds team effects after BREAK and multiple Movement buffs. [[Leafy|/aniimo/leafy]]'s Power of Nature works from off field after the active teammate uses three skills. [[Witchin|/aniimo/witchin]]'s Prank operates on an 18-second cycle and rewards Dark basic attacks against the cursed target. Those are rotation instructions hiding inside [[trait records|/database/traits]].",
        "[[Glacy|/aniimo/glacy]]'s Water Spirit is terrain-bound, while [[Blazen|/aniimo/blazen]]'s Power Sustain counts skill critical hits before entering an Overcharged state. Neither should be rated from the last sentence alone. First ask how often your route supplies the terrain or your build supplies the critical events; then decide whether the reward is reliable enough for your team."
      ],
      image: { src: "/images/aniimo/tubster.png", alt: "Tubster Aniimo artwork", caption: "Victory Concerto is not simply a BREAK bonus: shields, BREAK timing, and Movement buffs determine how much of the trait the team actually receives." },
      table: {
        caption: "Named trait examples from current profile records.",
        columns: ["Trait / owner", "Trigger or condition", "Player test"],
        rows: [
          ["Scorching Flames · Emberpup", "Enemy is weak to the element; +15% damage", "Repeat one weak and one neutral matchup"],
          ["Victory Concerto · Tubster", "Shielded state, BREAK trigger, and Movement buffs", "Watch whether shield uptime overlaps the pressure window"],
          ["Water Spirit · Glacy", "Water terrain; skill EP cost reduced by 10%", "Compare the same rotation in and out of water terrain"],
          ["Power of Nature · Leafy", "Off field; teammate uses three skills", "Count skills and look for the grass creation timing"],
          ["Prank · Witchin", "18s cycle; curse, then Dark basic attacks", "Check whether the party can exploit the curse before it expires"],
          ["Power Sustain · Blazen", "Six skill critical hits; six-second Overcharged state", "Measure how often the build reaches the state in a normal fight"]
        ]
      },
      link: { label: "Browse trait records", href: "/database/traits" }
    },
    {
      id: "trait-field-test",
      label: "A three-run trait test",
      title: "Test a trait in three runs",
      tone: "workbench",
      scene: { src: "/images/guides/official/traits-battle.avif", alt: "Pathfinder and Aniimo using a fiery skill during a rainy encounter", caption: "A trait earns its slot in the messy part of a real encounter, where its trigger has to fit positioning, timing, and the rest of the rotation." },
      paragraphs: [
        "Pick an encounter you already know and run it once without trying to force the trait. This gives you the normal rhythm: how often skills are pressed, when shields appear, and whether the fight lasts long enough for an 18-second or six-crit condition. A trigger that never appears in the baseline is already telling you something.",
        "On the second run, create the condition deliberately. Keep Tubster shielded before working toward BREAK, leave Leafy off field while the active teammate reaches three skills, or hold Dark basics for Witchin's curse. If the setup makes the rest of the rotation clumsy, include that cost in the verdict. [[Combat|/guides/aniimo-combat-guide]] is the loop this test sits inside.",
        "The third run is the honest one: play normally again, but now recognize the cue. A good fit should appear naturally often enough that you notice its reward without turning the whole fight into maintenance. Record the trigger, the recipient, and the moment it changed. ‘Strong passive’ is not a useful field note; ‘saved 10% EP on the water route’ is."
      ],
      image: { src: "/images/aniimo/glacy.png", alt: "Glacy Aniimo artwork", caption: "Glacy's Water Spirit is a clean test case because terrain decides whether the EP reduction is active." },
      table: {
        caption: "Use three runs to separate tooltip excitement from repeatable value.",
        columns: ["Run", "How to play", "What to record"],
        rows: [
          ["Baseline", "Normal rotation; do not force the trait", "Whether the trigger appears on its own"],
          ["Forced condition", "Build deliberately around the trigger", "Setup cost, uptime, and who receives the reward"],
          ["Natural repeat", "Return to normal play but watch the cue", "Whether the payoff survives outside a demonstration"]
        ]
      },
      note: { title: "Traits are team rules", body: "If the trigger asks for shields, terrain, crits, or a specific element, count how often the current team provides that condition before comparing the reward." },
      link: { label: "Check the team around the trait", href: "/team-builder" }
    }
  ],
  "aniimo-materials-guide": [
    {
      id: "breezy-plains-loops",
      label: "Three routes with a clear purpose",
      title: "Three Breezy Plains loops",
      tone: "route",
      scene: { src: "/images/guides/official/materials-route.avif", alt: "Pathfinder gliding over a wide Idyll landscape while planning a route", caption: "A repeatable farming route follows the landscape. The map chooses the starting cluster; the terrain decides which detours are actually worth keeping." },
      paragraphs: [
        "Beast Fang Ridge is the strongest mixed plant loop in the current map snapshot: 53 Sunny Daisy, 49 Lunar Daisy, and 33 Azur Grass points are tagged there. That does not mean you should collect all 135 markers. Choose the one material blocking the next upgrade, learn a compact pass through its cluster, and let nearby pickups remain a bonus. Start on the [[map|/map]] with one layer.",
        "Blitzwood favors a different bag. Its records include 51 Sunny Daisy, 53 Orange Cap, and 6 Turtleback Ore points. If the shortfall is Red Cap, Zephyrus Landbridge is the clearer first look with 80 points, while Mistwoods carries 55 and can support a route that also searches 29 Sunny Daisy and 20 Azur Grass points.",
        "These counts describe pins in the site's current Breezy Plains dataset, not guaranteed live yields or respawn rates. The map helps you choose where to start and which layer to keep visible. Your current game state decides what is actually available when you arrive."
      ],
      image: { src: "/images/map/poi/aniimotools/items/sunny-daisy.webp", alt: "Sunny Daisy map marker artwork", caption: "A useful farming plan starts from one named shortfall and the region where its current map points are concentrated." },
      table: {
        caption: "Selected map-point concentrations from the current Breezy Plains dataset.",
        columns: ["Loop", "Recorded concentrations", "Best reason to start here"],
        rows: [
          ["Beast Fang Ridge", "Sunny Daisy 53 · Lunar Daisy 49 · Azur Grass 33", "A plant-focused pass with three strong nearby layers"],
          ["Blitzwood", "Orange Cap 53 · Sunny Daisy 51 · Turtleback Ore 6", "Orange Cap first, with useful secondary pickups"],
          ["Zephyrus Landbridge", "Red Cap 80", "The most concentrated named Red Cap route in this snapshot"],
          ["Mistwoods", "Red Cap 55 · Sunny Daisy 29 · Lunar Daisy 27 · Azur Grass 20", "A broader mixed route when Red Cap remains the main target"]
        ]
      },
      link: { label: "Filter material layers on the map", href: "/map" }
    },
    {
      id: "farm-session-ledger",
      label: "Write down the stop condition",
      title: "When to stop the loop",
      tone: "workbench",
      paragraphs: [
        "Before leaving town, write one line: the upgrade, the missing material, and the quantity still needed. That sentence prevents the common farming drift where every nearby icon becomes part of the job. If the live screen says you need six more, the route ends at six even if the map still has visible pins.",
        "After one loop, compare the map with what happened. A marker may be unavailable, already collected, above or below the route you took, or simply slower to reach than the next cluster. Remove poor detours from the second pass. The best route is the one you can repeat comfortably, not the one that touches the most pins on a screenshot.",
        "When the shortfall reaches zero, return to the upgrade screen and verify the full requirement again. Evolution and crafting records on the site help connect names, but they should not replace the current in-game quantities. Fund the decision you already made, then choose the next project; do not keep farming because the layer is still turned on. [[Forms and evolution|/guides/aniimo-forms-and-evolution]] is the usual next page.",
      ],
      image: { src: "/images/map/poi/aniimotools/items/red-cap.webp", alt: "Red Cap map marker artwork", caption: "For Red Cap, start with the concentrated Zephyrus or Mistwoods record, then trim the route after one real pass." },
      table: {
        caption: "A small ledger keeps the route attached to the upgrade.",
        columns: ["Before the run", "After one loop", "Stop"],
        rows: [
          ["Name one upgrade and exact shortfall", "Remove slow or unavailable detours", "Required quantity reached"],
          ["Turn on one primary material layer", "Keep only a nearby secondary pickup", "Live upgrade screen confirms the requirement"],
          ["Choose one region and starting point", "Note terrain or verticality that changed the route", "Next trip would be inventory for its own sake"]
        ]
      },
      note: { title: "Map points are planning data", body: "They do not promise drop quantity, refresh timing, or availability in your current world state. Use the live result to edit the second loop." },
      link: { label: "Check material item records", href: "/database/materials" }
    }
  ],
  "aniimo-eggs-guide": [
    {
      id: "egg-records",
      label: "What the item record really promises",
      title: "Alpha, Elite, and named eggs",
      tone: "records",
      paragraphs: [
        "The [[Alpha Egg|/database/items?q=alpha-egg]] record makes the narrowest useful promise: it is a key item whose description identifies a guaranteed Alpha trait. The [[Elite Emberpup Egg|/database/items?q=elite-emberpup-egg]] is also specific, naming [[Emberpup|/aniimo/emberpup]] and an Elite-potential-or-higher result. Those labels can guide a collection decision because the promise is attached to a particular stored record.",
        "Elite Egg is broader, while Beach, Forest, Grassland, and Blossom Egg records mostly confirm that a mysterious life stirs inside. A biome-like name may be a good route clue, but it is not enough to publish a guaranteed species list. Likewise, the Custom Egg Box categories—BREAK, DPS, Heal, REGEN, Support, and Legendary—should be read from their exact item descriptions rather than merged into one universal hatch rule.",
        "Dreamy Egg and Egg Gifted from Flowers carry unusual acquisition leads in their records: Dreamy Egg refers to an Incredible mutation during breeding, while Egg Gifted from Flowers begins with an offering of ten colors. Those are leads worth recognizing, not permission to fill in missing quantities, timing, or outcome tables."
      ],
      image: { src: "/images/database/items/elite-emberpup-egg.webp", alt: "Elite Emberpup Egg item artwork", caption: "A named egg can make a narrow promise. Keep that promise separate from rules the record does not state." },
      table: {
        caption: "Current item-record boundaries for selected eggs.",
        columns: ["Record", "What the stored description supports", "What still needs live verification"],
        rows: [
          ["Alpha Egg", "Guaranteed Alpha trait", "Source loop, hatch procedure, and other result details"],
          ["Elite Emberpup Egg", "Emberpup with Elite potential or higher", "Exact acquisition and complete hatch conditions"],
          ["Elite Egg", "An Elite-or-higher promise in the record", "Full species pool and repeatable source"],
          ["Beach / Forest / Grassland / Blossom", "Named rare eggs with life inside", "Guaranteed species, trait, or biome outcome"],
          ["Dreamy Egg", "Record points to an Incredible mutation during breeding", "Complete mutation and breeding rules"]
        ]
      },
      link: { label: "Search egg item records", href: "/database/items?q=egg" }
    },
    {
      id: "egg-map-plan",
      label: "Use counts to choose a region",
      title: "Egg pins on the map",
      tone: "route",
      scene: { src: "/images/guides/official/egg-heist.avif", alt: "Aniimo Egg Heist real-time encounter in the field", caption: "Egg Heist is a live search-and-battle activity. Map counts can plan the visit, but the current game session decides what is available." },
      paragraphs: [
        "The current Breezy Plains atlas contains 60 Elite Egg, 22 Highland Egg, 14 Alpha Egg, 11 Forest Egg, 11 Grassland Egg, and 9 Blossom Egg points. It also carries single records for Baleetle Egg, Egg of Prayers, Elite Emberpup Egg, Gift of the Branch, and Incredible Grassland Egg. That breadth makes Breezy Plains the better place to learn egg layers on the [[map|/map]], but it also makes an ‘all eggs’ route impractical.",
        "For Elite Egg, start with one sub-area rather than all sixty points. Echoback Landing, Nimbus Field, and Rosetower each carry seven in the current snapshot; Sea of Flowers has six and Driftwise Meadow five. Alpha Egg points are spread broadly, so turn off other egg layers and pair the hunt with a creature, chest, or material objective in the same region.",
        "Whisperwake Isles is a much smaller check in the current atlas: six Elite Egg points and one Alpha Egg point. That can be useful when you already plan to visit the archipelago. It is not evidence that the region has better rates—the count only tells you how many points the stored map currently exposes."
      ],
      image: { src: "/images/database/items/alpha-egg.webp", alt: "Alpha Egg item artwork", caption: "Alpha Egg has fourteen recorded Breezy Plains points in the current map snapshot, but a pin count is not a drop-rate claim." },
      table: {
        caption: "Egg-layer counts in the current local atlas data.",
        columns: ["Atlas / area", "Recorded egg points", "How to use the count"],
        rows: [
          ["Breezy Plains · all areas", "Elite 60 · Highland 22 · Alpha 14 · Forest 11 · Grassland 11 · Blossom 9", "Choose one label; do not display every layer"],
          ["Echoback / Nimbus / Rosetower", "7 Elite Egg points each", "Pick the area that supports another objective"],
          ["Sea of Flowers / Driftwise", "6 / 5 Elite Egg points", "Use as smaller sub-routes inside Breezy Plains"],
          ["Whisperwake Isles", "Elite 6 · Alpha 1", "Add a short egg check to an existing archipelago trip"]
        ]
      },
      note: { title: "Count pins, not promises", body: "The atlas can show where a recorded egg point sits. It cannot, by itself, prove availability, respawn timing, hatch odds, or the result in your current game version." },
      link: { label: "Open egg layers on the map", href: "/map" }
    }
  ],
  "aniimo-collection-guide": [
    {
      id: "tracker-controls",
      label: "What the tool actually remembers",
      title: "What the tracker remembers",
      tone: "records",
      scene: { src: "/images/guides/official/collection-roster.avif", alt: "Aniimo roster interface showing collected creatures and progression entries", caption: "The collection becomes useful when the roster view leads to a specific form, habitat, or team experiment you want to pursue next." },
      paragraphs: [
        "The [[Collection Tracker|/tools/collection-tracker]] has three useful controls: search, All/Owned/Missing filters, and the plus button on each Aniimo card. Marking a card stores that Aniimo slug in this browser's local storage and updates the progress bar. There is no account sync, form-level checkbox, import from the game, or automatic proof that a creature was caught.",
        "That limitation should shape the way you use it. Treat the tool as a personal shortlist for the device in front of you. If you clear site data or switch browsers, the marks may not follow. When a family has several forms, use the base checkbox as a reminder and open the profile to record which exact form or stage you still care about.",
        "The Missing filter is the best starting point, but it should not choose the session for you. Search a favorite name, open Details, and confirm habitat, form, and role before you build a route. One deliberate target gives the tracker a job; clicking ninety-four plus signs only turns it into another maintenance screen."
      ],
      image: { src: "/images/aniimo/helgon.png", alt: "Helgon Aniimo artwork used as a collection target", caption: "Use the tracker to hold a target, then open its profile for the form, habitat, skills, and family details the checkbox cannot store." },
      table: {
        caption: "Current Collection Tracker behavior in this site.",
        columns: ["Control", "What it does", "What it does not do"],
        rows: [
          ["＋ / ✓", "Stores or removes the Aniimo slug in local browser storage", "Verify an in-game catch or track each form separately"],
          ["Owned", "Shows records marked on this browser", "Import a roster from an Aniimo account"],
          ["Missing", "Shows unmarked base roster records", "Rank which target matters most to you"],
          ["Search", "Narrows cards by Aniimo name", "Search habitats, traits, stages, or item requirements"],
          ["Details", "Opens the full Aniimo profile", "Keep notes inside the tracker"]
        ]
      },
      link: { label: "Open the Collection Tracker", href: "/tools/collection-tracker" }
    },
    {
      id: "collection-session",
      label: "A complete tracker-to-map example",
      title: "Helgon in Russet Highlands",
      tone: "route",
      paragraphs: [
        "Imagine [[Helgon|/aniimo/helgon]] is still unmarked. Search its name in the tracker, open Details, and read the target before traveling: the current profile lists Wind, a BREAK role, and Russet Highlands as its habitat. It also separates a Basic Form from a Mountain Form, something the tracker’s single family-level checkbox cannot express for you. [[Forms and evolution|/guides/aniimo-forms-and-evolution]] is the check for that split.",
        "Choose Russet Highlands and add Sunny Daisy as the route partner; the current Breezy Plains snapshot records 51 Sunny Daisy points there. Keep the creature search and one material layer visible on the [[map|/map]]. If Helgon does not appear during the pass, the outing still returns a named resource and teaches you a region attached to the profile.",
        "After the run, mark Helgon only if that family-level reminder is useful to you, and keep the exact Mountain Form goal in your own short note. If its Wind/BREAK identity answers a team problem, test the record in [[Team Builder|/team-builder]]. If you want it only because the form appeals to you, that is also a complete reason to collect it."
      ],
      image: { src: "/images/aniimo/helgon.png", alt: "Helgon Aniimo collection target artwork", caption: "Helgon's profile turns a family-level tracker mark into a Wind/BREAK target in Russet Highlands, with Basic and Mountain form records to distinguish." },
      table: {
        caption: "One target moving through the site's connected tools.",
        columns: ["Page", "Decision", "Result carried forward"],
        rows: [
          ["Collection Tracker", "Choose Helgon from Missing or Search", "One family-level target"],
          ["Helgon profile", "Read Wind, BREAK, Russet Highlands, and the Mountain Form record", "Exact version, job, and region"],
          ["Interactive map", "Open Russet Highlands; add Sunny Daisy as the second objective", "A route that still has value if the catch is missed"],
          ["Team Builder", "Test whether a Wind/BREAK record fills a real gap", "A gameplay use—or an honest collection-only result"]
        ]
      },
      note: { title: "Back up what matters", body: "Tracker marks live in local browser storage. If the collection is important, keep a separate note before clearing browser data or moving to another device." },
      link: { label: "Read the Helgon profile", href: "/aniimo/helgon" }
    }
  ]
};

export function getGuideFieldNotes(slug: string) {
  return guideFieldNotes[slug] || [];
}
