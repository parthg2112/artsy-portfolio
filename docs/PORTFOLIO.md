# shreya.codes - how this site is put together

A personal portfolio for Shreya Chourasia, built on the layout and motion of
artofadditti.com. Two artwork variants render the same content so they can be judged
side by side.

| route | artwork |
|---|---|
| `/` `/about` `/contact` | **code pack** - hand-authored SVG + Shreya's photos |
| `/original` `/original/about` `/original/contact` | **original pack** - artofadditti's artwork, kept as a private design reference |

A switcher pinned to the bottom-centre flips between them in development. It is not
rendered in production - see Deploying at the end.

> The original pack is reference only. That artwork is Aditi Kulkarni's and must not ship
> on the public site, so `public/portfolio/original/images/` is gitignored. A fresh clone
> renders `/original` with broken images; that is expected.

There is a second axis: **palette**. `Blush` is what ships - pink and butter grounds with
the two inks unchanged. `Paper` is the inherited cream and lime, kept as an override.

## Where to change things

### Words - `src/content/shreya.ts`
One file, everything: name, role, email, socials, nav, hero heading, the five projects,
the three services, About copy, CTA, footer columns, and the Tally embed URL. Both packs
read from it, so a copy edit shows up in both variants at once.

**The contact form** is Tally form `XxbZBP`, embedded with `transparentBackground=1` so
the paper grid shows through it. Clearing `contact.tallyEmbedUrl` falls back to a plain
email block, so the page is never broken.

### Styling the Tally form

**No CSS in this repo can reach the form.** It is a cross-origin iframe, so its fonts,
colours, spacing and borders are all set inside Tally, under **Customize**. Free plan
covers theme, colours and 900+ Google Fonts, which happens to include both fonts this
site uses. Set these to match:

| Tally control | value |
|---|---|
| Heading font | Instrument Serif |
| Body font | Manjari |
| Background | transparent |
| Text | `#3B4AD6` |
| Accent (links, focus, selected) | `#FF5E00` |
| Button background | `#FF5E00` |
| Button text | `#F7F2E6` |

That matches fonts and colour exactly. Input border-radius, padding, border width and
base font size are **Pro-only** ($29/mo, which also unlocks a custom CSS block), so those
stay at Tally's defaults. The only way to a pixel-exact match without Pro is to drop the
iframe and rebuild the form in these components, which then needs its own submission
backend.

`dynamicHeight=1` in the embed URL does nothing by itself: the iframe posts its height
and **Tally's own loader in the parent page** is what resizes it. `TallyEmbed` loads
`https://tally.so/widgets/embed.js` for exactly that reason. A hand-rolled `postMessage`
listener does not work - that was tried and never fired.

### The corner player - `src/components/portfolio/shared/MusicPlayer.tsx`

Bottom-left, three stages: `hidden -> hint -> player`. The hint reads "click anywhere for
sound"; the first click on the document is both the cue and the user gesture browsers
require before audio may play, so autoplay is never attempted. A `✕` opts out and is
remembered in `sessionStorage`.

**No audio or cover art is in this repo, and none should be.** The queue in
`content.tracks` is metadata only; `public/audio/` is gitignored. Drop
`sunflower.mp3` and `lemonade.mp3` in there and the player appears by itself. Without
them it renders nothing at all - it waits for the audio element to report
`readyState >= 1` before it will even show the hint, so a fresh clone never displays a
player that could not play anything. Cover art is the same story: `Track.artwork` is
optional and a palette tile is drawn from the track id unless a file is supplied.

Three traps live in it, all found by testing rather than reading:

- `onLoadedMetadata` **cannot be the only readiness signal.** A local file often reaches
  `HAVE_METADATA` before React attaches the handler, so the event fires into nothing.
  The element's `readyState` is checked on mount as well, per track.
- The document listener is in the **capture** phase, so `stopPropagation` inside the
  dismiss button runs too late to stop it - "no thanks" would start the music. The opt-out
  is checked inside the capture handler via `[data-player-optout]`.
