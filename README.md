# Aniimo

Aniimo is an independent fan-made companion for players exploring Idyll. It brings creature profiles, forms, skills, traits, habitats, maps, and practical planning tools into one place, so a player can move from a question to a useful next step without losing the connections between them.

The site is not affiliated with, endorsed by, sponsored by, or connected to the owners of Aniimo. Game-related names, artwork, and other intellectual property belong to their respective owners.

Visit [aniimo.cc](https://aniimo.cc) to browse the site.

## Development

This site uses Astro's static output. Run `npm install` and `npm run dev` locally. Before deployment, run `npm run audit:roster`, `npm run audit:skills`, `npm run check`, `npm run lint`, and `npm run build`; the audit commands fail when current-source differences remain. `npm run preview` serves the generated `dist/` directory. With the preview running at `http://127.0.0.1:4321`, `npm run test:smoke` checks the sitemap pages and core browser interactions. Vercel serves the static build and applies legacy URL redirects from `vercel.json`.

Creature profiles retain an official wiki snapshot in `src/data/game/aniimo.json`. The wiki index currently has fewer records than this snapshot and its detail endpoint can fail, so `npm run sync:data` deliberately stops when the index is incomplete. The separate `npm run sync:progression` command refreshes factual build item links, resonance stage gates and costs, and research milestones from public AniimoVerse Aniilog pages into `src/data/research/progression.json`. It requires at least 97 parsed profiles before replacing that file. This community data is labeled with its source and review date on each profile; it does not overwrite official snapshot fields. Review changed records before publishing, especially renamed forms and item recommendations.

`npm run sync:achievements` refreshes achievement path, region, rarity, and tier names from the community detail pages. It requires at least 30 of the 31 badge lines to parse before replacing `src/data/research/achievement-details.json`.

`npm run audit:roster` compares the assembled index against the community Aniilog directory and writes a dated coverage report for `/sources`. `npm run sync:item-uses` collects acquisition methods and shop offers for the progression items already linked on creature profiles; it does not claim coverage of the full item catalogue. Database owner links use individual form IDs and can open a profile with `?form=<id>`.

`npm run sync:profile-kits` refreshes current profile and skill descriptions, costs, power, form unlock links, 235 form portraits and seven-field base blocks for all 98 profiles into `src/data/research/current-profile-kits.json`. The live profiles use these current community fields while preserving older wiki form stats separately as a historical model. `npm run audit:skills` compares current skill and form fields against the live AniimoVerse pages and writes `src/data/research/skill-audit.json`. It also records differences in the superseded wiki snapshot for provenance. Review changed records before publishing.

`npm run sync:unreleased` refreshes two clearly separate client-file discovery sections on `/aniimo`: 33 unreleased Aniimo entries with 10 additional forms, plus 15 unreleased form portraits for known Aniimo. The sync requires all three counts to parse and keeps them outside the playable roster and filter counts. Their portrait images are served by the community source CDN.

`npm run sync:roster-additions` refreshes five launch profiles missing from the older wiki snapshot. The live index uses those five alongside 93 species from the snapshot, displays Hexxin under its current name, and places Fennelun under Lunara as a temporary form while preserving both older URLs. Current seven-field base blocks retain their separate schema instead of being forced into the older wiki stat model. Refresh the roster and profile-kit audits after syncing additions.

## What players can do here

- Find a creature by element, role, stage, or form and open its connected records.
- Compare published base fields, skills, traits, habitats, and evolution paths.
- Build a four-Aniimo party and review element and role coverage before a session.
- Browse player-vote results as a popularity snapshot, not a universal power ranking.
- Keep a browser-local checklist of the Aniimo you are still trying to find.
- Compare Homeland work ability levels by form.

## Explore the site

| Page | What it is for |
| --- | --- |
| [Home](https://aniimo.cc/) | Start with the roster, useful tools, popular records, and quick answers. |
| [All Aniimo](https://aniimo.cc/aniimo) | Browse creature profiles by element, role, stage, and form. |
| [Database](https://aniimo.cc/database) | Explore skills, items, traits, elements, habitats, evolutions, materials, bosses, and achievements. |
| [Work Abilities](https://aniimo.cc/database/work-abilities) | Find Homeland workers by ability and compare form-specific levels from the wiki snapshot. |
| [Tier List](https://aniimo.cc/tier-list) | Read player tier choices by role and team use. |
| [Map](https://aniimo.cc/map) | Explore Idyll chests, spawns, puzzles and transporters on the interactive map. |
| [Team Builder](https://aniimo.cc/team-builder) | Choose four Aniimo and review party coverage and base-field summaries. |
| [Player Team Templates](https://aniimo.cc/team-builder/templates) | Open one of six player-made starting shapes, then adapt it to your own roster. |
| [Guides](https://aniimo.cc/guides) | Read practical help for first teams, roles, elements, forms, and exploration choices. |
| [Tools](https://aniimo.cc/tools) | Reach the map, Team Builder, creature comparison, and collection tracker. |
| [Compare](https://aniimo.cc/tools/compare) | Put a short list of Aniimo side by side before choosing a team slot. |
| [Collection Tracker](https://aniimo.cc/tools/collection-tracker) | Keep track of found Aniimo locally in your browser. |
| [Updates](https://aniimo.cc/updates) | Follow release milestones, events, and update highlights. |

## Frequently asked questions

### Is Aniimo an official website?

No. Aniimo is an independent fan-made website. It does not represent the game&apos;s owners, and player-made guides, templates, and rankings are clearly presented as planning aids rather than official instructions.

### Is the Global Vote a combat tier list?

No. It reflects player votes and popularity. Use creature profiles, the comparison tool, and Team Builder when you want to evaluate a specific party decision.

### Does the Collection Tracker require an account?

No. Your selected entries are stored in the local storage of the browser you are using. Clearing browser storage can remove that list.

### How can I report a correction?

Email [wyong@aniimo.cc](mailto:wyong@aniimo.cc) with the page URL, the field that needs review, the date you noticed the issue, and any useful in-game context.

## Legal and contact

- [Privacy Policy](https://aniimo.cc/legal/privacy-policy)
- [Terms of Service](https://aniimo.cc/legal/terms-of-service)
- [Copyright](https://aniimo.cc/legal/copyright)
- [About Us](https://aniimo.cc/legal/about-us)
- [Contact Us](https://aniimo.cc/legal/contact-us)
