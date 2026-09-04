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

  // Five objects, not six glyphs. The reference hangs things with weight and texture,
  // and its ornaments read as separate because they carry soft transparent margins;
  // ours are crisp edge to edge, so they need real gaps instead. Every x-range here is
  // disjoint (29px between each) and the string lengths vary so nothing lines up.
  // This layer is `absolute inset-0 pointer-events-none`, so it is outside the parity
  // gate - moving these cannot shift a measured landmark.
  heroOrnaments: [
    { src: `${I}/orn-photo-a.svg`, left: 150, top: -52, width: 92, height: 98.4, stringLength: 196, zIndex: 1 },
    { src: `${I}/orn-bulb.svg`, left: 271, top: -52, width: 74, height: 118.4, stringLength: 118, zIndex: 2 },
    { src: `${I}/orn-leaf.svg`, left: 374, top: -52, width: 66, height: 109.2, stringLength: 168, zIndex: 1 },
    { src: `${I}/orn-photo-b.svg`, left: 469, top: -52, width: 78, height: 83.7, stringLength: 96, zIndex: 2 },
    { src: `${I}/orn-cassette.svg`, left: 576, top: -52, width: 96, height: 68.9, stringLength: 146, zIndex: 1 },
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
    note: { src: `${I}/photo-note.jpg`, width: 210, height: 210 },
  },

  divider: { src: `${I}/divider-rule.svg`, width: 400, height: 115 },

  fullBleed: { src: `${I}/photo-wide.jpg`, width: 1440, height: 900 },

  aboutHero: {
    dossierCover: `${I}/art-about.jpg`,
    artReveal: `${I}/art-about-reveal.jpg`,
    // Photo composites, not vector: line-art under the lens' 5px blur barely reads as
    // blurred, so the drag-to-reveal needs a real photographic subject underneath.
    lensDesktop: `${I}/collage-desktop.png`,
    lensMobile: `${I}/collage-mobile.png`,
    lensAlt: "A scrapbook collage of photos of Shreya",
  },
};
