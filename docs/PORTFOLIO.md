# shreya.codes - how this site is put together

A personal portfolio for Shreya Chourasia, built on the layout and motion of
artofadditti.com. Two artwork variants render the same content so they can be judged
side by side.

| route | artwork |
|---|---|
| `/` `/about` `/contact` | **code pack** - hand-authored SVG + Shreya's photos |
| `/original` `/original/about` `/original/contact` | **original pack** - artofadditti's artwork, kept as a private design reference |

A switcher pinned to the bottom-centre flips between them and keeps you on the same page.

> The original pack is reference only. That artwork is Aditi Kulkarni's and must not ship
> on the public site - see `docs/research/www-artofadditti-com-69cfdfac/ARTIFACT_MANIFEST.md`.

## Where to change things

### Words - `src/content/shreya.ts`
One file, everything: name, role, email, socials, nav, hero heading, the five projects,
the three services, About copy, CTA, footer columns, and the Tally embed URL. Both packs
read from it, so a copy edit shows up in both variants at once.

**The contact form** is Tally form `XxbZBP`, embedded with `transparentBackground=1` so
the paper grid shows through it. `TallyEmbed` opens at 480px and grows if Tally posts a
height back; the form itself measures 440px at every width. Clearing
`contact.tallyEmbedUrl` falls back to a plain email block, so the page is never broken.

### Artwork - `src/assets/packs/{code,original}.ts`
Both satisfy `AssetPack` in `src/types/portfolio.ts`. Each slot carries its `src` **and**
its geometry, because the layout numbers are derived per image. To swap a picture, change
the path - and if the new file has a different aspect ratio, change the `width`/`height`
next to it. Files live in `public/portfolio/{code,original}/images/`.

### Photos
Sources live in `public/portfolio/photos/`. The fixed-size crops the design needs are
derived from them by `scripts/derive-photo-crops.mjs` (needs `sharp`); re-run it after
adding or swapping a source.

| slot | rendered | source |
|---|---|---|
| Footer CTA portrait | 500x560 | `shreya-portrait-navy.jpg` |
| About portrait | 240x260 | `shreya-selfie.jpg` (face region extracted) |
| Folder tab avatar | 30x30 | `shreya-closeup.jpg` |
| Folder sheet | 187x132 | `cat.jpg` |
| Heading chips x3 | 140x76 | `shreya-childhood`, `shreya-visor`, `shreya-standing` |
| Lens collage | 1360x720 | `shreya-portrait` centre, the rest as scrapbook polaroids |

The About portrait is scaled 1.4x and clipped by its wrapper, so `cover` alone leaves the
face off-centre. That one uses an explicit `extract` box; if you swap the photo, re-pick it.

### Adding a third pack (e.g. hand-crafted art)
Copy `code.ts`, point it at new files, register it in `src/assets/packs/index.ts`, and add
a route folder mirroring `src/app/original/`. Nothing else changes.

## Layout rules that will bite you

Three places hold **measured pixel widths**. Change the words and you must re-measure.

1. **Hero heading** (`content.hero.slots`) - 990px container, `gap-x-16`, boxes about
   1.2× each word's natural width at 106px Instrument Serif / `-3.18px` tracking.
   Rows must each stay under 990:
   `260+140+388+32=820` · `544+68+184+32=828` · `460+140+330+32=962` · `140+730+69+32=971`.
   `content.hero.rows` sets the container height as `rows × 136`.
2. **Contact heading** (`content.contact.headingWords`) - 768px container, and unlike the
   hero these are **natural** widths (ratio ~1.00). Wraps 4 + 3.
3. **About paragraph one** (`content.about.paragraphOneLines`) - authored line breaks that
   desktop honours and mobile reflows.

The hero heading is scaled about its **centre**, not its top, so its authored `top: 86px`
does not describe where it lands. At the mobile scale that pushed the last row past the
hero's clip; `max-[809px]:top-[-24px]` compensates. If you change
`--additti-heading-scale`, re-check that the block still fits.

The marquee's card size lives only in the `DESKTOP`/`MOBILE` constants because `distance`
is computed from them. Duplicating a size as a class literal desyncs the loop seam.

Other length-sensitive spots: the folder tab label (`content.shortName`, ~209px of room),
service titles (must not wrap - the title row is `overflow-clip`), and project titles
(one line only; a second line breaks the card-height invariant the Work grid relies on).

To re-measure, run the harness in `$CLAUDE_JOB_DIR/tmp`:
`node probe2.mjs "http://localhost:3001/" measure-words.mjs "" 1440 900 1`

## Verified

- `npm run check` green; all 7 routes prerender static.
- `/` and `/original` measure **identical** - every landmark `dx,dy = 0,0`, same
  `docHeight` - so the pack layer changes artwork only, never layout.
- No horizontal scroll, no broken images, no heading word overflowing its box, at
  1440px and 402px. On mobile the hero heading keeps all 4 rows inside the section
  (bottom 450 vs 506).
