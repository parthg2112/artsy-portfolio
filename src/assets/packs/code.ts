import type { AssetPack } from "@/types/portfolio";

/**
 * Shreya's own artwork: hand-authored SVG in the site palette, plus her photographs.
 * Geometry mirrors `originalPack` exactly - same boxes, same aspect ratios - so the
 * layout is identical and only the imagery changes.
 */
const I = "/portfolio/code/images";

export const codePack: AssetPack = {
  id: "code",
  label: "Code",

  heroOrnaments: [
    { src: `${I}/orn-braces.svg`, left: 178, top: -52, width: 101.5, height: 148.6, stringLength: 210, zIndex: 1 },
    { src: `${I}/orn-semicolon.svg`, left: 271, top: -52, width: 39.6, height: 143.9, stringLength: 96, zIndex: 2 },
    { src: `${I}/orn-hash.svg`, left: 323, top: -52, width: 74.6, height: 73.6, stringLength: 118, zIndex: 2 },
    { src: `${I}/orn-terminal.svg`, left: 308, top: -52, width: 230.3, height: 124.5, stringLength: 183, zIndex: 1 },
    { src: `${I}/orn-arrow.svg`, left: 452, top: -52, width: 75.1, height: 57.6, stringLength: 98, zIndex: 2 },
    { src: `${I}/orn-asterisk.svg`, left: 511, top: -52, width: 97.6, height: 94.2, stringLength: 156, zIndex: 1 },
  ],

  heroDoodles: [
    { src: `${I}/doodle-comment.svg`, left: 135.5, top: 274.5, width: 378, height: 339.8, rotate: -10 },
    { src: `${I}/doodle-glob.svg`, left: 428, top: 523, width: 223, height: 223, rotate: 0 },
    { src: `${I}/doodle-caret.svg`, left: 494.6, top: 537.4, width: 173.8, height: 122.2, rotate: 0 },
  ],

  heroPlane: `${I}/plane-packet.svg`,

  folder: {
    back: `${I}/folder-back.svg`,
    flap: `${I}/folder-flap.svg`,
    backClipPath:
      "polygon(10px 0px, 96px 0px, 128px 29px, 262px 29px, 262px 209px, 0px 209px, 0px 10px)",
    sheets: [
      { src: `${I}/sheet-graph.svg`, rotate: 6, openRotate: -9.8, openX: -70, openY: -93 },
      { src: `${I}/sheet-photo.jpg`, rotate: -4, openRotate: -5.9, openX: 0, openY: -64 },
      { src: `${I}/sheet-plot.svg`, rotate: 0, openRotate: 16, openX: 92, openY: -94 },
    ],
    stickers: [
      { src: `${I}/sticker-node.svg`, left: -27, top: 0, width: 145, height: 144 },
      { src: `${I}/sticker-tag.svg`, left: 7, top: 46, width: 76, height: 108 },
      { src: `${I}/sticker-dot.svg`, left: 5, top: 49, width: 63, height: 73 },
    ],
    avatar: `${I}/photo-avatar.jpg`,
  },

  // Each slot mixes one photo of Shreya with two code frames, so the cycle stays personal.
  headingChips: [
    [`${I}/chip-photo-a.jpg`, `${I}/chip-code-a.svg`, `${I}/chip-code-b.svg`],
    [`${I}/chip-code-c.svg`, `${I}/chip-photo-b.jpg`, `${I}/chip-code-d.svg`],
    [`${I}/chip-code-e.svg`, `${I}/chip-code-f.svg`, `${I}/chip-photo-c.jpg`],
  ],

  stickers: [
    `${I}/badge-cpp.svg`,
    `${I}/badge-typescript.svg`,
    `${I}/badge-python.svg`,
    `${I}/badge-jupyter.svg`,
    `${I}/badge-n8n.svg`,
    `${I}/badge-postgres.svg`,
    `${I}/badge-docker.svg`,
    `${I}/badge-nextjs.svg`,
  ],

  // Order matches content.projects; the ratios drive the scattered Work grid.
  projectCovers: [
    { src: `${I}/cover-atlas.svg`, width: 376.59, height: 528.67 },
    { src: `${I}/cover-breast-cancer.svg`, width: 672.5, height: 593.53 },
    { src: `${I}/cover-rag.svg`, width: 573.19, height: 441.55 },
    { src: `${I}/cover-email-digest.svg`, width: 349.69, height: 577.86 },
    { src: `${I}/cover-n8n.svg`, width: 538, height: 633.53 },
  ],

  portraits: {
    about: { src: `${I}/photo-about.jpg`, width: 240, height: 260 },
    cta: { src: `${I}/photo-cta.jpg`, width: 500, height: 560 },
  },

  divider: { src: `${I}/divider-rule.svg`, width: 400, height: 115 },

  aboutHero: {
    dossierCover: `${I}/dossier-cover.svg`,
    stamp: `${I}/dossier-stamp.svg`,
    // Photo composites, not vector: line-art under the lens' 5px blur barely reads as
    // blurred, so the drag-to-reveal needs a real photographic subject underneath.
    lensDesktop: `${I}/collage-desktop.png`,
    lensMobile: `${I}/collage-mobile.png`,
    lensAlt: "A scrapbook collage of photos of Shreya",
  },
};
