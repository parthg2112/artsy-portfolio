// Generates the blush colourway of the code pack from the paper one.
//
// The two brand inks (orange, cobalt) do not move - only the grounds do. Tints and
// shades derived from a ground (the folder shading, the sheet paper, the collage
// scraps) are re-derived rather than substituted: each one is shifted by its own
// OKLab offset from its base, so a highlight stays a highlight and a shadow stays a
// shadow against the new ground.
//
// usage: node scripts/recolour-palette.mjs

import { readdir, readFile, writeFile, mkdir, copyFile } from "node:fs/promises";

const SRC = "public/portfolio/code/images";
const DST = "public/portfolio/code-blush/images";

/** Ground colours that move, old -> new. Everything else is measured against these. */
const GROUNDS = [
  ["#f7f2e6", "#ffffff"], // paper -> white: cards read as objects on the blush page
  ["#ebecb0", "#fbf3d4"], // lime -> butter
];
/** Inks that must not move, and the one file that is not site chrome. */
const FROZEN = new Set(["#ff5e00", "#3b4ad6"]);
const SKIP_FILES = new Set(["atlas-preview.svg"]);

// -- sRGB <-> OKLab ---------------------------------------------------------

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklab(hex) {
  const r = toLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = toLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = toLinear(parseInt(hex.slice(5, 7), 16) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToHex([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    rgb
      .map((c) => {
        const v = Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255);
        return v.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// -- mapping ----------------------------------------------------------------

const groundLabs = GROUNDS.map(([from, to]) => ({
  from,
  fromLab: hexToOklab(from),
  toLab: hexToOklab(to),
}));

const cache = new Map();

function mapColour(hex) {
  const key = hex.toLowerCase();
  if (FROZEN.has(key)) return null;
  if (cache.has(key)) return cache.get(key);

  const exact = GROUNDS.find(([from]) => from === key);
  if (exact) {
    cache.set(key, exact[1]);
    return exact[1];
  }

  // A derivative: shift it by the same OKLab offset its base moved.
  const lab = hexToOklab(key);
  const base = groundLabs.reduce((best, g) =>
    dist(lab, g.fromLab) < dist(lab, best.fromLab) ? g : best,
  );
  const shifted = oklabToHex([
    lab[0] + (base.toLab[0] - base.fromLab[0]),
    lab[1] + (base.toLab[1] - base.fromLab[1]),
    lab[2] + (base.toLab[2] - base.fromLab[2]),
  ]);
  cache.set(key, shifted);
  return shifted;
}

// -- run --------------------------------------------------------------------

await mkdir(DST, { recursive: true });
const files = await readdir(SRC);
let svgs = 0;
let copied = 0;

for (const file of files) {
  if (!file.endsWith(".svg") || SKIP_FILES.has(file)) {
    await copyFile(`${SRC}/${file}`, `${DST}/${file}`);
    copied++;
    continue;
  }
  const src = await readFile(`${SRC}/${file}`, "utf8");
  const out = src.replace(/#[0-9a-fA-F]{6}\b/g, (m) => mapColour(m) ?? m);
  await writeFile(`${DST}/${file}`, out);
  svgs++;
}

console.log(`recoloured ${svgs} svg, copied ${copied} verbatim -> ${DST}`);
console.log("\ncolour map:");
for (const [from, to] of [...cache].sort()) console.log(`  ${from} -> ${to}`);