- Space and the arrow keys are bound to the **player**, never the document. A global
  Space handler would take the spacebar away from page scrolling across the whole site.

The player is mounted in `layout.tsx`, not in a page, so the audio element survives
client-side navigation instead of restarting the track on every route change.

### Artwork - `src/assets/packs/{code,original}.ts`
Both satisfy `AssetPack` in `src/types/portfolio.ts`. Each slot carries its `src` **and**
its geometry, because the layout numbers are derived per image. To swap a picture, change
the path - and if the new file has a different aspect ratio, change the `width`/`height`
next to it. Files live in `public/portfolio/{code,original}/images/`.

### Colour - `src/app/globals.css`
Four variables in `:root` are the whole palette. Nothing in `src/` hardcodes a brand hex;
components use the `bg-paper` / `text-ink` / `text-blue` / `bg-lime` utilities that
`@theme inline` generates from them.

| role | Paper | Blush |
|---|---|---|
| page ground | `#f7f2e6` | `#fbeef0` |
| band, footer | `#ebecb0` | `#fbf3d4` |
| display type | `#ff5e00` | unchanged |
| body, line art | `#3b4ad6` | unchanged |

The inks deliberately do not move: pink, butter and white are all ~95% lightness, so if
the ink went pale too there would be nothing left to read the 106px display type against.

SVGs loaded through `<img src>` cannot see CSS variables, so the blush artwork is a
generated second copy: `node scripts/recolour-palette.mjs` rebuilds
`public/portfolio/code-blush/` from `public/portfolio/code/`. **Re-run it after touching
any code-pack SVG.** It shifts each tint and shade by its own OKLab offset from its base
rather than substituting colours, so highlights stay highlights.

The paper grid is drawn with two `repeating-linear-gradient`s, not loaded from a file, so
there is no asset to go missing and the line colour follows the palette.

### Photos
Sources live in `public/portfolio/photos/`. The fixed-size crops the design needs are
derived from them by `scripts/derive-photo-crops.mjs` (needs `sharp`); re-run it after
adding or swapping a source. `scripts/build-hero-props.mjs` builds the two hanging photo
ornaments, which embed their photo as a data URI because an SVG loaded through `<img>`
cannot reference an external image.

| slot | rendered | source |
|---|---|---|
| Footer CTA portrait | 500x560 | `shreya-portrait-navy.jpg` |
| About portrait | 240x260 | `shreya-selfie.jpg` (face region extracted) |
| /about taped polaroid | 210x210 | `shreya-visor.jpg` (explicit square extract) |
| Hero ornament photos x2 | 62 / 58 | `shreya-standing.jpg`, `shreya-childhood.jpg` |

Some sources carry EXIF orientation (the cat-cafe shot is orientation 6), so the crop
pipeline calls `.rotate()` first and every `extract` box below is in the upright frame.
| Folder tab avatar | 30x30 | `shreya-closeup.jpg` |
| Folder sheet | 187x132 | `cat.jpg` |
| Heading chips x3 | 140x76 | `shreya-childhood`, `shreya-visor`, `shreya-cat-cafe` |
| Full-bleed scroll section | 1440x900 | `shreya-standing.jpg` (horizontal band) |
| /about art card reveal | 317x398 | `shreya-cat-cafe.jpg` (near-full plate) |
| Lens collage | 1360x720 | `shreya-portrait` centre, the rest as scrapbook polaroids |

Two of these need an explicit `extract` box rather than `cover` or `sharp.strategy.attention`:
the About portrait (scaled 1.4x and clipped, so `cover` leaves the face off-centre) and
the /about polaroid (`attention` locks onto the stair railing). If you swap either photo,
re-pick the box.

### Drawing an ornament that does not look machine-made
The reference artwork carries its form in **tone**, not contour. The first version of this
pack drew flat two-tone glyphs at one uniform stroke width and it read as clip-art. What
fixed it:

