/**
 * Builds the two photo ornaments that hang in the hero.
 *
 *   node scripts/build-hero-props.mjs
 *
 * The photo is embedded as a data URI rather than referenced, because these render
 * through <img src>, where an SVG cannot load an external image. Keeping the frame as
 * vector means the palette script still recolours it.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/portfolio/photos";
const OUT = "public/portfolio/code/images";

const PROPS = [
  {
    out: "orn-photo-a.svg",
    src: "shreya-standing.jpg",
    // 713x1600 portrait: take a square from the upper body, not the whole frame.
    // Rescaled for the 1456x3264 replacement source (2.04x the original).
    extract: { left: 82, top: 511, width: 1266, height: 1266 },
    w: 86,
    photo: 62,
    padTop: 10,
    padBottom: 20,
    rotate: -5,
    title: "A hanging photo of Shreya",
  },
  {
    out: "orn-photo-b.svg",
    src: "shreya-childhood.jpg",
    // 1600x900 landscape: centre square.
    extract: { left: 470, top: 0, width: 900, height: 900 },
    w: 82,
    photo: 58,
    padTop: 10,
    padBottom: 20,
    rotate: 6,
    title: "A hanging childhood photo of Shreya",
  },
];

for (const p of PROPS) {
  const buf = await sharp(`${SRC}/${p.src}`)
    .rotate()
    .extract(p.extract)
    .resize(p.photo * 3, p.photo * 3, { fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  const pad = (p.w - p.photo) / 2;
  const h = p.padTop + p.photo + p.padBottom;
  // Rotating inside the viewBox keeps the ornament's own box axis-aligned, so the
  // pack geometry stays the plain width/height the layout measures.
  const cx = p.w / 2;
  const cy = h / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${p.w}" height="${h}" viewBox="0 0 ${p.w} ${h}" fill="none">
  <title>${p.title}</title>
  <g transform="rotate(${p.rotate} ${cx} ${cy})">
    <rect x="0.8" y="0.8" width="${p.w - 1.6}" height="${h - 1.6}" rx="2.5" fill="#F7F2E6" stroke="#3B4AD6" stroke-width="1.6"/>
    <image x="${pad}" y="${p.padTop}" width="${p.photo}" height="${p.photo}" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${buf.toString("base64")}"/>
    <rect x="${pad}" y="${p.padTop}" width="${p.photo}" height="${p.photo}" fill="none" stroke="#3B4AD6" stroke-width="1" opacity="0.5"/>
    <path d="M${pad + 4} ${h - 9}h${p.photo - 20}" stroke="#FF5E00" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
  </g>
</svg>
`;

  await writeFile(`${OUT}/${p.out}`, svg);
  console.log(`ok  ${p.out.padEnd(18)} ${p.w}x${h}  <- ${p.src}  (${Math.round(svg.length / 1024)}kb)`);
}
