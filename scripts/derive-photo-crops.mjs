/**
 * Derives every fixed-size photo the design needs from the sources in
 * public/portfolio/photos/ into the code pack.
 *
 *   npm i -D sharp && node scripts/derive-photo-crops.mjs
 *
 * Each slot gets a different photo so no image repeats within one eyeline. Sizes are
 * 2x the rendered box so they stay sharp on retina.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/portfolio/photos";
const OUT = "public/portfolio/code/images";

const JOBS = [
  {
    // Footer CTA portrait, rendered 500x560. `position: "top"` only anchors vertically,
    // so `cover` centred horizontally and kept the dark counter on the left. She sits
    // right of centre in the 849x1280 frame, so the box is taken explicitly around her.
    src: "shreya-portrait-navy.jpg",
    out: "photo-cta.jpg",
    w: 1000,
    h: 1120,
    extract: { left: 110, top: 250, width: 700, height: 784 },
  },
  {
    // About portrait, rendered 240x260. Her hair reaches the top edge of the 716x1599
    // source, so the box starts at y=0 - any headroom taken here comes straight off
    // the crown. Aspect matches the render box exactly, so `cover` crops nothing more.
    src: "shreya-selfie.jpg",
    out: "photo-about.jpg",
    w: 480,
    h: 520,
    extract: { left: 162, top: 0, width: 554, height: 600 },
  },
  {
    // Folder tab avatar, a 30x30 circle. A tight face crop is exactly right here.
    src: "shreya-closeup.jpg",
    out: "photo-avatar.jpg",
    w: 160,
    h: 160,
    position: "top",
  },
  // Folder sheet, rendered 187x132.
  { src: "cat.jpg", out: "sheet-photo.jpg", w: 561, h: 396, position: "attention" },
  {
    // /about details polaroid, rendered 210x210. `attention` locks onto the stair
    // railing here, so the square is taken explicitly around her face.
    src: "shreya-visor.jpg",
    out: "photo-note.jpg",
    w: 420,
    h: 420,
    extract: { left: 462, top: 0, width: 716, height: 716 },
  },
  {
    // Full-bleed scroll-expand frame. Abstract rather than another photograph: she
    // already appears in the hero chips, the ornaments, both portraits, the polaroid,
    // the collage and the /about reveal, and one more was too many. Native 16:9, so
    // nothing is cropped; upscaled because abstract paint has no fine detail to lose.
    src: "art-scale.jpg",
    out: "photo-wide.jpg",
    w: 1920,
    h: 1080,
  },
  {
    // Behind the /about art card: the butterflies pixel-dissolve to this on hover.
    // Same 317x398 box as the card, at 2x.
    //
    // Was shreya-portrait.jpg, which is also the centre of the lens collage directly
    // below - the same face twice in one eyeline. The cat-cafe shot only ever appeared
    // as a 140x76 letterbox chip, so this is the one place it gets seen whole. Stored
    // with EXIF orientation 6; the pipeline rotates first, so this box is in the upright
    // 4284x5712 frame and is very nearly the full plate.
    src: "shreya-cat-cafe.jpg",
    out: "art-about-reveal.jpg",
    w: 634,
    h: 796,
    extract: { left: 0, top: 166, width: 4284, height: 5379 },
  },
  // Three heading chips, rendered 140x76 at scale(1.3).
  { src: "shreya-childhood.jpg", out: "chip-photo-a.jpg", w: 420, h: 228, position: "attention" },
  { src: "shreya-visor.jpg", out: "chip-photo-b.jpg", w: 420, h: 228, position: "centre" },
  {
    // Cat cafe, framed on the cat in her lap - a 140x76 letterbox cut her face in half.
    // Stored with EXIF orientation 6, so the pipeline rotates first and these
    // coordinates are in the upright 4284x5712 frame.
    src: "shreya-cat-cafe.jpg",
    out: "chip-photo-c.jpg",
    w: 420,
    h: 228,
    extract: { left: 500, top: 2694, width: 2600, height: 1412 },
  },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  let pipeline = sharp(`${SRC}/${job.src}`).rotate();
  if (job.extract) pipeline = pipeline.extract(job.extract);
  const position =
    job.position === "attention" ? sharp.strategy.attention : job.position;
  await pipeline
    .resize(job.w, job.h, { fit: "cover", ...(position ? { position } : {}) })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${OUT}/${job.out}`);
  console.log(`ok  ${job.out.padEnd(20)} ${job.w}x${job.h}  <- ${job.src}`);
}

console.log(`\n${JOBS.length} crops written to ${OUT}`);