- no ink outline on the plane at all - the facets alone describe the shape
- gradients rather than flat fills, and two or three stroke weights per object, with
  details lighter than silhouettes
- objects with weight (a bulb, a sprig, a cassette) rather than punctuation marks
- real photographs for two of the five, which is texture no vector can fake
- **space**: five objects with disjoint x-ranges beat six that overlap

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

It also needs **more than two copies** of the badge stack. After translating by one stack
plus the seam gap, only one stack is left on screen, so any viewport wider than a stack
(1126px on desktop, i.e. every desktop) runs out of track and the band ends mid-air. The
copy count is derived from the measured band width; the invariant to hold is
`trackWidth - distance >= bandWidth`.

`MaskedHeading` fills the scroll-expand title with the section's own photograph. Two
traps live in it. The wipe's `clip-path` must stay on an inner element, because a
clip-path on the element an IntersectionObserver is watching counts against that
element's own intersection ratio - put both on one node and the reveal deadlocks at
zero and the heading never appears. And the fill is `background-clip: text` with a
cream `color` underneath, so a browser without it still shows a readable heading;
never remove that base colour.

Two more things must not be re-clipped: the CTA pill's hover ring scales past its own box
and the column starts flush at the container's left edge, so the wrapper inside the footer
is deliberately **not** `overflow-clip`. And `layout.tsx` must not render a manual
`<head>` - doing so suppresses Next's metadata injection and silently drops the
`<link rel="icon">` for `app/icon.svg`. The palette boot script is the first child of
`<body>` instead, which still runs before anything paints.

Other length-sensitive spots: the folder tab label (`content.shortName`, ~209px of room),
service titles (must not wrap - the title row is `overflow-clip`), and project titles
(one line only; a second line breaks the card-height invariant the Work grid relies on).

The hero's decorative layer is **not** in that list. It is `absolute inset-0
pointer-events-none`, so ornament positions and sizes can change freely without moving a
measured landmark - verified by re-running the parity gate after rebuilding it.

The /about polaroid renders twice, once per breakpoint, with the other hidden. That is the
same idiom `AboutHero` uses for its lens frames. The mobile copy sits inside the heading,
which is why it is a `<span>` and not a `<div>`.

## Verified

- `npm run check` green; all 7 routes prerender static.
- **Fresh clone builds and runs with no broken assets.** `git clone` to a temp dir,
  `npm i`, `npm run build`: 6.3 MB, zero failed requests on `/`, `/about`, `/contact`.
  This is the check that catches anything still reaching into the gitignored artwork.
- `/` and `/original` measure **identical** - every landmark `dx,dy = 0,0`, same
  `docHeight` - so the pack layer changes artwork only, never layout.
- Switching palette changes only colours: same pack geometry, because the blush pack is
  the paper pack with its image paths retargeted (`src/assets/packs/retarget.ts` rewrites
  strings only, never numbers).
- Hero ornaments: 5, no overlapping x-ranges, an even 29px between each.
- No horizontal scroll, no heading word overflowing its box, at 1440px and 402px. On
  mobile the hero heading keeps all 4 rows inside the section (bottom 450 vs 506).

Note: an audit that flags `cover-email-digest.svg` and `cover-n8n.svg` as broken is seeing
`next/image` lazy-loading, not a fault - they load once the page is scrolled. Scroll the
page in the checker before asserting on image state.

## Deploying

The shipped design is **blush + code**. There is no switcher in production: the palette
lives on bare `:root` so it applies with no JavaScript, and `PackSwitcher` only renders
when `NODE_ENV === "development"`.

`/original` is **development only**. Its artwork is gitignored, so each of those routes
calls `notFound()` in production and returns a real 404 rather than a page of broken
images. Locally all six routes still work, which is what keeps the parity gate runnable.

To deploy on Vercel:

1. `vercel.com/new` and import `parthg2112/shreyas-portfolio`.
2. Next.js is auto-detected; no build settings to change.
3. Project Settings -> Domains -> add `shreya.codes`.

Nothing else is needed - there are no environment variables and no server routes.
