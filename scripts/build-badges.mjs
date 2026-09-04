/**
 * Builds the marquee badges from the official brand marks.
 *
 *   node scripts/build-badges.mjs
 *
 * The first version of these was hand-drawn from memory, which is exactly why they read
 * as fake - the geometry was approximately right and recognisably wrong. These use the
 * real paths from `simple-icons` (MIT), rendered in the site palette rather than each
 * brand's own colour, because the page is built on two inks and seven brand colours
 * would pull the band forward when it is meant to sit behind the work grid.
 *
 * Card geometry must stay 132x184 - StickerMarquee derives its loop distance from that.
 */
import * as icons from "simple-icons";
import { writeFile } from "node:fs/promises";

const OUT = "public/portfolio/code/images";

// No text on the cards. A label inside an SVG loaded through <img> cannot reach the
// page's webfonts, so those labels were silently falling back to a generic system sans -
// which is a large part of why the strip looked off. These marks are recognisable on
// their own, and dropping the text lets the card be squarer and the mark much bigger.
const CARD_W = 132;
const CARD_H = 150;
const PAPER = "#F7F2E6";
const INK = "#FF5E00";
const BLUE = "#3B4AD6";
const LIME = "#EBECB0";

/** Alternating card fills so the strip has rhythm, matching the previous set. */
const BADGES = [
  { slug: "cplusplus", out: "badge-cpp.svg", label: "C++", fill: PAPER, mark: BLUE },
  { slug: "typescript", out: "badge-typescript.svg", label: "TypeScript", fill: BLUE, mark: PAPER },
  { slug: "python", out: "badge-python.svg", label: "Python", fill: LIME, mark: BLUE },
  { slug: "jupyter", out: "badge-jupyter.svg", label: "Jupyter", fill: PAPER, mark: INK },
  { slug: "n8n", out: "badge-n8n.svg", label: "n8n", fill: INK, mark: PAPER },
  { slug: "postgresql", out: "badge-postgres.svg", label: "Postgres", fill: BLUE, mark: PAPER },
  { slug: "docker", out: "badge-docker.svg", label: "Docker", fill: LIME, mark: BLUE },
  { slug: "nextdotjs", out: "badge-nextjs.svg", label: "Next.js", fill: INK, mark: PAPER },
];

const key = (slug) => "si" + slug.charAt(0).toUpperCase() + slug.slice(1);

const MARK_BOX = 76; // simple-icons paths are authored on a 24x24 grid.
const SCALE = MARK_BOX / 24;
const MARK_X = (CARD_W - MARK_BOX) / 2;
const MARK_Y = (CARD_H - MARK_BOX) / 2;

for (const badge of BADGES) {
  const icon = icons[key(badge.slug)];
  if (!icon) throw new Error(`simple-icons has no entry for ${badge.slug}`);

  const strokeColour = badge.fill === PAPER || badge.fill === LIME ? BLUE : PAPER;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" fill="none">
  <title>${icon.title}</title>
  <rect x="2.5" y="2.5" width="${CARD_W - 5}" height="${CARD_H - 5}" rx="18" fill="${badge.fill}" stroke="${strokeColour}" stroke-width="3"/>
  <g transform="translate(${MARK_X} ${MARK_Y}) scale(${SCALE.toFixed(4)})">
    <path d="${icon.path}" fill="${badge.mark}"/>
  </g>
</svg>
`;

  await writeFile(`${OUT}/${badge.out}`, svg);
  console.log(`ok  ${badge.out.padEnd(22)} ${icon.title}`);
}

console.log(`\n${BADGES.length} badges written to ${OUT}`);
