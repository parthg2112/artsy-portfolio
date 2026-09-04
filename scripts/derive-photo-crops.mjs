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
    // Footer CTA portrait, rendered 500x560. Face sits upper-middle, so anchor top.
    src: "shreya-portrait-navy.jpg",
    out: "photo-cta.jpg",
    w: 1000,
    h: 1120,
    position: "top",
  },
  {
    // About portrait, rendered 240x260 but scaled 1.4x and clipped by its wrapper,
    // so the face is extracted explicitly rather than left to `cover`.
    src: "shreya-selfie.jpg",
    out: "photo-about.jpg",
    w: 480,
    h: 520,
    extract: { left: 230, top: 150, width: 470, height: 509 },
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
  // Three heading chips, rendered 140x76 at scale(1.3).
  { src: "shreya-childhood.jpg", out: "chip-photo-a.jpg", w: 420, h: 228, position: "attention" },
  { src: "shreya-visor.jpg", out: "chip-photo-b.jpg", w: 420, h: 228, position: "centre" },
  { src: "shreya-standing.jpg", out: "chip-photo-c.jpg", w: 420, h: 228, position: "attention" },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  let pipeline = sharp(`${SRC}/${job.src}`);
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
