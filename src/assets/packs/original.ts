import type { AssetPack } from "@/types/portfolio";

/**
 * The artofadditti.com artwork, kept as a private design reference to compare the code
 * pack against. Every value here was measured off the live site - do not change them;
 * `/original` is the regression gate that proves the pack layer is lossless.
 *
 * This artwork is Aditi Kulkarni's and is not part of the published site.
 */
const I = "/portfolio/original/images";

export const originalPack: AssetPack = {
  id: "original",
  label: "Original",

  heroOrnaments: [
    { src: `${I}/MnZMK6CMjzYNLB07gjMUMGvug8.png`, left: 178, top: -52, width: 101.5, height: 148.6, stringLength: 210, zIndex: 1 },
    { src: `${I}/F3dlkJO49ibuu7n02KesW0DXm70.png`, left: 271, top: -52, width: 39.6, height: 143.9, stringLength: 96, zIndex: 2 },
    { src: `${I}/N94aPp7N4iSS4gjILVCmCROYQ.png`, left: 323, top: -52, width: 74.6, height: 73.6, stringLength: 118, zIndex: 2 },
    { src: `${I}/EHVGmpQM8dVpQLAyzwcuXeQs.png`, left: 308, top: -52, width: 230.3, height: 124.5, stringLength: 183, zIndex: 1 },
    { src: `${I}/baV8T2acA7TKna4z1bvo9hwsx6I.png`, left: 452, top: -52, width: 75.1, height: 57.6, stringLength: 98, zIndex: 2 },
    { src: `${I}/sZwazhJ250pXq2qUC5DO1ZSCruo.png`, left: 511, top: -52, width: 97.6, height: 94.2, stringLength: 156, zIndex: 1 },
  ],

  heroDoodles: [
    { src: `${I}/pn0YDTs7KLTkTbjTlgKQi65XfdQ.png`, left: 135.5, top: 274.5, width: 378, height: 339.8, rotate: -10 },
    { src: `${I}/edhOFIyMzso9G8BB7gfGLol0mk.png`, left: 428, top: 523, width: 223, height: 223, rotate: 0 },
    { src: `${I}/tAVZDSN0Nu9rZP9wkaewR9rwFM.png`, left: 494.6, top: 537.4, width: 173.8, height: 122.2, rotate: 0 },
  ],

  heroPlane: `${I}/6oZpGzBazHjxAqismGQ3hhQWyM.png`,

  folder: {
    back: `${I}/kjOTInz0DqRnLHq0XxijSJRsaI.png`,
    flap: `${I}/kGAYrm6AYeZpbOsWqgtpNcfRXwk.png`,
    backClipPath:
      "polygon(10px 0px, 96px 0px, 128px 29px, 262px 29px, 262px 209px, 0px 209px, 0px 10px)",
    sheets: [
      { src: `${I}/raldo60nlFkdE0hfN4Si3SWgstg.jpg`, rotate: 6, openRotate: -9.8, openX: -70, openY: -93 },
      { src: `${I}/JUZkCFWhwYbYVIyEcKWdsw84LM.jpg`, rotate: -4, openRotate: -5.9, openX: 0, openY: -64 },
      { src: `${I}/cZuwXslhiKLfOyCG51vcAigs5BI.jpg`, rotate: 0, openRotate: 16, openX: 92, openY: -94 },
    ],
    stickers: [
      { src: `${I}/6NUatnATRUrI0fiKL0NWuwKyufY.png`, left: -27, top: 0, width: 145, height: 144 },
      { src: `${I}/RdpgIpMAB1BiVWa6eNRxrsCw5g.png`, left: 7, top: 46, width: 76, height: 108 },
      { src: `${I}/iynxSgXyvc0PwjwO0P5IhTzrxE.png`, left: 5, top: 49, width: 63, height: 73 },
    ],
    avatar: `${I}/2WtpMI8pVJ2h68hU2Tqtvsi8JA.jpg`,
  },

  headingChips: [
    [
      `${I}/w9oI24ugV5vJopxegIHLQDsG0UE.png`,
      `${I}/yPfDuXMPTbCydkqmEE7SHdJNTA.png`,
      `${I}/7Fzq0mL978FowPIOTs6gD7rm1x4.png`,
    ],
    [
      `${I}/pVhda2fpRvf5OhKwe7bjcGOu6I.png`,
      `${I}/okO3XsRUxTLyAwsVvEZaqY5zg.png`,
      `${I}/KTMxuUZI94nir6l1470DeWLU.jpeg`,
    ],
    [
      `${I}/naYFYb4ONKDbU8TKfCeZ70rhbmE.png`,
      `${I}/QPrRvl2PkLPmoCpzdKn1pXyGmI.png`,
      `${I}/nlDSwMjONt22ZFabFLu53PzXmHI.png`,
    ],
  ],

  stickers: [
    `${I}/By2LPO2kW5qCrYlzsrhtxJsA1s.png`,
    `${I}/pG5qHZrLA6UYjjCDP8LJlLv48d0.png`,
    `${I}/LjemDqI7maj8W9ieBMS41YuAoo.png`,
    `${I}/hbOz1HDiHplNG83z3NSjWW73Kk.png`,
    `${I}/hdvxx56ZHKgPkLpJMsXY8kHmE.png`,
    `${I}/1NjliFcxYYmf4PfDUFnQaIbGJzc.png`,
    `${I}/hXFXD5eH9OOleqwbcwdTKRFR4I.png`,
    `${I}/QIp1n9xTlTtIRnN39BVNDT4eYg.png`,
  ],

  // Order matches content.projects. imageWidth/Height set each card's aspect ratio.
  projectCovers: [
    { src: `${I}/BPnr7OEOejGiYeQHTXZUkaPRc8.png`, width: 376.59, height: 528.67 },
    { src: `${I}/1XhVuj3i9345YyWkFe0z8iypuYA.png`, width: 672.5, height: 593.53 },
    { src: `${I}/lDoRQ70ZeGYeCSl9Lw4UqtPiaI.png`, width: 573.19, height: 441.55 },
    { src: `${I}/OmMGG3dIt5ehKnAtby64pLlc.png`, width: 349.69, height: 577.86 },
    { src: `${I}/LOIdXhjL3EVaETZYwykvHqOH30.png`, width: 538, height: 633.53 },
  ],

  portraits: {
    about: { src: `${I}/c1urHDvdJ5LuNmIGDP1Yh6NLg.png`, width: 240, height: 260 },
    cta: { src: `${I}/KckiBhuA4HlKUV7pYLYqYmKTDI.png`, width: 500, height: 560 },
  },

  divider: { src: `${I}/deROsZPeaxkyMaMV80RdrcQx8.png`, width: 400, height: 115 },

  aboutHero: {
    dossierCover: `${I}/ClmCPeMxbi3vTbEBXUhYHH6rYKM.jpg`,
    stamp: `${I}/IusE41NtiW6KCjpFPZMl2DUbSQE.png`,
    lensDesktop: `${I}/Lu6zMPRaT9J3XR7blsZVLf4I.png`,
    lensMobile: `${I}/xttaEzD6SLtzQX9aOMIfexOq0.png`,
    lensAlt: "Studio collage",
  },
};
